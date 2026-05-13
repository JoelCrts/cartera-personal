import React, { useState } from 'react';
import './FormularioMovimientos.css';

const FormularioMovimientos = () => {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('gasto');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Simulación de usuario activo
  const usuarioActivoId = "usr_token_12345"; 

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    const montoNumerico = Number(monto);
    
    // Validación de números negativos
    if (montoNumerico <= 0) {
      setError('Error: El monto no puede ser negativo ni igual a cero.');
      return;
    }

    const nuevoMovimiento = {
      id: Date.now(),
      usuarioId: usuarioActivoId, 
      monto: montoNumerico,
      categoria: categoria,
      tipo: tipo,
      fecha: new Date().toISOString()
    };

    // Persistencia local (localStorage)
    try {
      const historialPrevio = JSON.parse(localStorage.getItem('movimientosCartera')) || [];
      historialPrevio.push(nuevoMovimiento);
      localStorage.setItem('movimientosCartera', JSON.stringify(historialPrevio));
      
      setMensajeExito(`¡${tipo.charAt(0).toUpperCase() + tipo.slice(1)} registrado con éxito!`);
      
      setMonto('');
      setCategoria('');
    } catch (err) {
      setError('Hubo un error al guardar el movimiento.');
    }
  };

  return (
    <div className="formulario-contenedor">
      <h2>Registrar Movimiento</h2>
      
      {error && <div className="mensaje-error">{error}</div>}
      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

      <form onSubmit={handleSubmit}>
        <div className="campo-form">
          <label>Tipo de movimiento:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
        </div>

        <div className="campo-form">
          <label>Monto:</label>
          <input 
            type="number" 
            min="0.01" 
            step="0.01"
            value={monto} 
            onChange={(e) => setMonto(e.target.value)} 
            placeholder="Ej. 150.00"
            required 
          />
        </div>

        <div className="campo-form">
          <label>Categoría:</label>
          <input 
            type="text" 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)} 
            placeholder="Ej. Despensa, Transporte..."
            required 
          />
        </div>

        <button type="submit" className="btn-guardar">
          Guardar {tipo}
        </button>
      </form>
    </div>
  );
};

export default FormularioMovimientos;