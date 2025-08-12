import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SearchBar from './sub/SearchBar';
import '../assets/styles/Navbar.css';
import SignInModal from './sub/SignInModal';
import { useCart } from '../contexts/CartContext';
import UserDropdownMenu from './UserDropdownMenu';
import MobileMenu from './sub/MobileMenu';
import SupportDropdownMenu from './sub/SupportDropdownMenu';
import CoinWidget from './CoinWidget';
import chroma from 'chroma-js';
import MiniCart from './MiniCart';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v1';
const CK = 'ck_2e4ba96dde422ed59388a09a139cfee591d98263';
const CS = 'cs_43b449072b8d7d63345af1b027f2c8026fd15428';
const WP_LOGO_API = 'https://db.store1920.com/wp-json/custom/v1/logo';


const decodeHtml = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const NavbarWithMegaMenu = ({cartIconRef , openCart, backgroundColor = '#fff' }) => {
    const isDark = chroma(backgroundColor).luminance() < 0.5;
  const textColor = isDark ? '#fff' : '#000';
  const [sitelogo, setSitelogo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [hovering, setHovering] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
 const { isCartOpen, setIsCartOpen, cartItems } = useCart();
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const supportTimeoutRef = useRef(null); // 👈 Add this line
  const loggedInUserId = user?.id || null;
     const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const totalQuantity = cartItems?.reduce(
  (acc, item) => acc + (Number(item.quantity) || 0),
  0
) || 0;


  const userTimeoutRef = useRef(null); // ✅ Add this line

  const { addToCart } = useCart();

  const handleAddToCart = (product, quantity = 1) => {
  if (!user) {
    setSignInOpen(true); // show login modal if not logged in
    return false; // or return to stop further processing
  }
  addToCart(product, quantity); // proceed if logged in
  return true;
};


// console.log('Navbar user.id:', user?.id);

const truncateName = (name, maxLength = 10) => {
  if (!name) return '';
  return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  
};
const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
useEffect(() => {
  if (user) {
    // console.log('Current user:', user);
    // console.log('User ID passed to CoinWidget:', user.id);
  }
}, [user]);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(() => {
  console.log('Full user object:', user);
  console.log('user.id:', user?.id);
  console.log('user.userId:', user?.userId);
}, [user]);


  useEffect(() => {
    axios.get(WP_LOGO_API)
      .then(res => setSitelogo(res.data.logo_url))
      .catch(() => setSitelogo(null));

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
    // console.log("......................");
    console.log(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setSignInOpen(false);
  };


  const closeUserDropdown = () => setUserDropdownOpen(false);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    closeUserDropdown();
    setMobileMenuOpen(false);
    window.location.href = '/'; // Redirect home after sign out
  };

  return (
    <>
    <nav
  className="navbar"
  style={{
     width: isMobile ? '100%' : (isCartOpen ? 'calc(100% - 250px)' : '100%'),
    transition: 'width 0.3s ease',
    backgroundColor: backgroundColor || '#FF6C01',
    color: textColor,
  }}
>
        <div className="navbar-inner">
          <div className="nav-left">
           { sitelogo ? (
  <img
    src='https://db.store1920.com/wp-content/uploads/2025/07/cropped-1.webp'
    alt="Store1920"
    className="logo"
    style={{ maxHeight: 55, cursor: 'pointer' }}
    onClick={() => {
      closeMobileMenu();
      window.location.href = '/';
    }}
  />
) : (
  <div className="logo" onClick={closeMobileMenu} style={{ color: textColor }}>
 <img
    src='https://db.store1920.com/wp-content/uploads/2025/07/cropped-1.webp'
    alt="Store1920"
    className="logo"
    style={{ maxHeight: 35, cursor: 'pointer' }}
    onClick={() => {
      closeMobileMenu();
      window.location.href = '/';
    }}
  />
  </div>
)}

          </div>
          <div>
                 <div className="nav-center-mobile">
              <SearchBar />
            </div>

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
              <div className="nav-icon-with-text"  onClick={() => window.location.href = '/new'}>
                <img
                  src="https://db.store1920.com/wp-content/uploads/2025/07/7.png"
                  alt="New"
                  className="icon-small"
                />
                <span>New</span>
              </div>

              <div className="nav-icon-with-text star-rating" onClick={() => window.location.href = '/rated'}>
                <img
                  src="https://db.store1920.com/wp-content/uploads/2025/07/6.png"
                  alt="5 Star rated"
                  className="icon-star"
                />
                <span>5-Star Rated</span>
              </div>

              <div
                className="dropdown-container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="dropdown-trigger">Categories ▾</div>
                {hovering && (
                  <div className="mega-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className="mega-left">
                      {categories.map((cat) => (
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
                      {products.length > 0 ? products.map((product) => (
                        <a
                          key={product.id}
                          href={product.permalink}
                          className="mega-product"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="circle-img">
                            <img src={product.images[0]?.src || ''} alt={product.name} />
                          </div>
                          <div className="price">{product.price} AED</div>
                        </a>
                      )) : (
                        <div className="no-products">No products found</div>
                      )}
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
    userTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 200);
  }}
   style={{ position: 'relative' }} 
  >
    <div className="avatar">
    {user.image ? (
      <img src={user.image} alt={user.name} />
    ) : (
      <div className="avatar-fallback">
        {user.name.charAt(0).toUpperCase()}
      </div>
    )}
  </div>
<div className="user-name">
  Hi, {capitalizeFirst(truncateName(user.name))}{' '}
  {/* {user.id} */}
  <CoinWidget userId={Number(user.id)} />
</div>



<UserDropdownMenu
  user={user}
  setUser={setUser} // ✅ pass the function as a prop
  isOpen={userDropdownOpen}
  onSignOut={handleSignOut}
  onClose={() => setUserDropdownOpen(false)}
  setUserDropdownOpen={setUserDropdownOpen}
  setMobileMenuOpen={setMobileMenuOpen}
/>
</div>
) : (
    <div className="account guest-account" onClick={() => setSignInOpen(true)}>
      <img
        src="https://db.store1920.com/wp-content/uploads/2025/07/2-2.png"
        alt="Profile Icon"
        className="icon-small"
      />
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
    supportTimeoutRef.current = setTimeout(() => {
      setSupportDropdownOpen(false);
    }, 200);
  }}
  style={{ position: 'relative', cursor: 'pointer', marginRight: '20px', color: textColor  }}
>
  <img
    src="https://db.store1920.com/wp-content/uploads/2025/07/3-2.png"
    alt="Support Icon"
    className="icon-small"
  />
  <span>Support</span>

  <SupportDropdownMenu
    isOpen={supportDropdownOpen}
    onClose={() => setSupportDropdownOpen(false)}
  />
</div>

  
  </div>

<div
  className="nav-icon-only"
  title="Cart"
  onClick={() => navigate('/cart')}
  style={{ cursor: 'pointer', position: 'relative' }}
>
  <img
    src="https://db.store1920.com/wp-content/uploads/2025/07/1-3.png"
    alt="Cart"
    className="icon-cart"
  />
  {totalQuantity > 0 && (
    <div className="cart-badge">{totalQuantity}</div>
  )}
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
  closeUserDropdown={closeUserDropdown}
/>
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onLogin={handleLogin}
      />
{/* <MiniCart openSignInModal={() => setSignInOpen(true)} /> */}
      
    </>
  );
};

export default NavbarWithMegaMenu;
