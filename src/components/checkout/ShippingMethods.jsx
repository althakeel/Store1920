import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/styles/checkout/ShippingMethods.css';

const ShippingMethods = ({ selectedMethodId, onSelect, customerAddress, parcels }) => {
  const [methods, setMethods] = useState([
    {
      id: 'shipa_delivery',
      title: 'Shipa Delivery',
      description: 'Shipa Delivery method',
      cost: null, // null means price not yet loaded
      eligible: true,
    },
  ]);

  const [loading, setLoading] = useState(true);

  // Fetch Shipa Delivery rate dynamically
  useEffect(() => {
    if (!customerAddress) return;

    const fetchShipaRate = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          'https://api.shipadelivery.com/v1/rates',
          {
            pickup_address: {
              street: 'Warehouse Street',
              city: 'Dubai',
              country: 'AE',
              zip: '',
            },
            delivery_address: {
              street: customerAddress.street,
              city: customerAddress.city,
              country: customerAddress.country,
              zip: customerAddress.zip,
            },
            parcels: parcels || [{ weight: 1, length: 10, width: 10, height: 10 }],
          },
          {
            headers: {
              Authorization: 'Bearer YOUR_SHIPA_API_KEY',
              'Content-Type': 'application/json',
            },
          }
        );

        const rate = response.data?.rates?.[0]?.total || 0;

        setMethods(prev =>
          prev.map(m => (m.id === 'shipa_delivery' ? { ...m, cost: rate } : m))
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Shipa rate:', error);
        setMethods(prev =>
          prev.map(m => (m.id === 'shipa_delivery' ? { ...m, cost: 0 } : m))
        );
        setLoading(false);
      }
    };

    fetchShipaRate();
  }, [customerAddress, parcels]);

  // Auto-select Shipa Delivery by default
  useEffect(() => {
    if (methods.length > 0 && !selectedMethodId) {
      onSelect(methods[0].id);
    }
  }, [methods, selectedMethodId, onSelect]);

  return (
    <div className="shipping-container-full">
      <h3 className="shipping-title-full">Choose Shipping Method</h3>
      <form>
        {methods.map(method => {
          const isSelected = selectedMethodId === method.id;
          const price =
            method.cost === null
              ? 'Calculating...'
              : method.cost > 0
              ? `AED ${parseFloat(method.cost).toFixed(2)}`
              : 'Free';

          return (
            <label
              key={method.id}
              className={`shipping-full-card ${isSelected ? 'shipping-full-selected' : ''} ${
                method.eligible === false ? 'shipping-disabled' : ''
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => method.eligible !== false && onSelect(method.id)}
                className="shipping-full-radio"
                disabled={method.eligible === false}
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
