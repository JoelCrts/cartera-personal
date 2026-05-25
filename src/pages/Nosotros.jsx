import { Link } from 'react-router-dom';
import './Nosotros.css';

const valores = [
  { icon: '🔒', titulo: 'Privacidad', desc: 'Tus datos nunca salen de tu dispositivo. Cero servidores externos.' },
  { icon: '🌱', titulo: 'Crecimiento', desc: 'Cada función está pensada para que mejores tus hábitos financieros.' },
  { icon: '🤝', titulo: 'Accesibilidad', desc: 'Herramienta gratuita y sin barreras para cualquier persona.' },
  { icon: '⚡', titulo: 'Simplicidad', desc: 'Interfaz limpia que no requiere conocimientos financieros previos.' },
];

export default function Nosotros() {
  return (
    <div className="nosotros-page">

      {/* ── HERO ── imagen: nosotros.webp ──────────────────────────
          Cuatro profesionales jóvenes y diversos conversando en
          oficina moderna junto a un ventanal. Comunica trabajo
          colaborativo, diversidad e innovación en un ambiente
          profesional cercano y accesible.                          */}
      <section className="nosotros-hero">
        <img
          src="/images/nosotros.webp"
          alt="Equipo diverso de Cartera Personal colaborando en una oficina moderna"
          className="nosotros-bg"
          width="1000" height="666"
        />
        <div className="nosotros-overlay" />
        <div className="nosotros-hero-content">
          <p className="section-tag light">Quiénes somos</p>
          <h1>Construimos el futuro<br />de las finanzas personales</h1>
          <p>Un equipo apasionado por hacer que la educación financiera sea accesible para todos en Latinoamérica.</p>
        </div>
      </section>

      {/* ── MISIÓN Y VISIÓN ──────────────────────────────────────── */}
      <section className="nosotros-mission">
        <div className="section-container mission-grid">
          <div className="mission-card">
            <span className="mission-icon">🎯</span>
            <h2>Nuestra Misión</h2>
            <p>
              Democratizar el acceso a herramientas financieras inteligentes, ayudando a personas
              de todos los ingresos a entender, gestionar y hacer crecer su dinero con confianza
              y sin depender de instituciones financieras tradicionales.
            </p>
          </div>
          <div className="mission-card">
            <span className="mission-icon">🔭</span>
            <h2>Nuestra Visión</h2>
            <p>
              Ser la plataforma de gestión financiera personal más confiable de Latinoamérica,
              impulsando el bienestar económico de millones de familias a través de la tecnología
              ética y el diseño centrado en las personas.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALORES ── imagen: ahorro.webp ─────────────────────────
          Las monedas con el brote verde simbolizan crecimiento
          sostenible y progresivo, metáfora perfecta del valor
          central de Cartera Personal: el ahorro consistente
          como camino hacia la libertad financiera.                 */}
      <section className="nosotros-valores">
        <div className="section-container valores-inner">
          <div className="valores-img">
            <img
              src="/images/ahorro.webp"
              alt="Crecimiento financiero progresivo representado con monedas y una planta emergiendo"
              width="800" height="522"
            />
          </div>
          <div className="valores-texto">
            <p className="section-tag">Lo que nos define</p>
            <h2>Nuestros Valores</h2>
            <div className="valores-grid">
              {valores.map(v => (
                <div key={v.titulo} className="valor-item">
                  <span className="valor-icon">{v.icon}</span>
                  <div>
                    <h3>{v.titulo}</h3>
                    <p>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EQUIPO ── imagen: testimonios.webp ────────────────────
          Retrato profesional recortado a 1:1 para avatar circular.
          La mirada directa a cámara genera conexión personal y
          confianza con el visitante del sitio.                     */}
      <section className="nosotros-team">
        <div className="section-container">
          <p className="section-tag" style={{ textAlign: 'center' }}>Las personas detrás del proyecto</p>
          <h2 className="team-title">Nuestro Equipo</h2>
          <div className="team-grid">
            <div className="team-card">
              <img
                src="/images/developer.webp"
                alt="Joel Cortés Godínez, Fundador y Desarrollador de Cartera Personal"
                width="400" height="400"
              />
              <h3>Joel Cortés Godínez</h3>
              <p>Fundador &amp; Desarrollador Full Stack</p>
              <span className="team-tag">React · Node.js · Fintech</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── imagen: contacto.webp ────────────────────
          Vista cenital de escritorio ordenado, vista que transmite
          control y productividad. Ideal para invitar al usuario
          a tomar acción desde una posición de orden y claridad.    */}
      <section className="nosotros-cta">
        <img
          src="/images/contacto.webp"
          alt=""
          className="nosotros-cta-bg"
          aria-hidden="true"
          width="1920" height="1280"
        />
        <div className="nosotros-cta-overlay" />
        <div className="nosotros-cta-content">
          <h2>¿Te identificas con nuestra misión?</h2>
          <p>Únete a miles de personas que ya gestionan su dinero de forma inteligente.</p>
          <Link to="/registro" className="cta-primary large">Crear cuenta gratis</Link>
        </div>
      </section>

    </div>
  );
}
