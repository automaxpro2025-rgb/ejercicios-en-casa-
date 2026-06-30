import React from 'react';
import { Compass, Grid, Dumbbell, User, Settings, Flame, LogOut, Moon, Sun, Shield } from 'lucide-react';
import { ScreenType, UserProfile } from '../types';

interface SidebarNavProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  user: UserProfile;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onResetWelcome: () => void;
}

export default function SidebarNav({
  currentScreen,
  setScreen,
  user,
  darkMode,
  toggleDarkMode,
  onResetWelcome
}: SidebarNavProps) {
  const menuItems = [
    { id: 'home' as ScreenType, label: 'Inicio', icon: Compass },
    { id: 'categories' as ScreenType, label: 'Enfoques', icon: Grid },
    { id: 'routines' as ScreenType, label: 'Entrenar', icon: Dumbbell },
    { id: 'profile' as ScreenType, label: 'Historial', icon: User },
    { id: 'admin' as ScreenType, label: 'Panel Creador', icon: Shield },
    { id: 'settings' as ScreenType, label: 'Ajustes', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Left Sidebar Nav */}
      <aside className={`hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 border-r shrink-0 transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 border-slate-900 text-slate-100' : 'bg-white border-slate-100 text-slate-800'
      } p-6`}>
        {/* Brand Header */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className={`font-black text-lg tracking-wider uppercase ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              PULSE<span className="text-orange-500">.</span>FIT
            </span>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                currentScreen === item.id || 
                (item.id === 'routines' && (
                  currentScreen === 'routines' || 
                  currentScreen === 'courses' || 
                  currentScreen === 'course-detail' || 
                  currentScreen === 'player' || 
                  currentScreen === 'routine-detail' || 
                  currentScreen === 'workout-active'
                ));
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => setScreen(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-500 border border-orange-500/20 shadow-sm'
                      : `border border-transparent ${
                          darkMode ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-orange-500' : 'opacity-75'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer/User Info & Extra Controls */}
        <div className="flex flex-col gap-4 border-t pt-5 border-slate-200/50 dark:border-slate-900">
          {/* Quick theme toggler */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-400">
            <span>Tema visual</span>
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                darkMode
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-amber-400'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* User Profile info widget */}
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || undefined}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold truncate ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 truncate uppercase font-bold tracking-wider">
                Atleta Elite
              </span>
            </div>
          </div>

          <button
            onClick={onResetWelcome}
            className={`flex items-center gap-2 justify-center py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              darkMode
                ? 'border-slate-900 hover:bg-red-500/10 hover:border-red-500/20 text-slate-400 hover:text-red-400'
                : 'border-slate-100 hover:bg-red-50 hover:border-red-100 text-slate-500 hover:text-red-500'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Editar Atleta</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Nav Bar */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex justify-around items-center h-16 backdrop-blur-md transition-all duration-300 ${
        darkMode ? 'bg-slate-950/95 border-slate-900 text-slate-100' : 'bg-white/95 border-slate-100 text-slate-800'
      }`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            currentScreen === item.id || 
            (item.id === 'routines' && (
              currentScreen === 'routines' || 
              currentScreen === 'courses' || 
              currentScreen === 'course-detail' || 
              currentScreen === 'player' || 
              currentScreen === 'routine-detail' || 
              currentScreen === 'workout-active'
            ));
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-orange-500 font-extrabold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
