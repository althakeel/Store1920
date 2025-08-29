import React, { useEffect, useState } from 'react';
import { getProductReviewsWoo } from '../../data/wooReviews'; // adjust path

export default function ProductCardReviews({ productId, soldCount = 0 }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchReviews() {
    console.log('Starting fetchReviews...', productId);
    if (!productId) {
      console.warn('No productId provided');
      setLoading(false);
      return;
    }

    const id = parseInt(productId, 10);
    console.log('Parsed product ID:', id);
    if (isNaN(id)) {
      console.error('Invalid productId:', productId);
      setLoading(false);
      return;
    }

    try {
      console.log('Calling getProductReviewsWoo...');
      const data = await getProductReviewsWoo(id);
      console.log('Data received:', data);
      setReviews(data || []);

      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + Number(r.rating), 0) / data.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
      setAverageRating(0);
    } finally {
      console.log('Setting loading false');
      setLoading(false);
    }
  }

  fetchReviews();
}, [productId]);


  // Star logic
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} style={{ color: '#ffcc00' }}>★</span>);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<span key={i} style={{ color: '#ffcc00' }}>☆</span>); // half-star fallback
      } else {
        stars.push(<span key={i} style={{ color: '#ccc' }}>★</span>);
      }
    }
    return stars;
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#333' }}>
      <strong>{averageRating.toFixed(1)}</strong>
      <div>{renderStars(averageRating)}</div>
      <span style={{ color: '#777' }}>({reviews.length})</span>
      {soldCount > 0 && <span>{soldCount} sold</span>}
    </div>
  );
}
