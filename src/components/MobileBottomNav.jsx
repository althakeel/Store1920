import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaHome, FaStore, FaTh, FaUser } from 'react-icons/fa';
import SignInModal from './sub/SignInModal';
import '../assets/styles/Mobile/MobileBottomNav.css';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, login, loading } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  const cartCount = cartItems.length;

  const isLoggedIn = user && user.id && user.token;

  const getUserImage = () => {
    if (!isLoggedIn) return null;
    if (user.name?.toLowerCase() === 'rohith') {
      return 'https://example.com/rohith-profile.png';
    }
    return user.image || null;
  };

  // Dynamically create menu items on each render
  const menuItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/allproducts', label: 'Shop', icon: <FaStore /> },
    { path: '/categories', label: 'Categories', icon: <FaTh /> },
    { 
      path: isLoggedIn ? '/myaccount' : '#',
      label: isLoggedIn ? 'Account' : 'Sign In',
      icon: isLoggedIn ? (
        getUserImage() ? (
          <img src={getUserImage()} alt="Profile" className="nav-profile-pic" />
        ) : <FaUser />
      ) : <FaUser />,
      onClick: () => {
        if (isLoggedIn) {
          navigate('/myaccount');
        } else {
          setShowSignIn(true);
        }
      }
    },
  ];

  // Close modal automatically if user logs in
  useEffect(() => {
    if (isLoggedIn) {
      setShowSignIn(false);
    }
  }, [isLoggedIn]);

  return (
    <>
      <nav className="mobile-bottom-nav">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={item.onClick}
          >
            <div className="icon-wrapper">{item.icon}</div>
            <span className="label">{item.label}</span>
            {item.label === 'Cart' && cartCount > 0 && (
              <span className="badge001">{cartCount}</span>
            )}
          </div>
        ))}
      </nav>

      <SignInModal
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onLogin={(userData) => {
          login(userData);          // update context
          setShowSignIn(false);     // close modal
        }}
      />
    </>
  );
}
