import React, { useEffect, useState } from 'react';
import '../../assets/styles/checkout/ShippingMethods.css';

const ShippingMethods = ({ countryCode, selectedMethodId, onSelect }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
  const CONSUMER_KEY = 'ck_408d890799d9dc59267dd9b1d12faf2b50f9ccc8';
  const CONSUMER_SECRET = 'cs_c65538cff741bd9910071c7584b3d070609fec24';

useEffect(() => {
  if (!countryCode) {
    setMethods([]);
    setLoading(false);
    console.log('No countryCode provided');
    return;
  }

  const fetchShippingMethods = async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching zones for countryCode:', countryCode);

    try {
      const zonesRes = await fetch(`${API_BASE}/shipping/zones?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`);
      const zones = await zonesRes.json();
      console.log('Zones:', zones);

      let matchedZone = null;

      for (const zone of zones) {
        const locationsRes = await fetch(`${API_BASE}/shipping/zones/${zone.id}/locations?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`);
        const locations = await locationsRes.json();
        console.log(`Zone ${zone.id} locations:`, locations);

        const found = locations.some(loc => loc.code.toUpperCase() === countryCode.toUpperCase());
        if (found) {
          matchedZone = zone;
          break;
        }
      }

      console.log('Matched zone:', matchedZone);

      if (!matchedZone) {
        const defaultZoneRes = await fetch(`${API_BASE}/shipping/zones/0?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`);
        matchedZone = await defaultZoneRes.json();
        console.log('Default zone:', matchedZone);
      }

      const methodsRes = await fetch(`${API_BASE}/shipping/zones/${matchedZone.id}/methods?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`);
      const methodsData = await methodsRes.json();
      console.log('Shipping methods:', methodsData);

      setMethods(methodsData);
    } catch (err) {
      setError(err.message || 'Failed to fetch shipping methods');
      setMethods([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchShippingMethods();
}, [countryCode]);

  if (loading) return <p>Loading shipping methods...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!methods.length) return <p>No shipping methods available.</p>;

  return (
    <div className="unique-shipping-container">
      <h3 className="unique-shipping-title">Shipping Methods</h3>
      <form>
        {methods.map(method => {
          const isSelected = selectedMethodId === method.id;
          const cost = parseFloat(method.settings?.cost?.value || 0);
          const price = cost > 0 ? `AED ${cost.toFixed(2)}` : 'Free';

          return (
            <label
              key={method.id}
              className={`unique-shipping-label ${isSelected ? 'unique-shipping-selected' : ''}`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => onSelect(method.id)}
                className="unique-shipping-radio"
              />
              <div className="unique-shipping-row">
                <span className="unique-shipping-method-title">{method.title}</span>
                <span className="unique-shipping-method-price">{price}</span>
              </div>
            </label>
          );
        })}
      </form>
    </div>
  );
};

export default ShippingMethods;
