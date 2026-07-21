/**
 * ThemeContext
 * - Defaults to the device system theme (useColorScheme)
 * - User can override via toggle from ProfileScreen
 * - Override is persisted in AsyncStorage
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkTheme, lightTheme, ThemeColors} from '../styles/theme';

const THEME_KEY = '@fintrack_theme_override';

type ThemeMode = 'dark' | 'light';

type ThemeContextValue = {
  theme: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: darkTheme,
  mode: 'dark',
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({children}: {children: ReactNode}) {
  const systemScheme = useColorScheme(); // 'dark' | 'light' | null
  // null means unknown — treat as dark
  const systemMode: ThemeMode = systemScheme === 'light' ? 'light' : 'dark';

  // null = no user override (follow system), otherwise user-chosen mode
  const [override, setOverride] = useState<ThemeMode | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load saved user override on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(saved => {
      if (saved === 'light' || saved === 'dark') {
        setOverride(saved);
      }
      setLoaded(true);
    });
  }, []);

  // Active mode: user override → system
  const mode: ThemeMode = override ?? systemMode;

  const toggleTheme = useCallback(() => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setOverride(next);
    AsyncStorage.setItem(THEME_KEY, next);
  }, [mode]);

  const value: ThemeContextValue = {
    theme: mode === 'dark' ? darkTheme : lightTheme,
    mode,
    isDark: mode === 'dark',
    toggleTheme,
  };

  // Avoid flicker: don't render until AsyncStorage is read
  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Hook — use inside any screen or component */
export function useTheme() {
  return useContext(ThemeContext);
}
