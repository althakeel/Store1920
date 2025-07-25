import React, { useEffect, useState } from 'react';
import '../../assets/styles/checkout/ShippingMethods.css';  // changed filename to match new class names

const ShippingMethods = ({ countryCode, selectedMethodId, onSelect }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const zonesRes = await fetch('https://db.store1920.com/wp-json/custom/v1/shipping-zones');
        const zones = await zonesRes.json();

        const matchedZone = zones.find((zone) =>
          zone.locations.some((loc) => loc.code === countryCode)
        );

        if (!matchedZone) {
          setMethods([]);
          setLoading(false);
          return;
        }

        const methodsRes = await fetch(`https://db.store1920.com/wp-json/custom/v1/shipping-zones/${matchedZone.id}/methods`);
        const methodsData = await methodsRes.json();

        setMethods(methodsData);
      } catch (error) {
        console.error('Shipping fetch failed:', error);
        setMethods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShippingMethods();
  }, [countryCode]);

  if (loading) return <p className="unique-shipping-loading">Loading shipping methods...</p>;
  if (methods.length === 0) return <p className="unique-shipping-no-methods">No shipping methods found for this country.</p>;

  return (
    <div className="unique-shipping-container">
      <h3 className="unique-shipping-title">Shipping Methods</h3>
      <form>
        {methods.map((method) => {
          const isFreeShipping = method.title.toLowerCase() === 'free shipping';
          const checked = selectedMethodId === method.id;

          return (
            <label
              key={method.id}
              className={`unique-shipping-label ${isFreeShipping ? 'unique-shipping-free' : ''} ${checked ? 'unique-shipping-selected' : ''}`}
            >
              <input
                type="radio"
                name="uniqueShippingMethod"
                value={method.id}
                checked={checked}
                onChange={() => onSelect(method.id)}
                className="unique-shipping-radio"
              />
              <span className="unique-shipping-method-title">{method.title}</span>
              {!isFreeShipping && method.description && (
                <span className="unique-shipping-method-desc"> - {method.description}</span>
              )}
            </label>
          );
        })}
      </form>
    </div>
  );
};

export default ShippingMethods;
