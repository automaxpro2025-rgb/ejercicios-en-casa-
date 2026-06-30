import React, { useState } from 'react';
import { 
  Settings, Moon, Sun, Play, Volume2, HelpCircle, Bell, Trash2, ShieldAlert, Check, Dumbbell, Award
} from 'lucide-react';
import { AppSettings, UserProfile } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
  user: UserProfile;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onResetProgress: () => void;
}

export default function SettingsScreen({
  settings,
  onChangeSettings,
  user,
  darkMode,
  toggleDarkMode,
  onResetProgress,
}: SettingsScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggleVoiceGuide = () => {
    onChangeSettings({ ...settings, voiceGuide: !settings.voiceGuide });
  };

  const handleToggleSound = () => {
    onChangeSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleToggleNotifications = () => {
    onChangeSettings({ ...settings, notifications: !settings.notifications });
  };

  const handleSelectCountdown = (seconds: number) => {
    onChangeSettings({ ...settings, countdownTimer: seconds });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <span className="text-xs font-black uppercase tracking-widest text-orange-500 font-mono">
          Consola de Control
        </span>
        <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Ajustes del Sistema
        </h1>
        <p className={`text-sm mt-1 font-light ${darkMode ? 'text-slate-400' : 'text-slate-650'}`}>
          Configura tus guías por voz, alertas sonoras, temporizadores y restablece estadísticas físicas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Preferences */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Interface & Visual Theme */}
          <div className={`p-6 md:p-8 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-6`}>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-900">
              <Sun className="w-5 h-5 text-orange-400" />
              <h3 className={`font-extrabold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>Tema Visual</h3>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Fondo Oscuro Avanzado</p>
                <p className="text-xs text-slate-400 mt-1">Utiliza tonos oscuros premium para reducir la fatiga ocular durante el entreno.</p>
              </div>
              
              {/* Switch */}
              <button
                onClick={toggleDarkMode}
                id="btn-settings-darkmode"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  darkMode ? 'bg-orange-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Voice Coach & Audio Settings */}
          <div className={`p-6 md:p-8 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-6`}>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-900">
              <Volume2 className="w-5 h-5 text-orange-400" />
              <h3 className={`font-extrabold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>Asistente Auditivo & Alertas</h3>
            </div>

            {/* Voice Guide toggle */}
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Entrenador de Voz por TTS</p>
                <p className="text-xs text-slate-400 mt-1">Sintetiza la voz real del coach para avisarte cuándo comenzar o descansar.</p>
              </div>
              <button
                onClick={handleToggleVoiceGuide}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  settings.voiceGuide ? 'bg-orange-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.voiceGuide ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Beep sound effects toggle */}
            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Efectos Auditivos (Beeps)</p>
                <p className="text-xs text-slate-400 mt-1">Emite pitidos en los últimos 3 segundos antes de iniciar o acabar series.</p>
              </div>
              <button
                onClick={handleToggleSound}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  settings.soundEnabled ? 'bg-orange-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Countdown length selector */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Tiempo de Preparación Inicial</p>
                <span className="text-xs font-mono text-slate-400">Seleccionado: {settings.countdownTimer} segundos</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[5, 8, 12].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => handleSelectCountdown(sec)}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      settings.countdownTimer === sec
                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/10'
                        : darkMode
                        ? 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sec} Segundos
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications and Safety */}
          <div className={`p-6 md:p-8 rounded-3xl border ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          } space-y-6`}>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200/40 dark:border-slate-900">
              <Bell className="w-5 h-5 text-orange-400" />
              <h3 className={`font-extrabold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>Notificaciones</h3>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className={`text-sm font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Recordatorio de Hábitos</p>
                <p className="text-xs text-slate-400 mt-1">Recibe recordatorios de entreno para mantener tu racha activa de días.</p>
              </div>
              <button
                onClick={handleToggleNotifications}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                  settings.notifications ? 'bg-orange-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Athlete Summary & Danger Zone */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border text-center space-y-4 ${
            darkMode ? 'bg-slate-900/10 border-slate-900' : 'bg-white border-slate-100 shadow-sm'
          }`}>
            <img
              src={user.avatar || undefined}
              alt={user.name}
              className="w-16 h-16 rounded-full border border-orange-500/30 mx-auto object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[9px] font-black tracking-widest text-orange-500 uppercase font-mono block">FICHA REGISTRADA</span>
              <h4 className={`text-base font-extrabold mt-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>{user.name}</h4>
              <p className="text-xs text-slate-400 font-light mt-0.5">{user.goal}</p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
              Dispositivo: Pulse Local Storage
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-red-500/15 bg-red-500/5 space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="text-sm font-bold">Zona de Peligro</h4>
            </div>
            
            <p className="text-xs text-red-300/80 leading-relaxed font-light">
              Restablece completamente tus estadísticas físicas (historial de entrenos completados, calorías quemadas y rachas activas) para empezar tu temporada de cero.
            </p>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                id="btn-settings-reset-progress"
                className="w-full py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 hover:text-white text-red-400 text-xs font-bold border border-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-fade-in"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Restablecer Historial Físico</span>
              </button>
            ) : (
              <div className="space-y-3 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl animate-fade-in">
                <p className="text-xs text-red-200 font-bold leading-relaxed text-center">
                  ¿Estás seguro de que deseas eliminar todo tu historial de entrenamiento? Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-850 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowConfirm(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-650/20"
                  >
                    Sí, Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
