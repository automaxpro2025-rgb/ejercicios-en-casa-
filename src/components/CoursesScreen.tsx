import React, { useState, useMemo } from 'react';
import { Search, Flame, Clock, Dumbbell, Award, Star, SlidersHorizontal, FilterX, Shield, Activity, ListFilter } from 'lucide-react';
import { Routine, UserProgress } from '../types';

interface CoursesScreenProps {
  courses: Routine[]; // bound to routines
  progress: UserProgress;
  onSelectCourse: (routine: Routine) => void;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  darkMode: boolean;
}

export default function CoursesScreen({
  courses,
  progress,
  onSelectCourse,
  selectedCategoryId,
  onSelectCategory,
  darkMode
}: CoursesScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  const categoriesList = useMemo(() => {
    const list = [
      { id: null as string | null, label: 'Todo' },
      { id: 'fuerza' as string | null, label: 'Fuerza Élite' },
      { id: 'hiit' as string | null, label: 'Cardio' },
      { id: 'core' as string | null, label: 'Abs & Core' },
      { id: 'movilidad' as string | null, label: 'Movilidad' }
    ];

    courses.forEach(c => {
      if (c.category && !list.some(item => item.id === c.category)) {
        let label = c.category.charAt(0).toUpperCase() + c.category.slice(1);
        if (c.category === 'taichi') label = 'Tai Chi';
        list.push({ id: c.category, label });
      }
    });

    return list;
  }, [courses]);

  const levelsList = ['Principiante', 'Intermedio', 'Avanzado'];

  const handleClearFilters = () => {
    setSearchQuery('');
    onSelectCategory(null);
    setLevelFilter(null);
  };

  const filteredRoutines = useMemo(() => {
    return courses.filter((routine) => {
      const matchesSearch =
        routine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        routine.coach.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategoryId ? routine.category === selectedCategoryId : true;
      const matchesLevel = levelFilter ? routine.level === levelFilter : true;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchQuery, selectedCategoryId, levelFilter]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-orange-500 font-mono">
          Entrenamientos Activos
        </span>
        <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Catálogo de Rutinas
        </h1>
        <p className={`text-sm mt-1 font-light ${darkMode ? 'text-slate-400' : 'text-slate-650'}`}>
          Rutinas guiadas por video interactivo con temporizadores incorporados de esfuerzo y descanso.
        </p>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              id="courses-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar rutina por músculo, ejercicio, coach..."
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all font-medium ${
                darkMode
                  ? 'bg-slate-900/40 border-slate-900 text-white placeholder-slate-500 focus:border-orange-500/50 focus:bg-slate-900'
                  : 'bg-white border-slate-150 text-slate-800 placeholder-slate-400 focus:border-orange-500/50 shadow-sm'
              }`}
            />
          </div>

          {/* Level Filter Tags */}
          <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 md:pb-0">
            {levelsList.map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(levelFilter === level ? null : level)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                  levelFilter === level
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                    : darkMode
                    ? 'border-slate-900 bg-slate-900/30 text-slate-400 hover:text-white'
                    : 'border-slate-150 bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Category horizontal filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 dark:border-slate-900">
          <ListFilter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
          {categoriesList.map((cat) => (
            <button
              key={cat.id ?? 'all'}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                selectedCategoryId === cat.id
                  ? 'bg-orange-500 text-white border-orange-500 dark:bg-orange-500 dark:text-white dark:border-orange-500'
                  : darkMode
                  ? 'border-transparent text-slate-400 hover:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routines Grid */}
      {filteredRoutines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map((routine) => {
            const isSaved = progress.savedRoutines.includes(routine.id);
            const totalExercises = routine.exercises.length;

            return (
              <div
                key={routine.id}
                onClick={() => onSelectCourse(routine)}
                className={`group rounded-3xl border overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-500/5 cursor-pointer flex flex-col justify-between ${
                  darkMode 
                    ? 'bg-slate-900/30 border-slate-900 hover:border-orange-500/30 hover:shadow-orange-500/5 backdrop-blur-sm' 
                    : 'bg-white/80 border-slate-150 hover:border-slate-300 shadow-sm hover:shadow-slate-200'
                }`}
              >
                {/* Image Cover */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={routine.coverImage || undefined}
                    alt={routine.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                    <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur-md text-orange-400 border border-orange-500/20 shadow-sm">
                      {routine.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border ${
                      routine.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      routine.level === 'Intermedio' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {routine.level}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className={`font-extrabold text-lg leading-snug group-hover:text-orange-500 transition-colors ${
                      darkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {routine.title}
                    </h3>

                    <p className={`text-xs font-light leading-relaxed line-clamp-2 ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {routine.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-1">
                    {/* Coach widget */}
                    <div className="flex items-center gap-2.5">
                      <img
                        src={routine.coach.avatar || undefined}
                        alt={routine.coach.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                      />
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          Coach {routine.coach.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate uppercase font-bold tracking-wider">
                          Preparador Elite
                        </p>
                      </div>
                    </div>

                    {/* Stats footer */}
                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-900 pt-3.5 mt-2 text-[11px] font-bold font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-orange-500">
                        <Flame className="w-3.5 h-3.5" />
                        {routine.caloriesEstimate} kcal
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {routine.durationMinutes} mins
                      </span>
                      <span className="font-semibold">{totalExercises} Ejercicios</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`p-16 rounded-3xl border text-center space-y-4 flex flex-col items-center justify-center ${
          darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-slate-50/50 border-slate-150'
        }`}>
          <div className="p-4 bg-slate-500/5 rounded-2xl text-slate-400">
            <FilterX className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h3 className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              No se encontraron entrenamientos
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mt-1 mx-auto font-light">
              Prueba a cambiar tus criterios de búsqueda o de nivel físico para encontrar un circuito ideal.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-orange-500/10"
          >
            Limpiar Filtros de Búsqueda
          </button>
        </div>
      )}
    </div>
  );
}
