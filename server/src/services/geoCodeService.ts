import type { GeocodeResult } from '../types/index.js';
import { requireApiKey } from '../utils/env.js';

const GEOCODE_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const TIMEOUT_MS = 10_000;

function sanitizeQuery(query: string): string {
  return query
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[,;|]/g, '')
    .slice(0, 100);
}

function mapGeocodeResults(results: any[]): GeocodeResult[] {
  return results.map((item) => ({
    name: item.name,
    country: item.country ?? null,
    state: item.state ?? null,
    lat: item.lat,
    lon: item.lon,
    label: item.state
      ? `${item.name}, ${item.state}, ${item.country}`
      : `${item.name}, ${item.country}`,
  }));
}

export async function searchCities(query: string, limit = 5): Promise<GeocodeResult[]> {
  const cleanQuery = sanitizeQuery(query);
  const url = new URL(GEOCODE_URL);
  url.searchParams.set('q', cleanQuery);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('appid', requireApiKey());

  const resp = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  if (!resp.ok) {
    const body = await resp.json().catch(() => null) as Record<string, unknown> | null;
    const error = new Error(
      (body?.message as string) ?? `Error en Geocoding API (status ${resp.status})`
    );
    (error as any).statusCode = 502;
    throw error;
  }

  const data = await resp.json() as any[];
  return mapGeocodeResults(data);
}
