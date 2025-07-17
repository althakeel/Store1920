import React, { useEffect, useState, useRef } from 'react';
import SignInModal from '../sub/SignInModal'; // Adjust path to your SignInModal
import '../../assets/styles/ProductReviewList.css';

const ReviewStars = ({ rating, onRate }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={i <= rating ? 'star filled' : 'star'}
        onClick={() => onRate && onRate(i)}
        style={{ cursor: onRate ? 'pointer' : 'default' }}
        aria-label={`${i} Star${i > 1 ? 's' : ''}`}
      >
        ★
      </span>
    ))}
  </div>
);

export default function ProductReviewList({ productId, user, onLogin }) {
  // `user` is either null (not logged in) or an object with user info

  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const formRef = useRef(null);

  useEffect(() => {
    fetch(`/wp-json/custom-reviews/v1/product/${productId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [productId]);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  const maskName = (n) => {
    if (!n || n.length <= 4) return n;
    return n.substring(0, 2) + '***' + n.slice(-2);
  };

  // Handle Write Review button click
  const handleWriteReviewClick = () => {
    if (user) {
      // Logged in — show form
      setShowReviewForm(true);
    } else {
      // Not logged in — open login modal
      setSignInOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!rating || !message.trim()) {
      setSubmitError('Please select a rating and write a review message.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('reviewer', name || 'Anonymous');
      formData.append('rating', rating);
      formData.append('review', message.trim());
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch('/wp-json/custom-reviews/v1/submit', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to submit review');

      // Refresh reviews
      const updatedReviews = await fetch(`/wp-json/custom-reviews/v1/product/${productId}`).then((res) => res.json());
      setReviews(updatedReviews);

      setName(user?.name || '');
      setRating(0);
      setMessage('');
      setImageFile(null);
      setSubmitSuccess('Review submitted successfully!');
      setShowAll(true);

      if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err.message || 'Error submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  // Called when user successfully logs in from SignInModal
  const onUserLogin = (userData) => {
    if (onLogin) onLogin(userData); // pass up to parent
    setSignInOpen(false);
    setShowReviewForm(true);
    setName(userData.name || '');
  };

  return (
    <div className="product-review-box">
      {/* Review summary */}
      <div className="review-summary">
        <strong>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</strong> &nbsp;|&nbsp;
        <span>
          {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0).toFixed(1)}{' '}
          <ReviewStars rating={Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0)} />
        </span>
      </div>

      {/* Review list */}
      <div className="review-list">
        {visibleReviews.map((r, i) => (
          <div key={i} className="review-item">
            <div className="review-header">
              <div className="avatar">{r.reviewer?.substring(0, 1).toUpperCase()}</div>
              <span className="review-user">{maskName(r.reviewer)}</span>
              <span className="review-date">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <ReviewStars rating={r.rating} />
            {r.image_url && <img src={r.image_url} alt="Review" className="review-image" />}
            <p className="review-text">{r.review}</p>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button className="see-all-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'See All Reviews'}
        </button>
      )}

      {/* Write Review button */}
      {!showReviewForm && (
        <button className="write-review-btn" onClick={handleWriteReviewClick}>
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <form ref={formRef} className="custom-product-review-form" onSubmit={handleSubmit} style={{ marginTop: 30 }}>
          <h3>Write a Review</h3>

          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="Your name"
            />
          </label>

          <label>
            Rating:
            <ReviewStars rating={rating} onRate={setRating} />
          </label>

          <label>
            Review Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              placeholder="Write your review here"
              rows={5}
              required
            />
          </label>

          <label>
            Upload Image (optional):
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </label>

          {submitError && <p className="error-message">{submitError}</p>}
          {submitSuccess && <p className="success-message">{submitSuccess}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* SignInModal for login */}
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} onLogin={onUserLogin} />
    </div>
  );
}
