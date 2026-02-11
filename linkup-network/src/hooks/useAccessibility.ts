import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from './useAppState';

// ═══════════════════════════════════════════════════════════
// useAnnounce — Push messages to the ARIA live region
// ═══════════════════════════════════════════════════════════

export function useAnnounce() {
  const { dispatch } = useApp();
  return useCallback(
    (message: string) => {
      dispatch({ type: 'ANNOUNCE', message });
    },
    [dispatch],
  );
}

// ═══════════════════════════════════════════════════════════
// useFocusTrap — Trap tab focus inside a container
// ═══════════════════════════════════════════════════════════

export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const el = ref.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    el.addEventListener('keydown', handleTab);
    first?.focus();

    return () => el.removeEventListener('keydown', handleTab);
  }, [active, ref]);
}

// ═══════════════════════════════════════════════════════════
// useReducedMotion — Respect prefers-reduced-motion
// ═══════════════════════════════════════════════════════════

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// ═══════════════════════════════════════════════════════════
// useInfiniteScroll — IntersectionObserver-based pagination
// ═══════════════════════════════════════════════════════════

export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  loading: boolean,
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callback();
      },
      { rootMargin: '200px' },
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [callback, hasMore, loading]);

  return sentinelRef;
}

// ═══════════════════════════════════════════════════════════
// useThrottle — Throttle a callback
// ═══════════════════════════════════════════════════════════

export function useThrottle<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
): T {
  const lastRun = useRef(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= ms) {
        lastRun.current = now;
        fn(...args);
      }
    }) as T,
    [fn, ms],
  );
}
