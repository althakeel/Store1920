import React from 'react';

export default function CheckoutRight({
  subtotal,
  discount,
  total,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  couponError,
  onPlaceOrder,
  paymentMethods,
  selectedPaymentMethod,
  onPaymentMethodChange,
}) {
  return (
    <aside className="checkoutRight">
      <h2>Order Summary</h2>
      <div className="summaryRow">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="summaryRow">
        <span>Discount:</span>
        <span>${discount.toFixed(2)}</span>
      </div>

      <div className="summaryRow total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="couponBox">
        <input
          name="couponCode"
          value={couponCode}
          onChange={onCouponChange}
          placeholder="Enter coupon code"
          aria-label="Coupon Code"
        />
        <button type="button" onClick={onApplyCoupon}>
          Apply
        </button>
      </div>
      {couponError && <div className="couponError">{couponError}</div>}

      <div className="paymentMethods">
        <h3>Select Payment Method</h3>
        {paymentMethods.length === 0 && <p>No payment methods available.</p>}

        {paymentMethods.map((method) => (
          <label key={method.id} className="paymentMethodOption">
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedPaymentMethod === method.id}
              onChange={onPaymentMethodChange}
            />
            {method.title}
          </label>
        ))}

        {selectedPaymentMethod && (
          <div className="paymentMethodDetails">
            {
              paymentMethods.find((m) => m.id === selectedPaymentMethod)?.description ||
              'No description available.'
            }
          </div>
        )}
      </div>

      <button className="placeOrderBtn" onClick={onPlaceOrder}>
        Place Order
      </button>
    </aside>
  );
}
