import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
        <span className="brand-icon">₱</span>
        <span className="brand-name">Cartera <strong>Personal</strong></span>
      </Link>

      {isAuthenticated ? (
        <div className="navbar-links">
          <Link to="/dashboard"    className={isActive('/dashboard')}>Dashboard</Link>
          <Link to="/movimientos"  className={isActive('/movimientos')}>Movimientos</Link>
          <Link to="/historial"    className={isActive('/historial')}>Historial</Link>
          <Link to="/metas"        className={isActive('/metas')}>Metas</Link>
          <Link to="/reportes"     className={isActive('/reportes')}>Reportes</Link>
          <div className="navbar-user">
            <span className="user-avatar">{user?.nombre?.[0]?.toUpperCase() || 'U'}</span>
            <span className="user-name">{user?.nombre?.split(' ')[0] || 'Usuario'}</span>
            <button className="btn-logout" onClick={handleLogout}>Salir</button>
          </div>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/"         className={isActive('/')}>Inicio</Link>
          <Link to="/nosotros" className={isActive('/nosotros')}>Nosotros</Link>
          <Link to="/login"    className="btn-nav-primary">Ingresar</Link>
        </div>
      )}
    </nav>
  );
}
