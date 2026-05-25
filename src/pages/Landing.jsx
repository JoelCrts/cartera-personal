import { Link } from 'react-router-dom';
import './Landing.css';

const features = [
  { icon: '📊', title: 'Dashboard en Tiempo Real',  desc: 'Visualiza tus ingresos y gastos con gráficas claras e interactivas actualizadas al instante.' },
  { icon: '🎯', title: 'Metas de Ahorro',            desc: 'Crea objetivos financieros individuales o compartidos y monitorea tu progreso paso a paso.' },
  { icon: '🔒', title: 'Seguridad Garantizada',      desc: 'Tus datos están protegidos con cifrado de extremo a extremo. Tu privacidad es nuestra prioridad.' },
  { icon: '📄', title: 'Reportes PDF',               desc: 'Descarga reportes detallados de tus finanzas personales en cualquier momento.' },
];

const stats = [
  { value: '10K+', label: 'Usuarios Activos' },
  { value: '$5M+', label: 'Gestionados' },
  { value: '4.9★', label: 'Calificación' },
];

const planes = [
  {
    nombre: 'Gratis', precio: '$0', periodo: 'para siempre', color: 'plan-free',
    features: ['Registro ilimitado de movimientos', 'Historial completo', '1 meta de ahorro', 'Dashboard básico'],
  },
  {
    nombre: 'Pro', precio: '$79', periodo: '/mes', color: 'plan-pro', destacado: true,
    features: ['Todo lo de Gratis', 'Metas compartidas ilimitadas', 'Reportes PDF avanzados', 'Gráficas estadísticas completas', 'Soporte prioritario'],
  },
  {
    nombre: 'Familia', precio: '$149', periodo: '/mes', color: 'plan-family',
    features: ['Todo lo de Pro', 'Hasta 5 usuarios', 'Panel familiar compartido', 'Reportes consolidados', 'Asesor financiero IA'],
  },
];

const blogPosts = [
  { img: '/images/ahorro.webp',     tag: 'Ahorro',     titulo: 'El poder del ahorro progresivo: cómo empezar desde cero',           desc: 'Pequeñas aportaciones constantes generan grandes resultados. La consistencia es la clave.' },
  { img: '/images/dashboard.webp',  tag: 'Finanzas',   titulo: 'Cómo leer tu dashboard financiero como un experto',                  desc: 'Aprende a interpretar gráficas de flujo de caja y tomar decisiones basadas en datos reales.' },
  { img: '/images/security.webp',   tag: 'Seguridad',  titulo: '¿Por qué es seguro guardar tus datos financieros localmente?',       desc: 'Descubre cómo el almacenamiento en tu dispositivo es más privado que cualquier nube.' },
];

const testimonios = [
  {
    avatar: '/images/testimonios.webp',
    nombre: 'Ana García',
    rol: 'Diseñadora Freelance · Ciudad de México',
    quote: '"Cartera Personal transformó mi relación con el dinero. En 3 meses logré ahorrar lo suficiente para mi fondo de emergencia. La interfaz es tan clara que no necesité ningún tutorial."',
  },
  {
    avatar: '/images/testimonio2.webp',
    nombre: 'Carlos Mendoza',
    rol: 'Ingeniero de Software · Guadalajara',
    quote: '"Llevaba años buscando una app financiera que no me pidiera acceso a mi banco. Cartera Personal es exactamente lo que necesitaba: privada, rápida y con reportes profesionales."',
  },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* ══ 1. HERO — hero1.webp ═══════════════════════════════
          Mujer joven iluminada por smartphone en entorno nocturno.
          Conecta con usuarios digitales y refuerza el uso móvil. */}
      <section className="hero">
        <img src="/images/hero1.webp" alt="Mujer gestionando sus finanzas desde el móvil" className="hero-bg" width="1920" height="1280" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-badge">🚀 Finanzas inteligentes con IA</p>
          <h1>Tu Futuro Financiero<br /><span className="hero-highlight">Comienza Hoy</span></h1>
          <p className="hero-desc">
            Toma el control de tus finanzas con inteligencia artificial. Gestiona gastos,
            ahorra de forma inteligente y alcanza tus metas económicas con confianza.
          </p>
          <div className="hero-ctas">
            <Link to="/registro" className="cta-primary">Comenzar Gratis</Link>
            <Link to="/nosotros" className="cta-secondary">Conocer Más</Link>
          </div>
          <div className="hero-stats">
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 2. FEATURES ══════════════════════════════════════ */}
      <section className="features-section">
        <div className="section-container">
          <p className="section-tag">¿Por qué elegirnos?</p>
          <h2 className="section-title">Todo lo que necesitas para<br />manejar tu dinero</h2>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. SHOWCASE — dashboard.webp ═════════════════════
          Laptop con panel financiero en oficina con luz azul.
          Tangibiliza el producto antes de que el usuario se registre. */}
      <section className="showcase-section">
        <div className="section-container showcase-inner">
          <div className="showcase-text">
            <p className="section-tag">Interfaz intuitiva</p>
            <h2>Un Dashboard diseñado<br />para tomar decisiones</h2>
            <p>
              Visualiza en tiempo real tus proyecciones, activos y flujo de caja.
              Nuestro panel financiero te da una fotografía completa de tu salud
              económica para que actúes con información, no con suposiciones.
            </p>
            <Link to="/registro" className="cta-primary">Pruébalo gratis</Link>
          </div>
          <div className="showcase-img">
            <img src="/images/dashboard.webp" alt="Dashboard financiero de Cartera Personal con gráficas de ingresos y gastos" width="1200" height="800" />
          </div>
        </div>
      </section>

      {/* ══ 4. HOW IT WORKS — registro.webp ══════════════════
          Manos en laptop, primer plano. Ilustra el acto concreto
          de registrar movimientos, paso central del producto.    */}
      <section className="howitworks-section">
        <div className="section-container">
          <p className="section-tag">Así de simple</p>
          <h2 className="section-title">Empieza en 3 pasos</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Crea tu cuenta</h3>
              <p>Regístrate gratis en menos de 2 minutos. Sin tarjeta de crédito, sin compromisos.</p>
            </div>
            <div className="step-visual">
              <img src="/images/registro.webp" alt="Persona usando Cartera Personal en su laptop" width="800" height="533" />
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Registra tus movimientos</h3>
              <p>Agrega ingresos y gastos con categorías, fecha y descripción. Todo queda guardado automáticamente.</p>
            </div>
            <div className="step-card-bottom">
              <div className="step-number">03</div>
              <h3>Visualiza y decide</h3>
              <p>Consulta tus estadísticas, establece metas y descarga reportes para tomar el control total de tu economía.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 5. SECURITY — security.webp ══════════════════════
          Candado digital con anillos tecnológicos azules.
          Refuerza confianza y privacidad — valores clave de la app. */}
      <section className="security-section">
        <div className="section-container security-inner">
          <div className="security-img">
            <img src="/images/security.webp" alt="Seguridad digital con cifrado AES-256 para datos financieros" width="1200" height="960" />
          </div>
          <div className="security-text">
            <p className="section-tag light">Confianza total</p>
            <h2>Tu dinero, tu información,<br />siempre protegidos</h2>
            <ul className="security-list">
              <li>✅ Cifrado de extremo a extremo (AES-256)</li>
              <li>✅ Autenticación de dos factores (2FA)</li>
              <li>✅ Sin acceso a tus cuentas bancarias reales</li>
              <li>✅ Datos almacenados localmente en tu dispositivo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ══ 6. PLANES ════════════════════════════════════════ */}
      <section className="planes-section">
        <div className="section-container">
          <p className="section-tag">Elige tu plan</p>
          <h2 className="section-title">Precios transparentes,<br />sin sorpresas</h2>
          <div className="planes-grid">
            {planes.map(p => (
              <div key={p.nombre} className={`plan-card ${p.color} ${p.destacado ? 'plan-destacado' : ''}`}>
                {p.destacado && <span className="plan-badge">⭐ Más popular</span>}
                <h3 className="plan-nombre">{p.nombre}</h3>
                <div className="plan-precio">
                  <span className="plan-monto">{p.precio}</span>
                  <span className="plan-periodo">{p.periodo}</span>
                </div>
                <ul className="plan-features">
                  {p.features.map(f => <li key={f}><span className="plan-check">✓</span>{f}</li>)}
                </ul>
                <Link to="/registro" className={`plan-cta ${p.destacado ? 'plan-cta-primary' : 'plan-cta-outline'}`}>
                  Empezar ahora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. BLOG — ahorro.webp / dashboard.webp / security.webp
          Tres artículos con imágenes temáticas. Cada imagen
          refuerza el tema del artículo con coherencia visual.     */}
      <section className="savings-section">
        <div className="section-container">
          <p className="section-tag">Aprende mientras ahorras</p>
          <h2 className="section-title">Recursos para crecer<br />financieramente</h2>
          <div className="blog-grid">
            {blogPosts.map(post => (
              <div key={post.titulo} className="blog-card">
                <div className="blog-img-wrap">
                  <img src={post.img} alt={post.titulo} width="800" height="533" />
                  <span className="blog-tag">{post.tag}</span>
                </div>
                <div className="blog-card-body">
                  <h3>{post.titulo}</h3>
                  <p>{post.desc}</p>
                  <Link to="/registro" className="blog-link">Leer más →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 8. TESTIMONIOS — testimonios.webp + testimonio2.webp
          Dos testimoniales reales con avatares circulares.
          La mujer profesional y el hombre en oficina generan
          representación diversa y credibilidad de marca.         */}
      <section className="testimonial-section">
        <div className="section-container">
          <p className="section-tag" style={{ textAlign: 'center' }}>Lo que dicen nuestros usuarios</p>
          <h2 className="section-title">Historias reales de<br />éxito financiero</h2>
          <div className="testimonials-grid">
            {testimonios.map(t => (
              <div key={t.nombre} className="testimonial-card">
                <div className="testimonial-top">
                  <img src={t.avatar} alt={t.nombre} className="testimonial-avatar" width="64" height="64" />
                  <div className="testimonial-info">
                    <p className="testimonial-name">{t.nombre}</p>
                    <p className="testimonial-role">{t.rol}</p>
                    <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                  </div>
                </div>
                <p className="testimonial-quote">{t.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9. CTA — contacto.webp ═══════════════════════════
          Vista cenital de escritorio organizado como fondo.
          Transmite control y orden, ideal para llamada a la acción. */}
      <section className="contact-section">
        <img src="/images/contacto.webp" alt="" className="contact-bg" aria-hidden="true" width="1920" height="1280" />
        <div className="contact-overlay" />
        <div className="contact-content">
          <h2>¿Listo para tomar el control<br />de tus finanzas?</h2>
          <p>Únete a más de 10,000 usuarios que ya confían en Cartera Personal.</p>
          <div className="contact-ctas">
            <Link to="/registro" className="cta-primary large">Crear cuenta gratis</Link>
            <Link to="/nosotros" className="cta-secondary">Conocer el equipo</Link>
          </div>
        </div>
      </section>

      {/* ══ 10. FOOTER — footer.webp ═════════════════════════
          Fondo poligonal azul marino. Estética tecnológica y
          sobria para el cierre de página. */}
      <footer className="footer">
        <img src="/images/footer.webp" alt="" className="footer-bg" aria-hidden="true" width="1920" height="1280" />
        <div className="footer-overlay" />
        <div className="footer-content">
          <div className="footer-brand">
            <span className="brand-icon-footer">₱</span>
            <span className="footer-brand-name">Cartera Personal</span>
            <p>Tu aliado financiero inteligente.<br />Gestiona, ahorra y crece.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Producto</h4>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/movimientos">Movimientos</Link>
              <Link to="/metas">Metas</Link>
              <Link to="/reportes">Reportes</Link>
            </div>
            <div className="footer-col">
              <h4>Compañía</h4>
              <Link to="/nosotros">Nosotros</Link>
              <a href="#">Blog</a>
              <a href="#">Privacidad</a>
              <a href="#">Términos</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Cartera Personal · Joel Cortés Godínez · Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
