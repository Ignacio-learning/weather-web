export type {
  WeatherLocation,
  WeatherCondition,
  WeatherMetrics,
  WeatherMeta,
  WeatherResponse,
  GeocodeResult,
  ForecastDay,
} from '@chile-data-hub/shared';

// ─── ECONOMÍA ──────────────────────────────────────────

export interface BoostrEconomyResponse {
  status: string;
  data: Record<string, { date: string; value: number }>;
}

export interface EconomyIndicator {
  codigo: string;
  nombre: string;
  unidad: string;
  fecha: string;
  valor: number;
}

export interface IndicatorSerie {
  fecha: string;
  valor: number;
}

export interface IndicatorDetailResponse {
  version: string;
  autor: string;
  codigo: string;
  nombre: string;
  unidad: string;
  serie: IndicatorSerie[];
}
