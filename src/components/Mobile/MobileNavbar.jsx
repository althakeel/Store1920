import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useClickAway } from 'react-use';
import { useAuth } from '../../contexts/AuthContext';
import HeaderSlider from './HeaderSlider';
import LogoIcon from '../../assets/images/logomobile.png';
import CartIcon from '../../assets/images/addtocart.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';
import Logo1 from '../../assets/images/Logo/p1@6x.png';
import Logo2 from '../../assets/images/Logo/w1@6x.png';

const MAX_SUGGESTIONS = 10;
const truncateText = (text, maxLength = 35) =>
  text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;

const MobileNavbar = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState('auto');

  const [logoIndex, setLogoIndex] = useState(() => Number(localStorage.getItem('navbarLogoIndex') || 0));
  const [bgColor, setBgColor] = useState(logoIndex === 0 ? '#fff3' : '#ffffffff');
  const [iconColor, setIconColor] = useState(logoIndex === 0 ? '#333' : '#000000ff');

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  // ---------------- Fetch categories & products ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('https://db.store1920.com/wp-json/wc/v3/products/categories', { params: { per_page: 50, parent: 0 } }),
          axios.get('https://db.store1920.com/wp-json/wc/v3/products', { params: { per_page: 50 } }),
        ]);

        const categories = catRes.data.map(c => ({ id: c.id, name: c.name, slug: c.slug, type: 'category' }));
        const products = prodRes.data.map(p => ({ id: p.id, name: p.name, slug: p.slug, type: 'product' }));

        const combined = [...categories, ...products];
        setItems(combined);
        setSuggestions(combined.slice(0, MAX_SUGGESTIONS));
      } catch (err) {
        console.error('Failed to fetch categories/products:', err);
      }
    };
    fetchData();
  }, []);

  // ---------------- Hide dropdown when clicking outside ----------------
  useClickAway(containerRef, () => setDropdownVisible(false));

  // ---------------- Update dropdown width ----------------
  useEffect(() => {
    if (dropdownVisible && inputRef.current) {
      setDropdownWidth(inputRef.current.offsetWidth);
    }
  }, [dropdownVisible]);

  // ---------------- Debounced search & suggestions ----------------
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSuggestions(items.slice(0, MAX_SUGGESTIONS));
        return;
      }
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('https://db.store1920.com/wp-json/wc/v3/products/categories', { params: { search: searchTerm, per_page: 50 } }),
          axios.get('https://db.store1920.com/wp-json/wc/v3/products', { params: { search: searchTerm, per_page: 50 } }),
        ]);

        let categories = catRes.data.map(c => ({ id: c.id, name: c.name, slug: c.slug, type: 'category' }));
        let products = prodRes.data.map(p => ({ id: p.id, name: p.name, slug: p.slug, type: 'product' }));

        const lower = searchTerm.toLowerCase();
        categories = categories.filter(c => c.name.toLowerCase().includes(lower) || c.slug.toLowerCase().includes(lower) || String(c.id) === searchTerm);
        products = products.filter(p => p.name.toLowerCase().includes(lower) || p.slug.toLowerCase().includes(lower) || String(p.id) === searchTerm);

        setSuggestions([...categories, ...products].slice(0, MAX_SUGGESTIONS));
      } catch (err) {
        console.error('Search failed:', err);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm, items]);

  const goToProduct = (slug = null, customLabel = '') => {
    const finalSearch = customLabel || searchTerm;
    if (slug) {
      navigate(`/product/${slug}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(finalSearch)}`);
    }
  };

  const handleSelect = item => {
    setDropdownVisible(false);
    if (item.type === 'category') {
      goToProduct(null, item.slug);
    } else {
      goToProduct(item.slug);
    }
  };

  // ---------------- Automatic Logo & Icon Color Cycling ----------------
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndex(prev => {
        const next = (prev + 1) % 2;
        setBgColor(next === 0 ? '#fff3' : '#ffffffff');
        setIconColor(next === 0 ? '#333' : '#000000ff');
        localStorage.setItem('navbarLogoIndex', next);
        return next;
      });
    }, 30000); // change every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ---------------- Optional manual trigger on search enter ----------------
  const handleNavbarClose = () => {
    setDropdownVisible(false);
    setTimeout(() => {
      setLogoIndex(prev => {
        const next = (prev + 1) % 2;
        setBgColor(next === 0 ? '#fff3' : '#ffffffff');
        setIconColor(next === 0 ? '#333' : '#000000ff');
        localStorage.setItem('navbarLogoIndex', next);
        return next;
      });
    }, 3000);
  };

  return (
    <>
      <nav
        aria-label="Mobile navigation bar"
   style={{
    position: 'relative', // changed from sticky
    top: 0,
    zIndex: 1000,
    backgroundColor: bgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',

    gap: 8,
    width: '100%',
    boxSizing: 'border-box',
    height: 56,
    willChange: 'top',
    transform: 'translateZ(0)',
    userSelect: 'none',
  }}
      >
        {/* Logo */}
        <button aria-label="Go to homepage" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flex: '0 0 auto' }}>
          <img src={logoIndex === 0 ? Logo1 : Logo1} alt="Logo" style={{ width: 80, userSelect: 'none', display: 'block' }} draggable={false} />
        </button>

        {/* Search */}
        <div ref={containerRef} style={{ background: '#f5f5f5', borderRadius: 20, display: 'flex', alignItems: 'center', flex: 1, padding: '4px 8px', minWidth: 0, overflow: 'hidden', position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, brands..."
            aria-label="Search products"
            autoComplete="off"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setDropdownVisible(true); }}
            onFocus={() => setDropdownVisible(true)}
            onKeyDown={e => { 
              if (e.key === 'Enter') { 
                e.preventDefault(); 
                handleNavbarClose(); 
                navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`); 
              } 
            }}
            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 13, minWidth: 0 }}
            spellCheck={false}
          />
          {searchTerm && (
            <div onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 30, cursor: 'pointer', fontSize: 20, color: '#999' }}>×</div>
          )}
          <div style={{ width: 18, marginLeft: 6, flexShrink: 0, cursor: 'pointer' }} onClick={() => { handleNavbarClose(); navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`); }}>
            <FaSearch style={{ color: "#9E1DAB", width: '100%' }} aria-hidden="true" />
          </div>
        </div>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, position: 'relative' }}>
          <button type="button" aria-label="View cart" onClick={() => navigate('/cart')} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'none', border: 'none', padding: 0, position: 'relative' }}>
            {/* <img src={CartIcon} alt="Cart" style={{ maxWidth: 20, userSelect: 'none' }} draggable={false} /> */}
            <FaShoppingCart color={iconColor} size={20} />
            {totalQuantity > 0 && <span aria-label={`${totalQuantity} items in cart`} style={{ position: 'absolute', top: 0, right: -6, backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 0', fontSize: 10, fontWeight: 'bold', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', minWidth: 18, textAlign: 'center' }}>{totalQuantity}</span>}
          </button>

          <button type="button" aria-label="Open categories menu" onClick={() => navigate('/category')} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>
            <FaBars color={iconColor} size={20} />
          </button>
        </div>
      </nav>

      {/* Categories Slider */}
      {/* <HeaderSlider /> */}
    </>
  );
};

export default MobileNavbar;
