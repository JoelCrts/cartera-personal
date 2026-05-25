import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import './Dashboard.css';

const COLORS = ['#2E86C1','#1ABC9C','#E67E22','#E74C3C','#9B59B6','#F39C12','#27AE60','#2980B9'];

const fmt = (n) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 0 })}`;

export default function Dashboard() {
  const { user } = useAuth();

  const movimientos = useMemo(() => {
    const raw = JSON.parse(localStorage.getItem('cp_movimientos') || '[]');
    return raw.filter(m => m.usuarioId === user?.id);
  }, [user]);

  const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0);
  const gastos   = movimientos.filter(m => m.tipo === 'gasto').reduce((s, m) => s + m.monto, 0);
  const balance  = ingresos - gastos;
  const metas    = JSON.parse(localStorage.getItem('cp_metas') || '[]').length;

  // Gastos por categoría → PieChart
  const porCategoria = useMemo(() => {
    const map = {};
    movimientos.filter(m => m.tipo === 'gasto').forEach(m => {
      map[m.categoria] = (map[m.categoria] || 0) + m.monto;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [movimientos]);

  // Últimos 6 meses → BarChart
  const porMes = useMemo(() => {
    const map = {};
    movimientos.forEach(m => {
      const mes = m.fecha?.slice(0, 7) || 'N/A';
      if (!map[mes]) map[mes] = { mes, ingresos: 0, gastos: 0 };
      if (m.tipo === 'ingreso') map[mes].ingresos += m.monto;
      else                      map[mes].gastos   += m.monto;
    });
    return Object.values(map)
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .slice(-6)
      .map(d => ({ ...d, mes: d.mes.slice(5) + '/' + d.mes.slice(2, 4) }));
  }, [movimientos]);

  // Balance acumulado → LineChart
  const balanceAcumulado = useMemo(() => {
    let acum = 0;
    return movimientos
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .map(m => {
        acum += m.tipo === 'ingreso' ? m.monto : -m.monto;
        return { fecha: m.fecha?.slice(5) || '', balance: acum };
      });
  }, [movimientos]);

  const ultimosMovimientos = [...movimientos]
    .sort((a, b) => new Date(b.creadoEn || b.fecha) - new Date(a.creadoEn || a.fecha))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      {/* Header con imagen de fondo */}
      <div className="dash-hero">
        <img src="/images/dashboard.webp" alt="" className="dash-hero-img" aria-hidden="true" />
        <div className="dash-hero-overlay" />
        <div className="dash-hero-content">
          <h1>Hola, {user?.nombre?.split(' ')[0] || 'Usuario'} 👋</h1>
          <p>Aquí tienes el resumen de tu salud financiera.</p>
        </div>
      </div>

      <div className="dash-body">
        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card ingreso">
            <span className="kpi-icon">📥</span>
            <div>
              <p className="kpi-label">Total Ingresos</p>
              <p className="kpi-value">{fmt(ingresos)}</p>
            </div>
          </div>
          <div className="kpi-card gasto">
            <span className="kpi-icon">📤</span>
            <div>
              <p className="kpi-label">Total Gastos</p>
              <p className="kpi-value">{fmt(gastos)}</p>
            </div>
          </div>
          <div className={`kpi-card ${balance >= 0 ? 'balance-pos' : 'balance-neg'}`}>
            <span className="kpi-icon">{balance >= 0 ? '💰' : '⚠️'}</span>
            <div>
              <p className="kpi-label">Balance</p>
              <p className="kpi-value">{fmt(balance)}</p>
            </div>
          </div>
          <div className="kpi-card metas">
            <span className="kpi-icon">🎯</span>
            <div>
              <p className="kpi-label">Metas activas</p>
              <p className="kpi-value">{metas}</p>
            </div>
          </div>
        </div>

        {movimientos.length === 0 ? (
          <div className="dash-empty">
            <img src="/images/ahorro.webp" alt="Comienza a registrar" className="dash-empty-img" />
            <div>
              <h2>¡Bienvenido a tu Dashboard!</h2>
              <p>Aún no tienes movimientos registrados. Comienza agregando tus ingresos y gastos para ver tus estadísticas aquí.</p>
              <Link to="/movimientos" className="btn-dash-action">Registrar primer movimiento →</Link>
            </div>
          </div>
        ) : (
          <div className="charts-grid">
            {/* Bar chart */}
            <div className="chart-card wide">
              <h3>Ingresos vs Gastos por Mes</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={porMes} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => fmt(v)} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#27AE60" radius={[4,4,0,0]} name="Ingresos" />
                  <Bar dataKey="gastos"   fill="#E74C3C" radius={[4,4,0,0]} name="Gastos" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie chart */}
            {porCategoria.length > 0 && (
              <div className="chart-card">
                <h3>Gastos por Categoría</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={porCategoria} cx="50%" cy="50%" outerRadius={90}
                      dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                      labelLine={false} fontSize={11}>
                      {porCategoria.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => fmt(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Line chart */}
            {balanceAcumulado.length > 1 && (
              <div className="chart-card">
                <h3>Evolución del Balance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={balanceAcumulado} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                    <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => fmt(v)} />
                    <Line type="monotone" dataKey="balance" stroke="#2E86C1" strokeWidth={2} dot={false} name="Balance" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Últimos movimientos */}
            <div className="chart-card wide">
              <h3>Últimos Movimientos</h3>
              <table className="mini-tabla">
                <thead>
                  <tr><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Monto</th></tr>
                </thead>
                <tbody>
                  {ultimosMovimientos.map(m => (
                    <tr key={m.id}>
                      <td>{m.fecha}</td>
                      <td><span className={`badge-tipo ${m.tipo}`}>{m.tipo}</span></td>
                      <td>{m.categoria}</td>
                      <td className={`td-monto ${m.tipo}`}>{m.tipo==='gasto'?'-':'+'}{fmt(m.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to="/historial" className="ver-mas-link">Ver historial completo →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
