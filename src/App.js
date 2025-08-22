// App.js
import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { CartProvider, useCart } from './contexts/CartContext';
import { CompareProvider } from './contexts/CompareContext';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './contexts/ThemeContext';

import Home from './pages/Home';
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
import SupportPage from './pages/Support';
import SafetyCenter from './pages/SafetyCenter';
import PurchaseProtection from './pages/PurchaseProtection';
import PartnerWithUs from './pages/partnerwithus';
import Returnandrefundpolicy from './pages/Returnandrefundpolicy';
import About from './pages/about';
import Shippinginfo from './pages/shippinginfo';
import Intellectualproperty from './pages/intellectual-property-policy';
import PrivacyPolicy from './pages/privacy-policy';
import Terms0fuse from './pages/TermsOfuse';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/track-order';
import Festsale from './pages/Festsale';
import CookiesSettings from './pages/CookiesSettingsPage';
import LostPassword from './pages/lost-password';
import MyCoins from './pages/my-coins';
import TopSellingitems from './pages/topselling';
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/contact';
import Search from './pages/search';

// Components
import Topbar from './components/topbar';
import NavbarWithMegaMenu from './components/NavbarMain';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import MiniCart from './components/MiniCart';
import ProtectedRoute from './components/ProtectedRoute';
import CheckoutNavbar from './components/checkout/CheckoutNavbar';
import MobileBottomNav from './components/MobileBottomNav';
import MobileNavbar from './components/Mobile/MobileNavbar';
import ChatBot from './components/sub/Chatbot';
import { useNetworkSpeed } from './hooks/useNetworkSpeed';
import { ToastContainer } from 'react-toastify';
import CookiePopup from './components/common/CookiePopup';


const AppContent = () => {

  const { isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();
  const path = location.pathname;
  const cartIconRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update mobile flag on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Paths where MiniCart should NOT appear
  const excludeMiniCartPaths = [
    '/cart',
    '/checkout',
    '/lost-password',
    '/order-success',
  ];

  const shouldShowMiniCart =
    !isMobile &&
    isCartOpen &&
    !excludeMiniCartPaths.some(
      (excludedPath) => path === excludedPath || path.startsWith(`${excludedPath}/`)
    );

  const isHomePage = path === '/';
  const isFestSalePage = path === '/fest-sale';
  const onCheckoutPage = path === '/checkout' || path.startsWith('/checkout/');

  const queryClient = new QueryClient();

  // Close cart if navigating to excluded paths
  useEffect(() => {
    if (
      excludeMiniCartPaths.some(
        (excludedPath) => path === excludedPath || path.startsWith(`${excludedPath}/`)
      ) &&
      isCartOpen
    ) {
      setIsCartOpen(false);
    }
  }, [path, excludeMiniCartPaths, isCartOpen, setIsCartOpen]);

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId="HwYK8fUGicIEYk3RV16SVyvWJN9sctAJoxFhnTsT">
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
                  isCartOpen={isCartOpen}
                  cartIconRef={cartIconRef}
                />
              )}

              <div style={{ display: 'flex', position: 'relative' }}>
                <main
                  style={{
                    width: shouldShowMiniCart ? 'calc(100% - 250px)' : '100%',
                    transition: 'width 0.3s ease',
                    overflowX: 'hidden',
                    background: '#fff',
                  }}
                >
                  {!isHomePage && !isFestSalePage && <Breadcrumbs />}

                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:slug" element={<ProductDetails />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    <Route
                      path="/myaccount/*"
                      element={
                        <ProtectedRoute>
                          <Myaccount />
                        </ProtectedRoute>
                      }
                    />

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
                    <Route path="/top-selling-item" element={<TopSellingitems />} />
                    <Route path="/categorypage/:id" element={<CategoryPage />} />
                    <Route path="*" element={<NotFound />} />
                          <Route path="contact" element={<Contact />} />
                                <Route path="search" element={<Search />} />
                  </Routes>
                </main>

                {shouldShowMiniCart && (
                  <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                )}
              </div>
           <CookiePopup/>
              <ChatBot />
              {/* <ToastContainer /> */}
              <Footer />
              {isMobile &&
                !excludeMiniCartPaths.includes(path) && (
                  <MobileBottomNav />
                )}
            </>
          </AuthProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
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
