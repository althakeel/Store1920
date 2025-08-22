import axios from 'axios';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3';
const AUTH = {
  username: 'ck_5441db4d77e2a329dc7d96d2db6a8e2d8b63c29f',
  password: 'cs_81384d5f9e75e0ab81d0ea6b0d2029cba2d52b63',
};
const axiosInstance = axios.create({ auth: AUTH });

export async function getProductReviewsWoo(productId) {
  const id = parseInt(productId, 10); // convert to integer
  if (isNaN(id)) {
    console.error('Invalid productId:', productId);
    return [];
  }

  try {
    const res = await axiosInstance.get(`${API_BASE}/products/reviews`, {
      params: { product: id, per_page: 100 }, // must be integer
    });

    return res.data.map(r => ({
      id: r.id,
      reviewer: r.reviewer,
      rating: r.rating,
      comment: r.review,
      date: r.date_created,
      image_url: null,
    }));
  } catch (err) {
    console.error('WooCommerce reviews fetch error:', err);
    return [];
  }
}
