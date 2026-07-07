import type { ForecastDay } from '../types';

function formatDay(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('es-ES', { weekday: 'short', timeZone: 'UTC' });
}

interface Props {
  days: ForecastDay[];
}

export function ForecastSection({ days }: Props) {
  const valid = days.filter((d) => d.tempMinC !== d.tempMaxC).slice(0, 5);

  if (!valid.length) return null;

  return (
    <div className="forecast-wrap">
      <div className="forecast-title">Próximos días</div>
      <div className="forecast-grid">
        {valid.map((day) => (
          <div key={day.date} className="forecast-card">
            <div className="forecast-day">{formatDay(day.date)}</div>
            {day.icon && (
              <img
                className="forecast-icon"
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description ?? ''}
                loading="lazy"
              />
            )}
            <div className="forecast-temp">{Math.round(day.tempC)}°C</div>
            <div className="forecast-desc">{day.description}</div>
            <div className="forecast-minmax">
              {Math.round(day.tempMinC)}° / {Math.round(day.tempMaxC)}°
            </div>
            <div className="forecast-meta">
              <div className="forecast-meta-item">
                <span className="fk">Sensación</span>
                <span className="fv">{Math.round(day.feelsLikeC)}°C</span>
              </div>
              <div className="forecast-meta-item">
                <span className="fk">Humedad</span>
                <span className="fv">{day.humidity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
