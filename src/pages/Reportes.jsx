import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Reportes.css';

export default function Reportes() {
  const { user } = useAuth();
  const [generando, setGenerando] = useState(false);
  const [ok,        setOk]        = useState(false);

  const movimientos = useMemo(() => {
    const raw = JSON.parse(localStorage.getItem('cp_movimientos') || '[]');
    return raw.filter(m => m.usuarioId === user?.id)
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [user]);

  const ingresos  = movimientos.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + m.monto, 0);
  const gastos    = movimientos.filter(m => m.tipo === 'gasto').reduce((s, m) => s + m.monto, 0);
  const balance   = ingresos - gastos;
  const fmt       = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const descargarPDF = async () => {
    setGenerando(true); setOk(false);
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;

    // Header
    doc.setFillColor(13, 43, 85);
    doc.rect(0, 0, pageW, 38, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('Cartera Personal', margin, 18);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text('Reporte Financiero Personal', margin, 26);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric' })}`, margin, 33);
    doc.text(`Usuario: ${user?.nombre || 'N/A'}`, pageW - margin, 33, { align: 'right' });

    // KPI cards
    let y = 50;
    doc.setTextColor(30, 30, 30);

    const kpis = [
      { label: 'Total Ingresos', value: fmt(ingresos), color: [39, 174, 96] },
      { label: 'Total Gastos',   value: fmt(gastos),   color: [231, 76, 60] },
      { label: 'Balance Net',    value: fmt(balance),  color: balance >= 0 ? [46, 134, 193] : [230, 126, 34] },
      { label: 'Movimientos',    value: String(movimientos.length), color: [13, 43, 85] },
    ];
    const cardW = (pageW - margin * 2 - 9) / 4;
    kpis.forEach((k, i) => {
      const x = margin + i * (cardW + 3);
      doc.setFillColor(...k.color);
      doc.roundedRect(x, y, cardW, 22, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7); doc.setFont('helvetica', 'normal');
      doc.text(k.label.toUpperCase(), x + 4, y + 8);
      doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text(k.value, x + 4, y + 18);
    });
    y += 32;

    // Tabla movimientos
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('Detalle de Movimientos', margin, y);
    y += 6;

    const cols = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto'];
    const colW  = [28, 22, 35, 58, 30];
    const rowH  = 8;

    // Header fila
    doc.setFillColor(26, 74, 138);
    doc.rect(margin, y, pageW - margin * 2, rowH, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
    let cx = margin + 2;
    cols.forEach((c, i) => { doc.text(c, cx, y + 5.5); cx += colW[i]; });
    y += rowH;

    doc.setFont('helvetica', 'normal');
    movimientos.slice(0, 40).forEach((m, idx) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFillColor(idx % 2 === 0 ? 245 : 255, idx % 2 === 0 ? 247 : 255, idx % 2 === 0 ? 250 : 255);
      doc.rect(margin, y, pageW - margin * 2, rowH, 'F');
      doc.setTextColor(50, 50, 50);
      const row = [m.fecha || '—', m.tipo, m.categoria, (m.descripcion || '—').slice(0, 35), fmt(m.monto)];
      cx = margin + 2;
      row.forEach((cell, i) => {
        if (i === 4) doc.setTextColor(m.tipo === 'ingreso' ? 39 : 200, m.tipo === 'ingreso' ? 174 : 50, m.tipo === 'ingreso' ? 96 : 50);
        doc.text(String(cell), cx, y + 5.5);
        doc.setTextColor(50, 50, 50);
        cx += colW[i];
      });
      // border bottom
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y + rowH, pageW - margin, y + rowH);
      y += rowH;
    });

    if (movimientos.length > 40) {
      y += 4;
      doc.setFontSize(8); doc.setTextColor(120, 120, 120);
      doc.text(`... y ${movimientos.length - 40} movimientos más. Usa los filtros del historial para ver todos.`, margin, y);
    }

    // Footer
    const pages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFillColor(13, 43, 85);
      doc.rect(0, 287, pageW, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text('Cartera Personal © 2026 · Joel Cortés Godínez', margin, 293);
      doc.text(`Pág. ${p} / ${pages}`, pageW - margin, 293, { align: 'right' });
    }

    doc.save(`reporte-cartera-${new Date().toISOString().slice(0, 10)}.pdf`);
    setGenerando(false); setOk(true);
  };

  return (
    <div className="reportes-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Reportes Financieros</h1>
          <p>Descarga un PDF detallado de tus finanzas personales.</p>
        </div>
      </div>

      <div className="reportes-layout">
        {/* Panel visual */}
        <div className="reporte-visual">
          <img src="/images/nosotros.webp" alt="" aria-hidden="true" />
          <div className="rv-overlay">
            <h3>Tu historial, en tus manos</h3>
            <p>Genera reportes profesionales para llevar el control total de tu economía personal.</p>
          </div>
        </div>

        {/* Panel acción */}
        <div className="reporte-panel">
          <div className="reporte-resumen">
            <h2>Resumen actual</h2>
            <div className="rep-stats">
              <div className="rep-stat ingreso">
                <span className="rs-label">Ingresos totales</span>
                <span className="rs-val">{fmt(ingresos)}</span>
              </div>
              <div className="rep-stat gasto">
                <span className="rs-label">Gastos totales</span>
                <span className="rs-val">{fmt(gastos)}</span>
              </div>
              <div className={`rep-stat ${balance >= 0 ? 'balance-pos' : 'balance-neg'}`}>
                <span className="rs-label">Balance neto</span>
                <span className="rs-val">{fmt(balance)}</span>
              </div>
              <div className="rep-stat neutral">
                <span className="rs-label">Total movimientos</span>
                <span className="rs-val">{movimientos.length}</span>
              </div>
            </div>
          </div>

          <div className="reporte-acciones">
            <h2>Generar reporte PDF</h2>
            <p>El reporte incluye un resumen ejecutivo, KPIs clave y el detalle de hasta 40 movimientos.</p>

            {movimientos.length === 0 ? (
              <div className="rep-warning">
                ⚠️ No tienes movimientos registrados aún. Registra al menos uno para generar un reporte.
              </div>
            ) : (
              <>
                {ok && <div className="rep-ok">✅ ¡Reporte descargado correctamente!</div>}
                <button className="btn-descargar" onClick={descargarPDF} disabled={generando}>
                  {generando ? '⏳ Generando PDF…' : '📄 Descargar Reporte PDF'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
