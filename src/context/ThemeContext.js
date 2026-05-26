import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── CardVault Design System ───────────────────────────────────────────────────
// Inspiré du brief: premium gaming/sports cards, coffre-fort numérique
// Palette: #070B17 fond sombre, #1E90FF bleu, #00C2FF glow, #6B4DFF violet

export const DARK = {
  // Fonds
  bg:           '#070B17',   // fond principal ultra sombre
  surface:      '#0D1426',   // surface cartes/panels
  card:         '#111B33',   // cartes de collection
  cardElevated: '#162040',   // cartes avec élévation
  glass:        '#1A2547CC', // glassmorphism (avec alpha)

  // Accents
  accent:       '#1E90FF',   // bleu principal
  accentGlow:   '#00C2FF',   // glow cyan
  accentBg:     '#1E90FF18', // fond accent translucide
  violet:       '#6B4DFF',   // violet secondaire
  violetBg:     '#6B4DFF18',

  // Borders & dividers
  border:       '#1E2D4D',
  borderGlow:   '#1E90FF33', // bordure avec glow

  // Textes
  text:         '#F0F4FF',
  textSub:      '#8899BB',
  muted:        '#3D5080',

  // États
  green:        '#00E676',
  red:          '#FF4D6D',
  orange:       '#FF9800',
  gold:         '#FFD700',

  // Sports
  nhl:          '#00C2FF',
  nfl:          '#FF4D6D',
  nba:          '#FF6B35',
  mlb:          '#00E676',

  // Tab bar
  tabBg:        '#070B17',
  tabBorder:    '#1E2D4D',
  tabActive:    '#1E90FF',
  tabInactive:  '#3D5080',

  // Navy pour hero
  navy:         '#0D1B4B',

  statusBar:    'light-content',
};

export const LIGHT = {
  bg:           '#F0F4FF',
  surface:      '#FFFFFF',
  card:         '#FFFFFF',
  cardElevated: '#F8FAFF',
  glass:        '#FFFFFFCC',

  accent:       '#1E90FF',
  accentGlow:   '#00C2FF',
  accentBg:     '#1E90FF15',
  violet:       '#6B4DFF',
  violetBg:     '#6B4DFF12',

  border:       '#DDE5F5',
  borderGlow:   '#1E90FF33',

  text:         '#070B17',
  textSub:      '#4A5A7A',
  muted:        '#8899BB',

  green:        '#00A854',
  red:          '#D32F2F',
  orange:       '#E65100',
  gold:         '#F9A825',

  nhl:          '#1E90FF',
  nfl:          '#D32F2F',
  nba:          '#E65100',
  mlb:          '#00A854',

  tabBg:        '#FFFFFF',
  tabBorder:    '#DDE5F5',
  tabActive:    '#1E90FF',
  tabInactive:  '#8899BB',

  navy:         '#0D1B4B',

  statusBar:    'dark-content',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const deviceScheme  = useColorScheme();
  const [mode, setMode] = useState('system');

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then(saved => { if (saved) setMode(saved); });
  }, []);

  const setThemeMode = async (m) => { setMode(m); await AsyncStorage.setItem('themeMode', m); };

  const isDark  = mode === 'system' ? deviceScheme === 'dark' : mode === 'dark';
  const colors  = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ colors, mode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() { return useContext(ThemeContext); }

// ── Formatage ─────────────────────────────────────────────────────────────────
export const CAD_USD_RATE = 0.74;
export const formatCAD = (v) => `CA$${Number(v || 0).toFixed(2)}`;
export const formatUSD = (v) => `US$${Number(v || 0).toFixed(2)}`;

// ── Shadows / Glow helpers ────────────────────────────────────────────────────
export const glowShadow = (color = '#1E90FF', radius = 12) => ({
  shadowColor:   color,
  shadowOffset:  { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius:  radius,
  elevation:     10,
});

export const cardShadow = {
  shadowColor:   '#000',
  shadowOffset:  { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius:  8,
  elevation:     4,
};
