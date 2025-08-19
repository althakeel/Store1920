import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { useClickAway } from 'react-use';
import { useAuth } from '../../contexts/AuthContext';
import SignInModal from '../../components/sub/SignInModal';
import HeaderSlider from './HeaderSlider';
import LogoIcon from '../../assets/images/logomobile.png';
import CartIcon from '../../assets/images/addtocart.png';
import UserIcon from '../../assets/images/Account.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';

const MAX_SUGGESTIONS = 10;

const truncateText = (text, maxLength = 35) =>
  text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;

const MobileNavbar = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // States
  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState('auto');

  // Refs
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Calculate total quantity in cart
  const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  // Fetch categories and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, prodResponse] = await Promise.all([
          axios.get('https://db.store1920.com/wp-json/wc/v3/products/categories', {
            params: { per_page: 50, parent: 0 },
          }),
          axios.get('https://db.store1920.com/wp-json/wc/v3/products', {
            params: { per_page: 50 },
          }),
        ]);

        const categories = catResponse.data.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          type: 'category',
        }));

        const products = prodResponse.data.map(prod => ({
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          type: 'product',
        }));

        const combinedItems = [...categories, ...products];
        setItems(combinedItems);
        setSuggestions(combinedItems.slice(0, MAX_SUGGESTIONS));
      } catch (error) {
        console.error('Failed to fetch categories/products:', error);
      }
    };

    fetchData();
  }, []);

  // Hide dropdown when clicking outside
  useClickAway(containerRef, () => setDropdownVisible(false));

  // Update dropdown width when visible
  useEffect(() => {
    if (dropdownVisible && inputRef.current) {
      setDropdownWidth(inputRef.current.offsetWidth);
    }
  }, [dropdownVisible]);

  // Filter suggestions based on search term
// Debounce search requests
useEffect(() => {
  const delayDebounce = setTimeout(async () => {
    if (!searchTerm.trim()) {
      setSuggestions(items.slice(0, MAX_SUGGESTIONS));
      return;
    }

    try {
      const [catRes, prodRes] = await Promise.all([
        axios.get("https://db.store1920.com/wp-json/wc/v3/products/categories", {
          params: { search: searchTerm, per_page: 10 },
        }),
        axios.get("https://db.store1920.com/wp-json/wc/v3/products", {
          params: { search: searchTerm, per_page: 10 },
        }),
      ]);

      const categories = catRes.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        type: "category",
      }));

      const products = prodRes.data.map(prod => ({
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        type: "product",
      }));

      setSuggestions([...categories, ...products].slice(0, MAX_SUGGESTIONS));
    } catch (err) {
      console.error("Search failed:", err);
    }
  }, 400); // ⏳ debounce (400ms)

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);


  // Handle selecting an item from dropdown
  const handleSelect = (item) => {
    setDropdownVisible(false);
    if (item.type === 'category') {
      navigate(`/categories/${item.slug}`);
    } else {
      navigate(`/products/${item.slug}`);
    }
  };

  return (
    <>
      <nav
        aria-label="Mobile navigation bar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid #eee',
          gap: 8,
          width: '100%',
          boxSizing: 'border-box',
          height: 56,
          willChange: 'top',
          transform: 'translateZ(0)',
          userSelect: 'none',
        }}
      >
        {/* Logo Button */}
        <button
          aria-label="Go to homepage"
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            flex: '0 0 auto',
          }}
        >
          <img
            src={LogoIcon}
            alt="Logo"
            style={{ width: 90, userSelect: 'none', display: 'block' }}
            draggable={false}
          />
        </button>

        {/* Search Input & Dropdown */}
    <div
  style={{
    background: '#f5f5f5',
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '4px 8px',
    minWidth: 0,           // <-- Allows shrinking inside flex container
    overflow: 'hidden',    // <-- Prevents content from spilling
  }}
>
  <input
    ref={inputRef}
    type="text"
    placeholder="Search products, brands..."
    aria-label="Search products"
    autoComplete="off"
    value={searchTerm}
    onChange={e => {
      setSearchTerm(e.target.value);
      setDropdownVisible(true);
    }}
    onFocus={() => setDropdownVisible(true)}
    style={{
      border: 'none',
      outline: 'none',
      background: 'transparent',
      flex: 1,
      fontSize: 13,
      minWidth: 0,         // <-- Crucial to allow shrinking in small screens
    }}
    spellCheck={false}
  />
  <div style={{ width: 18, marginLeft: 6, flexShrink: 0 }}>
    <FaSearch style={{ color: '#064789', width: '100%' }} aria-hidden="true" />
  </div>



          {dropdownVisible && suggestions.length > 0 && (
            <div
              role="listbox"
              aria-label="Search suggestions"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: dropdownWidth,
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1001,
                padding: 8,
                borderRadius: 6,
                maxHeight: 240,
                overflowY: 'auto',
                userSelect: 'none',
              }}
            >
              {suggestions.map(item => (
                <div
                  key={`${item.type}-${item.id}`}
                  role="option"
                  tabIndex={0}
                  title={`${item.name} (${item.type})`}
                  onClick={() => handleSelect(item)}
                  onKeyPress={e => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelect(item);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    fontSize: 14,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {truncateText(item.name)}{' '}
                  <small style={{ color: '#666' }}>({item.type})</small>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Icons Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {/* Cart Button */}
          <button
            type="button"
            aria-label="View cart"
            onClick={() => navigate('/cart')}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              position: 'relative',
            }}
          >
            <img src={CartIcon} alt="Cart" style={{ maxWidth: 20, userSelect: 'none' }} draggable={false} />
            {totalQuantity > 0 && (
              <span
                aria-label={`${totalQuantity} items in cart`}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -6,
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 0',
                  fontSize: 10,
                  fontWeight: 'bold',
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  minWidth: 18,
                  textAlign: 'center',
                }}
              >
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Categories/Menu Button */}
          <button
            type="button"
            aria-label="Open categories menu"
            onClick={() => navigate('/categories')}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            <FaBars color="#333" size={20} />
          </button>

          {/* User Section */}
          {user ? (
            <div
              className="user-icon-wrapper"
              aria-label={`Logged in as ${user.name}`}
              title={`Logged in as ${user.name}`}
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {/* <img
                src={UserIcon}
                alt="User Icon"
                style={{
                  width: 24,
                  height: 24,
                  objectFit: 'contain',
                  borderRadius: '50%',
                  border: '1px solid #ccc',
                  userSelect: 'none',
                }}
                draggable={false}
              /> */}
              <div
                style={{
                  backgroundColor: '#1b1b1fff',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 12,
                  userSelect: 'none',
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          ) : (
            <SignInModal
              trigger={
                <button
                  type="button"
                  aria-label="Login"
                  style={{
                    fontSize: 14,
                    color: '#333',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    userSelect: 'none',
                  }}
                >
                  Login
                </button>
              }
            />
          )}
        </div>
      </nav>

      {/* Categories Slider */}
      <HeaderSlider />
    </>
  );
};

export default MobileNavbar;
