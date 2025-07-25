import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CK = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
const CS = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

export default function CouponDiscount({ onApplyCoupon }) {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');
  const [discountData, setDiscountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage('Please enter a coupon code.');
      setDiscountData(null);
      setIsValid(false);
      onApplyCoupon(null);
      return;
    }

    setLoading(true);
    setMessage('');
    setDiscountData(null);
    setIsValid(false);

    try {
      const url = `${API_BASE}/coupons?code=${encodeURIComponent(couponCode.trim())}&consumer_key=${CK}&consumer_secret=${CS}`;
      const response = await axios.get(url);

      if (response.data.length === 0) {
        setMessage('Invalid coupon code.');
        setIsValid(false);
        onApplyCoupon(null);
      } else {
        const coupon = response.data[0];
        if (!coupon.date_expires || new Date(coupon.date_expires) > new Date()) {
          setDiscountData(coupon);
          setMessage(`Coupon applied! Discount: ${coupon.amount}${coupon.discount_type === 'percent' ? '%' : ''}`);
          setIsValid(true);
          onApplyCoupon && onApplyCoupon(coupon);
        } else {
          setMessage('Coupon expired.');
          setIsValid(false);
          onApplyCoupon(null);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('Error checking coupon. Please try again.');
      setIsValid(false);
      onApplyCoupon(null);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 350, margin: '0.8rem auto', fontFamily: "'Montserrat', sans-serif", fontSize: '13px' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
<input
  type="text"
  placeholder="Enter coupon code"
  value={couponCode}
  onChange={e => setCouponCode(e.target.value.toUpperCase())}
  onKeyDown={e => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  }}
  disabled={loading}
  style={{
    flexGrow: 1,
    padding: '8px 12px',
    fontSize: '13px',
    borderRadius: '5px',
    border: isValid ? '1.8px solid #dd5e14ff' : '1.8px solid #bbb',
    outline: 'none',
    transition: 'border-color 0.25s',
    boxShadow: isValid ? '0 0 5px #dd5e14ff' : 'none',
    textTransform: 'uppercase',
  }}
  onFocus={e => e.target.style.borderColor = '#dd5e14ff'}
  onBlur={e => e.target.style.borderColor = isValid ? '#dd5e14ff' : '#bbb'}
/>

        <button
          onClick={handleApplyCoupon}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#a0aec0' : '#dd5e14ff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '13px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.25s',
            userSelect: 'none',
          }}
          onMouseEnter={e => !loading && (e.target.style.backgroundColor = '#dd5e14ff')}
          onMouseLeave={e => !loading && (e.target.style.backgroundColor = '#036830ff')}
        >
          {loading ? 'Checking...' : 'Apply'}
        </button>
      </div>

      <div
        style={{
          marginTop: '10px',
          padding: '8px 12px',
          borderRadius: '5px',
          color: isValid ? '#004085' : '#721c24',
          backgroundColor: isValid ? '#cce5ff' : '#f8d7da',
          border: `1px solid ${isValid ? '#b8daff' : '#f5c6cb'}`,
          fontWeight: '600',
          minHeight: '32px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {message || 'Enter a coupon code to see discount.'}
      </div>

      {discountData && isValid && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            backgroundColor: '#d0e9ff',
            border: '1px solid #4a90e2',
            borderRadius: '5px',
            color: '#004085',
            fontWeight: '700',
            fontSize: '14px',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {discountData.discount_type === 'percent'
            ? `${discountData.amount}% OFF`
            : `$${discountData.amount} OFF`}
        </div>
      )}
    </div>
  );
}
