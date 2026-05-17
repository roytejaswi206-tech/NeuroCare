import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, isLoggedIn } from '../utils/storage';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  
  // Use the new storage utility to check authentication
  const user = getCurrentUser();
  const authenticated = isLoggedIn();

  if (!authenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;