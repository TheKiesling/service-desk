import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, List, BarChart3 } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <LayoutDashboard size={24} />
            <span>Service Desk - Gestión de Uniformes</span>
          </Link>
          <div className="navbar-links">
            <Link to="/" className={`navbar-link ${isActive('/')}`}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link to="/crear-ticket" className={`navbar-link ${isActive('/crear-ticket')}`}>
              <Plus size={18} />
              Crear Ticket
            </Link>
            <Link to="/tablero" className={`navbar-link ${isActive('/tablero')}`}>
              <List size={18} />
              Tablero
            </Link>
            <Link to="/estadisticas" className={`navbar-link ${isActive('/estadisticas')}`}>
              <BarChart3 size={18} />
              Estadísticas
            </Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

