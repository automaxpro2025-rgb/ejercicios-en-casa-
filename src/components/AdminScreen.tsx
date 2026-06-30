import React, { useState, useRef } from 'react';
import { 
  Shield, Plus, Trash2, Save, FileVideo, Image as ImageIcon, 
  CheckCircle, Upload, Play, Sparkles, Dumbbell, Flame, Sparkle, ArrowLeft, Eye, Pencil
} from 'lucide-react';
import { Routine, Exercise, Coach } from '../types';
import { saveMedia } from '../lib/mediaDb';

interface AdminScreenProps {
  onSaveRoutine: (newRoutine: Routine) => void;
  existingRoutines: Routine[];
  onDeleteRoutine: (routineId: string) => void;
  darkMode: boolean;
}

interface NewExercise {
  name: string;
  instructions: string;
  duration: number; // in seconds
  reps: number | null;
  sets: number;
  restAfter: number; // in seconds
  muscleGroup: string;
  videoFile: File | null;
  imageFile: File | null;
  videoPreview: string;
  imagePreview: string;
}

export default function AdminScreen({
  onSaveRoutine,
  existingRoutines,
  onDeleteRoutine,
  darkMode
}: AdminScreenProps) {
  // Authentication Guard for Trainer
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showCode, setShowCode] = useState(false);

  // Screen views: 'list' | 'create'
  const [view, setView] = useState<'list' | 'create'>('list');
  const [deletingRoutineId, setDeletingRoutineId] = useState<string | null>(null);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fuerza');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'Principiante' | 'Intermedio' | 'Avanzado'>('Intermedio');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [equipmentInput, setEquipmentInput] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');

  // Exercises list in the form
  const [formExercises, setFormExercises] = useState<NewExercise[]>([]);

  // Individual exercise form state (modal/section to add)
  const [exName, setExName] = useState('');
  const [exInstructions, setExInstructions] = useState('');
  const [exDuration, setExDuration] = useState(30);
  const [exReps, setExReps] = useState<number | null>(null);
  const [isRepBased, setIsRepBased] = useState(false);
  const [exSets, setExSets] = useState(3);
  const [exRestAfter, setExRestAfter] = useState(15);
  const [exMuscleGroup, setExMuscleGroup] = useState('General');
  const [exVideoFile, setExVideoFile] = useState<File | null>(null);
  const [exImageFile, setExImageFile] = useState<File | null>(null);
  const [exVideoPreview, setExVideoPreview] = useState('');
  const [exImagePreview, setExImagePreview] = useState('');

  const fileInputRefVideo = useRef<HTMLInputElement>(null);
  const fileInputRefImage = useRef<HTMLInputElement>(null);
  const fileInputRefCover = useRef<HTMLInputElement>(null);

  const categories = ['Fuerza', 'Cardio', 'Yoga', 'Tai Chi', 'Baile'];

  // Handle Cover image selection
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Handle Video file selection for exercise
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExVideoFile(file);
      setExVideoPreview(URL.createObjectURL(file));
    }
  };

  // Handle Image file selection for exercise
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExImageFile(file);
      setExImagePreview(URL.createObjectURL(file));
    }
  };

  // Add Exercise to temporary list
  const handleAddExerciseToForm = () => {
    if (!exName.trim()) {
      alert('Por favor ingresa un nombre para el ejercicio.');
      return;
    }
    if (!exVideoFile && !exVideoPreview) {
      alert('Por favor sube un video MP4 para este ejercicio.');
      return;
    }
    if (!exImageFile && !exImagePreview) {
      alert('Por favor sube una imagen de apoyo para este ejercicio.');
      return;
    }

    const newEx: NewExercise = {
      name: exName,
      instructions: exInstructions || 'Realiza este movimiento con técnica controlada.',
      duration: isRepBased ? 0 : exDuration,
      reps: isRepBased ? (exReps || 10) : null,
      sets: exSets,
      restAfter: exRestAfter,
      muscleGroup: exMuscleGroup,
      videoFile: exVideoFile,
      imageFile: exImageFile,
      videoPreview: exVideoPreview,
      imagePreview: exImagePreview
    };

    setFormExercises([...formExercises, newEx]);

    // Reset exercise form
    setExName('');
    setExInstructions('');
    setExDuration(30);
    setExReps(null);
    setIsRepBased(false);
    setExSets(3);
    setExRestAfter(15);
    setExMuscleGroup('General');
    setExVideoFile(null);
    setExImageFile(null);
    setExVideoPreview('');
    setExImagePreview('');
    if (fileInputRefVideo.current) fileInputRefVideo.current.value = '';
    if (fileInputRefImage.current) fileInputRefImage.current.value = '';
  };

  const handleRemoveExerciseFromForm = (index: number) => {
    setFormExercises(formExercises.filter((_, i) => i !== index));
  };

  const handleResetForm = () => {
    setTitle('');
    setCategory('Fuerza');
    setDescription('');
    setLevel('Intermedio');
    setDurationMinutes(15);
    setEquipmentInput('');
    setCoverFile(null);
    setCoverPreview('');
    setFormExercises([]);
    setEditingRoutineId(null);
    
    // Clear individual exercise form state as well
    setExName('');
    setExInstructions('');
    setExDuration(30);
    setExReps(null);
    setIsRepBased(false);
    setExSets(3);
    setExRestAfter(15);
    setExMuscleGroup('General');
    setExVideoFile(null);
    setExImageFile(null);
    setExVideoPreview('');
    setExImagePreview('');
    if (fileInputRefVideo.current) fileInputRefVideo.current.value = '';
    if (fileInputRefImage.current) fileInputRefImage.current.value = '';
  };

  const handleStartEditRoutine = (routine: Routine) => {
    setTitle(routine.title);
    
    // Map internal category ID to display category
    // Internal category map: 'Fuerza' -> 'fuerza', 'Cardio' -> 'hiit', 'Yoga' -> 'yoga', 'Tai Chi' -> 'taichi', 'Baile' -> 'baile'
    let dispCategory = 'Fuerza';
    if (routine.category === 'hiit') dispCategory = 'Cardio';
    else if (routine.category === 'yoga') dispCategory = 'Yoga';
    else if (routine.category === 'taichi') dispCategory = 'Tai Chi';
    else if (routine.category === 'baile') dispCategory = 'Baile';
    setCategory(dispCategory);
    
    setDescription(routine.description);
    setLevel(routine.level);
    setDurationMinutes(routine.durationMinutes);
    setEquipmentInput(routine.equipmentNeeded ? routine.equipmentNeeded.join(', ') : '');
    setCoverPreview(routine.coverImage || '');
    setCoverFile(null);
    
    const convertedExercises: NewExercise[] = routine.exercises.map((ex) => ({
      name: ex.name,
      instructions: ex.instructions,
      duration: ex.duration,
      reps: ex.reps,
      sets: ex.sets,
      restAfter: ex.restAfter,
      muscleGroup: ex.muscleGroup,
      videoFile: null,
      imageFile: null,
      videoPreview: ex.videoUrl,
      imagePreview: ex.imageUrl,
    }));
    setFormExercises(convertedExercises);
    
    setEditingRoutineId(routine.id);
    setView('create');
  };

  // Save the complete Routine
  const handleSaveRoutine = async () => {
    // 1. Validate mandatory fields
    if (!title.trim()) {
      alert('Por favor ingresa el nombre de la rutina.');
      return;
    }
    if (!description.trim()) {
      alert('Por favor ingresa una descripción para la rutina.');
      return;
    }
    if (!durationMinutes || Number(durationMinutes) <= 0) {
      alert('Por favor ingresa una duración válida (mayor a 0 minutos).');
      return;
    }
    if (formExercises.length === 0) {
      alert('Por favor agrega al menos un ejercicio a la rutina.');
      return;
    }

    const routineId = editingRoutineId || 'custom-' + Math.random().toString(36).substring(2, 9);
    
    // Save routine cover image to DB with try-catch safety
    let coverUrl = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80';
    if (coverFile) {
      try {
        await saveMedia(`cover-${routineId}`, coverFile);
      } catch (e) {
        console.error('Error saving cover image to DB:', e);
      }
      coverUrl = coverPreview || URL.createObjectURL(coverFile);
    } else if (coverPreview) {
      coverUrl = coverPreview;
    } else if (formExercises[0]?.imageFile) {
      // Use first exercise support image as cover if none uploaded
      try {
        await saveMedia(`cover-${routineId}`, formExercises[0].imageFile);
      } catch (e) {
        console.error('Error saving default cover image to DB:', e);
      }
      coverUrl = formExercises[0].imagePreview;
    } else if (formExercises[0]?.imagePreview) {
      coverUrl = formExercises[0].imagePreview;
    }

    // Process and save exercise files with try-catch safety
    const exercises: Exercise[] = [];
    for (let i = 0; i < formExercises.length; i++) {
      const ex = formExercises[i];
      const exId = `ex-${routineId}-${i}`;

      let videoUrl = ex.videoPreview || '';
      if (ex.videoFile) {
        try {
          await saveMedia(`video-${exId}`, ex.videoFile);
        } catch (e) {
          console.error(`Error saving exercise video ${exId} to DB:`, e);
        }
      }

      let imageUrl = ex.imagePreview || '';
      if (ex.imageFile) {
        try {
          await saveMedia(`image-${exId}`, ex.imageFile);
        } catch (e) {
          console.error(`Error saving exercise image ${exId} to DB:`, e);
        }
      }

      exercises.push({
        id: exId,
        name: ex.name,
        instructions: ex.instructions,
        duration: ex.duration,
        reps: ex.reps,
        sets: ex.sets,
        restAfter: ex.restAfter,
        muscleGroup: ex.muscleGroup,
        videoUrl: videoUrl,
        imageUrl: imageUrl,
        equipment: []
      });
    }

    // Map Category to internal category ID
    // Internal category map: 'Fuerza' -> 'fuerza', 'Cardio' -> 'hiit', 'Yoga' -> 'yoga', 'Tai Chi' -> 'taichi', 'Baile' -> 'baile'
    let mappedCategory = 'fuerza';
    if (category === 'Cardio') mappedCategory = 'hiit';
    else if (category === 'Yoga') mappedCategory = 'yoga';
    else if (category === 'Tai Chi') mappedCategory = 'taichi';
    else if (category === 'Baile') mappedCategory = 'baile';

    const parsedEquipment = equipmentInput
      .split(',')
      .map(e => e.trim())
      .filter(e => e.length > 0);

    const coach: Coach = {
      name: 'Entrenador Pulse (Admin)',
      role: 'Creador de Contenido',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Ficha personalizada cargada directamente por el creador del sistema.'
    };

    const newRoutine: Routine = {
      id: routineId,
      title: title,
      description: description,
      longDescription: description,
      coach: coach,
      durationMinutes: Number(durationMinutes) || 15,
      level: level,
      category: mappedCategory,
      caloriesEstimate: (Number(durationMinutes) || 15) * 11,
      coverImage: coverUrl,
      exercises: exercises,
      equipmentNeeded: parsedEquipment.length > 0 ? parsedEquipment : ['Ninguno (Peso Corporal)']
    };

    // 2. Save the routine and exercises to dynamic list
    onSaveRoutine(newRoutine);

    // 5. Success visual alert feedback
    alert(editingRoutineId ? 'Rutina actualizada correctamente' : 'Rutina guardada correctamente');

    // 6. Clean and Reset Form completely
    handleResetForm();
    setView('list');
  };

  const getCustomRoutines = () => {
    return existingRoutines.filter(r => r.id.startsWith('custom-'));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 animate-fade-in">
        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl transition-all ${
          darkMode 
            ? 'bg-slate-900 border-slate-800 shadow-orange-950/5 text-white' 
            : 'bg-white border-slate-100 shadow-slate-200/50 text-slate-800'
        }`}>
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 to-red-600 blur opacity-30 animate-pulse"></div>
              <div className="relative p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500">
                <Shield className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                  Acceso Restringido
                </span>
              </div>
              <h2 className={`text-xl md:text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Consola del Entrenador
              </h2>
              <p className={`text-xs font-light max-w-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Ingresa el código de seguridad para habilitar la configuración del sistema y edición de rutinas.
              </p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (accessCode === 'PULSE2026') {
                  setIsAuthenticated(true);
                  setAuthError('');
                } else {
                  setAuthError('Código incorrecto');
                }
              }} 
              className="w-full space-y-4"
            >
              <div className="relative">
                <input
                  type={showCode ? "text" : "password"}
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Código de acceso"
                  className={`w-full px-5 py-3.5 pr-12 rounded-2xl border text-center font-mono tracking-widest text-lg font-bold outline-none transition-all ${
                    authError 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-500/5' 
                      : darkMode
                        ? 'border-slate-800 bg-slate-950 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {authError && (
                <p className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1 animate-fade-in">
                  <span>⚠️</span> {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] cursor-pointer"
              >
                Verificar Código
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-orange-500 font-mono">
              Panel Creador
            </span>
            <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-wider font-mono">
              Acceso Privado
            </span>
          </div>
          <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {view === 'list' ? 'Consola de Rutinas' : (editingRoutineId ? 'Editar Rutina' : 'Crear Nueva Rutina')}
          </h1>
          <p className={`text-sm mt-1 font-light ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {view === 'list' 
              ? 'Administra, carga y personaliza los circuitos físicos directamente en el sistema.' 
              : 'Configura metadatos, carga videos MP4 de tu dispositivo y define ejercicios para el alumno.'}
          </p>
        </div>

        {view === 'list' ? (
          <button
            onClick={() => {
              handleResetForm();
              setView('create');
            }}
            className="px-5 py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Rutina</span>
          </button>
        ) : (
          <button
            onClick={() => {
              handleResetForm();
              setView('list');
            }}
            className={`px-4 py-2.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              darkMode 
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800' 
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Consola</span>
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-6">
          {/* Custom loaded content list */}
          <div className={`p-6 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-4`}>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-900">
              <Shield className="w-5 h-5 text-orange-500" />
              <h3 className={`font-extrabold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Tus Rutinas Cargadas ({getCustomRoutines().length})
              </h3>
            </div>

            {getCustomRoutines().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCustomRoutines().map((routine) => (
                  <div 
                    key={routine.id}
                    className={`p-4 rounded-2xl border flex gap-4 items-center justify-between ${
                      darkMode ? 'bg-slate-900/30 border-slate-900' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    {deletingRoutineId === routine.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in w-full">
                        <span className="text-xs font-bold text-red-500 text-center sm:text-left leading-relaxed">
                          ¿Deseas eliminar esta rutina? Esta acción no se puede deshacer.
                        </span>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => setDeletingRoutineId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => {
                              onDeleteRoutine(routine.id);
                              setDeletingRoutineId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-650/20"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img 
                            src={routine.coverImage || undefined} 
                            alt={routine.title} 
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className={`text-sm font-extrabold truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                              {routine.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 font-mono">
                                {routine.category === 'hiit' ? 'Cardio' : routine.category}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {routine.exercises.length} Ejercicios
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEditRoutine(routine)}
                            className="p-2.5 rounded-xl text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer"
                            title="Editar Rutina"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingRoutineId(routine.id)}
                            className="p-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Eliminar Rutina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <Play className="w-10 h-10 text-slate-600 mx-auto opacity-40" />
                <p className="text-sm font-light">No has cargado rutinas personalizadas aún.<br />¡Haz clic en "Nueva Rutina" para subir tus primeros videos de entreno!</p>
              </div>
            )}
          </div>

          {/* Quick tips */}
          <div className="p-5 rounded-2xl border border-orange-500/10 bg-orange-500/5 flex gap-4">
            <Sparkle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-500 font-mono">Nota del Desarrollador</h4>
              <p className={`text-xs leading-relaxed font-light ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Los archivos de video MP4 e imágenes de apoyo se almacenan localmente en el motor de almacenamiento persistente del navegador (IndexedDB). Esto permite una carga y reproducción instantánea de videos súper fluidos de alta calidad, directamente desde tu dispositivo, sin depender de servidores lentos, YouTube o marcas de agua de terceros.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main creation card */}
          <div className={`p-6 md:p-8 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-6`}>
            
            {/* Meta Info Section */}
            <div className="space-y-4">
              <h3 className={`font-black text-base pb-2 border-b ${
                darkMode ? 'text-white border-slate-900' : 'text-slate-900 border-slate-100'
              }`}>
                1. Información General de la Rutina
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold font-mono uppercase tracking-wider block ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Nombre de la Rutina
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Ritmo Latino Cardio, Yoga Matutino, etc."
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-800 text-white focus:border-orange-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-500 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold font-mono uppercase tracking-wider block ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-800 text-white focus:border-orange-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-500 focus:bg-white'
                    }`}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Level */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold font-mono uppercase tracking-wider block ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Nivel Requerido
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Principiante', 'Intermedio', 'Avanzado'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          level === lvl
                            ? 'bg-orange-500 text-white border-orange-500'
                            : darkMode
                            ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold font-mono uppercase tracking-wider block ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Duración Estimada (minutos)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 10)}
                    min="1"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-800 text-white focus:border-orange-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-500 focus:bg-white'
                    }`}
                  />
                </div>

                {/* Equipment */}
                <div className="space-y-2">
                  <label className={`text-xs font-bold font-mono uppercase tracking-wider block ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Equipamiento (Separado por comas)
                  </label>
                  <input
                    type="text"
                    value={equipmentInput}
                    onChange={(e) => setEquipmentInput(e.target.value)}
                    placeholder="Ej. Mancuernas, Colchoneta"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900/50 border-slate-800 text-white focus:border-orange-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-500 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className={`text-xs font-bold font-mono uppercase tracking-wider block ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Descripción de la Sesión
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explica detalladamente en qué consiste esta sesión física, el enfoque metabólico y los beneficios para el alumno..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all resize-none ${
                    darkMode 
                      ? 'bg-slate-900/50 border-slate-800 text-white focus:border-orange-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-orange-500 focus:bg-white'
                  }`}
                />
              </div>

              {/* Cover Upload */}
              <div className="space-y-2">
                <label className={`text-xs font-bold font-mono uppercase tracking-wider block ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Imagen de Portada de la Rutina (Opcional)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRefCover.current?.click()}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      darkMode 
                        ? 'border-slate-850 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850' 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Upload className="w-4 h-4 text-orange-500" />
                    <span>{coverFile ? 'Cambiar Portada' : 'Subir Portada'}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefCover}
                    onChange={handleCoverChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {coverPreview && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <img 
                        src={coverPreview || undefined} 
                        alt="Portada preview" 
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span>{coverFile?.name}</span>
                    </div>
                  )}
                  {!coverPreview && (
                    <span className="text-xs text-slate-500 italic">Si no subes portada, se usará la imagen del primer ejercicio.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Exercises List in Routine */}
            <div className="space-y-4 pt-4 border-t dark:border-slate-900">
              <h3 className={`font-black text-base pb-2 border-b ${
                darkMode ? 'text-white border-slate-900' : 'text-slate-900 border-slate-100'
              }`}>
                2. Ejercicios Agregados ({formExercises.length})
              </h3>

              {formExercises.length > 0 ? (
                <div className="space-y-3">
                  {formExercises.map((ex, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        darkMode ? 'bg-slate-900/30 border-slate-900' : 'bg-slate-50 border-slate-150'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-black font-mono shrink-0">
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-extrabold truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            {ex.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider font-mono">
                            {ex.sets} Series • {ex.duration > 0 ? `${ex.duration}s` : `${ex.reps} Reps`} • Descanso: {ex.restAfter}s • {ex.muscleGroup}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        {ex.imagePreview && (
                          <img 
                            src={ex.imagePreview || undefined} 
                            alt="apoyo" 
                            className="w-8 h-8 rounded object-cover"
                            title="Imagen de apoyo"
                          />
                        )}
                        {ex.videoFile && (
                          <div className="p-1 bg-orange-500/15 rounded text-orange-500" title="MP4 cargado">
                            <FileVideo className="w-4 h-4" />
                          </div>
                        )}
                         <button
                          type="button"
                          onClick={() => {
                            setExName(ex.name);
                            setExInstructions(ex.instructions);
                            setExDuration(ex.duration || 30);
                            setExReps(ex.reps);
                            setIsRepBased(ex.duration === 0);
                            setExSets(ex.sets);
                            setExRestAfter(ex.restAfter);
                            setExMuscleGroup(ex.muscleGroup);
                            setExVideoPreview(ex.videoPreview);
                            setExImagePreview(ex.imagePreview);
                            setExVideoFile(ex.videoFile);
                            setExImageFile(ex.imageFile);
                            handleRemoveExerciseFromForm(idx);
                          }}
                          className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Editar Ejercicio"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseFromForm(idx)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar Ejercicio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-500 text-xs">
                  Aún no has agregado ejercicios a este circuito. Configura un ejercicio en la sección inferior para añadirlo.
                </div>
              )}
            </div>

            {/* Exercise Configurer Form */}
            <div className={`p-5 rounded-2xl border ${
              darkMode ? 'bg-slate-950 border-slate-850' : 'bg-slate-50 border-slate-150'
            } space-y-4`}>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-orange-500 font-mono">
                <Plus className="w-4 h-4" />
                <span>Configurar Ejercicio</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Exercise Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                    Nombre del Ejercicio *
                  </label>
                  <input
                    type="text"
                    value={exName}
                    onChange={(e) => setExName(e.target.value)}
                    placeholder="Ej. Sentadilla con Salto, Postura del Guerrero, etc."
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-orange-500' 
                        : 'bg-white border-slate-200 text-slate-800 focus:border-orange-500'
                    }`}
                  />
                </div>

                {/* Muscle Group */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                    Grupo Muscular / Enfoque
                  </label>
                  <input
                    type="text"
                    value={exMuscleGroup}
                    onChange={(e) => setExMuscleGroup(e.target.value)}
                    placeholder="Ej. Cuádriceps, Core, Espalda, General"
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-orange-500' 
                        : 'bg-white border-slate-200 text-slate-800 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                  Instrucciones o Consejos de Técnica
                </label>
                <textarea
                  value={exInstructions}
                  onChange={(e) => setExInstructions(e.target.value)}
                  placeholder="Instrucciones breves: 'Mantén la espalda recta, inhala al bajar, empuja con los talones...'"
                  rows={2}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all resize-none ${
                    darkMode 
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-orange-500' 
                      : 'bg-white border-slate-200 text-slate-800 focus:border-orange-500'
                  }`}
                />
              </div>

              {/* Series, duration/reps, rest */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Timed vs Rep-based toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                    Tipo de Estímulo
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsRepBased(false)}
                      className={`flex-1 py-2 text-[10px] font-bold transition-all cursor-pointer ${
                        !isRepBased 
                          ? 'bg-orange-500 text-white' 
                          : darkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Por Tiempo
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRepBased(true)}
                      className={`flex-1 py-2 text-[10px] font-bold transition-all cursor-pointer ${
                        isRepBased 
                          ? 'bg-orange-500 text-white' 
                          : darkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Repeticiones
                    </button>
                  </div>
                </div>

                {/* Duration/Reps input */}
                {!isRepBased ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                      Duración (segundos)
                    </label>
                    <input
                      type="number"
                      value={exDuration}
                      onChange={(e) => setExDuration(parseInt(e.target.value) || 30)}
                      min="5"
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-800 text-white focus:border-orange-500' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-orange-500'
                      }`}
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                      Número de Reps
                    </label>
                    <input
                      type="number"
                      value={exReps || 10}
                      onChange={(e) => setExReps(parseInt(e.target.value) || 10)}
                      min="1"
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-800 text-white focus:border-orange-500' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-orange-500'
                      }`}
                    />
                  </div>
                )}

                {/* Sets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                    Series / Vueltas
                  </label>
                  <input
                    type="number"
                    value={exSets}
                    onChange={(e) => setExSets(parseInt(e.target.value) || 3)}
                    min="1"
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-orange-500' 
                        : 'bg-white border-slate-200 text-slate-800 focus:border-orange-500'
                    }`}
                  />
                </div>

                {/* RestAfter */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono uppercase text-slate-400 block">
                    Descanso (segundos)
                  </label>
                  <input
                    type="number"
                    value={exRestAfter}
                    onChange={(e) => setExRestAfter(parseInt(e.target.value) || 15)}
                    min="0"
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-orange-500' 
                        : 'bg-white border-slate-200 text-slate-800 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              {/* Direct file uploads for MP4 video and Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Video Upload */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2 text-center bg-white dark:bg-slate-900/40">
                  <FileVideo className="w-7 h-7 text-orange-500 mx-auto" />
                  <div>
                    <p className={`text-[11px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {exVideoFile ? 'Video Listo' : 'Sube Video MP4 del Ejercicio *'}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Archivo de video real para reproducir en el reproductor.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRefVideo.current?.click()}
                    className={`px-3 py-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      darkMode 
                        ? 'border-slate-800 bg-slate-950 text-slate-300 hover:text-white' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-500" />
                    <span>{exVideoFile ? 'Sustituir MP4' : 'Seleccionar MP4'}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefVideo}
                    onChange={handleVideoChange}
                    accept="video/mp4"
                    className="hidden"
                  />
                  {exVideoPreview && (
                    <div className="pt-2">
                      <video 
                        src={exVideoPreview || undefined} 
                        controls 
                        className="max-h-24 mx-auto rounded border dark:border-slate-800"
                        preload="metadata"
                      />
                      <p className="text-[9px] text-slate-500 mt-1 truncate">{exVideoFile?.name}</p>
                    </div>
                  )}
                </div>

                {/* Support Image Upload */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2 text-center bg-white dark:bg-slate-900/40">
                  <ImageIcon className="w-7 h-7 text-orange-500 mx-auto" />
                  <div>
                    <p className={`text-[11px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {exImageFile ? 'Imagen de Apoyo Lista' : 'Sube Imagen de Apoyo (PNG/JPG) *'}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Imagen de previsualización que acompaña al ejercicio.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRefImage.current?.click()}
                    className={`px-3 py-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                      darkMode 
                        ? 'border-slate-800 bg-slate-950 text-slate-300 hover:text-white' 
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-500" />
                    <span>{exImageFile ? 'Sustituir Imagen' : 'Seleccionar Imagen'}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefImage}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {exImagePreview && (
                    <div className="pt-2">
                      <img 
                        src={exImagePreview || undefined} 
                        alt="Apoyo preview" 
                        className="max-h-24 mx-auto rounded border dark:border-slate-800 object-cover"
                      />
                      <p className="text-[9px] text-slate-500 mt-1 truncate">{exImageFile?.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm add exercise button */}
              <button
                type="button"
                onClick={handleAddExerciseToForm}
                className="w-full py-2.5 rounded-xl border border-orange-500/25 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Ejercicio al Circuito</span>
              </button>
            </div>

            {/* Save Entire Routine Button */}
            <div className="pt-4 border-t dark:border-slate-900 flex justify-end">
              <button
                onClick={handleSaveRoutine}
                className="px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-orange-500/10"
              >
                <Save className="w-4.5 h-4.5" />
                <span>{editingRoutineId ? 'Actualizar Rutina Completa' : 'Guardar Rutina Completa'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
