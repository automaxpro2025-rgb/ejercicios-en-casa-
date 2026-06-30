import React from 'react';
import { 
  Award, Clock, Calendar, CheckCircle, ArrowUpRight, Flame, Heart, Sparkles, User, Dumbbell, Shield, Activity
} from 'lucide-react';
import { Routine, UserProgress, UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  progress: UserProgress;
  courses: Routine[]; // bound to routines
  onSelectCourse: (routine: Routine) => void;
  onResetWelcome: () => void;
  darkMode: boolean;
}

export default function ProfileScreen({
  user,
  progress,
  courses,
  onSelectCourse,
  onResetWelcome,
  darkMode,
}: ProfileScreenProps) {
  // Saved Routines
  const savedRoutinesList = courses.filter((r) => progress.savedRoutines.includes(r.id));

  // Sort history newest first
  const sortedHistory = [...(progress.history || [])].sort((a, b) => {
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-orange-500 font-mono">
          Ficha Deportiva
        </span>
        <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Perfil de Rendimiento
        </h1>
        <p className={`text-sm mt-1 font-light ${darkMode ? 'text-slate-400' : 'text-slate-650'}`}>
          Monitorea tus estadísticas metabólicas, marcas históricas y asiduidad semanal.
        </p>
      </div>

      {/* Main Profile Info Card */}
      <div className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-br ${
        darkMode ? 'from-slate-900/60 to-orange-950/10 border-slate-900' : 'from-slate-50 to-white border-slate-100 shadow-sm'
      }`}>
        <div className="absolute top-[-50%] right-[-10%] w-72 h-72 rounded-full bg-orange-600/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
            <img
              src={user.avatar || undefined}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-orange-500/25 object-cover shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2.5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                  <Sparkles className="w-3 h-3 fill-current text-orange-500" /> Atleta Verificado Pulse
                </span>
                <h2 className={`text-2xl font-extrabold mt-2 ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  {user.name}
                </h2>
                <p className="text-sm text-slate-400 font-light">Meta primordial: <strong className="text-orange-400 font-bold">{user.goal}</strong></p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Peso: {user.weightKg} Kg
                </span>
                <span>•</span>
                <span className="font-bold">Nivel: {user.fitnessLevel}</span>
                <span>•</span>
                <span className="truncate">{user.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onResetWelcome}
            className="px-5 py-2.5 rounded-xl border border-orange-500/20 text-orange-500 hover:bg-orange-500/10 hover:border-orange-500 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Editar Datos del Atleta
          </button>
        </div>
      </div>

      {/* Stats Bento Box Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Metabolismo Activo</span>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{progress.totalCaloriesBurned}</span>
            <span className="text-xs text-slate-400 font-mono">kcal</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-orange-500 mt-2 font-bold font-mono">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Calorías quemadas</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Tiempo de Esfuerzo</span>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{progress.totalWorkoutMinutes}</span>
            <span className="text-xs text-slate-400 font-mono">mins</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-orange-400 mt-2 font-bold font-mono">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span>Tiempos de circuito</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Racha Activa</span>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{progress.streakDays}</span>
            <span className="text-xs text-slate-400 font-mono">días</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-orange-500 mt-2 font-bold font-mono">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Asiduidad registrada</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${
          darkMode ? 'bg-slate-900/40 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Sesiones Listas</span>
          <div className="flex items-baseline gap-1.5 mt-3">
            <span className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{progress.history ? progress.history.length : 0}</span>
            <span className="text-xs text-slate-400 font-mono">vueltas</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-orange-400 mt-2 font-bold font-mono">
            <Award className="w-3.5 h-3.5 text-orange-500" />
            <span>Historial acumulado</span>
          </div>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Workouts history log */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Historial de Entrenamientos ({sortedHistory.length})
            </h3>

            {sortedHistory.length > 0 ? (
              <div className="space-y-3.5">
                {sortedHistory.map((log) => {
                  return (
                    <div
                      key={log.id}
                      className={`p-4 md:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        darkMode ? 'bg-slate-900/20 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                          <Dumbbell className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            {log.routineTitle}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                            Realizado el {new Date(log.completedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider font-mono">Tiempo</span>
                          <span className="text-xs font-bold text-slate-300 font-mono">{log.durationMinutes} mins</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider font-mono">Gasto</span>
                          <span className="text-xs font-extrabold text-orange-500 font-mono">{log.caloriesBurned} kcal</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`p-10 rounded-3xl border text-center ${
                darkMode ? 'bg-slate-900/10 border-slate-900 text-slate-400' : 'bg-slate-50/50 border-slate-150 text-slate-500'
              }`}>
                <p className="text-sm font-light leading-relaxed">No tienes entrenamientos finalizados aún.<br />¡Escoge un circuito en el catálogo y da tu primer paso!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bookmarked Routines */}
        <div className="space-y-6">
          <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Rutinas Guardadas ({savedRoutinesList.length})
          </h3>

          {savedRoutinesList.length > 0 ? (
            <div className="space-y-3">
              {savedRoutinesList.map((routine) => (
                <div
                  key={routine.id}
                  onClick={() => onSelectCourse(routine)}
                  className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] cursor-pointer flex gap-3.5 min-w-0 ${
                    darkMode ? 'bg-slate-900/20 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
                  }`}
                >
                  <img
                    src={routine.coverImage || undefined}
                    alt={routine.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h4 className={`text-xs font-extrabold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {routine.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 truncate uppercase font-bold tracking-wider">
                      {routine.level} • {routine.durationMinutes} mins
                    </p>
                  </div>
                  <button className="self-center p-1.5 text-rose-500">
                    <Heart className="w-4 h-4 fill-current text-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-8 rounded-2xl border text-center ${
              darkMode ? 'bg-slate-900/10 border-slate-900 text-slate-400' : 'bg-slate-50/50 border-slate-150 text-slate-500'
            }`}>
              <p className="text-xs font-light">No tienes rutinas agregadas a guardados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
