import React from 'react';
import { Compass, Flame, Clock, Dumbbell, Award, Play, ChevronRight, Zap, Target, Star, Calendar } from 'lucide-react';
import { Routine, UserProgress, UserProfile } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  courses: Routine[]; // routine matches courses under structural binding
  progress: UserProgress;
  onSelectCourse: (routine: Routine) => void;
  onContinueClass: (routine: Routine, exerciseId: string) => void;
  darkMode: boolean;
  setScreen: (screen: 'routines' | 'categories' | 'profile') => void;
}

export default function HomeScreen({
  user,
  courses, // routine mapping
  progress,
  onSelectCourse,
  onContinueClass,
  darkMode,
  setScreen,
}: HomeScreenProps) {
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return '¡Buenos días, Atleta!';
    if (hours < 20) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const savedRoutines = courses.filter((r) => progress.savedRoutines.includes(r.id));
  const recommendedRoutine = courses[0]; // Fuerza Funcional as hero card

  // Calculate stats from actual workout sessions if available
  const sessionsCount = progress.history.length;
  const currentStreak = progress.streakDays;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Dynamic Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 font-mono">
            Panel de Rendimiento
          </span>
          <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {getGreeting()}, {user.name.split(' ')[0]}
          </h1>
          <p className={`text-sm mt-1 font-light ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Meta: <span className="font-semibold text-orange-500">{user.goal}</span> • Nivel: <span className="font-semibold">{user.fitnessLevel}</span>
          </p>
        </div>
        <div className={`flex items-center gap-2 text-xs font-bold font-mono px-4 py-2 rounded-xl border ${
          darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping shrink-0" />
          <span>ENTRENADOR PERSONAL LISTO</span>
        </div>
      </div>

      {/* Fitness Bento Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl ${
          darkMode 
            ? 'bg-slate-900/35 border-slate-800/80 hover:border-orange-500/30 hover:shadow-orange-500/5' 
            : 'bg-white/75 border-slate-200/60 hover:border-orange-300/40 hover:shadow-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Tiempo de Esfuerzo
            </span>
            <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/15">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-2xl md:text-3.5xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {progress.totalWorkoutMinutes} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">mins</span>
            </span>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Tiempo de actividad total</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl ${
          darkMode 
            ? 'bg-slate-900/35 border-slate-800/80 hover:border-red-500/30 hover:shadow-red-500/5' 
            : 'bg-white/75 border-slate-200/60 hover:border-red-300/40 hover:shadow-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Calorías Quemadas
            </span>
            <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400 border border-red-500/15">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-2xl md:text-3.5xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {progress.totalCaloriesBurned} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">kcal</span>
            </span>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Energía consumida</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl ${
          darkMode 
            ? 'bg-slate-900/35 border-slate-800/80 hover:border-amber-500/30 hover:shadow-amber-500/5' 
            : 'bg-white/75 border-slate-200/60 hover:border-amber-300/40 hover:shadow-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Racha Activa
            </span>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/15">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-2xl md:text-3.5xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {currentStreak} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">días</span>
            </span>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Entrenando consecutivamente</p>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl ${
          darkMode 
            ? 'bg-slate-900/35 border-slate-800/80 hover:border-emerald-500/30 hover:shadow-emerald-500/5' 
            : 'bg-white/75 border-slate-200/60 hover:border-emerald-300/40 hover:shadow-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Sesiones Listas
            </span>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/15">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className={`text-2xl md:text-3.5xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              {sessionsCount} <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">completados</span>
            </span>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Rutinas ejecutadas al 100%</p>
          </div>
        </div>
      </div>

      {/* Featured Workout Hero - Large Interactive Card */}
      {recommendedRoutine && (
        <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 group ${
          darkMode 
            ? 'border-slate-800/85 bg-slate-900/40 backdrop-blur-md' 
            : 'border-slate-200/80 bg-white/70 backdrop-blur-md shadow-lg shadow-slate-100'
        }`}>
          {/* Accent light/dark ambient light beams inside the card */}
          <div className="absolute top-[-20%] left-[-10%] w-72 h-72 rounded-full bg-orange-500/15 blur-[80px] pointer-events-none group-hover:bg-orange-500/20 transition-all duration-700 animate-pulse" />
          <div className="absolute bottom-[-20%] right-[20%] w-96 h-96 rounded-full bg-red-500/10 blur-[100px] pointer-events-none group-hover:bg-red-500/15 transition-all duration-700" />

          {/* Large dynamic hero photo of high-intensity training with dark overlay */}
          <div className="absolute top-0 right-0 w-full lg:w-1/2 h-56 lg:h-full opacity-55 lg:opacity-100 overflow-hidden">
            <div className={`absolute inset-0 z-10 ${
              darkMode 
                ? 'bg-gradient-to-t lg:bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/20' 
                : 'bg-gradient-to-t lg:bg-gradient-to-r from-white via-white/90 to-transparent'
            }`} />
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
              alt={recommendedRoutine.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-20 p-8 md:p-12 lg:w-3/5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider animate-pulse">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> RECOMENDADO PARA TU OBJETIVO
            </div>
            
            <h2 className={`text-2xl md:text-4xl font-black leading-tight tracking-tight ${
              darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300' : 'text-slate-900'
            }`}>
              {recommendedRoutine.title}
            </h2>
            
            <p className={`text-sm md:text-base leading-relaxed max-w-lg font-light ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {recommendedRoutine.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold font-mono text-slate-400 pt-1">
              <span>Coach: <strong className={darkMode ? 'text-orange-400' : 'text-slate-800'}>{recommendedRoutine.coach.name}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" /> {recommendedRoutine.durationMinutes} minutos
              </span>
              <span>•</span>
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black tracking-wider uppercase ${
                recommendedRoutine.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                recommendedRoutine.level === 'Intermedio' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>{recommendedRoutine.level}</span>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => onSelectCourse(recommendedRoutine)}
                className="group/btn relative inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold text-sm rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5"
              >
                {/* Shiny reflection effect */}
                <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-xl" />
                <span>COMENZAR ENTRENAMIENTO</span>
                <Play className="w-4 h-4 fill-current ml-0.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routine list - "Rutinas de entrenamiento" */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className={`text-lg font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Explorar Rutinas Guiadas
            </h3>
            <p className="text-xs text-slate-400">Entrenamientos interactivos por video y tiempos de descanso.</p>
          </div>
          <button
            onClick={() => setScreen('routines')}
            className="text-xs text-orange-500 hover:text-orange-400 font-extrabold flex items-center gap-1 cursor-pointer"
          >
            Ver catálogo completo <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((routine) => {
            const isSaved = progress.savedRoutines.includes(routine.id);
            const totalExercises = routine.exercises.length;

            return (
              <div
                key={routine.id}
                onClick={() => onSelectCourse(routine)}
                className={`group rounded-2xl border overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-xl cursor-pointer ${
                  darkMode 
                    ? 'bg-slate-900/30 border-slate-900 hover:border-orange-500/30 hover:shadow-orange-500/5' 
                    : 'bg-white/80 border-slate-150 hover:border-slate-300 shadow-sm hover:shadow-slate-200'
                }`}
              >
                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={routine.coverImage || undefined}
                    alt={routine.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Category overlay */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <span className="text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-orange-400 border border-orange-500/30 shadow-md">
                      {routine.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-md border ${
                      routine.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      routine.level === 'Intermedio' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {routine.level}
                    </span>
                  </div>
                </div>

                {/* Routine Info */}
                <div className="p-5 space-y-3 relative">
                  <h4 className={`font-extrabold text-base line-clamp-1 group-hover:text-orange-500 transition-colors duration-300 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {routine.title}
                  </h4>

                  <p className={`text-xs font-light line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {routine.description}
                  </p>

                  <div className="flex items-center gap-2.5 pt-1.5">
                    <img
                      src={routine.coach.avatar || undefined}
                      alt={routine.coach.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <span className="text-xs text-slate-400">Coach {routine.coach.name}</span>
                  </div>

                  {/* Routine stats footer */}
                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-900 pt-3.5 mt-2 text-[11px] font-bold font-mono text-slate-400">
                    <div className="flex items-center gap-1 text-orange-400">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{routine.caloriesEstimate} kcal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{totalExercises} ejercicios</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fitness Motivation Quote card */}
      <div className={`p-6 rounded-3xl border ${
        darkMode ? 'bg-gradient-to-r from-orange-950/20 via-red-950/15 to-slate-950 border-orange-500/20' : 'bg-gradient-to-r from-orange-50 via-amber-50 to-white border-orange-200'
      } flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-bold tracking-widest text-orange-500 uppercase font-mono">Consistencia Diario</span>
          <h4 className="text-base font-extrabold">"La fuerza no viene de la capacidad corporal, sino de la voluntad del alma."</h4>
          <p className="text-xs text-slate-400">Completa al menos un circuito de movilidad los días de descanso para acelerar la regeneración.</p>
        </div>
        <button
          onClick={() => setScreen('routines')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-colors tracking-wide whitespace-nowrap"
        >
          INICIAR RUTINA RÁPIDA
        </button>
      </div>
    </div>
  );
}
