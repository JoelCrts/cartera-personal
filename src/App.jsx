import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import FormularioMovimientos from './components/FormularioMovimientos'

function Login() {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    alert("Simulación: ¡Login Correcto! Redirigiendo...");
    navigate('/movimientos');
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>Iniciar Sesión</h2>
        <p>Cartera Personal</p>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
        <Link to="/registro" className="link-text">Crear cuenta nueva</Link>
      </div>
    </div>
  );
}

function Registro() {
  const navigate = useNavigate();
  const handleRegistro = (e) => {
    e.preventDefault();
    alert("Simulación: ¡Usuario Registrado! Ve al login.");
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>Crear Cuenta</h2>
        <p>Únete a Cartera Personal</p>
        <form onSubmit={handleRegistro}>
          <input type="text" placeholder="Nombre completo" required />
          <input type="email" placeholder="Correo" required />
          <input type="password" placeholder="Contraseña (mín 6)" minLength="6" required />
          <button type="submit" className="btn-primary">Registrarse</button>
        </form>
        <Link to="/" className="link-text">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/movimientos" element={<FormularioMovimientos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App