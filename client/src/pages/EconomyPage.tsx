import { Layout, Header, Footer } from '../components/Layout';
import { EconomyCard } from '../components/EconomyCard';
import { useEconomyIndicators } from '../hooks/useEconomy';

export function EconomyPage() {
  const { indicatorList, loading, error, refetch } = useEconomyIndicators();

  return (
    <>
      <Layout />
      <main className="container">
        <Header />

        <section className="card">
          <div className="eco-header">
            <h2 className="eco-section-title">Indicadores Económicos Chile</h2>
            <button className="secondary eco-refresh" onClick={refetch} disabled={loading}>
              {loading ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>

          {loading && <div className="status">Cargando indicadores…</div>}
          {error && <div className="status error">{error}</div>}

          {indicatorList.length > 0 && (
            <div className="eco-grid">
              {indicatorList.map((ind) => (
                <EconomyCard key={ind.codigo} indicator={ind} />
              ))}
            </div>
          )}
        </section>

        <section className="card" style={{ marginTop: 16 }}>
          <h2 className="eco-section-title">Leyenda</h2>
          <div className="eco-legend">
            <div className="eco-legend-item"><span className="eco-legend-dot eco-dolar" /> Dólar observado (CLP/USD)</div>
            <div className="eco-legend-item"><span className="eco-legend-dot eco-euro" /> Euro (CLP/EUR)</div>
            <div className="eco-legend-item"><span className="eco-legend-dot eco-uf" /> UF — Unidad de Fomento</div>
            <div className="eco-legend-item"><span className="eco-legend-dot eco-utm" /> UTM — Unidad Tributaria Mensual</div>
            <div className="eco-legend-item"><span className="eco-legend-dot eco-ipc" /> IPC — Índice de Precios al Consumidor</div>
          </div>
          <p className="eco-source">Fuente: <a href="https://api.sbif.cl" target="_blank" rel="noopener noreferrer">SBIF</a> vía <a href="https://boostr.cl" target="_blank" rel="noopener noreferrer">boostr.cl</a></p>
        </section>

        <Footer />
      </main>
    </>
  );
}
