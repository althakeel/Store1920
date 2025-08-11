// PATH: src/pages/CartPage.jsx
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import CouponInput from '../components/CouponInput';
import '../assets/styles/cart.css';
import CartMessages from '../components/sub/CartMessages';
import ProductsUnder20AED from '../components/ProductsUnder20AED';

export default function CartPage() {
  const { cartItems } = useCart();
  const [discount, setDiscount] = useState(0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = Math.max(subtotal - discount, 0);

  return (
    <>
    <div className="cartGrid">
      <section className="cartLeft">
        <CartMessages/>
        <h2>Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => <CartItem key={item.id} item={item} />)
        )}

        
      </section>

      <aside className="cartRight">
        <OrderSummary
          subtotal={subtotal}
          discount={discount}
          total={total}
          onCheckout={() => (window.location.href = '/checkout')}
        />
      </aside>


    </div>
    <ProductsUnder20AED/>

    </>
  );
}
