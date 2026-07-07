import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <Link to="/" className="brand">
        <div className="logo" aria-hidden="true">CD</div>
        <div>
          <h1>Chile Data Hub</h1>
          <p>Clima e indicadores económicos</p>
        </div>
      </Link>
      <nav className="nav" aria-label="Navegación principal">
        <Link to="/" className={`nav-link${pathname === '/' ? ' active' : ''}`}>Clima</Link>
        <Link to="/economia" className={`nav-link${pathname === '/economia' ? ' active' : ''}`}>Economía</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>Fuentes: OpenWeatherMap · boostr.cl · SBIF</span>
    </footer>
  );
}
