// UserDropdownMenu.jsx
import React, { useRef, useState, useEffect } from 'react';
import '../assets/styles/UserDropdownMenu.css';
import SignOutConfirmModal from './sub/SignOutConfirmModal';
import orderIcon from '../assets/images/Orders 2.png'
import reviewIcon from '../assets/images/Reviews 2.png'
import profileIcon from '../assets/images/Accounts  2.png'
import couponIcon from '../assets/images/coupons.png'
import notificationIcon from '../assets/images/Notification2.png'
import historyIcon from '../assets/images/History2.png'
import SignOut from '../assets/images/Signout2.png'

const UserDropdownMenu = ({
  user,
  isOpen,
  onClose,
  setUser,
  setUserDropdownOpen,
  setMobileMenuOpen,
}) => {
  const timeoutRef = useRef(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen && !showSignOutConfirm) {
      setShowSignOutConfirm(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [isOpen, showSignOutConfirm]);

  const handleMouseLeave = () => {
    if (!showSignOutConfirm) {
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 200);
    }
  };

  const handleCancelSignOut = () => {
    setShowSignOutConfirm(false);
    onClose();
  };

  const handleConfirmSignOut = () => {
    setShowSignOutConfirm(false);
    setUser(null);
    localStorage.removeItem('user');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.href = '/'; // or use react-router navigation if SPA
  };

  const menuItems = [
    { label: 'Your Orders', icon: orderIcon, link: '/myaccount/orders' },
    { label: 'Your Reviews', icon: reviewIcon, link: 'myaccount/reviews' },
    { label: 'Your Profile', icon: profileIcon, link: '/myaccount/profile' },
    { label: 'Coupons & Offers', icon: couponIcon, link: '/myaccount/coupons' },
    { label: 'Notifications', icon: notificationIcon, link: '/myaccount/notifications' },
    { label: 'Browse History', icon: historyIcon, link: '/myaccount/history' },
  ];

  if (!isOpen && !showSignOutConfirm) return null;

  return (
    <>
      <div
        className="user-dropdown-wrapper"
        onMouseEnter={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="user-dropdown-menu">
          {menuItems.map((item, index) => (
            <a key={index} href={item.link} className="dropdown-item">
              <img src={item.icon} alt={item.label} className="dropdown-icon" />
              {item.label}
            </a>
          ))}

       <button
  className="dropdown-item signout-btn"
  onClick={() => setShowSignOutConfirm(true)}
  type="button"
>
  <img src={SignOut} alt="Sign Out" className="dropdown-icon" />
  Sign Out
</button>
        </div>
      </div>

      <SignOutConfirmModal
        isOpen={showSignOutConfirm}
        onConfirm={handleConfirmSignOut}
        onCancel={handleCancelSignOut}
      />
    </>
  );
};

export default UserDropdownMenu;
