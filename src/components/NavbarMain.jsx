// NavbarWithMegaMenu.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import chroma from 'chroma-js';

import SearchBar from './sub/SearchBar';
import SignInModal from './sub/SignInModal';
import MobileMenu from './sub/MobileMenu';
import UserDropdownMenu from './UserDropdownMenu';
import SupportDropdownMenu from './sub/SupportDropdownMenu';
import CoinWidget from './CoinWidget';
import { useCart } from '../contexts/CartContext';

import '../assets/styles/Navbar.css';

// Icons
import Newicon from '../assets/images/webicons/Header/White/Asset 34@6x.png';
import Star from '../assets/images/webicons/Header/White/Asset 33@6x.png';
import SupportIcon from '../assets/images/webicons/Header/White/Asset 32@6x.png';
import CartIcon from '../assets/images/webicons/Header/White/Asset 30@6x.png';
import UserIcon from '../assets/images/webicons/Header/White/Asset 21@6x.png';

// Logos
import Logo1 from '../assets/images/Logo/Asset 1.svg';
import Logo2 from '../assets/images/Logo/Asset 2.svg';
import Logo3 from '../assets/images/Logo/Asset 3.svg';

// API constants
const API_BASE = 'https://db.store1920.com/wp-json/wc/v1';
const CK = 'ck_2e4ba96dde422ed59388a09a139cfee591d98263';
const CS = 'cs_43b449072b8d7d63345af1b027f2c8026fd15428';

const decodeHtml = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const NavbarWithMegaMenu = ({ cartIconRef, openCart }) => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [hovering, setHovering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { isCartOpen, cartItems } = useCart();
  const navigate = useNavigate();

  const timeoutRef = useRef(null);
  const supportTimeoutRef = useRef(null);
  const userTimeoutRef = useRef(null);

  const totalQuantity = cartItems?.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0) || 0;

  const truncateName = (name, maxLength = 10) => {
    if (!name) return '';
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch categories & user
  useEffect(() => {
    axios.get(`${API_BASE}/products/categories?consumer_key=${CK}&consumer_secret=${CS}`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('Category error', err));

    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleCategoryHover = (id) => {
    setActiveCategoryId(id);
    axios.get(`${API_BASE}/products?category=${id}&per_page=12&consumer_key=${CK}&consumer_secret=${CS}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Product error', err));
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovering(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHovering(false), 200);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setSignInOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  // Logo & background cycling
  const navbarBackgrounds = ['#ffc901', '#fe6c03', '#38a9d8'];
  const navbarLogos = [Logo1, Logo2, Logo3];
  const [navbarIndex, setNavbarIndex] = useState(0);

  useEffect(() => {
    // Only run once per session
    const sessionFlag = sessionStorage.getItem('navbarSessionActive');
    let nextIndex = 0;

    if (!sessionFlag) {
      let lastIndex = localStorage.getItem('navbarIndex');
      lastIndex = lastIndex !== null ? parseInt(lastIndex, 10) : -1;

      nextIndex = (lastIndex + 1) % navbarLogos.length;

      localStorage.setItem('navbarIndex', nextIndex);
      sessionStorage.setItem('navbarSessionActive', 'true');
    } else {
      const savedIndex = localStorage.getItem('navbarIndex');
      if (savedIndex !== null) nextIndex = parseInt(savedIndex, 10);
    }

    setNavbarIndex(nextIndex);
  }, []);

  const backgroundColor = navbarBackgrounds[navbarIndex];
  const sitelogo = navbarLogos[navbarIndex];
  const isDark = chroma(backgroundColor).luminance() < 0.5;
  const textColor = isDark ? '#fff' : '#fff';

  return (
    <>
      <nav
        className="navbar"
        style={{
          width: isMobile ? '100%' : (isCartOpen ? 'calc(100% - 250px)' : '100%'),
          transition: 'width 0.3s ease',
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        <div className="navbar-inner">
          <div className="nav-left">
            <img
              src={sitelogo}
              alt="Store1920"
              className="logo"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                closeMobileMenu();
                window.location.href = '/';
              }}
            />
          </div>

          <div className="nav-center-mobile">
            <SearchBar />
          </div>

          <div
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </div>

          <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <div className="nav-left-links">
              <div className="nav-icon-with-text" onClick={() => window.location.href = '/new'}>
                <img src={Newicon} alt="New" className="icon-small" />
                <span>New</span>
              </div>
              <div className="nav-icon-with-text star-rating" onClick={() => window.location.href = '/rated'}>
                <img src={Star} alt="5 Star rated" className="icon-star" />
                <span>5-Star Rated</span>
              </div>

            <div
  className="dropdown-container"
  onMouseEnter={() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovering(true);
  }}
  onMouseLeave={() => {
    timeoutRef.current = setTimeout(() => setHovering(false), 300); // small delay
  }}
>
  <div className="dropdown-trigger">Categories ▾</div>
  {hovering && (
    <div className="mega-menu">
      <div className="mega-left">
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`mega-cat-item ${activeCategoryId === cat.id ? 'active' : ''}`}
            onMouseEnter={() => handleCategoryHover(cat.id)}
          >
            {decodeHtml(cat.name)}
          </div>
        ))}
      </div>
      <div className="mega-right">
        {products.map(product => (
          <a
            key={product.id}
            href={product.permalink.replace('db.store1920.com', 'store1920.com')}
            className="mega-product"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="circle-img">
              <img src={product.images[0]?.src || ''} alt={product.name} />
            </div>
            <div className="price">{product.price} AED</div>
          </a>
        ))}
      </div>
    </div>
  )}
</div>

            </div>

            <div className="nav-center">
              <SearchBar />
            </div>

            <div className="nav-right">
              {user ? (
                <div
                  className="account logged-in"
                  title={`Hi, ${user.name}`}
                  onMouseEnter={() => {
                    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
                    setUserDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    userTimeoutRef.current = setTimeout(() => setUserDropdownOpen(false), 200);
                  }}
                  style={{ position: 'relative' }}
                >
                  <div className="avatar">
                    {user.image ? <img src={user.image} alt={user.name} /> :
                      <div className="avatar-fallback">{user.name.charAt(0).toUpperCase()}</div>}
                  </div>
                  <div className="user-name">
                    Hi, {capitalizeFirst(truncateName(user.name))} <CoinWidget userId={Number(user.id)} />
                  </div>
                  <UserDropdownMenu
                    user={user}
                    setUser={setUser}
                    isOpen={userDropdownOpen}
                    onSignOut={handleSignOut}
                    onClose={() => setUserDropdownOpen(false)}
                    setUserDropdownOpen={setUserDropdownOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                  />
                </div>
              ) : (
                <div className="account guest-account" onClick={() => setSignInOpen(true)}>
                  <img src={UserIcon} alt="Profile Icon" className="icon-small" />
                  <div className="account-text" style={{  color: textColor,}}>
                    <span className="account-title" >Sign In / Register</span>
                    <span className="small-text">Orders & Account</span>
                  </div>
                </div>
              )}

              <div
                className="nav-icon-with-text support-link"
                onMouseEnter={() => {
                  if (supportTimeoutRef.current) clearTimeout(supportTimeoutRef.current);
                  setSupportDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  supportTimeoutRef.current = setTimeout(() => setSupportDropdownOpen(false), 200);
                }}
                style={{ position: 'relative', cursor: 'pointer', marginRight: '20px', color: textColor }}
              >
                <img src={SupportIcon} alt="Support Icon" className="icon-small" />
                <span>Support</span>
                <SupportDropdownMenu isOpen={supportDropdownOpen} onClose={() => setSupportDropdownOpen(false)} />
              </div>
            </div>

            <div
              className="nav-icon-only"
              title="Cart"
              onClick={() => navigate('/cart')}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <img src={CartIcon} alt="Cart" className="icon-cart" />
              {totalQuantity > 0 && <div className="cart-badge">{totalQuantity}</div>}
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
        categories={categories}
        user={user}
        userDropdownOpen={userDropdownOpen}
        setUserDropdownOpen={setUserDropdownOpen}
        setSignInOpen={setSignInOpen}
        handleSignOut={handleSignOut}
        handleCategoryHover={handleCategoryHover}
        closeUserDropdown={() => setUserDropdownOpen(false)}
      />

      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

export default NavbarWithMegaMenu;
