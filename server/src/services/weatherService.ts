import type { WeatherResponse } from '../types/index.js';
import { requireApiKey } from '../utils/env.js';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const TIMEOUT_MS = 10_000;

function buildWeatherUrl(city: string, country: string): URL {
  const q = country ? `${city},${country}` : city;
  const url = new URL(BASE_URL);
  url.searchParams.set('q', q);
  url.searchParams.set('appid', requireApiKey());
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', 'es');
  return url;
}

function mapWeatherResponse(data: any): WeatherResponse {
  return {
    location: {
      name: data.name,
      country: data.sys?.country ?? null,
      lat: data.coord?.lat ?? null,
      lon: data.coord?.lon ?? null,
    },
    weather: {
      description: data.weather?.[0]?.description ?? null,
      main: data.weather?.[0]?.main ?? null,
      icon: data.weather?.[0]?.icon ?? null,
    },
    metrics: {
      tempC: data.main?.temp ?? null,
      feelsLikeC: data.main?.feels_like ?? null,
      tempMinC: data.main?.temp_min ?? null,
      tempMaxC: data.main?.temp_max ?? null,
      humidity: data.main?.humidity ?? null,
      pressure: data.main?.pressure ?? null,
      windSpeed: data.wind?.speed ?? null,
    },
    meta: {
      provider: 'openweathermap',
      units: 'metric',
      lang: 'es',
    },
  };
}

export async function getWeatherByCity(city: string, country: string): Promise<WeatherResponse> {
  const url = buildWeatherUrl(city, country);
  const resp = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  if (!resp.ok) {
    const body = await resp.json().catch(() => null) as Record<string, unknown> | null;
    const error = new Error(
      resp.status === 404
        ? 'Ciudad no encontrada. Revisa el nombre y/o el país.'
        : (body?.message as string) ?? `Error en la API externa (status ${resp.status})`
    );
    (error as any).statusCode = resp.status === 404 ? 404 : 502;
    throw error;
  }

  const data = await resp.json();
  return mapWeatherResponse(data);
}
