import { useState, useCallback } from 'react';
import type { GeocodeResult } from '../types';
import { useWeather } from '../hooks/useWeather';
import { useForecast } from '../hooks/useForecast';
import { Autocomplete } from '../components/Autocomplete';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastSection } from '../components/ForecastSection';
import { Header, Footer } from '../components/Layout';

export function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<GeocodeResult | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const weather = useWeather();
  const forecast = useForecast();
  const [status, setStatus] = useState('');

  const handleSelect = useCallback((city: GeocodeResult) => {
    setSelectedCity(city);
    setStatus('');
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCity) {
      setStatus('Selecciona una ciudad de la lista de sugerencias.');
      return;
    }
    const country = selectedCity.country ?? '';
    setStatus('Consultando…');
    weather.reset();
    forecast.reset();
    await Promise.all([
      weather.query(selectedCity.name, country),
      forecast.query(selectedCity.name, country),
    ]);
    setStatus('');
  }

  function handleClear() {
    setSelectedCity(null);
    setResetKey((k) => k + 1);
    weather.reset();
    forecast.reset();
    setStatus('');
  }

  const hasResults = weather.data || forecast.data;

  return (
    <main className="container">
      <Header />

      <h2 className="page-title">Clima</h2>
      <p className="page-desc">Consulta el tiempo actual y el pronóstico para cualquier ciudad.</p>

      <section className="card">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="search-bar">
            <Autocomplete onSelect={handleSelect} resetKey={resetKey} />
            <div className="search-actions">
              <button type="submit" disabled={weather.loading}>
                {weather.loading ? 'Consultando…' : 'Consultar'}
              </button>
              <button type="button" className="secondary" onClick={handleClear}>
                Limpiar
              </button>
            </div>
          </div>
        </form>

        {status && <div className="status" role="status">{status}</div>}
        {weather.error && <div className="status error" role="alert">{weather.error}</div>}
        {forecast.error && <div className="status error" role="alert">{forecast.error}</div>}

        {weather.data && <WeatherCard data={weather.data} />}
        {forecast.data && <ForecastSection days={forecast.data} />}

        {!hasResults && !weather.loading && !status && !weather.error && (
          <div className="empty-state">
            Busca una ciudad y presiona Consultar para ver el clima.
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
