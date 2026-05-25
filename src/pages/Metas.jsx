import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import './Metas.css';

function getMetas() { return JSON.parse(localStorage.getItem('cp_metas') || '[]'); }
function saveMetas(m) { localStorage.setItem('cp_metas', JSON.stringify(m)); }

export default function Metas() {
  const { user } = useAuth();
  const [metas,     setMetas]     = useState(getMetas);
  const [showForm,  setShowForm]  = useState(false);
  const [aportando, setAportando] = useState(null); // meta id
  const [aporte,    setAporte]    = useState('');
  const [form, setForm] = useState({ nombre: '', objetivo: '', descripcion: '', tipo: 'individual' });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const misMetas = useMemo(() => metas.filter(m =>
    m.adminId === user?.id || m.tipo === 'compartida'
  ), [metas, user]);

  const crearMeta = (e) => {
    e.preventDefault(); setError('');
    const obj = parseFloat(form.objetivo);
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!obj || obj <= 0)    { setError('El objetivo debe ser mayor a cero.'); return; }
    const nueva = {
      id: Date.now(), adminId: user?.id,
      nombre: form.nombre, descripcion: form.descripcion,
      objetivo: obj, acumulado: 0,
      tipo: form.tipo, aportaciones: [],
      creadaEn: new Date().toISOString(),
    };
    const actualizadas = [...metas, nueva];
    saveMetas(actualizadas); setMetas(actualizadas);
    setForm({ nombre: '', objetivo: '', descripcion: '', tipo: 'individual' });
    setShowForm(false);
  };

  const aportar = (metaId) => {
    const monto = parseFloat(aporte);
    if (!monto || monto <= 0) return;
    const actualizadas = metas.map(m => {
      if (m.id !== metaId) return m;
      const nuevaAcum = Math.min(m.acumulado + monto, m.objetivo);
      return {
        ...m,
        acumulado: nuevaAcum,
        aportaciones: [...m.aportaciones, { monto, usuarioId: user?.id, fecha: new Date().toISOString() }],
      };
    });
    saveMetas(actualizadas); setMetas(actualizadas);
    setAportando(null); setAporte('');
  };

  const eliminar = (id) => {
    const actualizadas = metas.filter(m => m.id !== id);
    saveMetas(actualizadas); setMetas(actualizadas);
  };

  const pct = (m) => Math.min(100, Math.round((m.acumulado / m.objetivo) * 100));
  const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  return (
    <div className="metas-page">
      <div className="page-header">
        <div>
          <h1>Metas de Ahorro</h1>
          <p>Crea objetivos financieros individuales o compartidos y monitorea tu progreso.</p>
        </div>
        <button className="btn-nueva-meta" onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕ Cancelar' : '+ Nueva Meta'}
        </button>
      </div>

      {/* Formulario nueva meta (HU-05) */}
      {showForm && (
        <div className="meta-form-card">
          <h2>Nueva Meta de Ahorro</h2>
          {error && <div className="msg-error">{error}</div>}
          <form onSubmit={crearMeta} className="meta-form">
            <div className="mf-grid">
              <div className="field-group">
                <label>Nombre de la meta</label>
                <input type="text" placeholder="Ej. Fondo de emergencia" value={form.nombre} onChange={set('nombre')} required />
              </div>
              <div className="field-group">
                <label>Monto objetivo ($)</label>
                <input type="number" min="1" step="0.01" placeholder="10000.00" value={form.objetivo} onChange={set('objetivo')} required />
              </div>
              <div className="field-group">
                <label>Tipo</label>
                <select value={form.tipo} onChange={set('tipo')}>
                  <option value="individual">Individual</option>
                  <option value="compartida">Compartida (grupal)</option>
                </select>
              </div>
              <div className="field-group full">
                <label>Descripción <span className="opt">(opcional)</span></label>
                <input type="text" placeholder="¿Para qué es esta meta?" value={form.descripcion} onChange={set('descripcion')} />
              </div>
            </div>
            <button type="submit" className="btn-crear-meta">Crear Meta</button>
          </form>
        </div>
      )}

      {/* Imagen decorativa + info */}
      <div className="metas-banner">
        <img src="/images/ahorro.webp" alt="Ahorro y crecimiento" />
        <div className="metas-banner-text">
          <h3>El ahorro constante genera grandes resultados</h3>
          <p>Cada aportación, por pequeña que sea, te acerca más a tu objetivo. ¡Comienza hoy!</p>
        </div>
      </div>

      {/* Lista de metas */}
      {misMetas.length === 0 ? (
        <div className="historial-empty">
          <span>🎯</span>
          <p>Aún no tienes metas de ahorro.</p>
          <small>Crea tu primera meta usando el botón "Nueva Meta".</small>
        </div>
      ) : (
        <div className="metas-grid">
          {misMetas.map(m => (
            <div key={m.id} className="meta-card">
              <div className="meta-card-header">
                <div>
                  <span className={`meta-badge ${m.tipo}`}>{m.tipo}</span>
                  <h3>{m.nombre}</h3>
                  {m.descripcion && <p className="meta-desc">{m.descripcion}</p>}
                </div>
                {m.adminId === user?.id && (
                  <button className="btn-eliminar" onClick={() => eliminar(m.id)} title="Eliminar meta">✕</button>
                )}
              </div>

              <div className="meta-montos">
                <span className="acumulado">{fmt(m.acumulado)}</span>
                <span className="separador">de</span>
                <span className="objetivo">{fmt(m.objetivo)}</span>
              </div>

              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: `${pct(m)}%` }} />
              </div>
              <div className="meta-pct">{pct(m)}% completado · {m.aportaciones.length} aportaciones</div>

              {/* Aportación (HU-06) */}
              {aportando === m.id ? (
                <div className="aportar-form">
                  <input type="number" min="0.01" step="0.01" placeholder="Monto a aportar"
                    value={aporte} onChange={e => setAporte(e.target.value)} autoFocus />
                  <button onClick={() => aportar(m.id)} className="btn-confirmar-aporte">Aportar</button>
                  <button onClick={() => setAportando(null)} className="btn-cancelar-aporte">Cancelar</button>
                </div>
              ) : (
                pct(m) < 100
                  ? <button className="btn-aportar" onClick={() => { setAportando(m.id); setAporte(''); }}>💰 Hacer aportación</button>
                  : <div className="meta-completada">🎉 ¡Meta completada!</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
