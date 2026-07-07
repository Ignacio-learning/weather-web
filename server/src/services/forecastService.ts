import type { ForecastDay } from '../types/index.js';
import { requireApiKey } from '../utils/env.js';

const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const TIMEOUT_MS = 10_000;

function extractDate(dtTxt: string): string {
  return dtTxt.slice(0, 10);
}

function extractHour(dtTxt: string): string {
  return dtTxt.slice(11, 13);
}

function pickRepresentativeRecord(records: any[]): any {
  const priority = ['12', '15', '11', '13', '14'];
  for (const hour of priority) {
    const match = records.find((r) => extractHour(r.dt_txt) === hour);
    if (match) return match;
  }
  return records[0];
}

function groupByDay(list: any[]): ForecastDay[] {
  const map = new Map<string, any[]>();

  for (const item of list) {
    const date = extractDate(item.dt_txt);
    const group = map.get(date) ?? [];
    group.push(item);
    map.set(date, group);
  }

  return Array.from(map.entries()).map(([date, records]) => {
    const rep = pickRepresentativeRecord(records);
    const temps = records.map((r) => r.main.temp);
    const tempMin = Math.min(...temps);
    const tempMax = Math.max(...temps);
    const humidity =
      records.reduce((sum, r) => sum + r.main.humidity, 0) / records.length;

    return {
      date,
      tempC: rep.main.temp,
      feelsLikeC: rep.main.feels_like,
      tempMinC: tempMin,
      tempMaxC: tempMax,
      humidity: Math.round(humidity),
      description: rep.weather?.[0]?.description ?? null,
      icon: rep.weather?.[0]?.icon ?? null,
    };
  });
}

export async function getForecastByCity(city: string, country: string): Promise<ForecastDay[]> {
  const q = country ? `${city},${country}` : city;
  const url = new URL(FORECAST_URL);
  url.searchParams.set('q', q);
  url.searchParams.set('appid', requireApiKey());
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', 'es');
  url.searchParams.set('cnt', '40');

  const resp = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  if (!resp.ok) {
    const body = await resp.json().catch(() => null) as Record<string, unknown> | null;
    const error = new Error(
      resp.status === 404
        ? 'Ciudad no encontrada.'
        : (body?.message as string) ?? `Error en la API (status ${resp.status})`
    );
    (error as any).statusCode = resp.status === 404 ? 404 : 502;
    throw error;
  }

  const data = await resp.json() as any;
  return groupByDay(data.list);
}
