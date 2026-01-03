'use client';

import { useEffect, useState } from 'react';

type Theme = {
  primaryHue: number;
  accentHue: number;
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Load theme from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('fpilot-theme');
      if (storedTheme) {
        setTheme(JSON.parse(storedTheme));
      } else {
        // Default theme if nothing is stored
        setTheme({ primaryHue: 275, accentHue: 258 });
      }
    } catch (error) {
        // Fallback to default on any error
        setTheme({ primaryHue: 275, accentHue: 258 });
    }
  }, []);

  // Apply theme to CSS variables and save to localStorage whenever it changes
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--primary-hue', theme.primaryHue.toString());
      document.documentElement.style.setProperty('--accent-hue', theme.accentHue.toString());
      try {
          localStorage.setItem('fpilot-theme', JSON.stringify(theme));
      } catch (error) {
          console.error("Failed to save theme to localStorage", error);
      }
    }
  }, [theme]);

  const handleThemeChange = (newTheme: Partial<Theme>) => {
    setTheme(prevTheme => ({ ...prevTheme!, ...newTheme }));
  };

  return {
    theme,
    setTheme: handleThemeChange,
    isLoading: theme === null,
  };
}
