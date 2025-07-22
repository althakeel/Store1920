import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { CartProvider, useCart } from './contexts/CartContext';
import { CompareProvider } from './contexts/CompareContext';
import { AuthProvider } from './contexts/AuthContext';
// import { SignOutModalProvider } from './contexts/SignOutModalProvider';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/checkout';
import NotFound from './pages/NotFound';
import Myaccount from './pages/myaccount';
import Wishlist from './pages/Whislist';
import Lightningdeal from './pages/lightningdeal';
import ComparePage from './pages/compare';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';
import AllProducts from './pages/allproducts';
import Bestrated from './pages/bestrated';
import Rated from './pages/rated';
import TestRegister from './pages/Testregister';
import SupportPage from './pages/Support';
import SafetyCenter from './pages/SafetyCenter';
import PurchaseProtection from './pages/PurchaseProtection';
import PartnerWithUs from './pages/partnerwithus';
import Returnandrefundpolicy from './pages/Returnandrefundpolicy';
import About from './pages/about';
import Shippinginfo from './pages/shippinginfo';
import Intellectualproperty from './pages/intellectual-property-policy';

// Components
import Topbar from './components/topbar';
import NavbarWithMegaMenu from './components/NavbarMain';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import MiniCart from './components/MiniCart';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();
  const path = location.pathname;

  const isHomePage = path === '/';
  const onCartPage = path.startsWith('/cart');
const onCheckoutPage = /^\/checkout(\/|$)/.test(path);



  const knownPaths = [
    '/',
    '/products',
    '/product',
    '/cart',
    '/checkout',
    '/myaccount',
    '/wishlist',
    '/lightningdeal',
    '/compare',
    '/categories',
    '/category',
    '/allproducts',
    '/bestrated',
    '/rated',
  ];

  const is404Page = !knownPaths.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  const [navbarColor, setNavbarColor] = useState('#0aa6ee');

  useEffect(() => {
    if (isHomePage) {
      setNavbarColor('#0aa6ee');
      sessionStorage.removeItem('navbarColor');
    } else {
      const storedColor = sessionStorage.getItem('navbarColor');
      if (storedColor) {
        setNavbarColor(storedColor);
      } else {
        const colors = ['#0aa6ee', '#ff7402', '#0d8a14', '#26a69a', '#ff9800', '#000000ff'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sessionStorage.setItem('navbarColor', randomColor);
        setNavbarColor(randomColor);
      }
    }
  }, [isHomePage]);

  useEffect(() => {
    if ((onCartPage || onCheckoutPage || is404Page) && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [onCartPage, onCheckoutPage, is404Page, isCartOpen, setIsCartOpen]);

  return (
    // <SignOutModalProvider>
    <AuthProvider>
      <Topbar />
      <NavbarWithMegaMenu
  openCart={() => setIsCartOpen(true)}
  backgroundColor={navbarColor}
  isCartOpen={isCartOpen}  // <-- pass this prop here
/>
      <div style={{ display: 'flex', position: 'relative' }}>
        <main
          style={{
            width:
              !onCartPage && !onCheckoutPage && !is404Page && isCartOpen
                ? 'calc(100% - 250px)'
                : '100%',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            background: '#fff',
          }}
        >
          {!isHomePage && <Breadcrumbs />}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/myaccount/*"
              element={
                <ProtectedRoute>
                  <Myaccount />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/lightningdeal" element={<Lightningdeal />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryProducts />} />
            <Route path="/allproducts" element={<AllProducts />} />
            <Route path="/bestrated" element={<Bestrated />} />
            <Route path="/rated" element={<Rated />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/safetycenter" element={<SafetyCenter />} />
            <Route path="/purchaseprotection" element={<PurchaseProtection />} />
            <Route path="/partnerwithus" element={<PartnerWithUs />} />
            <Route path="/returnandrefundpolicy" element={<Returnandrefundpolicy />} />
            <Route path="/Intellectual-property-policy" element={<Intellectualproperty />} />
            <Route path="/shippinginfo" element={<Shippinginfo />} />
            <Route path="/about" element={<About />} />
            <Route path="/testregister" element={<TestRegister />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* MiniCart on public pages */}
        {!onCartPage && !onCheckoutPage && !is404Page && (
         <MiniCart
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  navbarColor={navbarColor}
/>
        )}
      </div>

      <Footer />
    </AuthProvider>
    // </SignOutModalProvider>
  );
};

export default function App() {
  return (
    <CartProvider>
      <CompareProvider>
        <Router>
          <AppContent />
        </Router>
      </CompareProvider>
    </CartProvider>
  );
}
