import { Header, Footer } from '../components/Layout';
import { EconomyCard } from '../components/EconomyCard';
import { useEconomyIndicators } from '../hooks/useEconomy';

export function EconomyPage() {
  const { indicatorList, loading, error, refetch } = useEconomyIndicators();

  return (
    <main className="container">
      <Header />

      <h2 className="page-title">Indicadores económicos</h2>
      <p className="page-desc">Valores oficiales del dólar, euro, UF, UTM e IPC en Chile.</p>

      <section className="card">
        <div className="eco-header">
          <h3 className="eco-section-title">Últimos valores</h3>
          <button className="secondary eco-refresh" onClick={refetch} disabled={loading}>
            {loading ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>

        {loading && indicatorList.length === 0 && (
          <div className="status">Cargando indicadores…</div>
        )}
        {error && <div className="status error" role="alert">{error}</div>}

        {indicatorList.length > 0 && (
          <div className="eco-grid">
            {indicatorList.map((ind) => (
              <EconomyCard key={ind.codigo} indicator={ind} />
            ))}
          </div>
        )}

        <p className="eco-source">
          Fuente: <a href="https://api.sbif.cl" target="_blank" rel="noopener noreferrer">SBIF</a>
          {' '}vía <a href="https://boostr.cl" target="_blank" rel="noopener noreferrer">boostr.cl</a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
