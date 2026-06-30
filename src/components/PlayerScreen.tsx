import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, ShieldAlert,
  ChevronRight, Dumbbell, Clock, Flame, ChevronLeft, Award, HelpCircle,
  RefreshCw, Check, SkipForward, PlayCircle, Star
} from 'lucide-react';
import { Routine, Exercise, UserProgress } from '../types';

interface PlayerScreenProps {
  course: Routine; // maps to Routine
  lessonId: string; // active exerciseId
  progress: UserProgress;
  onBack: () => void;
  onSelectLesson: (exerciseId: string) => void;
  onToggleComplete: (routineId: string, exerciseId: string) => void;
  onNextLesson: () => void;
  darkMode: boolean;
  autoplayEnabled?: boolean; // mapped from settings
}

export default function PlayerScreen({
  course,
  lessonId, // represents exerciseId
  progress,
  onBack,
  onSelectLesson,
  onToggleComplete,
  onNextLesson,
  darkMode
}: PlayerScreenProps) {
  const exercises = course.exercises;
  const currentIdx = exercises.findIndex(e => e.id === lessonId);
  const exercise = exercises[currentIdx] || exercises[0];

  // Training state phases: 'prepare' | 'work' | 'rest' | 'complete'
  const [phase, setPhase] = useState<'prepare' | 'work' | 'rest' | 'complete'>('prepare');
  
  // Timer counts
  const [prepareSeconds, setPrepareSeconds] = useState(8); // Preparation countdown before work
  const [workSeconds, setWorkSeconds] = useState(exercise.duration || 45); // Work countdown
  const [restSeconds, setRestSeconds] = useState(exercise.restAfter || 20); // Rest countdown
  
  // Sets tracking
  const [currentSet, setCurrentSet] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);

  // Audio Beep generator using Web Audio API
  const playBeep = (freq: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // AudioContext blocked or unsupported
    }
  };

  // Text-To-Speech announcement
  const speakVoice = (text: string) => {
    if (!voiceGuideEnabled) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      // speech synthesis failed
    }
  };

  // On Exercise change: Reset state
  useEffect(() => {
    setPhase('prepare');
    setPrepareSeconds(8);
    setWorkSeconds(exercise.duration || 45);
    setRestSeconds(exercise.restAfter || 20);
    setCurrentSet(1);
    setIsPaused(false);
    
    // Announce exercise switch
    speakVoice(`Siguiente ejercicio: ${exercise.name}. Prepárate en posición.`);
  }, [lessonId]);

  // Handle active countdowns
  useEffect(() => {
    if (isPaused) return;

    let timer: NodeJS.Timeout;

    if (phase === 'prepare') {
      if (prepareSeconds > 0) {
        timer = setTimeout(() => {
          // Play countdown tick on final 3 seconds
          if (prepareSeconds <= 3) {
            playBeep(800, 0.1);
          }
          setPrepareSeconds(prev => prev - 1);
        }, 1000);
      } else {
        playBeep(1200, 0.35); // Start work beep
        speakVoice(`¡A entrenar!`);
        setPhase('work');
      }
    } 
    
    else if (phase === 'work') {
      if (workSeconds > 0) {
        timer = setTimeout(() => {
          // Countdown beeps on final 3s
          if (workSeconds <= 3) {
            playBeep(800, 0.15);
          }
          setWorkSeconds(prev => prev - 1);
        }, 1000);
      } else {
        // Work finished
        playBeep(1000, 0.4); // Rest chime
        
        if (currentSet < exercise.sets) {
          // Move to Rest phase for next set
          speakVoice(`Buen trabajo. Descansa.`);
          setPhase('rest');
          setRestSeconds(exercise.restAfter || 20);
        } else {
          // Exercise completed for all sets!
          handleExerciseFinished();
        }
      }
    } 
    
    else if (phase === 'rest') {
      if (restSeconds > 0) {
        timer = setTimeout(() => {
          if (restSeconds <= 3) {
            playBeep(850, 0.1);
          }
          setRestSeconds(prev => prev - 1);
        }, 1000);
      } else {
        // Rest over, start next set
        playBeep(1200, 0.3);
        const nextSetNum = currentSet + 1;
        setCurrentSet(nextSetNum);
        speakVoice(`Serie número ${nextSetNum}. ¡Comienza!`);
        setPhase('work');
        setWorkSeconds(exercise.duration || 45);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, prepareSeconds, workSeconds, restSeconds, isPaused, currentSet, exercise]);

  // Exercise completed (transition to next exercise or final celebration)
  const handleExerciseFinished = () => {
    // Notify main controller of exercise completion
    onToggleComplete(course.id, exercise.id);

    // Is there a next exercise?
    if (currentIdx < exercises.length - 1) {
      const nextEx = exercises[currentIdx + 1];
      onSelectLesson(nextEx.id);
    } else {
      // Completed the entire routine!
      setPhase('complete');
      playBeep(523, 0.15);
      setTimeout(() => playBeep(659, 0.15), 150);
      setTimeout(() => playBeep(783, 0.3), 300);
      speakVoice(`¡Felicidades! Has completado el circuito con éxito. Excelente trabajo de constancia.`);
    }
  };

  // Fast forward skip rest
  const skipRest = () => {
    playBeep(1200, 0.3);
    const nextSetNum = currentSet + 1;
    setCurrentSet(nextSetNum);
    speakVoice(`Serie número ${nextSetNum}. ¡Comienza!`);
    setPhase('work');
    setWorkSeconds(exercise.duration || 45);
  };

  // Add 10s of extra rest
  const addRestTime = () => {
    setRestSeconds(prev => prev + 10);
    playBeep(700, 0.1);
  };

  const handleFinishSessionDirectly = () => {
    // Complete workout routine action
    onBack();
  };

  const currentProgressPercent = () => {
    if (phase === 'prepare') return (prepareSeconds / 8) * 100;
    if (phase === 'work') return (workSeconds / (exercise.duration || 45)) * 100;
    if (phase === 'rest') return (restSeconds / (exercise.restAfter || 20)) * 100;
    return 100;
  };

  // If entire routine is completed, show premium summary/celebration screen
  if (phase === 'complete') {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 text-center space-y-8 animate-fade-in">
        <div className="inline-flex p-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-full animate-bounce">
          <Award className="w-16 h-16" />
        </div>

        <div className="space-y-3">
          <span className="text-xs font-black tracking-widest text-orange-500 uppercase font-mono">
            Rendimiento de Élite
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            ¡Rutina Completada!
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed font-light">
            Has demostrado disciplina de acero hoy. Tu entrenador personal ha registrado tu sesión y actualizado tus métricas en tiempo real.
          </p>
        </div>

        {/* Stats Burned Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tiempo Total</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{course.durationMinutes} mins</span>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Calorías Quemadas</span>
            <span className="text-xl font-extrabold text-orange-500 mt-1 block">~{course.caloriesEstimate} kcal</span>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl col-span-2 md:col-span-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ejercicios</span>
            <span className="text-xl font-extrabold text-white mt-1 block">{exercises.length} Listos</span>
          </div>
        </div>

        {/* Coach recommendation */}
        <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl max-w-md mx-auto text-left flex gap-4">
          <img
            src={course.coach.avatar || undefined}
            alt={course.coach.name}
            className="w-12 h-12 rounded-full object-cover shrink-0 border border-orange-500/20"
          />
          <div>
            <span className="text-[9px] font-black tracking-wider text-orange-500 uppercase block font-mono">Feedback del Entrenador</span>
            <p className="text-xs text-slate-300 font-light leading-relaxed mt-1">
              "Gran ritmo en las series hoy, Adrián. Hidrátate bien, haz estiramientos rápidos y prepárate para enfocar el core mañana."
            </p>
          </div>
        </div>

        <button
          onClick={handleFinishSessionDirectly}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold rounded-2xl text-sm transition-transform hover:scale-[1.02] shadow-lg shadow-orange-500/25 cursor-pointer"
        >
          REGISTRAR Y FINALIZAR SESIÓN
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Back button header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer self-start ${
            darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-650 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>Abandonar entrenamiento</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold font-mono border ${
            darkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            Ejercicio {currentIdx + 1} de {exercises.length}
          </span>
          <span className="text-xs px-3.5 py-1.5 rounded-full font-bold font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {exercise.muscleGroup}
          </span>
        </div>
      </div>

      {/* Grid: Workout play video & controls vs exercises queue list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Video container, dynamic timer, action controls */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Simulated Active Player */}
          <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-900 overflow-hidden shadow-2xl flex items-center justify-center">
            
            {/* Active exercise video loop (from Mixkit high quality fitness loops) */}
            <video
              key={exercise.videoUrl}
              src={exercise.videoUrl || undefined}
              autoPlay
              loop
              muted
              playsInline
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />

            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

            {/* Prepare countdown screen overlay */}
            {phase === 'prepare' && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center space-y-4 z-20">
                <span className="text-xs font-black tracking-widest text-orange-500 uppercase font-mono animate-pulse">
                  PREPÁRATE EN POSICIÓN
                </span>
                <span className="text-7xl font-black text-white">{prepareSeconds}s</span>
                <p className="text-xs text-slate-400 font-bold max-w-sm uppercase">
                  Siguiente: {exercise.name}
                </p>
              </div>
            )}

            {/* Rest countdown overlay */}
            {phase === 'rest' && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-5 z-20">
                <span className="inline-flex p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full animate-bounce">
                  <RefreshCw className="w-8 h-8" />
                </span>
                <div className="space-y-1">
                  <span className="text-xs font-black tracking-widest text-blue-400 uppercase font-mono">
                    TIEMPO DE RECUPERACIÓN
                  </span>
                  <span className="text-6xl font-black text-white block">{restSeconds}s</span>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Aprovecha para respirar hondo. Siguiente serie: {currentSet + 1} de {exercise.sets}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={addRestTime}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-850 transition-colors"
                  >
                    +10s Descanso
                  </button>
                  <button
                    onClick={skipRest}
                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Omitir Descanso
                  </button>
                </div>
              </div>
            )}

            {/* Active workout visual interface */}
            {phase === 'work' && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-orange-500/15 backdrop-blur-md border border-orange-500/30 px-3 py-1.5 rounded-xl text-[10px] font-bold font-mono text-orange-400 uppercase tracking-widest animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>SERIE {currentSet} DE {exercise.sets}</span>
              </div>
            )}

            {/* The giant active ticker */}
            {phase === 'work' && (
              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-6 text-white">
                <div className="w-20 h-20 rounded-full border-4 border-orange-500/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-500/10 animate-pulse" />
                  <span className="text-3xl font-black tracking-tighter text-orange-400">{workSeconds}s</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-black tracking-tight leading-none text-white">{exercise.name}</h3>
                  <p className="text-xs text-slate-300 font-light flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    Enfoque: {exercise.muscleGroup}
                  </p>
                </div>
              </div>
            )}

            {/* Elegant horizontal phase progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-950/80 z-20 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${
                  phase === 'prepare' ? 'bg-amber-500' :
                  phase === 'rest' ? 'bg-blue-500' :
                  'bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]'
                }`}
                style={{ width: `${currentProgressPercent()}%` }}
              />
            </div>
          </div>

          {/* Action Row: Play/Pause, Beeps, instructions, skip set */}
          <div className={`p-5 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-5 ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-slate-50/50 border-slate-150'
          }`}>
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-center">
              {/* Play / Pause */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-transform hover:scale-105"
                title={isPaused ? "Reanudar temporizador" : "Pausar temporizador"}
              >
                {isPaused ? <Play className="w-5 h-5 fill-current ml-0.5" /> : <Pause className="w-5 h-5 fill-current" />}
              </button>

              {/* Sound Enabled */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl border transition-all ${
                  soundEnabled ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'border-slate-800 text-slate-500'
                }`}
                title="Efectos de sonido beeps"
              >
                {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
              </button>

              {/* Voice Guide */}
              <button
                onClick={() => setVoiceGuideEnabled(!voiceGuideEnabled)}
                className={`p-2.5 rounded-xl border transition-all ${
                  voiceGuideEnabled ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'border-slate-800 text-slate-500'
                }`}
                title="Voz del entrenador guiada"
              >
                <HelpCircle className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleExerciseFinished}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold rounded-xl text-xs transition-transform hover:scale-[1.01]"
              >
                <span>OMITIR EJERCICIO</span>
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Coach's Instructions & biomechanical tips */}
          <div className={`p-6 md:p-8 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-4`}>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowInstructions(!showInstructions)}>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-orange-500 flex items-center gap-2">
                <Star className="w-4 h-4 fill-current text-orange-500" /> BIOMECÁNICA Y CONSEJOS DEL ENTRENADOR
              </h4>
              <span className="text-xs text-slate-500 font-bold">{showInstructions ? 'Ocultar' : 'Mostrar'}</span>
            </div>
            
            {showInstructions && (
              <div className="border-t border-slate-500/10 pt-3 space-y-4">
                <p className="text-xs md:text-sm font-light leading-relaxed text-slate-400">
                  {exercise.instructions}
                </p>
                {!!exercise.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-48 flex items-center justify-center p-1">
                    <img
                      src={exercise.imageUrl || undefined}
                      alt={exercise.name}
                      className="max-h-44 object-contain rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Exercises queue list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="px-1 flex justify-between items-center">
            <h3 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Lista de Ejercicios
            </h3>
            <span className="text-xs font-bold font-mono text-slate-400">
              {currentIdx + 1} de {exercises.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {exercises.map((ex, index) => {
              const isCurrent = ex.id === lessonId;
              const isComp = currentIdx > index;

              return (
                <div
                  key={ex.id}
                  onClick={() => onSelectLesson(ex.id)}
                  className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 cursor-pointer flex gap-3.5 min-w-0 ${
                    isCurrent
                      ? 'bg-orange-500/12 border-orange-500/45 text-orange-400 shadow-md shadow-orange-500/5 font-black'
                      : isComp
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                      : darkMode
                      ? 'bg-slate-900/25 border-slate-900/80 hover:border-slate-850 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200 backdrop-blur-sm'
                      : 'bg-white border-slate-150 hover:border-slate-250 shadow-sm text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="shrink-0">
                    {isComp ? (
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-lg border text-[10px] font-mono font-bold flex items-center justify-center ${
                        isCurrent
                          ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                          : 'border-slate-700/20 bg-slate-500/5'
                      }`}>
                        {index + 1}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p className={`text-xs font-bold truncate ${
                      isCurrent ? 'text-orange-400' : darkMode ? 'text-slate-300' : 'text-slate-800'
                    }`}>
                      {ex.name}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">{ex.duration > 0 ? `${ex.duration}s` : `${ex.reps} reps`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
