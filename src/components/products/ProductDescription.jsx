import React from 'react';
import '../../assets/styles/ProductDescription.css';

// Helper function to decode HTML entities
function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function joinWithComma(items, key = 'id', display = 'name') {
  return items.map((item, i) => (
    <span key={item[key] || i} className={`${display.toLowerCase()}-name`}>
      {decodeHtml(item[display])} {/* decodeHtml used here */}
      {i < items.length - 1 ? ', ' : ''}
    </span>
  ));
}

export default function ProductDescription({ product, selectedVariation }) {
  if (!product) return null;

  // Use selected variation description or fallback to product description
  const descriptionHtml = selectedVariation?.description || product.description || '';

  // SKU: use variation SKU if available else product SKU
  const sku = selectedVariation?.sku || product.sku || '';

  // Categories and tags arrays from product object
  const categories = product.categories || [];
  const tags = product.tags || [];

  // Attributes either from variation or product
  const attributes = selectedVariation?.attributes?.length
    ? selectedVariation.attributes
    : product.attributes || [];

  return (
    <section className="product-description-section">
      <h2>Product Details</h2>

      {/* SKU */}
      {sku && (
        <dl className="product-sku">
          <dt>SKU:</dt>
          <dd>{sku}</dd>
        </dl>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <dl className="product-categories">
          <dt>Categories:</dt>
          <dd>{joinWithComma(categories)}</dd>
        </dl>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <dl className="product-tags">
          <dt>Tags:</dt>
          <dd>{joinWithComma(tags)}</dd>
        </dl>
      )}

      {/* Attributes */}
      {attributes.length > 0 && (
        <section className="product-attributes">
          <h3>Attributes:</h3>
          <ul>
            {attributes.map((attr, i) => {
              const options = Array.isArray(attr.options) ? attr.options : [attr.options];
              const displayName = attr.name || attr.attribute_name || 'Attribute';
              const displayOptions = attr.option ? [attr.option] : options;

              return (
                <li key={attr.id || i}>
                  <strong>{displayName}:</strong> {displayOptions.join(', ')}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Product Description (HTML content) */}
      <article
        className="product-description-content"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
    </section>
  );
}
