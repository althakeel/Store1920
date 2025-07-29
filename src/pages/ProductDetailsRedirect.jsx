import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3/products';
const AUTH = {
  username: 'ck_8adb881aaff96e651cf69b9a8128aa5d9c80eb46',
  password: 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f',
};

export default function ProductDetailsRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductById() {
      try {
        const res = await axios.get(`${API_BASE}/${id}`, { auth: AUTH });
        const product = res.data;
        if (product && product.slug) {
          // Redirect to the slug URL
          navigate(`/product/slug/${product.slug}`, { replace: true });
        } else {
          // No product found, redirect to 404 or homepage
          navigate('/404', { replace: true });
        }
      } catch (error) {
        // On error redirect to 404
        navigate('/404', { replace: true });
      } finally {
        setLoading(false);
      }
    }

    fetchProductById();
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;

  return null; // No UI, just redirects
}
