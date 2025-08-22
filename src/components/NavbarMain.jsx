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
import { useTheme } from '../contexts/ThemeContext'; 
import LogoMain from '../assets/images/Logo/3.webp'

import Dirham from '../assets/images/language/aed (1).png'
import Dollor from '../assets/images/language/dollor.png'
import aeFlag from '../assets/images/language/aed (3).png'

import '../assets/styles/Navbar.css';

// Icons
import Newicon from '../assets/images/webicons/Header/White/Asset 34@6x.png';
import Star from '../assets/images/webicons/Header/White/Asset 33@6x.png';
import SupportIcon from '../assets/images/webicons/Header/White/Asset 32@6x.png';
import CartIcon from '../assets/images/webicons/Header/White/Asset 30@6x.png';
import UserIcon from '../assets/images/webicons/Header/White/Asset 21@6x.png';

// Import the external mega menu component
import MegaMenu from '../components/sub/megamenu';

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
  const { currentTheme } = useTheme(); // get theme from ThemeContext
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

  const [language, setLanguage] = useState('en'); // default language
  const [currency, setCurrency] = useState('AED'); // default currency
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const { isCartOpen, cartItems } = useCart();
  const navigate = useNavigate();

  const timeoutRef = useRef(null);
  const supportTimeoutRef = useRef(null);
  const userTimeoutRef = useRef(null);
  const langTimeoutRef = useRef(null);

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
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/products/categories?per_page=100&hide_empty=false`,
          { auth: { username: CK, password: CS } }
        );
  
        const allCats = res.data.map((cat) => ({
          ...cat,
          id: Number(cat.id),
          parent: parseInt(cat.parent) || 0,
        }));
  
        const mainCats = allCats.filter((cat) => cat.parent === 0);
  
        const structuredCats = mainCats.map((parent) => ({
          ...parent,
          subCategories: allCats.filter((c) => c.parent === parent.id),
        }));
  
        setCategories(structuredCats);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
  
    fetchCategories();
  }, []);
  

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
    let mappedUser;
    
    if (userData.uid) {
      mappedUser = {
        id: userData.uid,
        name: userData.displayName || (userData.email ? userData.email.split('@')[0] : 'User'),
        email: userData.email || '',
        image: userData.photoURL || null,
      };
    } else {
      mappedUser = {
        id: userData.id || userData.user?.id,
        name: userData.name || 'User',
        email: userData.user?.email || userData.email || '',
        image: userData.image || null,
      };
    }
  
    setUser(mappedUser);
    localStorage.setItem('user', JSON.stringify(mappedUser));
    setSignInOpen(false);
  };
  

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  // Get navbar background and logo from current theme
  const backgroundColor = currentTheme?.navbarBg || '#CCA000';
  const sitelogo = currentTheme?.logo || LogoMain;
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
                navigate('/');
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
              <div className="nav-icon-with-text star-rating" onClick={() => navigate('/top-selling-item')}>
                <img src={Star} alt="5 Star rated" className="icon-star" />
                <span>Top Selling Items</span>
              </div>
              <div className="nav-icon-with-text" onClick={() => navigate('/new')}>
                <img src={Newicon} alt="New" className="icon-small" />
                <span>New</span>
              </div>
              <div className="nav-icon-with-text star-rating" onClick={() => navigate('/rated')}>
                <img src={Star} alt="5 Star rated" className="icon-star" />
                <span>5-Star Rated</span>
              </div>
<div
  className="categories-dropdown"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
  <span>Categories&nbsp;▾</span>
</div>
{hovering && (
  <div
    className="mega-dropdown-card"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <MegaMenu categories={categories} />
  </div>
)}





            </div>

            <div className="nav-center">
              <SearchBar />
            </div>

            {/* Right side: user, support, language, cart */}
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
                  <div className="account-text" style={{ color: textColor }}>
                    <span className="account-title">Sign In / Register</span>
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
                style={{ position: 'relative', cursor: 'pointer', color: textColor }}
              >
                <img src={SupportIcon} alt="Support Icon" className="icon-small" />
                <span>Support</span>
                <SupportDropdownMenu isOpen={supportDropdownOpen} onClose={() => setSupportDropdownOpen(false)} />
              </div>

              {/* Language Dropdown */}
              <div
                className="nav-icon-with-text language-dropdown"
                onMouseEnter={() => {
                  if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
                  setLangDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  langTimeoutRef.current = setTimeout(() => setLangDropdownOpen(false), 200);
                }}
                style={{ position: 'relative', cursor: 'pointer', marginRight: '20px', color: textColor }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={language === 'en' ? aeFlag : aeFlag}
                    alt={language === 'en' ? 'English' : 'العربية'}
                    className="lang-icon"
                    style={{ marginRight: '5px', width: '20px', height: '20px' }}
                  />
                  {language === 'en' ? 'English' : 'العربية'} ▾
                </span>

                {langDropdownOpen && (
                  <div className="lang-dropdown-card">
                    <div className="dropdown-arrow-up" /> {/* Arrow pointing to parent */}

                    {/* Language Section */}
                    <div className="dropdown-section">
                      <div className="dropdown-title">Language</div>
                      <label className="radio-item">
                        <input
                          type="radio"
                          checked={language === 'ar'}
                          onChange={() => setLanguage('ar')}
                        />
                        العربية
                      </label>
                      <label className="radio-item">
                        <input
                          type="radio"
                          checked={language === 'en'}
                          onChange={() => setLanguage('en')}
                        />
                        English
                      </label>
                    </div>

                    <hr />

                    {/* Currency Section */}
                    <div className="dropdown-section">
                      <div className="currency-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>Currency:</span>
                        <img 
                          src={currency === 'AED' ? Dirham : Dollor} 
                          alt={currency} 
                          style={{ width: '14px', height: '12px' }}
                        />
                        <span>{currency}</span>
                      </div>
                    </div>

                    <hr />

                    {/* Country Info */}
                    <div className="dropdown-footer">
                      <img src={aeFlag} alt="UAE" className="footer-flag" />
                      <span
                        style={{
                          maxWidth: "250px",
                          display: "inline-block",
                          whiteSpace: "normal",
                          lineHeight: "1.4",
                        }}
                      >
                        You are shopping in United Arab Emirates.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
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
