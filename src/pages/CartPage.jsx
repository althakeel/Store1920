import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import CartMessages from '../components/sub/CartMessages';
import ProductsUnder20AED from '../components/ProductsUnder20AED';
import '../assets/styles/cart.css';

export default function CartPage() {
  const { cartItems } = useCart();
  const [discount, setDiscount] = useState(0);
  const [sidebarTop, setSidebarTop] = useState(20); // top spacing

  useEffect(() => {
    const handleResize = () => {
      // dynamically calculate top if needed (header height etc.)
      const headerHeight = 20; // adjust if you have a header
      setSidebarTop(headerHeight + 20);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = Math.max(subtotal - discount, 0);

  return (
    <div className="cartPageWrapper">
      <div className="cartGrid">
        <section className="cartLeft">
          <CartMessages />
          <h2>Shopping Cart</h2>

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => <CartItem key={item.id} item={item} />)
          )}

          <ProductsUnder20AED />
        </section>

        <aside className="cartRightWrapper">
  <div
    className="cartRight"
    style={{ top: `${sidebarTop}px` }}
  >
    <OrderSummary
      subtotal={subtotal}
      discount={discount}
      total={total}
      onCheckout={() => (window.location.href = '/checkout')}
    />
  </div>
</aside>
      </div>
    </div>
  );
}
