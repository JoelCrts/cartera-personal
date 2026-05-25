import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import './Historial.css';

const TIPOS = ['todos', 'ingreso', 'gasto'];

export default function Historial() {
  const { user } = useAuth();
  const [filtroTipo,  setFiltroTipo]  = useState('todos');
  const [filtroCat,   setFiltroCat]   = useState('');
  const [busqueda,    setBusqueda]    = useState('');
  const [orden,       setOrden]       = useState('desc');

  const todos = useMemo(() => {
    const raw = JSON.parse(localStorage.getItem('cp_movimientos') || '[]');
    return raw.filter(m => m.usuarioId === (user?.id || 'anonimo'));
  }, [user]);

  const categorias = useMemo(() => [...new Set(todos.map(m => m.categoria))], [todos]);

  const filtrados = useMemo(() => {
    return todos
      .filter(m => filtroTipo === 'todos' || m.tipo === filtroTipo)
      .filter(m => !filtroCat || m.categoria === filtroCat)
      .filter(m => !busqueda || m.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) || m.categoria.toLowerCase().includes(busqueda.toLowerCase()))
      .sort((a, b) => orden === 'desc' ? new Date(b.fecha) - new Date(a.fecha) : new Date(a.fecha) - new Date(b.fecha));
  }, [todos, filtroTipo, filtroCat, busqueda, orden]);

  const totalIngresos = filtrados.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0);
  const totalGastos   = filtrados.filter(m => m.tipo === 'gasto').reduce((s, m) => s + m.monto, 0);

  const fmt = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
  const fmtFecha = (f) => new Date(f + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="historial-page">
      <div className="page-header">
        <div>
          <h1>Historial de Transacciones</h1>
          <p>Consulta y filtra todos tus movimientos registrados.</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="historial-resumen">
        <div className="res-card ingreso">
          <span className="res-label">Total Ingresos</span>
          <span className="res-valor">{fmt(totalIngresos)}</span>
        </div>
        <div className="res-card gasto">
          <span className="res-label">Total Gastos</span>
          <span className="res-valor">{fmt(totalGastos)}</span>
        </div>
        <div className={`res-card ${totalIngresos - totalGastos >= 0 ? 'positivo' : 'negativo'}`}>
          <span className="res-label">Balance</span>
          <span className="res-valor">{fmt(totalIngresos - totalGastos)}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="historial-filtros">
        <input
          type="text" placeholder="🔍 Buscar por categoría o descripción…"
          value={busqueda} onChange={e => setBusqueda(e.target.value)}
          className="filtro-busqueda"
        />
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="filtro-select">
          {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <select value={filtroCat} onChange={e => setFiltroCat(e.target.value)} className="filtro-select">
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={orden} onChange={e => setOrden(e.target.value)} className="filtro-select">
          <option value="desc">Más reciente primero</option>
          <option value="asc">Más antiguo primero</option>
        </select>
      </div>

      {/* Tabla */}
      {filtrados.length === 0 ? (
        <div className="historial-empty">
          <span>📭</span>
          <p>No hay movimientos que coincidan con los filtros.</p>
          <small>Registra tu primer movimiento en la sección de Movimientos.</small>
        </div>
      ) : (
        <div className="tabla-wrapper">
          <table className="historial-tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(m => (
                <tr key={m.id}>
                  <td>{fmtFecha(m.fecha)}</td>
                  <td><span className={`badge-tipo ${m.tipo}`}>{m.tipo}</span></td>
                  <td>{m.categoria}</td>
                  <td className="td-desc">{m.descripcion || '—'}</td>
                  <td className={`td-monto ${m.tipo}`}>
                    {m.tipo === 'gasto' ? '-' : '+'}{fmt(m.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
