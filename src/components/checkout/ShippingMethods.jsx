import React, { useEffect } from 'react';
import '../../assets/styles/checkout/ShippingMethods.css';

const ShippingMethods = ({ selectedMethodId, onSelect, subtotal }) => {
  const FIXED_AMOUNT = 10;

  const methods = [
    // {
    //   id: 'free_shipping',
    //   title: 'Free Shipping',
    //   cost: 0,
    //   description: 'Free for orders above AED 100',
    //   eligible: subtotal >= 100,
    // },
     {
      id: 'free_shipping',
      title: 'Free Shipping',
      cost: 0,
      description: 'Enjoy free delivery',
      eligible: true,
    },
    // {
    //   id: 'fixed_shipping',
    //   title: 'Standard Shipping',
    //   cost: FIXED_AMOUNT,
    //   description: 'Delivered within 5-7 business days',
    //   eligible: true,
    // },
  ];

  // Auto-select default method
  useEffect(() => {
    if (!selectedMethodId || (subtotal >= 100 && selectedMethodId !== 'free_shipping')) {
      const defaultMethod = methods.find(m => m.id === 'free_shipping' && m.eligible) || methods[1];
      onSelect(defaultMethod.id);
    }
  }, [selectedMethodId, subtotal, onSelect, methods]);

  return (
    <div className="shipping-container-full">
      <h3 className="shipping-title-full">Choose Shipping Method</h3>
      <form>
        {methods.map(method => {
          const isSelected = selectedMethodId === method.id;
          const price = method.cost > 0 ? `AED ${method.cost.toFixed(2)}` : 'Free';

          return (
            <label
              key={method.id}
              className={`shipping-full-card ${isSelected ? 'shipping-full-selected' : ''} ${!method.eligible ? 'shipping-disabled' : ''}`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => method.eligible && onSelect(method.id)}
                className="shipping-full-radio"
                disabled={!method.eligible}
              />
              <div className="shipping-full-content">
                <div className="shipping-full-text">
                  <span className="shipping-full-title">{method.title}</span>
                  <div className="shipping-full-desc">{method.description}</div>
                </div>
                <span className="shipping-full-price">{price}</span>
              </div>
            </label>
          );
        })}
      </form>
    </div>
  );
};

export default ShippingMethods;
