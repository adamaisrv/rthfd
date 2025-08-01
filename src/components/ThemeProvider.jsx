import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function ThemeProvider({ children }) {
  const { settings } = useStore();

  useEffect(() => {
    // Apply color scheme to CSS variables
    if (settings?.colors) {
      Object.entries(settings.colors).forEach(([key, color]) => {
        document.documentElement.style.setProperty(`--color-${key}`, color);
      });
    }

    // Apply theme - clean implementation
    if (settings?.theme) {
      // Remove all theme classes first
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');

      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else if (settings.theme === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      }
      // Light theme is default (no classes needed)
    }

    // Apply language and direction
    if (settings?.language) {
      document.documentElement.setAttribute('lang', settings.language);
      document.documentElement.setAttribute('dir', settings.language === 'ar' ? 'rtl' : 'ltr');
    }

    // Apply animations setting
    if (settings?.display?.showAnimations === false) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
      document.documentElement.style.setProperty('--transition-duration', '0s');
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0.3s');
      document.documentElement.style.setProperty('--transition-duration', '0.3s');
    }

    // Apply compact mode
    if (settings?.display?.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }

    // Listen for system theme changes when auto mode is enabled
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (settings?.theme === 'auto') {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        
        if (e.matches) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        }
      }
    };

    if (settings?.theme === 'auto') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [settings]);

  return children;
}
