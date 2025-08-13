// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial user from localStorage or sessionStorage
  useEffect(() => {
    const loadUser = () => {
      const saved = sessionStorage.getItem('user');
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        const id = localStorage.getItem('userId');
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        if (id && email && token) {
          setUser({ id, email, token });
        }
      }
      setLoading(false);
    };

    loadUser();

    // Listen to storage events from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'userId' || e.key === 'email' || e.key === 'token') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist user to sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);

    if (userData?.id) localStorage.setItem('userId', userData.id);
    if (userData?.email) localStorage.setItem('email', userData.email);
    if (userData?.token) localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
