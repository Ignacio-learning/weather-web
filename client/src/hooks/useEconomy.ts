import { useState, useEffect } from 'react';
import type { BoostrEconomyResponse, EconomyIndicator } from '../types';
import { fetchEconomyIndicators } from '../services/api';

const STORAGE_KEY = 'chilehub_economy';

const indicatorNames: Record<string, string> = {
  dolar: 'Dólar',
  uf: 'UF',
  euro: 'Euro',
  utm: 'UTM',
  ipc: 'IPC',
};

const indicatorUnits: Record<string, string> = {
  dolar: 'Pesos',
  uf: 'UF',
  euro: 'Pesos',
  utm: 'Pesos',
  ipc: 'Porcentaje',
};

function transformResponse(raw: BoostrEconomyResponse): EconomyIndicator[] {
  return Object.entries(raw.data).map(([codigo, { date, value }]) => ({
    codigo,
    nombre: indicatorNames[codigo] ?? codigo.toUpperCase(),
    unidad: indicatorUnits[codigo] ?? '',
    fecha: date,
    valor: value,
  }));
}

function loadCached(): EconomyIndicator[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw);
    if (Date.now() - cached.ts > 5 * 60 * 1000) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return cached.data as EconomyIndicator[];
  } catch {
    return null;
  }
}

function saveCache(data: EconomyIndicator[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function useEconomyIndicators() {
  const [indicators, setIndicators] = useState<EconomyIndicator[]>(() => loadCached() ?? []);
  const [loading, setLoading] = useState(() => !loadCached());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchEconomyIndicators();
        if (!cancelled) {
          const transformed = transformResponse(result);
          setIndicators(transformed);
          saveCache(transformed);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (indicators.length === 0) load();
    else setLoading(false);

    return () => { cancelled = true; };
  }, [indicators.length]);

  const indicatorList = [...indicators].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  return { indicatorList, loading, error, refetch: () => { setIndicators([]); } };
}
