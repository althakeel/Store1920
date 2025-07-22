import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/UserDropdownMenu.css';
import SignOutConfirmModal from './sub/SignOutConfirmModal';

import orderIcon from '../assets/images/Orders 2.png';
import reviewIcon from '../assets/images/Reviews 2.png';
import profileIcon from '../assets/images/Accounts  2.png';
import couponIcon from '../assets/images/coupons.png';
import notificationIcon from '../assets/images/Notification2.png';
import historyIcon from '../assets/images/History2.png';
import SignOut from '../assets/images/Signout2.png';

const UserDropdownMenu = ({ isOpen, onClose, setUserDropdownOpen, setMobileMenuOpen, user, setUser }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || showConfirmModal) {
      clearTimeout(timeoutRef.current);
    }
  }, [isOpen, showConfirmModal]);

  const handleMouseLeave = () => {
    if (!showConfirmModal) {
      timeoutRef.current = setTimeout(onClose, 200);
    }
  };

  const handleSignOut = () => {
    setShowConfirmModal(false);
    setUser(null);
    localStorage.removeItem('user');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    onClose();
  };

  const menuItems = [
    { label: 'Your Orders', icon: orderIcon, link: '/myaccount/orders' },
    { label: 'Your Reviews', icon: reviewIcon, link: '/myaccount/reviews' },
    { label: 'Your Profile', icon: profileIcon, link: '/myaccount/profile' },
    { label: 'Coupons & Offers', icon: couponIcon, link: '/myaccount/coupons' },
    { label: 'Notifications', icon: notificationIcon, link: '/myaccount/notifications' },
    { label: 'Browse History', icon: historyIcon, link: '/myaccount/history' },
  ];

  if (!isOpen && !showConfirmModal) return null;

  return (
    <>
      <div
        className="user-dropdown-wrapper"
        onMouseEnter={() => clearTimeout(timeoutRef.current)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="user-dropdown-menu">
          {menuItems.map((item, idx) => (
            <a key={idx} href={item.link} className="dropdown-item">
              <img src={item.icon} alt={item.label} className="dropdown-icon" />
              {item.label}
            </a>
          ))}

          <button
            type="button"
            className="dropdown-item signout-btn"
            onClick={() => setShowConfirmModal(true)}
          >
            <img src={SignOut} alt="Sign Out" className="dropdown-icon" />
            Sign Out
          </button>
        </div>
      </div>

      <SignOutConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleSignOut}
        onCancel={handleCancel}
      />
    </>
  );
};

export default UserDropdownMenu;