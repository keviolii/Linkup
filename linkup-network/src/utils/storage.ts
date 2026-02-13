const PREFIX = 'linkup_';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // quota exceeded or private browsing — silently ignore
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },
};

let writeTimer: ReturnType<typeof setTimeout> | null = null;

export function debouncedWrite<T>(key: string, value: T, ms = 500): void {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(() => storage.set(key, value), ms);
}
