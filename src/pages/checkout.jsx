import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CheckoutLeft from '../components/CheckoutLeft';
import CheckoutRight from '../components/CheckoutRight';
import SignInModal from '../components/sub/SignInModal';
import PaymentMethods from '../components/checkoutleft/PaymentMethods';
import '../assets/styles/checkout.css';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_e09e8cedfae42e5d0a37728ad6c3a6ce636695dd';
const CS = 'cs_2d41bc796c7d410174729ffbc2c230f27d6a1eda';

const fetchWithAuth = async (endpoint, options = {}) => {
  const url = `${API_BASE}/${endpoint}`;
  const authHeader = 'Basic ' + btoa(`${CK}:${CS}`);
  const fetchOptions = {
    ...options,
    headers: { 'Authorization': authHeader, 'Content-Type': 'application/json', ...(options.headers || {}) },
  };
  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed with status ${res.status}`);
  }
  return res.json();
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems: contextCartItems, clearCart } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    shipping: { fullName:'', address1:'', city:'', state:'', postalCode:'', country:'', phone:'' },
    billing: { fullName:'', address1:'', city:'', state:'', postalCode:'', country:'', phone:'', email:'' },
    billingSameAsShipping: true,
    paymentMethod: 'cod',
    paymentMethodTitle: 'Cash On Delivery',
  });
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price)||0) * item.quantity, 0);

  // Fetch products
  useEffect(() => {
    if (!contextCartItems.length) return setCartItems([]);
    const fetchProducts = async () => {
      try {
        const details = await Promise.all(contextCartItems.map(async item => {
          const prod = await fetchWithAuth(`products/${item.id}`);
          return { ...item, price: parseFloat(prod.price)||0, inStock: prod.stock_quantity>0, name: prod.name };
        }));
        setCartItems(details);
      } catch {
        setCartItems(contextCartItems.map(i => ({ ...i, price:i.price||0, inStock:true })));
      }
    };
    fetchProducts();
  }, [contextCartItems]);

  // Fetch countries & payment methods
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesData, paymentsData] = await Promise.all([
          fetchWithAuth('data/countries'),
          fetchWithAuth('payment_gateways')
        ]);
        setCountries(countriesData);
        setPaymentMethods(paymentsData);
        setIsLoggedIn(!!localStorage.getItem('userToken'));
      } catch(err) { setError(err.message || 'Failed to load checkout data.'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handlePaymentSelect = (methodId, title) => {
    setSelectedPaymentMethod(methodId);
    setFormData(prev => ({ ...prev, paymentMethod: methodId, paymentMethodTitle: title }));
  };


    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_failed') === '1') {
      setError('Payment failed. Please try again.');
    }
  }, []);

const createOrder = async () => {
  const shipping = formData.shipping;
  const billing = formData.billingSameAsShipping ? shipping : formData.billing;
  const line_items = cartItems.map(i => ({ product_id: i.id, quantity: i.quantity }));
  const userId = localStorage.getItem('userId');

  const payload = {
    payment_method: selectedPaymentMethod,
    payment_method_title: formData.paymentMethodTitle,
    set_paid: selectedPaymentMethod !== 'cod',
    billing: {
      first_name: billing.fullName.split(' ')[0] || '',
      last_name: billing.fullName.split(' ').slice(1).join('') || '',
      address_1: billing.address1,
      city: billing.city,
      state: billing.state,
      postcode: billing.postalCode,
      country: billing.country,
      phone: billing.phone,
      email: billing.email
    },
    shipping: {
      first_name: shipping.fullName.split(' ')[0] || '',
      last_name: shipping.fullName.split(' ').slice(1).join('') || '',
      address_1: shipping.address1,
      city: shipping.city,
      state: shipping.state,
      postcode: shipping.postalCode,
      country: shipping.country,
      phone: shipping.phone
    },
    line_items,
    ...(userId ? { customer_id: parseInt(userId, 10) } : { create_account: true }) // triggers WP auto user creation
  };

  const order = await fetchWithAuth('orders', { method: 'POST', body: JSON.stringify(payload) });

  if (!userId && order.customer_id) {
    localStorage.setItem('userId', order.customer_id); // save new WP user
  }

  setOrderId(order.id);
  return order.id;
};


const handlePlaceOrder = async () => {
  setError('');
  try {
    const id = orderId || await createOrder(); // WooCommerce order created
    clearCart();

    if (selectedPaymentMethod === 'cod') {
      navigate(`/order-success?order_id=${id}`);
    } else if (selectedPaymentMethod === 'paymob') {
      // Redirect to Paymob with order id
      window.location.href = `https://uae.paymob.com/${id}`;
    }
  } catch(err) {
    setError(err.message || 'Failed to place order.');
  }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color:'red' }}>{error}</div>;

  return (
    <>
      <div className="checkoutGrid">
        <CheckoutLeft
          formData={formData}
          onChange={(e, section) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
          }}
          countries={countries}
          cartItems={cartItems}
          subtotal={subtotal}
          orderId={orderId}
          onPaymentMethodSelect={handlePaymentSelect}
        />
        <CheckoutRight
          cartItems={cartItems}
          formData={formData}
          subtotal={subtotal}
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          onPlaceOrder={handlePlaceOrder}
          isLoggedIn={isLoggedIn}
          onRequireLogin={()=>setShowSignInModal(true)}
          createOrder={createOrder}
          clearCart={clearCart}
        />
      </div>
        {error && <div className="error-message">{error}</div>}
      {showSignInModal && <SignInModal onClose={()=>setShowSignInModal(false)} onLoginSuccess={()=>setIsLoggedIn(true)} />}
    </>
  );
}
