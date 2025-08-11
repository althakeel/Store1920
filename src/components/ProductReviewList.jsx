import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/styles/product-review-list.css'; // Optional, add styles as needed

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3/products';

const ProductReviewList = ({ productId, user, onLogin }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Adjust API endpoint for your actual review endpoint or WP REST API reviews
        const res = await axios.get(
          `${API_BASE}/${productId}/reviews?per_page=20`
        );
        setReviews(res.data);
      } catch (e) {
        setError('Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async () => {
    if (!user) {
      onLogin && onLogin();
      return;
    }

    if (!newReview.trim()) return;

    setSubmitting(true);
    try {
      // Submit review POST API — adjust URL and payload for your backend
      await axios.post(
        `${API_BASE}/${productId}/reviews`,
        {
          review: newReview,
          reviewer: user.name || 'Anonymous',
          reviewer_email: user.email || 'anonymous@example.com',
          rating: 5,
        },
        {
          auth: {
            username: 'ck_5441db4d77e2a329dc7d96d2db6a8e2d8b63c29f',
            password: 'cs_81384d5f9e75e0ab81d0ea6b0d2029cba2d52b63',
          },
        }
      );
      setNewReview('');
      // Optionally refresh reviews list:
      const res = await axios.get(`${API_BASE}/${productId}/reviews?per_page=20`);
      setReviews(res.data);
    } catch {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-review-list">
      <h3>Customer Reviews ({reviews.length})</h3>
      {reviews.length === 0 && <p>No reviews yet. Be the first to review!</p>}
      <ul>
        {reviews.map((rev) => (
          <li key={rev.id} className="review-item">
            <strong>{rev.reviewer || 'Anonymous'}</strong> –{' '}
            <span>{rev.date_created?.split('T')[0]}</span>
            <p>{rev.review}</p>
          </li>
        ))}
      </ul>

      <div className="review-form">
        <h4>Add Your Review</h4>
        <textarea
          rows="4"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review here..."
          disabled={submitting}
        />
        <button onClick={handleSubmitReview} disabled={submitting || !newReview.trim()}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default ProductReviewList;
