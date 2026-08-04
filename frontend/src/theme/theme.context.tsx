import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, type ColorPalette } from './colors';
import { _setActivePalette } from './index';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = '@theme_mode';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isDark: boolean;
  colors: ColorPalette;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function resolveTheme(mode: ThemeMode, systemScheme: 'light' | 'dark' | null): ResolvedTheme {
  if (mode === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      } catch {
        // ignore — fall back to system
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const resolvedTheme = resolveTheme(mode, systemColorScheme as 'light' | 'dark' | null);
  const isDark = resolvedTheme === 'dark';
  const activeColors = isDark ? darkColors : lightColors;

  useEffect(() => {
    _setActivePalette(activeColors);
  }, [activeColors]);

  const colors = activeColors;

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch(() => {});
  };

  const toggle = () => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setMode(next);
  };

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolvedTheme, isDark, colors, setMode, toggle }),
    [mode, resolvedTheme, isDark, colors],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useColors(): ColorPalette {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useColors must be used within ThemeProvider');
  return ctx.colors;
}
