import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Palettes ──────────────────────────────────────────────────────────────────
export const DARK = {
  bg:          '#0a0d14',
  surface:     '#111827',
  card:        '#1a2235',
  border:      '#1e2d45',
  accent:      '#00c8ff',  // cyan logo
  accentDim:   '#0088bb',
  accentBg:    '#00c8ff18',
  navy:        '#0d1b4b',  // bleu nuit logo
  text:        '#f0f4ff',
  textSub:     '#8899bb',
  muted:       '#4a5a7a',
  green:       '#00e676',
  red:         '#ff4d6d',
  nhl:         '#00c8ff',
  nfl:         '#ff4d6d',
  tabBg:       '#0a0d14',
  tabBorder:   '#1e2d45',
  tabActive:   '#00c8ff',
  tabInactive: '#4a5a7a',
  statusBar:   'light-content',
};

export const LIGHT = {
  bg:          '#f0f4ff',
  surface:     '#ffffff',
  card:        '#ffffff',
  border:      '#dde5f5',
  accent:      '#0066cc',
  accentDim:   '#0044aa',
  accentBg:    '#0066cc18',
  navy:        '#0d1b4b',
  text:        '#0a0d14',
  textSub:     '#4a5a7a',
  muted:       '#8899bb',
  green:       '#00a854',
  red:         '#d32f2f',
  nhl:         '#0066cc',
  nfl:         '#d32f2f',
  tabBg:       '#ffffff',
  tabBorder:   '#dde5f5',
  tabActive:   '#0066cc',
  tabInactive: '#8899bb',
  statusBar:   'dark-content',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const deviceScheme = useColorScheme();
  const [mode, setMode] = useState('system'); // 'system' | 'dark' | 'light'

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then(saved => {
      if (saved) setMode(saved);
    });
  }, []);

  const setThemeMode = async (newMode) => {
    setMode(newMode);
    await AsyncStorage.setItem('themeMode', newMode);
  };

  const isDark = mode === 'system'
    ? deviceScheme === 'dark'
    : mode === 'dark';

  const colors = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ colors, mode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Helpers formatage
export const formatCAD = (v) => `CA$${Number(v).toFixed(2)}`;
export const formatUSD = (v) => `US$${Number(v).toFixed(2)}`;
export const CAD_USD_RATE = 0.74;
