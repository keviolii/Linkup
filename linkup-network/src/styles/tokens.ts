// ═══════════════════════════════════════════════════════════
// Design Tokens — Single source of truth for all styling
// ═══════════════════════════════════════════════════════════

export const tokens = {
  colors: {
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
  },
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
