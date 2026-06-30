const DB_NAME = 'PulseMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media';

export interface MediaItem {
  id: string;
  blob: Blob;
  name: string;
  type: string;
}

// In-memory fallback map to keep uploads alive during the current session (crucial for sandbox/iframe environments)
const memoryCache = new Map<string, Blob | File>();

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error || new Error('Failed to open database'));
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    } catch (e) {
      reject(e);
    }
  });
}

export async function saveMedia(id: string, file: File | Blob): Promise<void> {
  // Always cache in memory as the ultimate fallback
  memoryCache.set(id, file);

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        id,
        blob: file,
        name: (file as any).name || 'uploaded_media',
        type: file.type
      });
      request.onerror = (e) => {
        console.warn('Failed to put media in IndexedDB:', e);
        resolve(); // Resolve anyway to proceed with in-memory fallback
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = (e) => {
        console.warn('Transaction error in IndexedDB:', e);
        resolve(); // Resolve anyway
      };
    });
  } catch (e) {
    console.warn('Failed to save to IndexedDB, using in-memory fallback:', e);
    // Do not reject so the save operation in AdminScreen doesn't fail
  }
}

export async function getMediaUrl(id: string): Promise<string | null> {
  // Try memory cache first
  const cached = memoryCache.get(id);
  if (cached) {
    return URL.createObjectURL(cached);
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onerror = () => resolve(null);
      request.onsuccess = () => {
        const result = request.result as MediaItem | undefined;
        if (result && result.blob) {
          resolve(URL.createObjectURL(result.blob));
        } else {
          resolve(null);
        }
      };
    });
  } catch (e) {
    console.warn('Failed to read IndexedDB media:', e);
    return null;
  }
}

export async function deleteMedia(id: string): Promise<void> {
  memoryCache.delete(id);

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onerror = () => resolve();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  } catch (e) {
    console.warn('Failed to delete from IndexedDB:', e);
  }
}

