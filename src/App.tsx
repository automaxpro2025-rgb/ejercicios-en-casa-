import React, { useState, useEffect } from 'react';
import { 
  ScreenType, Routine, Exercise, UserProgress, UserProfile, AppSettings 
} from './types';
import { 
  MOCK_CATEGORIES, MOCK_COURSES, MOCK_USER, DEFAULT_SETTINGS 
} from './mockData';

// Import our modular screens
import WelcomeScreen from './components/WelcomeScreen';
import SidebarNav from './components/SidebarNav';
import HomeScreen from './components/HomeScreen';
import CategoriesScreen from './components/CategoriesScreen';
import CoursesScreen from './components/CoursesScreen';
import CourseDetailScreen from './components/CourseDetailScreen';
import PlayerScreen from './components/PlayerScreen';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import AdminScreen from './components/AdminScreen';

import { getMediaUrl } from './lib/mediaDb';

// Custom Notification Toast interface
interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'achievement' | 'favorite';
}

export default function App() {
  // --- Persistent States (localStorage) ---
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('pulse_has_onboarded') === 'true';
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const saved = localStorage.getItem('pulse_current_screen') as ScreenType;
    return saved && saved !== 'welcome' ? saved : 'home';
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('pulse_user_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      completedRoutines: [],
      routineSessions: {},
      savedRoutines: [],
      totalWorkoutMinutes: 45, // starts with some realistic default
      totalCaloriesBurned: 520, // starts with some realistic default
      streakDays: 4,
      lastWorkoutDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      history: [
        {
          id: 'hist-1',
          routineId: 'fuerza-total-bento',
          routineTitle: 'Fuerza Funcional de Cuerpo Completo',
          completedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          durationMinutes: 25,
          caloriesBurned: 320
        },
        {
          id: 'hist-2',
          routineId: 'core-abdominal-acero',
          routineTitle: 'Pilares de Acero: Definición y Core',
          completedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
          durationMinutes: 12,
          caloriesBurned: 160
        }
      ]
    };
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('pulse_app_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('pulse_custom_routines');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...MOCK_COURSES, ...parsed];
      } catch (e) {
        // Fallback
      }
    }
    return MOCK_COURSES;
  });

  // Resolve custom media on mount
  useEffect(() => {
    async function resolveCustomMedia() {
      const saved = localStorage.getItem('pulse_custom_routines');
      if (!saved) return;
      try {
        const custom: Routine[] = JSON.parse(saved);
        const updated = await Promise.all(custom.map(async (routine) => {
          const exercises = await Promise.all(routine.exercises.map(async (ex) => {
            let videoUrl = ex.videoUrl;
            let imageUrl = ex.imageUrl;
            
            // Try to load from IndexedDB
            const resolvedVideo = await getMediaUrl(`video-${ex.id}`);
            if (resolvedVideo) videoUrl = resolvedVideo;
            
            const resolvedImage = await getMediaUrl(`image-${ex.id}`);
            if (resolvedImage) imageUrl = resolvedImage;

            return { ...ex, videoUrl, imageUrl };
          }));

          let coverImage = routine.coverImage;
          const resolvedCover = await getMediaUrl(`cover-${routine.id}`);
          if (resolvedCover) coverImage = resolvedCover;

          return { ...routine, exercises, coverImage };
        }));

        setRoutines([...MOCK_COURSES, ...updated]);
      } catch (e) {
        console.error('Error resolving custom media:', e);
      }
    }

    resolveCustomMedia();
  }, []);

  // --- UI/Interaction States ---
  const [selectedCourse, setSelectedCourse] = useState<Routine | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Synchronize states with localStorage ---
  useEffect(() => {
    localStorage.setItem('pulse_has_onboarded', String(hasOnboarded));
  }, [hasOnboarded]);

  useEffect(() => {
    localStorage.setItem('pulse_current_screen', currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    localStorage.setItem('pulse_user_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('pulse_app_settings', JSON.stringify(settings));
  }, [settings]);

  // Adjust global HTML background class dynamically based on darkMode setting
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#020617'; // slate-950
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#ffffff';
    }
  }, [settings.darkMode]);

  // --- Sound Engine (Web Audio API) ---
  const playSoundFeedback = (type: 'click' | 'complete' | 'achievement' | 'favorite') => {
    if (!settings.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'complete') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'favorite') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.08); // C#5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.16); // E5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'achievement') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12); // G5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.24); // A5
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.36); // D6
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      }
    } catch (e) {
      // AudioContext blocked or not supported
    }
  };

  // --- Dynamic Toast Notifications Helper ---
  const triggerToast = (title: string, description: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    
    // Auto remove toast after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3500);

    // Play corresponding synth sound
    if (type === 'success') playSoundFeedback('complete');
    else if (type === 'achievement') playSoundFeedback('achievement');
    else if (type === 'favorite') playSoundFeedback('favorite');
    else playSoundFeedback('click');
  };

  // --- Onboarding Complete Trigger ---
  const handleStartOnboarding = (updatedProfile: Partial<UserProfile>) => {
    setHasOnboarded(true);
    setCurrentScreen('home');
    triggerToast('¡Bienvenido a Pulse!', 'Tu entrenador personal está listo para tu primera sesión.', 'achievement');
  };

  // --- Routine Selection ---
  const handleSelectCourse = (routine: Routine) => {
    playSoundFeedback('click');
    setSelectedCourse(routine);
    setCurrentScreen('course-detail');
  };

  // --- Lesson Execution & Player Activation ---
  const handlePlayLesson = (exerciseId: string) => {
    if (!selectedCourse) return;
    playSoundFeedback('click');
    setSelectedLessonId(exerciseId);
    setCurrentScreen('player');
  };

  const handleContinueClass = (routine: Routine, exerciseId: string) => {
    setSelectedCourse(routine);
    setSelectedLessonId(exerciseId);
    setCurrentScreen('player');
    playSoundFeedback('click');
  };

  // --- Toggle Exercise Completion Status ---
  const handleToggleLessonComplete = (routineId: string, exerciseId: string) => {
    const activeRoutine = routines.find(r => r.id === routineId);
    if (!activeRoutine) return;
    const exIndex = activeRoutine.exercises.findIndex(ex => ex.id === exerciseId);
    const exercise = activeRoutine.exercises[exIndex];
    if (!exercise) return;

    // Estimate calories burned (e.g. ~15 kcal per exercise interval!)
    const caloriesToAdd = 15;
    const minutesToAdd = 1;

    setProgress((prev) => {
      const isFinalExercise = exIndex === activeRoutine.exercises.length - 1;
      let updatedHistory = [...prev.history];
      let updatedSessions = { ...prev.routineSessions };
      let updatedCompletedRoutines = [...prev.completedRoutines];

      if (isFinalExercise) {
        // Record full session history
        const sessionLog = {
          id: 'session-' + Math.random().toString(36).substring(2, 9),
          routineId: activeRoutine.id,
          routineTitle: activeRoutine.title,
          completedAt: new Date().toISOString(),
          durationMinutes: activeRoutine.durationMinutes,
          caloriesBurned: activeRoutine.caloriesEstimate
        };
        updatedHistory = [sessionLog, ...updatedHistory];
        updatedSessions[activeRoutine.id] = (updatedSessions[activeRoutine.id] || 0) + 1;
        if (!updatedCompletedRoutines.includes(activeRoutine.id)) {
          updatedCompletedRoutines.push(activeRoutine.id);
        }
      }

      return {
        ...prev,
        completedRoutines: updatedCompletedRoutines,
        routineSessions: updatedSessions,
        totalWorkoutMinutes: prev.totalWorkoutMinutes + minutesToAdd,
        totalCaloriesBurned: prev.totalCaloriesBurned + caloriesToAdd,
        history: updatedHistory,
        streakDays: prev.streakDays === 0 ? 1 : prev.streakDays // keep streak active
      };
    });

    if (exIndex === activeRoutine.exercises.length - 1) {
      triggerToast(
        '🎉 ¡Rutina Finalizada!',
        `Completaste "${activeRoutine.title}" con éxito.`,
        'achievement'
      );
    } else {
      triggerToast(
        'Ejercicio Listo',
        `Completado: ${exercise.name}`,
        'success'
      );
    }
  };

  // --- Progression to Next Lesson ---
  const handleNextLesson = () => {
    if (!selectedCourse || !selectedLessonId) return;
    
    const currentIndex = selectedCourse.exercises.findIndex(ex => ex.id === selectedLessonId);
    if (currentIndex < selectedCourse.exercises.length - 1) {
      const nextEx = selectedCourse.exercises[currentIndex + 1];
      handlePlayLesson(nextEx.id);
      triggerToast('Siguiente Ejercicio', `Iniciando: "${nextEx.name}"`, 'info');
    }
  };

  // --- Save / Favorite Routine Toggle ---
  const handleToggleSaveCourse = (routineId: string) => {
    const isSaved = progress.savedRoutines.includes(routineId);
    let updatedSaves: string[];

    if (isSaved) {
      updatedSaves = progress.savedRoutines.filter(id => id !== routineId);
      triggerToast('Rutina quitada', 'Removida de tus favoritos.', 'info');
    } else {
      updatedSaves = [...progress.savedRoutines, routineId];
      triggerToast('Rutina Guardada', 'Se añadió a tu lista guardada.', 'favorite');
    }

    setProgress((prev) => ({
      ...prev,
      savedRoutines: updatedSaves,
    }));
  };

  // --- Reset All Metrics ---
  const handleResetProgress = () => {
    setProgress({
      completedRoutines: [],
      routineSessions: {},
      savedRoutines: [],
      totalWorkoutMinutes: 0,
      totalCaloriesBurned: 0,
      streakDays: 0,
      lastWorkoutDate: null,
      history: []
    });
    
    try {
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert('Historial restablecido correctamente.');
      }
    } catch (e) {
      console.warn('Alert blocked or unavailable', e);
    }
    
    triggerToast('Historial restablecido', 'Historial restablecido correctamente.', 'success');
  };

  // --- Welcome Reset / Onboarding Repeat ---
  const handleResetWelcome = () => {
    playSoundFeedback('click');
    setHasOnboarded(false);
    setCurrentScreen('home');
  };

  // --- Selection Filter routing helper ---
  const handleSelectCategoryFromRoute = (categoryId: string) => {
    playSoundFeedback('click');
    if (categoryId === 'all') {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
    setCurrentScreen('courses');
  };

  const handleToggleGlobalDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
    playSoundFeedback('click');
  };

  const handleSaveRoutine = (newRoutine: Routine) => {
    const isUpdate = routines.some(r => r.id === newRoutine.id);
    setRoutines((prev) => {
      const exists = prev.some(r => r.id === newRoutine.id);
      const updated = exists 
        ? prev.map(r => r.id === newRoutine.id ? newRoutine : r)
        : [...prev, newRoutine];
      const customOnly = updated.filter(r => r.id.startsWith('custom-'));
      const sanitizedCustom = customOnly.map(r => ({
        ...r,
        coverImage: (r.coverImage && typeof r.coverImage === 'string' && r.coverImage.startsWith('blob:')) ? '' : (r.coverImage || ''),
        exercises: r.exercises.map(ex => ({
          ...ex,
          videoUrl: (ex.videoUrl && typeof ex.videoUrl === 'string' && ex.videoUrl.startsWith('blob:')) ? '' : (ex.videoUrl || ''),
          imageUrl: (ex.imageUrl && typeof ex.imageUrl === 'string' && ex.imageUrl.startsWith('blob:')) ? '' : (ex.imageUrl || '')
        }))
      }));
      localStorage.setItem('pulse_custom_routines', JSON.stringify(sanitizedCustom));
      return updated;
    });
    if (isUpdate) {
      triggerToast('Rutina actualizada', 'Rutina actualizada correctamente.', 'success');
    } else {
      triggerToast('¡Rutina Guardada!', `La rutina "${newRoutine.title}" ya está disponible para entrenar.`, 'success');
    }
  };

  const handleDeleteRoutine = async (routineId: string) => {
    const routineToDelete = routines.find(r => r.id === routineId);
    if (routineToDelete) {
      try {
        const { deleteMedia } = await import('./lib/mediaDb');
        await deleteMedia(`cover-${routineId}`);
        for (const ex of routineToDelete.exercises) {
          await deleteMedia(`video-${ex.id}`);
          await deleteMedia(`image-${ex.id}`);
        }
      } catch (err) {
        console.error('Error deleting media from db:', err);
      }
    }

    setRoutines((prev) => {
      const updated = prev.filter(r => r.id !== routineId);
      const customOnly = updated.filter(r => r.id.startsWith('custom-'));
      const sanitizedCustom = customOnly.map(r => ({
        ...r,
        coverImage: (r.coverImage && typeof r.coverImage === 'string' && r.coverImage.startsWith('blob:')) ? '' : (r.coverImage || ''),
        exercises: r.exercises.map(ex => ({
          ...ex,
          videoUrl: (ex.videoUrl && typeof ex.videoUrl === 'string' && ex.videoUrl.startsWith('blob:')) ? '' : (ex.videoUrl || ''),
          imageUrl: (ex.imageUrl && typeof ex.imageUrl === 'string' && ex.imageUrl.startsWith('blob:')) ? '' : (ex.imageUrl || '')
        }))
      }));
      localStorage.setItem('pulse_custom_routines', JSON.stringify(sanitizedCustom));
      return updated;
    });
    triggerToast('Rutina eliminada', 'Rutina eliminada correctamente.', 'success');
  };

  // If the user has not onboarded, show the Welcome/Onboarding Screen
  if (!hasOnboarded) {
    return <WelcomeScreen user={MOCK_USER} onEnter={handleStartOnboarding} />;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 flex flex-col md:flex-row relative ${
      settings.darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Ambient moving gradient spots */}
        <div className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] transition-opacity duration-1000 ${
          settings.darkMode ? 'bg-orange-600/8 animate-pulse-slow' : 'bg-orange-400/3 animate-pulse-slow'
        }`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-[150px] transition-opacity duration-1000 ${
          settings.darkMode ? 'bg-indigo-600/8 animate-pulse-slow' : 'bg-indigo-400/3 animate-pulse-slow'
        }`} style={{ animationDelay: '3.5s' }} />
        <div className={`absolute top-[30%] right-[10%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full blur-[100px] transition-opacity duration-1000 ${
          settings.darkMode ? 'bg-rose-600/5 animate-drift-slow' : 'bg-rose-400/2 animate-drift-slow'
        }`} />
        <div className={`absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] rounded-full blur-[130px] transition-opacity duration-1000 ${
          settings.darkMode ? 'bg-amber-600/5 animate-drift-slow' : 'bg-amber-400/2 animate-drift-slow'
        }`} style={{ animationDelay: '5s' }} />

        {/* Subtle luminous floating particles */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <div className="absolute top-[15%] left-[20%] w-1.5 h-1.5 rounded-full bg-orange-400/40 blur-[0.5px] animate-float-slow" />
          <div className="absolute top-[45%] left-[75%] w-2 h-2 rounded-full bg-amber-400/40 blur-[0.5px] animate-float-slower" />
          <div className="absolute top-[80%] left-[15%] w-2 h-2 rounded-full bg-indigo-400/30 blur-[0.5px] animate-float-slow" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-[60%] left-[42%] w-1.5 h-1.5 rounded-full bg-red-400/30 blur-[0.5px] animate-float-slower" style={{ animationDelay: '4.5s' }} />
          <div className="absolute top-[25%] left-[85%] w-2 h-2 rounded-full bg-orange-300/40 blur-[0.5px] animate-float-slow" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>
      
      {/* Universal Desktop Sidebar & Mobile Bottom Navigation */}
      <SidebarNav
        currentScreen={currentScreen}
        setScreen={(scr) => {
          playSoundFeedback('click');
          setCurrentScreen(scr);
        }}
        user={MOCK_USER}
        darkMode={settings.darkMode}
        toggleDarkMode={handleToggleGlobalDarkMode}
        onResetWelcome={handleResetWelcome}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:p-10 lg:p-12 pb-24 md:pb-12 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Render appropriate screen based on state routing */}
        {currentScreen === 'home' && (
          <HomeScreen
            user={MOCK_USER}
            courses={routines}
            progress={progress}
            onSelectCourse={handleSelectCourse}
            onContinueClass={handleContinueClass}
            darkMode={settings.darkMode}
            setScreen={(scr) => {
              if (scr === 'courses' as any || scr === 'routines' as any) {
                setCurrentScreen('courses');
              } else {
                setCurrentScreen(scr as any);
              }
            }}
          />
        )}

        {currentScreen === 'categories' && (
          <CategoriesScreen
            categories={MOCK_CATEGORIES}
            onSelectCategory={handleSelectCategoryFromRoute}
            darkMode={settings.darkMode}
          />
        )}

        {(currentScreen === 'courses' || currentScreen === 'routines') && (
          <CoursesScreen
            courses={routines}
            progress={progress}
            onSelectCourse={handleSelectCourse}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            darkMode={settings.darkMode}
          />
        )}

        {currentScreen === 'course-detail' && selectedCourse && (
          <CourseDetailScreen
            course={selectedCourse}
            progress={progress}
            onBack={() => {
              playSoundFeedback('click');
              setCurrentScreen('courses');
            }}
            onPlayLesson={handlePlayLesson}
            onToggleSave={handleToggleSaveCourse}
            darkMode={settings.darkMode}
          />
        )}

        {currentScreen === 'player' && selectedCourse && selectedLessonId && (
          <PlayerScreen
            course={selectedCourse}
            lessonId={selectedLessonId}
            progress={progress}
            onBack={() => {
              playSoundFeedback('click');
              setCurrentScreen('course-detail');
            }}
            onSelectLesson={setSelectedLessonId}
            onToggleComplete={handleToggleLessonComplete}
            onNextLesson={handleNextLesson}
            darkMode={settings.darkMode}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            user={MOCK_USER}
            progress={progress}
            courses={routines}
            onSelectCourse={handleSelectCourse}
            onResetWelcome={handleResetWelcome}
            darkMode={settings.darkMode}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminScreen
            onSaveRoutine={handleSaveRoutine}
            existingRoutines={routines}
            onDeleteRoutine={handleDeleteRoutine}
            darkMode={settings.darkMode}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            settings={settings}
            onChangeSettings={(set) => {
              playSoundFeedback('click');
              setSettings(set);
            }}
            user={MOCK_USER}
            darkMode={settings.darkMode}
            toggleDarkMode={handleToggleGlobalDarkMode}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Premium Sliding Toast Notifications Corner */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 md:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl border backdrop-blur-md shadow-lg flex flex-col gap-1 transition-all duration-300 translate-y-0 animate-slide-in pointer-events-auto ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-100'
                : toast.type === 'achievement'
                ? 'bg-orange-950/80 border-orange-500/30 text-orange-100'
                : toast.type === 'favorite'
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-100'
                : settings.darkMode
                ? 'bg-slate-900/90 border-slate-800 text-slate-100'
                : 'bg-white/95 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold font-sans">{toast.title}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter(t => t.id !== toast.id))}
                className="text-[10px] opacity-60 hover:opacity-100 transition-opacity cursor-pointer font-bold font-sans ml-2"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] font-light leading-snug opacity-90">{toast.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
