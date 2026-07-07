import { useState, useEffect } from 'react';
import type { EconomyIndicatorsResponse } from '../types';
import { fetchEconomyIndicators } from '../services/api';

const STORAGE_KEY = 'chilehub_economy';

function loadCached(): EconomyIndicatorsResponse | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.ts > 5 * 60 * 1000) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return cached.data as EconomyIndicatorsResponse;
  } catch {
    return null;
  }
}

function saveCache(data: EconomyIndicatorsResponse) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function useEconomyIndicators() {
  const [data, setData] = useState<EconomyIndicatorsResponse | null>(loadCached);
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchEconomyIndicators();
        if (!cancelled) {
          setData(result);
          saveCache(result);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!data) load();
    else setLoading(false);

    return () => { cancelled = true; };
  }, [data]);

  const indicators = data?.indicadores;
  const indicatorList = indicators
    ? Object.values(indicators).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    : [];

  return { indicators, indicatorList, loading, error, refetch: () => { setData(null); } };
}
