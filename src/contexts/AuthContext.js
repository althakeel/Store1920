// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const id = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    return id && email && token ? { id, email, token } : null;
  });

  const [loading, setLoading] = useState(true);

  // Sync user across tabs
  useEffect(() => {
    setLoading(false);

    const handleStorageChange = (e) => {
      if (["userId", "email", "token"].includes(e.key)) {
        const id = localStorage.getItem("userId");
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        setUser(id && email && token ? { id, email, token } : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("userId", user.id);
      localStorage.setItem("email", user.email);
      localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
