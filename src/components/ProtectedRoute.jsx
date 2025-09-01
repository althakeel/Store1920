// ProtectedRoute.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import SignInModal from "./sub/SignInModal";

const ProtectedRoute = ({ children }) => {
  const { user, loading, login } = useAuth();

  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }

  if (!user) {
    return (
      <SignInModal
        isOpen={true}
        onClose={() => {}}
        onLogin={(userData) => login(userData)} // this updates AuthContext
      />
    );
  }

  return children;
};

export default ProtectedRoute;
