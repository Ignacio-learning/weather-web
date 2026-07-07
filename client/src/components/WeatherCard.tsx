import type { WeatherResponse } from '../types';

function fmtC(n: number | null) {
  return typeof n === 'number' ? `${Math.round(n)}°C` : '—';
}

function fmtPct(n: number | null) {
  return typeof n === 'number' ? `${Math.round(n)}%` : '—';
}

function fmtWind(n: number | null) {
  return typeof n === 'number' ? `${n.toFixed(1)} m/s` : '—';
}

function fmtPress(n: number | null) {
  return typeof n === 'number' ? `${Math.round(n)} hPa` : '—';
}

function fmtCoords(lat: number | null, lon: number | null) {
  return typeof lat === 'number' && typeof lon === 'number'
    ? `${lat.toFixed(2)}, ${lon.toFixed(2)}`
    : '—';
}

function comfortBadge(tempC: number | null, humidity: number | null) {
  if (typeof tempC !== 'number') return { label: '—', className: '' };
  if (tempC <= 5) return { label: 'Frío', className: 'badge-cold' };
  if (tempC <= 18) return { label: 'Fresco', className: 'badge-cool' };
  if (tempC <= 27) return {
    label: humidity && humidity >= 70 ? 'Cálido y húmedo' : 'Agradable',
    className: 'badge-warm',
  };
  return {
    label: humidity && humidity >= 60 ? 'Caluroso y húmedo' : 'Caluroso',
    className: 'badge-hot',
  };
}

interface Props {
  data: WeatherResponse;
}

export function WeatherCard({ data }: Props) {
  const { location, weather, metrics } = data;
  const badge = comfortBadge(metrics.tempC, metrics.humidity);
  const place = location.country
    ? `${location.name}, ${location.country}`
    : location.name;

  return (
    <div className="result">
      <div className="resultHeader">
        <div className="result-main">
          {weather.icon && (
            <img
              className="weather-icon-lg"
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description ?? ''}
            />
          )}
          <div>
            <div className="place">{place}</div>
            <div className="desc">{weather.description ?? '—'}</div>
          </div>
        </div>
        <div className="tempWrap">
          <div className="temp">{fmtC(metrics.tempC)}</div>
          <div className={`badge ${badge.className}`}>{badge.label}</div>
        </div>
      </div>

      <div className="grid">
        <div className="metric">
          <div className="k">Sensación</div>
          <div className="v">{fmtC(metrics.feelsLikeC)}</div>
        </div>
        <div className="metric">
          <div className="k">Humedad</div>
          <div className="v">{fmtPct(metrics.humidity)}</div>
        </div>
        <div className="metric">
          <div className="k">Viento</div>
          <div className="v">{fmtWind(metrics.windSpeed)}</div>
        </div>
        <div className="metric">
          <div className="k">Presión</div>
          <div className="v">{fmtPress(metrics.pressure)}</div>
        </div>
        <div className="metric">
          <div className="k">Mín / Máx</div>
          <div className="v">{fmtC(metrics.tempMinC)} / {fmtC(metrics.tempMaxC)}</div>
        </div>
        <div className="metric">
          <div className="k">Coordenadas</div>
          <div className="v">{fmtCoords(location.lat, location.lon)}</div>
        </div>
      </div>
    </div>
  );
}
