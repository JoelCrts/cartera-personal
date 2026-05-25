import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <img src="/images/404.webp" alt="Página no encontrada" className="notfound-img" />
      <h1>¡Oops! Página no encontrada</h1>
      <p>La ruta que buscas no existe o fue movida. Vuelve al inicio y sigue gestionando tus finanzas.</p>
      <Link to="/" className="btn-home">← Ir al inicio</Link>
    </div>
  );
}
