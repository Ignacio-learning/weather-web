import type {
  WeatherResponse,
  GeocodeResult,
  ForecastDay,
  EconomyIndicatorsResponse,
  IndicatorDetailResponse,
} from '../types';

const BASE = '/api';

const TIMEOUT_MS = 15_000;

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });

  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    const body = await resp.json().catch(() => null);
    if (!resp.ok) {
      throw new Error(body?.error ?? `Error (${resp.status})`);
    }
    return body as T;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onAbort);
  }
}

export function fetchWeather(city: string, country: string, signal?: AbortSignal) {
  const url = new URL(`${BASE}/weather`, window.location.origin);
  url.searchParams.set('city', city);
  if (country) url.searchParams.set('country', country);
  return fetchJson<WeatherResponse>(url.toString(), signal);
}

export function fetchForecast(city: string, country: string, signal?: AbortSignal) {
  const url = new URL(`${BASE}/forecast`, window.location.origin);
  url.searchParams.set('city', city);
  if (country) url.searchParams.set('country', country);
  return fetchJson<ForecastDay[]>(url.toString(), signal);
}

export function fetchGeocode(query: string, signal?: AbortSignal) {
  const url = new URL(`${BASE}/geocode`, window.location.origin);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '5');
  return fetchJson<GeocodeResult[]>(url.toString(), signal);
}

export function fetchBoostr<T>(path: string, signal?: AbortSignal) {
  return fetchJson<T>(`${BASE}/boostr${path}`, signal);
}

// ─── ECONOMÍA ──────────────────────────────────────────

export function fetchEconomyIndicators(signal?: AbortSignal) {
  return fetchBoostr<EconomyIndicatorsResponse>('/economy/indicators', signal);
}

export function fetchEconomyIndicator(name: string, signal?: AbortSignal) {
  return fetchBoostr<IndicatorDetailResponse>(`/economy/${name}`, signal);
}

export function fetchEconomyIndicatorYear(name: string, year: number, signal?: AbortSignal) {
  return fetchBoostr<IndicatorDetailResponse>(`/economy/${name}/${year}`, signal);
}

export function fetchPrevired(signal?: AbortSignal) {
  return fetchBoostr<any>('/economy/previred', signal);
}

export function fetchCryptos(signal?: AbortSignal) {
  return fetchBoostr<any>('/economy/cryptos', signal);
}
