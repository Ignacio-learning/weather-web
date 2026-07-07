import { useState, useCallback } from 'react';
import type { GeocodeResult } from '../types';
import { useWeather } from '../hooks/useWeather';
import { useForecast } from '../hooks/useForecast';
import { Autocomplete } from '../components/Autocomplete';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastSection } from '../components/ForecastSection';
import { Layout, Header, Footer } from '../components/Layout';

export function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState<GeocodeResult | null>(null);
  const weather = useWeather();
  const forecast = useForecast();
  const [status, setStatus] = useState('');

  const handleSelect = useCallback((city: GeocodeResult) => {
    setSelectedCity(city);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCity) {
      setStatus('Selecciona una ciudad del autocompletado.');
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
    weather.reset();
    forecast.reset();
    setStatus('');
  }

  return (
    <>
      <Layout />
      <main className="container">
      <Header />

      <section className="card">
        <form className="form" onSubmit={handleSubmit} autoComplete="off">
          <Autocomplete onSelect={handleSelect} />
          <div className="actions">
            <button id="submitBtn" type="submit" disabled={weather.loading}>
              {weather.loading ? 'Consultando…' : 'Consultar'}
            </button>
            <button type="button" className="secondary" onClick={handleClear}>
              Limpiar
            </button>
          </div>
        </form>

        {status && <div className="status">{status}</div>}
        {weather.error && <div className="status error">{weather.error}</div>}
        {forecast.error && <div className="status error">{forecast.error}</div>}

        {weather.data && <WeatherCard data={weather.data} />}
        {forecast.data && <ForecastSection days={forecast.data} />}
      </section>

      <Footer />
    </main>
    </>
  );
}
