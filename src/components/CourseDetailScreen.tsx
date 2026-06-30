import React from 'react';
import { ArrowLeft, Clock, Flame, Play, CheckCircle, ChevronRight, User, Heart, Share2, Dumbbell, Shield, Sparkles, Check } from 'lucide-react';
import { Routine, UserProgress } from '../types';

interface CourseDetailScreenProps {
  course: Routine; // representing Routine
  progress: UserProgress;
  onBack: () => void;
  onPlayLesson: (exerciseId: string) => void; // mapping to active workout start
  onToggleSave: (routineId: string) => void;
  darkMode: boolean;
}

export default function CourseDetailScreen({
  course,
  progress,
  onBack,
  onPlayLesson,
  onToggleSave,
  darkMode,
}: CourseDetailScreenProps) {
  const isSaved = progress.savedRoutines.includes(course.id);
  const totalExercises = course.exercises.length;

  const handleStartWorkout = () => {
    // Start with the first exercise
    if (course.exercises.length > 0) {
      onPlayLesson(course.exercises[0].id);
    }
  };

  const shareRoutine = () => {
    try {
      navigator.clipboard.writeText(`¡Entrena conmigo! Rutina de Pulse.Fit: ${course.title}`);
      alert(`Enlace de rutina copiado al portapapeles: ${course.title}`);
    } catch (e) {
      alert(`Rutina: ${course.title}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back Button / Navigation Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer ${
            darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>Volver al catálogo</span>
        </button>

        <div className="flex gap-2">
          {/* Save/Favorite Button */}
          <button
            onClick={() => onToggleSave(course.id)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isSaved
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-md'
                : darkMode
                ? 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                : 'border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-850'
            }`}
            title={isSaved ? 'Quitar de guardadas' : 'Guardar rutina'}
          >
            <Heart className={`w-4.5 h-4.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          
          {/* Share Button */}
          <button
            onClick={shareRoutine}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              darkMode ? 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-850'
            }`}
            title="Compartir rutina"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Routine Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl border ${
        darkMode ? 'border-slate-900 bg-slate-950' : 'border-slate-100 bg-slate-50 shadow-sm'
      }`}>
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-56 lg:h-full opacity-45 lg:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
          <img
            src={course.coverImage || undefined}
            alt={course.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-20 p-6 md:p-10 lg:w-3/5 space-y-5">
          <span className="text-xs font-black tracking-widest uppercase text-orange-500 font-mono">
            RUTINA DE {course.category}
          </span>

          <h1 className={`text-2xl md:text-4.5xl font-extrabold leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {course.title}
          </h1>

          <p className={`text-sm md:text-base font-light leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-650'}`}>
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1 text-orange-400">
              <Flame className="w-4 h-4" />
              Est. {course.caloriesEstimate} kcal
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-4 h-4 text-slate-500" />
              {course.durationMinutes} minutos
            </span>
            <span>•</span>
            <span className={`px-2.5 py-0.5 rounded-full ${
              course.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              course.level === 'Intermedio' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>{course.level}</span>
          </div>

          <div className="flex items-center gap-4 pt-3">
            <button
              onClick={handleStartWorkout}
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-lg shadow-orange-500/25 hover:scale-[1.01]"
            >
              <Play className="w-4.5 h-4.5 fill-current ml-0.5 animate-pulse" />
              <span>INICIAR CIRCUITO</span>
            </button>
            <span className="text-xs text-slate-400 font-bold font-mono hidden sm:inline">
              {totalExercises} ejercicios activos • Autoguía incluida
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Details & Exercises checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns: Coach Bio & Equipment */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed routine description */}
          <div className={`p-6 md:p-8 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-4`}>
            <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              ¿Por qué realizar este circuito?
            </h3>
            <p className={`text-sm font-light leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-650'}`}>
              {course.longDescription}
            </p>
          </div>

          {/* Equipment Checklist */}
          <div className={`p-6 md:p-8 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-4`}>
            <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Equipamiento Requerido
            </h3>
            <div className="flex flex-wrap gap-3">
              {course.equipmentNeeded.map((eq, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-orange-400' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <Dumbbell className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Bio widget */}
          <div className={`p-6 md:p-8 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-4`}>
            <div className="flex gap-4 items-center">
              <img
                src={course.coach.avatar || undefined}
                alt={course.coach.name}
                className="w-16 h-16 rounded-full border-2 border-orange-500/30 object-cover shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 font-mono">TU ENTRENADOR PERSONAL</span>
                <h4 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Coach {course.coach.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {course.coach.role}
                </p>
              </div>
            </div>
            <p className={`text-sm font-light leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-650'}`}>
              {course.coach.bio}
            </p>
          </div>
        </div>

        {/* Right side panel: Muscle targets & Interactive Exercises list */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Ejercicios del Circuito
            </h3>
            <span className="text-xs font-bold font-mono text-slate-400">{totalExercises} ejercicios</span>
          </div>

          <div className="space-y-3.5">
            {course.exercises.map((exercise, index) => {
              return (
                <div
                  key={exercise.id}
                  onClick={() => onPlayLesson(exercise.id)}
                  className={`group p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer flex justify-between gap-4 ${
                    darkMode
                      ? 'bg-slate-900/10 border-slate-900 hover:border-orange-500/30 text-slate-300 hover:text-white'
                      : 'bg-white border-slate-100 hover:border-orange-500/20 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <div className="flex gap-3.5 min-w-0">
                    <div className="shrink-0 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold font-mono transition-all ${
                        darkMode
                          ? 'border-slate-800 bg-slate-950 text-slate-400 group-hover:border-orange-500 group-hover:text-orange-400'
                          : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:bg-white group-hover:border-orange-500/50 group-hover:text-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                    </div>

                    <div className="min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-extrabold truncate">
                        {exercise.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold font-mono text-slate-400 mt-1">
                        <span className="text-orange-500">
                          {exercise.duration > 0 ? `${exercise.duration}s` : `${exercise.reps} reps`}
                        </span>
                        <span>•</span>
                        <span>{exercise.sets} series</span>
                      </div>
                    </div>
                  </div>

                  <button className={`self-center p-2 rounded-lg border opacity-0 group-hover:opacity-100 transition-all ${
                    darkMode
                      ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      : 'border-slate-200 bg-white text-slate-500 hover:text-slate-950 shadow-sm'
                  }`}>
                    <Play className="w-3 h-3 fill-current ml-0.5 text-orange-500" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
