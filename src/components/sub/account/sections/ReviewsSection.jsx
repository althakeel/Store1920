import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../../assets/styles/myaccount/reviewSection.css';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_8adb881aaff96e651cf69b9a8128aa5d9c80eb46';
const CONSUMER_SECRET = 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f';

const ReviewSection = ({ customerEmail }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!customerEmail) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/products/reviews`, {
          params: {
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            reviewer_email: customerEmail,
            per_page: 100,
          },
        });

        console.log('Fetched Reviews:', res.data);
        setReviews(res.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [customerEmail]);

  if (loading) {
    return (
      <div className="review-loading">
        <p>Loading your reviews...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews-box">
        <h3>You don’t have any reviews</h3>
        <p>You have no completed reviews or your reviews have been deleted.</p>
      </div>
    );
  }

  return (
    <div className="review-section">
      <h2>Your Product Reviews</h2>
      {reviews.map((review) => (
        <div className="review-card" key={review.id}>
          <h4>Product ID: {review.product_id}</h4>
          <p><strong>Rating:</strong> {review.rating} ⭐</p>
          <p><strong>Review:</strong> {review.review}</p>
          <p className="review-date">
            {new Date(review.date_created).toLocaleDateString()} at {new Date(review.date_created).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;
