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
      return;
    }

    const fetchShippingMethods = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch all zones
        const zonesRes = await fetch(`${API_BASE}/shipping/zones?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`);
        if (!zonesRes.ok) throw new Error(`Error fetching zones (${zonesRes.status})`);
        const zones = await zonesRes.json();

        // 2. Find zone matching the country code
        let matchedZone = null;

        for (const zone of zones) {
          const locationsRes = await fetch(`${API_BASE}/shipping/zones/${zone.id}/locations?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`);
          if (!locationsRes.ok) throw new Error(`Error fetching locations for zone ${zone.id} (${locationsRes.status})`);
          const locations = await locationsRes.json();

          // Match if any location.code equals countryCode (case-insensitive)
          const found = locations.some(loc => loc.code.toUpperCase() === countryCode.toUpperCase());

          if (found) {
            matchedZone = zone;
            break;
          }
        }

        // 3. If no matched zone found, try default zone (id=0)
        if (!matchedZone) {
          const defaultZoneRes = await fetch(`${API_BASE}/shipping/zones/0?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`);
          if (!defaultZoneRes.ok) throw new Error(`Error fetching default zone (0) (${defaultZoneRes.status})`);
          matchedZone = await defaultZoneRes.json();
        }

        // 4. Fetch shipping methods for matched zone
        const methodsRes = await fetch(`${API_BASE}/shipping/zones/${matchedZone.id}/methods?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`);
        if (!methodsRes.ok) throw new Error(`Error fetching methods for zone ${matchedZone.id} (${methodsRes.status})`);
        const methodsData = await methodsRes.json();

        setMethods(methodsData);
      } catch (err) {
        setError(err.message || 'Failed to fetch shipping methods');
        setMethods([]);
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
