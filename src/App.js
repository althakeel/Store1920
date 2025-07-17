import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './contexts/CartContext';
import { CompareProvider } from './contexts/CompareContext';

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

// Components
import Topbar from './components/topbar';
import Navbar from './components/NavbarMain';
import Footer from './components/Footer';
import Breadcrumbs from './components/Breadcrumbs';
import MiniCart from './components/MiniCart';
// import FeedbackWidget from './components/FeedbackWidget'; // Uncomment if needed

function AppContent() {
  const { isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();

  const path = location.pathname;

  const onCartPage = path.startsWith('/cart');
  const onCheckoutPage = path.startsWith('/checkout');

const knownPaths = [
  '/',
  '/products',
  '/product',
  '/cart',
  '/checkout',
  '/customerprofile',
  '/wishlist',
  '/lightningdeal',
  '/compare',
  '/categories',
  '/category',
  '/allproducts', // ADD THIS LINE
];
  const is404Page = !knownPaths.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Auto-close MiniCart on specific pages
  useEffect(() => {
    if ((onCartPage || onCheckoutPage || is404Page) && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [onCartPage, onCheckoutPage, is404Page, isCartOpen, setIsCartOpen]);

  return (
    <>
      <Topbar />
      <Navbar openCart={() => setIsCartOpen(true)} />

      <div style={{ display: 'flex', position: 'relative' }}>
        <main
          style={{
            width:
              !onCartPage && !onCheckoutPage && !is404Page && isCartOpen
                ? 'calc(100% - 250px)'
                : '100%',
            transition: 'width 0.3s ease',
            // minHeight: '100vh',
            overflowX: 'hidden',
            background: '#fff',
          }}
        >
          {/* Show breadcrumbs on all pages except home */}
          {path !== '/' && <Breadcrumbs />}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
           <Route path="/myaccount/*" element={<Myaccount />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/lightningdeal" element={<Lightningdeal />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryProducts />} />
               <Route path="/allproducts" element={<AllProducts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* MiniCart Sidebar */}
        {!onCartPage && !onCheckoutPage && !is404Page && (
          <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        )}
      </div>

      {/* <FeedbackWidget /> Uncomment if needed */}
      <Footer />
    </>
  );
}

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
