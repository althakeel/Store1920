// components/MobileBottomNav.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaHome, FaUser, FaStore, FaHeart, FaShoppingBag } from 'react-icons/fa';
import '../assets/styles/Mobile/MobileBottomNav.css';
import { FaTh } from 'react-icons/fa';

export default function MobileBottomNav() {
  const location = useLocation();
  const { cartItems } = useCart();
  const cartCount = cartItems.length;

  const menuItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    // { path: '/myaccount', label: 'Account', icon: <FaUser /> },
    { path: '/allproducts', label: 'Shop', icon: <FaStore /> },
  { path: '/categories', label: 'Categories', icon: <FaTh /> },
    { path: '/cart', label: 'Cart', icon: <FaShoppingBag /> },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {menuItems.map((item) => (
        <Link
          to={item.path}
          key={item.label}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <div className="icon-wrapper">
            {item.icon}
            {(item.label === 'Cart' && cartCount > 0) || (item.label === 'Wishlist' && false) ? (
              <span className="badge001">{cartCount}</span>
            ) : null}
          </div>
          <span className="label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
