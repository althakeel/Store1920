import React, { useState, useEffect, useCallback } from 'react';
import CreditCardIcon from '../../assets/images/common/credit-card.png';
import '../../assets/styles/checkoutleft/paymentmethods.css';

const PaymentMethods = ({ selectedMethod, onMethodSelect, subtotal, orderId, createOrder }) => {
  const [iframeUrl, setIframeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentOptions = [
    { id: 'cod', title: 'Cash On Delivery', logo: '', description: 'Pay with cash on delivery' },
    { id: 'paymob', title: 'Paymob', logo: CreditCardIcon, description: 'Pay with card via Paymob' }
  ];

  const fetchPaymobIframe = useCallback(async (currentOrderId) => {
    if (!currentOrderId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/wp-json/custom/v3/paymob-init', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: subtotal, order_id: currentOrderId })
      });
      if(!res.ok) throw new Error('Failed to fetch Paymob iframe');
      const data = await res.json();
      if(data.iframe_url) setIframeUrl(data.iframe_url);
      else setError('Paymob not available.');
    } catch(err) {
      console.error(err);
      setError('Failed to load Paymob checkout.');
      setIframeUrl(null);
    } finally { setLoading(false); }
  }, [subtotal]);

  useEffect(() => {
    const handlePaymob = async () => {
      if(selectedMethod !== 'paymob') return;
      const id = orderId || (createOrder ? await createOrder() : null);
      if(id) fetchPaymobIframe(id);
    };
    handlePaymob();
  }, [selectedMethod, orderId, createOrder, fetchPaymobIframe]);

  return (
    <div className="payment-methods-wrapper">
      {paymentOptions.map(method => (
        <div key={method.id} className={`payment-card ${selectedMethod===method.id?'selected':''}`}
             onClick={()=>onMethodSelect(method.id, method.title)}>
          <input type="radio" checked={selectedMethod===method.id} readOnly />
          <img src={method.logo} alt={method.title} />
          <span>{method.title}</span>
          <p>{method.description}</p>

          {method.id==='paymob' && (
            <div>
              {loading && <p>Loading Paymob checkout...</p>}
              {iframeUrl && <iframe src={iframeUrl} title="Paymob Checkout" width="100%" height="600" style={{border:'none'}} />}
              {error && <p style={{color:'red'}}>{error}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
