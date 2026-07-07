import { useState, useRef, useCallback } from 'react';
import type { GeocodeResult } from '../types';
import { fetchGeocode } from '../services/api';

export function useGeocode() {
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      try {
        const cities = await fetchGeocode(query, controller.signal);
        setResults(cities);
        setOpen(cities.length > 0);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setResults([]);
          setOpen(false);
        }
      }
    }, 300);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const select = useCallback((city: GeocodeResult) => {
    setOpen(false);
    return city;
  }, []);

  return { results, open, search, close, select };
}
