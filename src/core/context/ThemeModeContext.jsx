import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../theme/createAppTheme';

const ThemeContext = createContext(null);

export function ThemeContextProvider({ children }) {
  const STORAGE_KEY = 'app-theme-mode';
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      setMode(saved);
    }
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const setTheme = (newMode) => {
    if (newMode !== 'light' && newMode !== 'dark') return;
    localStorage.setItem(STORAGE_KEY, newMode);
    setMode(newMode);
  };

  const theme = useMemo(() => {
    return createAppTheme(mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      isLight: mode === 'light',
      toggleTheme,
      setTheme,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeProviderWrapper');
  }
  return context;
}
