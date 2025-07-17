import React, { useState, useEffect } from 'react';
import '../../assets/styles/ProductVariants.css';

export default function ProductVariants({ variations, selectedVariation, onVariationChange }) {
  // Always call hooks at top
  const attributeNames = React.useMemo(() => {
    if (!variations || variations.length === 0) return [];
    // Get unique attribute names from all variations
    const namesSet = new Set();
    variations.forEach(v => {
      v.attributes?.forEach(attr => {
        if (attr.name) namesSet.add(attr.name);
      });
    });
    return Array.from(namesSet);
  }, [variations]);

  // Build a map: attributeName -> array of unique options
  const attributeOptions = React.useMemo(() => {
    const map = {};
    attributeNames.forEach(name => {
      const optionsSet = new Set();
      variations.forEach(v => {
        v.attributes?.forEach(attr => {
          if (attr.name === name && attr.option) optionsSet.add(attr.option);
        });
      });
      map[name] = Array.from(optionsSet);
    });
    return map;
  }, [variations, attributeNames]);

  // Selected options state: { Color: 'Red', Size: 'M', ... }
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const init = {};
    attributeNames.forEach(name => {
      // If selectedVariation provided, use its option
      const selectedAttr = selectedVariation?.attributes?.find(a => a.name === name);
      init[name] = selectedAttr?.option || attributeOptions[name]?.[0] || '';
    });
    return init;
  });

  // When selectedOptions change, find matching variation and call onVariationChange
  useEffect(() => {
    if (!variations || variations.length === 0) return;

    const matchingVariation = variations.find(variation =>
      attributeNames.every(name => {
        const attr = variation.attributes?.find(a => a.name === name);
        return attr?.option === selectedOptions[name];
      })
    );

    if (matchingVariation && matchingVariation.id !== selectedVariation?.id) {
      onVariationChange(matchingVariation);
    }
  }, [selectedOptions, variations, attributeNames, onVariationChange, selectedVariation]);

  if (!variations || variations.length === 0) return null;

  return (
    <div className="variants-section">
      {attributeNames.map(name => (
        <div key={name} className="variant-attribute-group">
          <div className="variant-title">{name} :</div>
          <div className="variants-list">
            {attributeOptions[name].map(option => {
              // Find variation(s) that have this option for current attribute
              const optionVariations = variations.filter(v =>
                v.attributes?.some(attr => attr.name === name && attr.option === option)
              );

              // Determine if all matching variations are out of stock (disable button)
              const isOutOfStock = optionVariations.every(v => v.is_in_stock === false);

              // Is this option currently selected?
              const isSelected = selectedOptions[name] === option;

              return (
                <button
                  key={option}
                  className={`variant-btn ${isSelected ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                  type="button"
                  disabled={isOutOfStock}
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (!isOutOfStock) {
                      setSelectedOptions(prev => ({ ...prev, [name]: option }));
                    }
                  }}
                >
                  {/* Optionally show image if available (from first variation with this option) */}
                  {optionVariations[0]?.image?.src && (
                    <img
                      src={optionVariations[0].image.src}
                      alt={`${name} ${option}`}
                      className="variant-image"
                      loading="lazy"
                    />
                  )}
                  <span className="variant-label">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
