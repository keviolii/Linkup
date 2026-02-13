// ═══════════════════════════════════════════════════════════
// Design Tokens — Single source of truth for all styling
// ═══════════════════════════════════════════════════════════

export const darkColors = {
  bg: '#0a0a0f',
  bgCard: '#12121a',
  bgCardHover: '#1a1a25',
  bgElevated: '#1e1e2a',
  bgInput: '#16161f',
  border: '#2a2a3a',
  borderFocus: '#6366f1',
  textPrimary: '#f0f0f5',
  textSecondary: '#9a9ab0',
  textTertiary: '#6a6a80',
  accent: '#6366f1',
  accentHover: '#818cf8',
  accentSoft: 'rgba(99,102,241,0.12)',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  like: '#ef4444',
  celebrate: '#fbbf24',
  support: '#a78bfa',
  insightful: '#38bdf8',
} as const;

export const lightColors = {
  bg: '#f5f5f7',
  bgCard: '#ffffff',
  bgCardHover: '#f0f0f5',
  bgElevated: '#ffffff',
  bgInput: '#f0f0f5',
  border: '#e0e0e8',
  borderFocus: '#6366f1',
  textPrimary: '#1a1a2e',
  textSecondary: '#5a5a7a',
  textTertiary: '#8a8aa0',
  accent: '#6366f1',
  accentHover: '#4f46e5',
  accentSoft: 'rgba(99,102,241,0.1)',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  like: '#ef4444',
  celebrate: '#d97706',
  support: '#7c3aed',
  insightful: '#0284c7',
} as const;

export const tokens = {
  colors: darkColors,
  fonts: {
    display: "'DM Sans', 'Satoshi', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.3)',
    md: '0 4px 16px rgba(0,0,0,0.4)',
    lg: '0 8px 32px rgba(0,0,0,0.5)',
    glow: '0 0 20px rgba(99,102,241,0.15)',
  },
} as const;

export type Tokens = typeof tokens;

export function getThemeColors(theme: 'dark' | 'light') {
  return theme === 'dark' ? darkColors : lightColors;
}

export function applyThemeToDOM(theme: 'dark' | 'light') {
  const colors = getThemeColors(theme);
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  // Update shadows for light theme
  if (theme === 'light') {
    root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.1)');
    root.style.setProperty('--shadow-md', '0 4px 16px rgba(0,0,0,0.1)');
    root.style.setProperty('--shadow-lg', '0 8px 32px rgba(0,0,0,0.12)');
  } else {
    root.style.setProperty('--shadow-sm', '0 1px 3px rgba(0,0,0,0.3)');
    root.style.setProperty('--shadow-md', '0 4px 16px rgba(0,0,0,0.4)');
    root.style.setProperty('--shadow-lg', '0 8px 32px rgba(0,0,0,0.5)');
  }
}
