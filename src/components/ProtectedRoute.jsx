// components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SignInModal from './sub/SignInModal';
 
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // If auth is still loading, show loader
  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }

  // If no user, show the login modal
  if (!user) {
    return (
      <SignInModal
        isOpen={true}
        onClose={() => setShowLoginModal(false)}
      />
    );
  }

  // If authenticated, render the protected children
  return children;
};

export default ProtectedRoute;
