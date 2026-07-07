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

export interface EconomyIndicator {
  codigo: string;
  nombre: string;
  unidad: string;
  fecha: string;
  valor: number;
}

export interface EconomyIndicatorsResponse {
  version: string;
  autor: string;
  fecha: string;
  indicadores: Record<string, EconomyIndicator>;
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
