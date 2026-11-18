import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ isAdmin, children }) => {
  return isAdmin ? children : <Navigate to="/adminlogin" replace />;
};

export default AdminProtectedRoute;

