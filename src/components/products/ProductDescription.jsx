import React from 'react';
import '../../assets/styles/ProductDescription.css';

function joinWithComma(items, key = 'id', display = 'name') {
  return items.map((item, i) => (
    <span key={item[key] || i} className={`${display.toLowerCase()}-name`}>
      {item[display]}
      {i < items.length - 1 ? ', ' : ''}
    </span>
  ));
}

export default function ProductDescription({ product, selectedVariation }) {
  if (!product) return null;

  const descriptionHtml = selectedVariation?.description || product.description || '';
  const sku = selectedVariation?.sku || product.sku || '';
  const categories = product.categories || [];
  const tags = product.tags || [];
  const attributes = selectedVariation?.attributes?.length
    ? selectedVariation.attributes
    : product.attributes || [];

  return (
    <section className="product-description-section">
      <h2>Product Details</h2>
      {sku && (
        <dl className="product-sku">
          <dt>SKU:</dt>
          <dd> {product.sku}</dd>
        </dl>
      )}
        {tags.length > 0 && (
        <dl className="product-tags">
          <dt>Tags:</dt>
          <dd>{joinWithComma(tags)}</dd>
        </dl>
      )}

      <article className="product-description-content" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />

      {categories.length > 0 && (
        <dl className="product-categories">
          <dt>Categories:</dt>
          <dd>{joinWithComma(categories)}</dd>
        </dl>
      )}

    
{/* 
      {attributes.length > 0 && (
        <section className="product-attributes">
          <h3>Attributes:</h3>
          <ul>
            {attributes.map((attr, i) => {
              const options = Array.isArray(attr.options) ? attr.options : [attr.options];
              return (
                <li key={attr.id || i}>
                  <strong>{attr.name}:</strong> {options.join(', ')}
                </li>
              );
            })}
          </ul>
        </section>
      )} */}
    </section>
  );
}
