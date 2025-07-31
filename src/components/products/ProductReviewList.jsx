import React, { useEffect, useState, useRef } from 'react';
import SignInModal from '../sub/SignInModal'; // Adjust path if needed
import '../../assets/styles/ProductReviewList.css';

// Star rating component
const ReviewStars = ({ rating, onRate }) => (
  <div className="stars" role="radiogroup" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        role={onRate ? 'radio' : undefined}
        aria-checked={i === rating}
        tabIndex={onRate ? 0 : -1}
        className={i <= rating ? 'star filled' : 'star'}
        onClick={() => onRate && onRate(i)}
        onKeyDown={(e) => {
          if (!onRate) return;
          if (e.key === 'Enter' || e.key === ' ') {
            onRate(i);
          }
        }}
        style={{ cursor: onRate ? 'pointer' : 'default' }}
        aria-label={`${i} Star${i > 1 ? 's' : ''}`}
      >
        ★
      </span>
    ))}
  </div>
);

// Modal shown after user reports a review
function ReportAlertModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100,
        padding: 20,
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="report-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 12,
          maxWidth: 400,
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          padding: '30px 25px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          color: '#333',
        }}
      >
        <div
          style={{
            fontSize: 48,
            color: '#e74c3c',
            marginBottom: 20,
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          &#9888; {/* Warning icon */}
        </div>
        <h2 id="report-modal-title" style={{ margin: '0 0 15px 0', fontWeight: '700' }}>
          Product Reported
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 25 }}>
          This product has been reported. Our support team will contact you soon.
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '10px 30px',
            backgroundColor: '#3498db',
            border: 'none',
            borderRadius: 6,
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: 16,
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2980b9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3498db')}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function ProductReviewList({ productId, user, onLogin }) {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [reportAlertOpen, setReportAlertOpen] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Submission states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const formRef = useRef(null);

  // Fetch reviews on mount or productId change
  useEffect(() => {
    fetch(`/wp-json/custom-reviews/v1/product/${productId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [productId]);

  // Show limited reviews or all
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  // Mask reviewer name for privacy
  const maskName = (n) => {
    if (!n || n.length <= 4) return n;
    return n.substring(0, 2) + '***' + n.slice(-2);
  };

  // When user clicks "Write a Review"
  const handleWriteReviewClick = () => {
    if (user && user.name) {
      setShowReviewForm(true);
    } else {
      setSignInOpen(true);
    }
  };

  // Handle review form submit
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

      // Refresh reviews list after successful submit
      const updatedReviews = await fetch(`/wp-json/custom-reviews/v1/product/${productId}`).then((res) => res.json());
      setReviews(updatedReviews);

      // Reset form
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

  // Handle user login from SignInModal
  const onUserLogin = (userData) => {
    if (onLogin) onLogin(userData);
    setSignInOpen(false);
    setShowReviewForm(true);
    setName(userData.name || '');
  };

  return (
    <div className="product-review-box">
      {/* Review summary */}
      <div className="review-summary" aria-live="polite">
        <strong>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </strong>{' '}
        &nbsp;|&nbsp;
        <span>
          {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0).toFixed(1)}{' '}
          <ReviewStars
            rating={Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0)}
          />
        </span>
      </div>

      {/* Review list */}
      <div className="review-list">
        {visibleReviews.map((r, i) => (
          <div key={i} className="review-item" tabIndex={0} aria-label={`Review by ${r.reviewer}`}>
            <div className="review-header">
              <div className="avatar" aria-hidden="true">
                {r.reviewer?.substring(0, 1).toUpperCase()}
              </div>
              <span className="review-user">{maskName(r.reviewer)}</span>
              <span className="review-date">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <ReviewStars rating={r.rating} />
            {r.image_url && <img src={r.image_url} alt="Review" className="review-image" />}
            <p className="review-text">{r.review}</p>
            <button
              className="report-btn"
              onClick={() => setReportAlertOpen(true)}
              style={{
                marginTop: 10,
                color: '#e74c3c',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
              aria-label="Report this review"
              type="button"
            >
              Report
            </button>
          </div>
        ))}
      </div>

      {/* Show toggle for more/less reviews */}
      {reviews.length > 3 && (
        <button
          className="see-all-btn"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
          aria-controls="review-list"
          type="button"
        >
          {showAll ? 'Show Less' : 'See All Reviews'}
        </button>
      )}

      {/* Write review button */}
      {!showReviewForm && (
        <button className="write-review-btn" onClick={handleWriteReviewClick} type="button">
          Write a Review
        </button>
      )}

      {/* Review submission form */}
      {showReviewForm && (
        <form
          ref={formRef}
          className="custom-product-review-form"
          onSubmit={handleSubmit}
          style={{ marginTop: 30 }}
          aria-live="polite"
        >
          <h3>Write a Review</h3>

          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              placeholder="Your name"
              aria-required="true"
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
              aria-required="true"
            />
          </label>

          <label>
            Upload Image (optional):
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              aria-label="Upload review image"
            />
          </label>

          {submitError && <p className="error-message" role="alert">{submitError}</p>}
          {submitSuccess && <p className="success-message" role="alert">{submitSuccess}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Modals */}
      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} onLogin={onUserLogin} />
      <ReportAlertModal isOpen={reportAlertOpen} onClose={() => setReportAlertOpen(false)} />
    </div>
  );
}
