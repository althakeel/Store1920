// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial user from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('user');
  
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      // fallback to localStorage
      const id = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (id && token) {
        setUser({ id, token });
      }
    }
  
    setLoading(false);
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

     if (userData?.id) {
    localStorage.setItem('userId', userData.id);
  }
  if (userData?.token) {
    localStorage.setItem('token', userData.token);
  }
  };

  const logout = () => {
    setUser(null);
      localStorage.removeItem('userId');
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
