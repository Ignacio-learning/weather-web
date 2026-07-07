import type { EconomyIndicator } from '../types';

function formatValue(valor: number, unidad: string): string {
  if (unidad === 'Porcentaje') return `${valor.toFixed(2)} %`;
  if (unidad === 'Pesos' || unidad === 'CLP') return `$${valor.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (unidad === 'UF' || unidad === 'USD') return valor.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${valor.toLocaleString('es-CL')} ${unidad}`;
}

function formatDate(fecha: string): string {
  try {
    const d = new Date(fecha + 'T12:00:00');
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return fecha;
  }
}

function indicatorClass(codigo: string): string {
  const map: Record<string, string> = {
    dolar: 'eco-dolar',
    euro: 'eco-euro',
    uf: 'eco-uf',
    utm: 'eco-utm',
    ipc: 'eco-ipc',
  };
  return map[codigo] ?? '';
}

interface Props {
  indicator: EconomyIndicator;
}

export function EconomyCard({ indicator }: Props) {
  return (
    <div className={`eco-card ${indicatorClass(indicator.codigo)}`}>
      <div className="eco-card-header">
        <div className="eco-card-title">{indicator.nombre}</div>
        {indicator.codigo && <div className="eco-card-code">{indicator.codigo.toUpperCase()}</div>}
      </div>
      <div className="eco-card-value">{formatValue(indicator.valor, indicator.unidad)}</div>
      <div className="eco-card-footer">
        <span className="eco-card-date">{formatDate(indicator.fecha)}</span>
        <span className="eco-card-unit">{indicator.unidad}</span>
      </div>
    </div>
  );
}
