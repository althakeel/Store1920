import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CheckoutLeft from '../components/CheckoutLeft';
import CheckoutRight from '../components/CheckoutRight';
import SignInModal from '../components/sub/SignInModal';
import '../assets/styles/checkout.css';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_e09e8cedfae42e5d0a37728ad6c3a6ce636695dd';
const CS = 'cs_2d41bc796c7d410174729ffbc2c230f27d6a1eda';

const fetchWithAuth = async (endpoint, options = {}) => {
  const url = `${API_BASE}/${endpoint}`;
  const authHeader = 'Basic ' + btoa(`${CK}:${CS}`);
  const fetchOptions = {
    ...options,
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };
  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMsg = errorData.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return res.json();
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems: contextCartItems, clearCart } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [countries, setCountries] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const [formData, setFormData] = useState({
    shipping: { fullName:'', address1:'', address2:'', city:'', state:'', postalCode:'', country:'', phone:'' },
    billing: { fullName:'', address1:'', address2:'', city:'', state:'', postalCode:'', country:'', phone:'', email:'' },
    billingSameAsShipping: true,
    paymentMethod: '',
    paymentMethodTitle: '',
  });

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!contextCartItems.length) { setCartItems([]); return; }
      try {
        const details = await Promise.all(contextCartItems.map(async (item) => {
          const product = await fetchWithAuth(`products/${item.id}`);
          return {
            ...item,
            price: parseFloat(product.price) || 0,
            stockQuantity: product.stock_quantity,
            inStock: product.stock_quantity > 0,
            name: product.name,
          };
        }));
        setCartItems(details);
      } catch {
        setCartItems(contextCartItems.map((item) => ({ ...item, price: item.price||0, inStock:true })));
      }
    };
    fetchProductDetails();
  }, [contextCartItems]);

  // Fetch countries & payment methods
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        const [countriesData, paymentData] = await Promise.all([
          fetchWithAuth('data/countries'),
          fetchWithAuth('payment_gateways'),
        ]);
        setCountries(countriesData);
        setPaymentMethods(paymentData);

        const token = localStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      } catch (err) { setError(err.message || 'Failed to load checkout data.'); }
      finally { setLoading(false); }
    };
    fetchCheckoutData();
  }, []);

  // Default payment method
  useEffect(() => {
    if (!paymentMethods.length) return;
    if (!selectedPaymentMethod) {
      const defaultMethod = paymentMethods[0];
      setSelectedPaymentMethod(defaultMethod.id);
      setFormData((prev) => ({
        ...prev,
        paymentMethod: defaultMethod.id,
        paymentMethodTitle: defaultMethod.title,
      }));
    }
  }, [paymentMethods]);

  const handleChange = (e, section) => {
    const { name, value, checked, type } = e.target;
    if (section==='checkbox') setFormData((prev)=>({...prev, billingSameAsShipping: checked}));
    else if (section==='shipping' || section==='billing') setFormData((prev)=>({...prev, [section]: {...prev[section],[name]:value}}));
    else if (section==='payment') setFormData((prev)=>({...prev,[name]:value}));
  };

  const handleRemoveItem = (itemId) => setCartItems((prev)=>prev.filter((item)=>(item.id||item.product_id)!==itemId));
  const handleShippingMethodSelect = (id) => setFormData((prev)=>({...prev, shipping:{...prev.shipping, shippingMethodId:id}}));
  const handleRequireLogin = () => setShowSignInModal(true);
  const handleLoginSuccess = () => { setIsLoggedIn(true); setShowSignInModal(false); };

  const subtotal = cartItems.reduce((sum,item)=>sum+(parseFloat(item.price)||0)*item.quantity,0);
  const hasOutOfStock = cartItems.some((item)=>!item.inStock);

  // **PLACE ORDER BEFORE PAYMOB**
  const handlePlaceOrder = async () => {
    if (hasOutOfStock) { setError('Please remove out-of-stock items before placing the order.'); return; }
    setError(''); setSubmitting(true);

    const lineItems = cartItems.map((item)=>({ product_id: item.id, quantity: item.quantity }));
    const shipping = formData.shipping;
    const billing = formData.billingSameAsShipping ? shipping : formData.billing;
    const userId = localStorage.getItem('userId');

    const orderPayload = {
      payment_method: selectedPaymentMethod || formData.paymentMethod,
      payment_method_title: formData.paymentMethodTitle,
      set_paid: false,
      ...(userId ? { customer_id: parseInt(userId, 10) } : {}),
      billing: {
        first_name: billing.fullName,
        address_1: billing.address1,
        address_2: billing.address2,
        city: billing.city,
        state: billing.state,
        postcode: billing.postalCode,
        country: billing.country,
        phone: billing.phone,
        email: billing.email,
      },
      shipping: {
        first_name: shipping.fullName,
        address_1: shipping.address1,
        address_2: shipping.address2,
        city: shipping.city,
        state: shipping.state,
        postcode: shipping.postalCode,
        country: shipping.country,
        phone: shipping.phone,
      },
      line_items: lineItems,
    };

    try {
      const orderData = await fetchWithAuth('orders', { method:'POST', body:JSON.stringify(orderPayload) });
      setOrderId(orderData.id); // ✅ now iframe can show
      if (selectedPaymentMethod==='cod') {
        clearCart();
        navigate(`/order-success?order_id=${orderData.id}`);
      }
    } catch(err) { setError(err.message || 'Error placing order.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading">Loading checkout...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="checkoutGrid">
        <CheckoutLeft
          formData={formData}
          onChange={handleChange}
          countries={countries}
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onPaymentMethodSelect={setSelectedPaymentMethod}
          subtotal={subtotal}
          orderId={orderId} // <-- iframe triggers when this exists
        />
        <CheckoutRight
          cartItems={cartItems}
          subtotal={subtotal}
          formData={formData}
          onShippingMethodSelect={handleShippingMethodSelect}
          onFormChange={handleChange}
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          isLoggedIn={isLoggedIn}
          onRequireLogin={handleRequireLogin}
          onPlaceOrder={handlePlaceOrder}
          submitting={submitting}
          hasOutOfStock={hasOutOfStock}
        />
        {showSignInModal && <SignInModal onClose={()=>setShowSignInModal(false)} onLoginSuccess={handleLoginSuccess} />}
      </div>
    </>
  );
}
