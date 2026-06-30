import React, { useState } from 'react';
import { Flame, Play, Target, Dumbbell, Award, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';

interface WelcomeScreenProps {
  user: UserProfile;
  onEnter: (updatedProfile: Partial<UserProfile>) => void;
}

export default function WelcomeScreen({ user, onEnter }: WelcomeScreenProps) {
  const [name, setName] = useState(user.name);
  const [goal, setGoal] = useState('Ganar Fuerza y Rendimiento');
  const [level, setLevel] = useState<'Principiante' | 'Intermedio' | 'Avanzado'>('Intermedio');
  const [weight, setWeight] = useState(user.weightKg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnter({
      name: name || 'Atleta Pulse',
      goal,
      fitnessLevel: level,
      weightKg: Number(weight) || 75
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Dynamic ambient dark glowing elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-orange-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-red-600/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.35)] animate-pulse">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-wider text-white">
            PULSE<span className="text-orange-500">.</span>FIT
          </span>
        </div>
        <div className="text-xs font-mono text-orange-400 bg-orange-950/40 border border-orange-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
          ● ENTRENADOR PERSONAL ACTIVO
        </div>
      </div>

      {/* Main Form/Hero Container */}
      <div className="max-w-4xl mx-auto my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 w-full">
        {/* Left column: Compelling Text */}
        <div className="lg:col-span-6 text-left flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-6 w-fit">
            <Dumbbell className="w-3.5 h-3.5" /> Entrenamientos Interactivos de Élite
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-none">
            Tu cuerpo.<br />
            Tu espacio.<br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-rose-500 bg-clip-text text-transparent">
              Sin excusas.
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base mb-8 leading-relaxed font-light max-w-md">
            No somos un curso ni una academia de lectura. Pulse es un entrenador activo de alta fidelidad que te guía segundo a segundo mediante video, alertas de audio, temporizadores de intervalos y métricas precisas de quema calórica.
          </p>

          <div className="hidden lg:flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                <Target className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Temporizadores Inteligentes</h4>
                <p className="text-xs text-slate-400">Intervalos automatizados con avisos sonoros de inicio, descanso y final de serie.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                <Play className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Videos de Alta Fidelidad</h4>
                <p className="text-xs text-slate-400">Visualiza la biomecánica correcta en bucles de video continuos y limpios.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form Onboarding Panel */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative">
          <div className="absolute top-0 right-12 translate-y-[-50%] bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Configuración Inicial
          </div>

          <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" /> Prepara tu perfil de atleta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">¿Cómo te llamas?</label>
              <input
                id="input-welcome-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de atleta"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500/50 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none transition-all placeholder:text-slate-600 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Peso actual (Kg)</label>
                <input
                  id="input-welcome-weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  placeholder="75"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500/50 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nivel Físico</label>
                <select
                  id="select-welcome-level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500/50 rounded-xl px-3 py-3 text-slate-100 text-sm focus:outline-none transition-all font-medium"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">¿Cuál es tu meta primordial?</label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  'Ganar Masa Muscular & Fuerza',
                  'Quemar Grasa & Definición (HIIT)',
                  'Movilidad, Alivio y Salud Articular',
                  'Optimizar Resistencia Cardiovascular'
                ].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                      goal === g
                        ? 'bg-orange-500/10 border-orange-500/80 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                        : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{g}</span>
                    {goal === g && <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="btn-welcome-submit"
              type="submit"
              className="w-full mt-2 group relative inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(239,68,68,0.25)] cursor-pointer"
            >
              <span>INICIAR MI COACHING</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-900 pt-6 mt-6 z-10 text-xs text-slate-500">
        <p>© 2026 Pulse Training Corp. Diseñado para rendimiento máximo de forma offline y persistente.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <span className="hover:text-slate-400 transition-colors cursor-pointer">Soporte Directo</span>
          <span className="hover:text-slate-400 transition-colors cursor-pointer">Seguridad</span>
        </div>
      </div>
    </div>
  );
}
