import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulación de autenticación
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('cp_users') || '[]');
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        login({ nombre: found.nombre, email: found.email, id: found.id });
        navigate('/dashboard');
      } else {
        setError('Correo o contraseña incorrectos. ¿No tienes cuenta?');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src="/images/registro.webp" alt="Plataforma Cartera Personal" />
        <div className="auth-visual-overlay">
          <h2>Gestiona tu dinero<br />con inteligencia</h2>
          <p>Más de 10,000 usuarios ya confían en Cartera Personal para alcanzar sus metas financieras.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">₱</div>
          <h1>Bienvenido de nuevo</h1>
          <p className="auth-subtitle">Inicia sesión en tu cuenta</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label>Correo electrónico</label>
              <input
                type="email" required autoComplete="email"
                placeholder="tu@correo.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Contraseña</label>
              <input
                type="password" required autoComplete="current-password"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/registro">Crear cuenta gratis</Link>
          </p>
          <p className="auth-switch" style={{ marginTop: '.5rem' }}>
            <Link to="/">← Volver al inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
