import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const loggedIn = localStorage.getItem('neurocare_logged_in');
  const userData = localStorage.getItem('neurocare_user');
  const user = userData ? JSON.parse(userData) : {};

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
