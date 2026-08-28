import React, { createContext, useContext, useEffect, useState } from 'react';
import { Auth } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('flyeasy_token');
    if (!token) {
      setLoading(false);
      return;
    }
    Auth.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('flyeasy_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(identifier, password) {
    const { user, token } = await Auth.login(identifier, password);
    localStorage.setItem('flyeasy_token', token);
    setUser(user);
    setShowAuthModal(false);
    
    // Auto redirect to portal if it's a client logging in from homepage
    if (user.role === 'client' && window.location.pathname === '/') {
      navigate('/portal');
    }
    return user;
  }

  async function register(name, email, phone, password) {
    const { user, token } = await Auth.register(name, email, phone, password);
    localStorage.setItem('flyeasy_token', token);
    setUser(user);
    setShowAuthModal(false);
    
    if (user.role === 'client' && window.location.pathname === '/') {
      navigate('/portal');
    }
    return user;
  }

  function logout() {
    localStorage.removeItem('flyeasy_token');
    setUser(null);
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
