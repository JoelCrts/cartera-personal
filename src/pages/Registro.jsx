import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function Registro() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) { setError('La contraseña debe tener mínimo 6 caracteres.'); return; }
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return; }

    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('cp_users') || '[]');
      if (users.find(u => u.email === form.email)) {
        setError('Este correo ya está registrado. Inicia sesión.');
        setLoading(false);
        return;
      }
      const newUser = { id: Date.now(), nombre: form.nombre, email: form.email, password: form.password };
      users.push(newUser);
      localStorage.setItem('cp_users', JSON.stringify(users));
      login({ nombre: newUser.nombre, email: newUser.email, id: newUser.id });
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src="/images/registro.webp" alt="Crea tu cuenta en Cartera Personal" />
        <div className="auth-visual-overlay">
          <h2>Tu futuro financiero<br />empieza aquí</h2>
          <p>Regístrate gratis y empieza a controlar tus finanzas en menos de 2 minutos.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <div className="auth-logo">₱</div>
          <h1>Crear cuenta</h1>
          <p className="auth-subtitle">Únete a Cartera Personal — es gratis</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-group">
              <label>Nombre completo</label>
              <input type="text" required placeholder="Ana García" value={form.nombre} onChange={set('nombre')} />
            </div>
            <div className="field-group">
              <label>Correo electrónico</label>
              <input type="email" required placeholder="tu@correo.com" value={form.email} onChange={set('email')} />
            </div>
            <div className="field-group">
              <label>Contraseña <span className="field-hint">(mínimo 6 caracteres)</span></label>
              <input type="password" required minLength={6} placeholder="••••••••" value={form.password} onChange={set('password')} />
            </div>
            <div className="field-group">
              <label>Confirmar contraseña</label>
              <input type="password" required placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Registrarme Gratis'}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
