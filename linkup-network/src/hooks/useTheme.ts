import { useCallback, useEffect } from 'react';
import { useApp } from './useAppState';
import { applyThemeToDOM, getThemeColors } from '@/styles/tokens';
import { storage } from '@/utils/storage';

export function useTheme() {
  const { state, dispatch } = useApp();
  const theme = state.theme;

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyThemeToDOM(theme);
    storage.set('theme', theme);
  }, [theme]);

  // Detect system preference on first load if no stored preference
  useEffect(() => {
    const stored = storage.get<string | null>('theme', null);
    if (stored) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    if (mq.matches) {
      dispatch({ type: 'SET_THEME', theme: 'light' });
    }
  }, [dispatch]);

  const toggle = useCallback(() => {
    dispatch({ type: 'SET_THEME', theme: theme === 'dark' ? 'light' : 'dark' });
  }, [theme, dispatch]);

  const colors = getThemeColors(theme);

  return { theme, toggle, colors };
}
