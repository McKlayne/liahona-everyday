'use client';

import { useEffect } from 'react';
import { storage } from '@/lib/storage';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply theme on mount and when settings change
    const applyTheme = () => {
      const settings = storage.getSettings();
      const theme = settings.theme;

      if (typeof document !== 'undefined') {
        // Handle auto theme (based on system preference)
        if (theme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
          document.body.setAttribute('data-theme', theme);
        }

        // Apply font size
        document.body.style.fontSize = {
          small: '14px',
          medium: '16px',
          large: '18px',
        }[settings.fontSize];
      }
    };

    applyTheme();

    // Listen for system theme changes when in auto mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const settings = storage.getSettings();
      if (settings.theme === 'auto') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Listen for storage changes (when settings are updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'liahona_settings') {
        applyTheme();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}
