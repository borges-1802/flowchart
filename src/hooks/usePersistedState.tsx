import { useEffect, useState } from 'react';

export function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // localStorage indisponível (modo privado, quota cheia, etc.) - segue sem salvar
    }
  }, [key, state]);

  return [state, setState] as const;
}