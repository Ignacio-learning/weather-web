export interface WeatherLocation {
  name: string;
  country: string | null;
  lat: number | null;
  lon: number | null;
}

export interface WeatherCondition {
  description: string | null;
  main: string | null;
  icon: string | null;
}

export interface WeatherMetrics {
  tempC: number | null;
  feelsLikeC: number | null;
  tempMinC: number | null;
  tempMaxC: number | null;
  humidity: number | null;
  pressure: number | null;
  windSpeed: number | null;
}

export interface WeatherMeta {
  provider: string;
  units: string;
  lang: string;
}

export interface WeatherResponse {
  location: WeatherLocation;
  weather: WeatherCondition;
  metrics: WeatherMetrics;
  meta: WeatherMeta;
}

export interface GeocodeResult {
  name: string;
  country: string | null;
  state: string | null;
  lat: number;
  lon: number;
  label: string;
}

export interface ForecastDay {
  date: string;
  tempC: number;
  feelsLikeC: number;
  tempMinC: number;
  tempMaxC: number;
  humidity: number;
  description: string | null;
  icon: string | null;
}
