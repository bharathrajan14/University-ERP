import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute component that guards private routes.
 * Redirects unauthenticated users to the login page.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
