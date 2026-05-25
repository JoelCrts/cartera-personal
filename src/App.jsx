import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar    from './components/Navbar';
import Landing   from './pages/Landing';
import Nosotros  from './pages/Nosotros';
import Login     from './pages/Login';
import Registro  from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Movimientos from './pages/Movimientos';
import Historial from './pages/Historial';
import Metas     from './pages/Metas';
import Reportes  from './pages/Reportes';
import NotFound  from './pages/NotFound';
import './App.css';

// Guard: redirige al login si no hay sesión
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Guard: si ya hay sesión, redirige al dashboard
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Landing />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/registro" element={<PublicRoute><Registro /></PublicRoute>} />

        {/* Privadas */}
        <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/movimientos" element={<PrivateRoute><Movimientos /></PrivateRoute>} />
        <Route path="/historial"   element={<PrivateRoute><Historial /></PrivateRoute>} />
        <Route path="/metas"       element={<PrivateRoute><Metas /></PrivateRoute>} />
        <Route path="/reportes"    element={<PrivateRoute><Reportes /></PrivateRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
