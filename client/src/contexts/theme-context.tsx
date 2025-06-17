import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'default' | 'liquid-glass';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  { value: 'default' as Theme, label: 'Default' },
  { value: 'liquid-glass' as Theme, label: 'Liquid Glass' },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('liquid-glass');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('ui-theme') as Theme;
    if (savedTheme && themes.some(t => t.value === savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme classes to document
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('default-theme', 'liquid-glass-theme');
    
    // Add current theme class
    root.classList.add(`${theme}-theme`);
    
    // Save to localStorage
    localStorage.setItem('ui-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}