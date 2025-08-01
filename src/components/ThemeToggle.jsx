import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ThemeToggle() {
  const { settings, updateSettings } = useStore();

  const themes = [
    { id: 'light', name: 'فاتح', icon: Sun },
    { id: 'dark', name: 'داكن', icon: Moon },
    { id: 'auto', name: 'تلقائي', icon: Monitor }
  ];

  const currentTheme = settings?.theme || 'light';

  const handleThemeChange = (themeId) => {
    updateSettings({
      ...settings,
      theme: themeId
    });
  };

  const getCurrentThemeIcon = () => {
    const theme = themes.find(t => t.id === currentTheme);
    return theme ? theme.icon : Sun;
  };

  const CurrentIcon = getCurrentThemeIcon();

  return (
    <div className="relative group">
      <button className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CurrentIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      
      <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/20 z-[99999] theme-toggle-panel opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="p-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                currentTheme === theme.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <theme.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
