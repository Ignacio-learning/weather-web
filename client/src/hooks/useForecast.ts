import { useState, useRef, useCallback } from 'react';
import type { ForecastDay } from '../types';
import { fetchForecast } from '../services/api';

export function useForecast() {
  const [data, setData] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const query = useCallback(async (city: string, country: string) => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchForecast(city, country, controller.signal);
      setData(result);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setData(null);
        setError(err.message);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, query, reset };
}
