import React, { useEffect, useState } from 'react';
import '../../assets/styles/checkout/ShippingMethods.css';

const ShippingMethods = ({ countryCode, selectedMethodId, onSelect }) => {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    const fetchShippingMethods = async () => {
      try {
        const zonesRes = await fetch('https://db.store1920.com/wp-json/custom/v1/shipping-zones');
        const zones = await zonesRes.json();

        let matchedZone = zones.find((zone) =>
          zone.locations.some((loc) => loc.code === countryCode)
        );

        if (!matchedZone) {
          matchedZone = zones.find((zone) =>
            zone.name.toLowerCase().includes('rest of the world')
          );
        }

        if (!matchedZone) return;

        const methodsRes = await fetch(
          `https://db.store1920.com/wp-json/custom/v1/shipping-zones/${matchedZone.id}/methods`
        );
        const methodsData = await methodsRes.json();
console.log('Fetched shipping methods:', methodsData); // <-- add this
        const unique = [];
        const seen = new Set();

        methodsData.forEach((method) => {
          if (!seen.has(method.title)) {
            seen.add(method.title);
            unique.push(method);
          }
        });

        setMethods(unique);
      } catch (err) {
        console.error('Error fetching shipping methods:', err);
        setMethods([]);
      }
    };

    if (countryCode) {
      fetchShippingMethods();
    }
  }, [countryCode]);

  return (
    <div className="unique-shipping-container">
      {methods.length > 0 && (
        <>
          <h3 className="unique-shipping-title">Shipping Methods</h3>
          <form>
            {methods.map((method) => {
              const isSelected = selectedMethodId === method.id;

              let cost =
                method.cost ??
                method.settings?.cost?.value ??
                method.settings?.shipping_cost?.value;

              const costFloat = parseFloat(cost);
              const price =
                !isNaN(costFloat) && costFloat > 0
                  ? `AED ${costFloat.toFixed(2)}`
                  : 'Free';

              return (
                <label
                  key={method.id}
                  className={`unique-shipping-label ${isSelected ? 'unique-shipping-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="uniqueShippingMethod"
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
        </>
      )}
    </div>
  );
};

export default ShippingMethods;
