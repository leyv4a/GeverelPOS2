import React from 'react'
import { isAuthenticated } from '../../utils/auth';
import { Navigate } from 'react-router-dom';
import CompleteSidebar from './CompleteSidebar';

export default function ProtectedRoute({ children, type }) {
  const user = isAuthenticated();

  if (!user) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" />;
  }

  if (user.tipo > type) {
    // Si no tiene el rol adecuado, puedes redirigir a una página de error o a la home
    return <Navigate to="/tienda" />;
  }

  // Si está autenticado y tiene el rol adecuado, renderiza el componente hijo
  return <><CompleteSidebar />{children}</>;
};

