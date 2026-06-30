import React from 'react';
import { Dumbbell, Flame, Shield, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../types';

interface CategoriesScreenProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  darkMode: boolean;
}

export default function CategoriesScreen({ categories, onSelectCategory, darkMode }: CategoriesScreenProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell':
        return Dumbbell;
      case 'Flame':
        return Flame;
      case 'Shield':
        return Shield;
      case 'Activity':
        return Activity;
      default:
        return Dumbbell;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Page Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-orange-500 font-mono">
          Especialidades Deportivas
        </span>
        <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Selecciona tu Enfoque
        </h1>
        <p className={`text-sm mt-1 font-light ${darkMode ? 'text-slate-400' : 'text-slate-650'}`}>
          Elige la disciplina que deseas entrenar hoy. Cada enfoque cuenta con entrenamientos guiados en tiempo real.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const IconComponent = getIcon(category.icon);

          return (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`group p-6 md:p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/5 cursor-pointer bg-gradient-to-br backdrop-blur-md ${category.color} ${
                darkMode ? 'border-slate-800/80 hover:border-orange-500/35' : 'border-slate-200 hover:border-orange-300/40 shadow-sm shadow-slate-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-950/20 dark:bg-slate-900/60 rounded-2xl border border-white/5 flex items-center justify-center">
                  <IconComponent className="w-6 h-6 text-orange-400" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-slate-950/20 border border-white/5 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {category.count} {category.count === 1 ? 'Rutina' : 'Rutinas'}
                </span>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className={`text-xl font-extrabold flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {category.name}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-orange-500" />
                </h3>
                <p className={`text-sm font-light leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-650'}`}>
                  {category.description}
                </p>
              </div>

              {/* Footer row of Category Card */}
              <div className="mt-6 pt-5 border-t border-slate-500/10 flex items-center justify-between text-xs font-bold">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Metodología Pulse de Alto Impacto</span>
                <span className="text-orange-500 font-extrabold group-hover:underline">Entrenar Ahora</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aesthetic Fitness Plan Quote */}
      <div className={`p-8 rounded-3xl border relative overflow-hidden bg-gradient-to-r from-orange-500/10 via-red-500/10 to-transparent ${
        darkMode ? 'border-slate-900' : 'border-slate-100 shadow-sm'
      }`}>
        <div className="relative z-10 max-w-xl space-y-3">
          <h4 className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            ¿Quieres alternar tu rutina diaria?
          </h4>
          <p className={`text-sm font-light leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-650'}`}>
            Nuestros entrenadores sugieren combinar 3 días de **Fuerza de Élite** con 2 días de **Cardio HIIT** y 1 sesión de **Movilidad** para un desarrollo muscular integral y quema de grasa simétrica.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onSelectCategory('all')}
              className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold border border-slate-800 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Ver Todas las Rutinas
            </button>
          </div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-10 opacity-10 pointer-events-none hidden lg:block">
          <Sparkles className="w-36 h-36 text-orange-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
