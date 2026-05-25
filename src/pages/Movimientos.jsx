import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Movimientos.css';

const CATEGORIAS_GASTO   = ['Alimentación','Transporte','Vivienda','Salud','Entretenimiento','Ropa','Educación','Servicios','Otros'];
const CATEGORIAS_INGRESO = ['Salario','Freelance','Negocio','Inversión','Regalo','Otros'];

export default function Movimientos() {
  const { user } = useAuth();
  const [tipo,       setTipo]       = useState('gasto');
  const [monto,      setMonto]      = useState('');
  const [categoria,  setCategoria]  = useState('');
  const [descripcion,setDescripcion]= useState('');
  const [fecha,      setFecha]      = useState(new Date().toISOString().split('T')[0]);
  const [error,      setError]      = useState('');
  const [exito,      setExito]      = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); setExito('');

    const montoNum = parseFloat(monto);
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError('El monto debe ser un número mayor a cero.');
      return;
    }
    if (!categoria) { setError('Selecciona una categoría.'); return; }
    if (!fecha)     { setError('La fecha es obligatoria.'); return; }

    const movimiento = {
      id: Date.now(),
      usuarioId: user?.id || 'anonimo',
      tipo, monto: montoNum, categoria, descripcion, fecha,
      creadoEn: new Date().toISOString(),
    };

    try {
      const prev = JSON.parse(localStorage.getItem('cp_movimientos') || '[]');
      prev.push(movimiento);
      localStorage.setItem('cp_movimientos', JSON.stringify(prev));
      setExito(`✅ ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} de $${montoNum.toFixed(2)} registrado correctamente.`);
      setMonto(''); setCategoria(''); setDescripcion('');
    } catch {
      setError('Error al guardar. Inténtalo de nuevo.');
    }
  };

  const categorias = tipo === 'gasto' ? CATEGORIAS_GASTO : CATEGORIAS_INGRESO;

  return (
    <div className="movimientos-page">
      <div className="movimientos-visual">
        <img src="/images/registro.webp" alt="" aria-hidden="true" />
        <div className="mv-overlay">
          <div className="mv-tips">
            <h3>💡 Consejos rápidos</h3>
            <ul>
              <li>Registra cada movimiento el mismo día para mayor precisión.</li>
              <li>Categorizar bien tus gastos te ayuda a detectar áreas de mejora.</li>
              <li>Un ingreso extra, por pequeño que sea, ¡cuenta!</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="movimientos-form-side">
        <div className="mv-header">
          <h1>Registrar Movimiento</h1>
          <p>Agrega un ingreso o gasto a tu cartera personal.</p>
        </div>

        {error && <div className="msg-error">{error}</div>}
        {exito && <div className="msg-exito">{exito}</div>}

        <form onSubmit={handleSubmit} className="mv-form" noValidate>

          {/* Tipo toggle */}
          <div className="tipo-toggle">
            <button type="button"
              className={`toggle-btn ${tipo === 'gasto' ? 'active-gasto' : ''}`}
              onClick={() => { setTipo('gasto'); setCategoria(''); }}>
              📤 Gasto
            </button>
            <button type="button"
              className={`toggle-btn ${tipo === 'ingreso' ? 'active-ingreso' : ''}`}
              onClick={() => { setTipo('ingreso'); setCategoria(''); }}>
              📥 Ingreso
            </button>
          </div>

          <div className="mv-fields">
            <div className="field-group">
              <label>Monto ($)</label>
              <input type="number" min="0.01" step="0.01"
                placeholder="0.00" value={monto}
                onChange={e => setMonto(e.target.value)} required />
            </div>

            <div className="field-group">
              <label>Categoría</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)} required>
                <option value="">— Selecciona —</option>
                {categorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="field-group">
              <label>Fecha</label>
              <input type="date" value={fecha}
                onChange={e => setFecha(e.target.value)} required />
            </div>

            <div className="field-group full">
              <label>Descripción <span className="opt">(opcional)</span></label>
              <input type="text" maxLength={80}
                placeholder="Ej. Supermercado Walmart, pago de renta…"
                value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            </div>
          </div>

          <button type="submit" className={`btn-mv ${tipo}`}>
            Guardar {tipo}
          </button>
        </form>
      </div>
    </div>
  );
}
