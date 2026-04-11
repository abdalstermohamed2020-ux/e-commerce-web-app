import React from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../store/UseStore';

const ProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = useStore((state) => state.isAdminAuthenticated);

  // لو المدير مسجل دخول (true) اعرض الصفحة، لو لأ (false) ابعته للوجن فوراً
  return isAdminAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;