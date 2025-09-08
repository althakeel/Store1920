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

  // Keep localStorage in sync with user state
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

  // Login function
  const login = (userData) => {
    setUser(userData);
    // CartContext will automatically handle user-specific cart
  };

  // Logout function
  const logout = () => {
    // CartContext will handle clearing user cart if needed
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
