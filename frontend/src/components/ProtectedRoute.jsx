import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false, clientOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user) {
    return adminOnly ? <Navigate to="/admin-login" replace /> : <Navigate to="/" replace />;
  }
  if (adminOnly && user.role !== 'admin') return <Navigate to="/portal" replace />;
  if (clientOnly && user.role === 'admin') return <Navigate to="/admin" replace />;

  return children;
}
