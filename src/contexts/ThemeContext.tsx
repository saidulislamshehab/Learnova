import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeColor = '#ACBAC4' | '#E1D9BC' | '#F7DB91' | '#D8E983' | '#A5C89E' | '#9F8383' | '#FD8A6B';

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (color: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColor>('#A5C89E');

  const setTheme = (color: ThemeColor) => {
    setThemeState(color);
    // Store theme in localStorage for persistence
    localStorage.setItem('learnova-theme', color);
  };

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('learnova-theme') as ThemeColor;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Update CSS variables when theme changes
    const root = document.documentElement;
    
    // Apply smooth transition
    root.style.setProperty('--theme-transition', 'all 0.3s ease');
    
    // Set the accent color
    root.style.setProperty('--accent-primary', theme);
    root.style.setProperty('--accent-primary-rgb', hexToRgb(theme));
    
    // Clean up transition after it completes
    const timeout = setTimeout(() => {
      root.style.setProperty('--theme-transition', 'none');
    }, 300);

    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return '165, 200, 158'; // Default sage green
}
