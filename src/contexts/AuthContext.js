// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage on initial render
    const id = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    return id && email && token ? { id, email, token } : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // Loading complete after initial check

    // Sync user across tabs
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

  // Keep localStorage in sync with state
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
    setUser(userData); // Triggers localStorage update
  };

  const logout = () => {
    setUser(null); // Clears state and localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
