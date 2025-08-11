import React, { useRef,useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { CartProvider, useCart } from './contexts/CartContext';
import { CompareProvider } from './contexts/CompareContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookieConsentProvider } from './contexts/CookieConsentContext';

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
import New from './pages/New';
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
import DeliveryGuarantee from './pages/delivery-guarantee';
import PrivacyPolicy from './/pages/privacy-policy';
import Terms0fuse from './pages/TermsOfuse'
import OrderSuccess from './pages/OrderSuccess';
import trackOrder from './pages/track-order';
import Festsale from './pages/Festsale';
import CookiesSettings from './pages/CookiesSettingsPage';
import LostPassword from './pages/lost-password';
import MyCoins from './pages/my-coins';

// Components
import Topbar from './components/topbar';
import NavbarWithMegaMenu from './components/NavbarMain';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import MiniCart from './components/MiniCart';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/sub/Preloader';
import CheckoutNavbar from './components/checkout/CheckoutNavbar';
import MobileBottomNav from './components/MobileBottomNav';
import ProductDetailsRedirect from './pages/ProductDetailsRedirect';
import TrackOrder from './pages/track-order';
import MobileNavbar from './components/Mobile/MobileNavbar';
import ChatBot from './components/sub/Chatbot';

const AppContent = () => {
  const { isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();
  const path = location.pathname;
  // Removed loading state and related useEffect

  const isHomePage = path === '/';
  const isFestSalePage = path === '/fest-sale';
  const onCartPage = path.startsWith('/cart');
  const onCheckoutPage = path === '/checkout' || path.startsWith('/checkout/');
  const cartIconRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const [navbarColor, setNavbarColor] = useState('#0a5e07ff');
  const queryClient = new QueryClient();

  useEffect(() => {
    if (isHomePage) {
      setNavbarColor('#38A9D8');
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

  useEffect(() => {
    if (onCheckoutPage && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [onCheckoutPage, isCartOpen, setIsCartOpen]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <>
          {!isMobile && <Topbar />}
          {onCheckoutPage ? (
            <CheckoutNavbar />
          ) : isMobile ? (
            <MobileNavbar
              openCart={() => setIsCartOpen(true)}
              isCartOpen={isCartOpen}
              cartIconRef={cartIconRef}
            />
          ) : (
            <NavbarWithMegaMenu
              openCart={() => {
                if (!isMobile) setIsCartOpen(true);
              }}
              backgroundColor={navbarColor}
              isCartOpen={isCartOpen}
              cartIconRef={cartIconRef}
            />
          )}
          <div style={{ display: 'flex', position: 'relative' }}>
            <main
              style={{
                width:
                  !onCartPage && !onCheckoutPage && !is404Page && isCartOpen && !isMobile
                    ? 'calc(100% - 250px)'
                    : '100%',
                transition: 'width 0.3s ease',
                overflowX: 'hidden',
                background: '#fff',
              }}
            >
            {!isHomePage && !isFestSalePage && <Breadcrumbs />}

              <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/products" element={<ProductList />} /> */}
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
                <Route path="/new" element={<New />} />
                <Route path="/rated" element={<Rated />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/safetycenter" element={<SafetyCenter />} />
                <Route path="/purchaseprotection" element={<PurchaseProtection />} />
                <Route path="/partnerwithus" element={<PartnerWithUs />} />
                <Route path="/returnandrefundpolicy" element={<Returnandrefundpolicy />} />
                <Route path="/Intellectual-property-policy" element={<Intellectualproperty />} />
                <Route path="/shippinginfo" element={<Shippinginfo />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-0f-use" element={<Terms0fuse />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/fest-sale" element={<Festsale />} />
                <Route path="/cookies-settings" element={<CookiesSettings />} />
                 <Route path="/lost-password" element={<LostPassword />} />
                   <Route path="/my-coins" element={<MyCoins />} />


                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* MiniCart on public pages */}
            {!onCartPage && !onCheckoutPage && !is404Page && !isMobile && isCartOpen && (
              <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            )}
          </div>
<ChatBot/>
          <Footer />
          {isMobile && !onCartPage && !onCheckoutPage && !is404Page && <MobileBottomNav />}
        </>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default function App() {
  return (
    <CartProvider>
      <CompareProvider>
         <CookieConsentProvider> 
        <Router>
          <AppContent />
        </Router>
           </CookieConsentProvider> 
      </CompareProvider>
    </CartProvider>
  );
}
