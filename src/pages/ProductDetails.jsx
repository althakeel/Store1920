import React, { useEffect, useState, useCallback, Suspense, lazy, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductDescription from '../components/products/ProductDescription';
import SkeletonLoader from '../components/SkeletonLoader';
import ProductReviewList from '../components/products/ProductReviewList';
import { getProductReviewsWoo } from '../data/wooReviews';

import '../assets/styles/product-details.css';

const RelatedProducts = lazy(() => import('../components/RelatedProducts'));

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3/products';
const AUTH = {
  username: 'ck_5441db4d77e2a329dc7d96d2db6a8e2d8b63c29f',
  password: 'cs_81384d5f9e75e0ab81d0ea6b0d2029cba2d52b63',
};
const axiosInstance = axios.create({ auth: AUTH });

function getReviewSummary(reviews) {
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0;
  return { totalReviews, avgRating };
}

export default function ProductDetails() {
  const { slug, id } = useParams();
  const { user, login } = useAuth();

  const [selectedVariation, setSelectedVariation] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [variations, setVariations] = useState([]);
  const [extraImages, setExtraImages] = useState([]);
  const [toast, setToast] = useState(null);
  const [reviews, setReviews] = useState([]);

  const isLoggedIn = !!user;

  // Restore user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) login(JSON.parse(storedUser));
  }, [user, login]);

  // Fetch minimal product first (for fast display)
  const { data: productMin, isLoading: loadingMin } = useQuery({
    queryKey: ['product-min', id || slug],
    queryFn: async () => {
      const fields = ['id', 'name', 'price', 'images'].join(',');
      const endpoint = id
        ? `${API_BASE}/${id}?_fields=${fields}`
        : `${API_BASE}?slug=${slug}&_fields=${fields}`;
      const res = await axiosInstance.get(endpoint);
      return id ? res.data : res.data[0] || null;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch full product only after minimal is loaded
  const { data: productFull, isLoading: loadingFull, error } = useQuery({
    queryKey: ['product-full', productMin?.id],
    queryFn: async () => {
      if (!productMin) return null;
      const fields = [
        'id',
        'name',
        'price',
        'images',
        'variations',
        'description',
        'categories',
        'tags',
        'stock_status',
        'short_description',
      ].join(',');
      const endpoint = `${API_BASE}/${productMin.id}?_fields=${fields}`;
      const res = await axiosInstance.get(endpoint);
      return res.data;
    },
    enabled: !!productMin,
    staleTime: 1000 * 60 * 5,
  });

  const product = productFull || productMin; // For rendering minimal first

  // Fetch variations after full product loads
  useEffect(() => {
    if (!productFull?.variations?.length) {
      setVariations([]);
      return;
    }
    async function fetchVariations() {
      try {
        const res = await axiosInstance.get(
          `${API_BASE}/${productFull.id}/variations?per_page=100&_fields=id,attributes,price,image`
        );
        setVariations(res.data || []);
      } catch {
        setVariations([]);
      }
    }
    fetchVariations();
  }, [productFull]);

  // Auto-select first variation
  useEffect(() => {
    if (variations.length > 0 && !selectedVariation) {
      setSelectedVariation(variations[0]);
    }
  }, [variations, selectedVariation]);

  // Show main image immediately (product first), then switch if variation chosen
  useEffect(() => {
    if (productMin?.images?.[0]?.src) {
      setMainImageUrl(productMin.images[0].src);
    }
    if (selectedVariation?.image?.src) {
      setMainImageUrl(selectedVariation.image.src);
    }
  }, [productMin, selectedVariation]);

  // Collect extra variation images
  useEffect(() => {
    if (variations.length > 0) {
      const variantImgs = variations
        .map((v) => v.image)
        .filter((img) => img?.src)
        .filter((img, idx, arr) => arr.findIndex((i) => i.src === img.src) === idx);
      setExtraImages(variantImgs);
    }
  }, [variations]);

  // Combined images
  const combinedImages = useMemo(() => {
    if (!productFull) return [];
    return [...(productFull.images || []), ...extraImages].filter(
      (img, idx, arr) => arr.findIndex((i) => i.src === img.src) === idx
    );
  }, [productFull, extraImages]);

  // Fetch reviews
  useEffect(() => {
    if (!productFull) return;
    async function fetchReviews() {
      try {
        const reviewsFromWoo = await getProductReviewsWoo(productFull.id);
        setReviews(reviewsFromWoo);
      } catch {
        setReviews([]);
      }
    }
    fetchReviews();
  }, [productFull]);

  const reviewSummary = getReviewSummary(reviews);

  // Handlers
  const handleVariationChange = useCallback((variation) => setSelectedVariation(variation), []);
  const openModal = useCallback((type) => setActiveModal(type), []);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };
  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    showToast('✅ Product added to wishlist!');
  };
  const handleReportProduct = () => showToast('⚠️ Product reported!');
  const handleAddReview = () => {
    if (!isLoggedIn) setShowLoginModal(true);
    else setActiveModal('review');
  };
  const closeLoginModal = () => setShowLoginModal(false);
  const mockLogin = () => {
    const mockUser = { id: '123', name: 'Test User', token: 'mock-token' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    login(mockUser);
    closeLoginModal();
    showToast('✅ Logged in successfully!');
  };

  // Loading states
  if (loadingMin) return <SkeletonLoader />;
  if (error) return <div>Error loading product.</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <>
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 5,
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
          }}
        >
          {toast}
        </div>
      )}

      <div className="product-details-container">
        <div className="left">
          <div className="gallery-and-description">
            {/* Show minimal image/title/price immediately */}
            {!productFull && (
              <div className="product-minimal">
                <img src={productMin.images?.[0]?.src} alt={productMin.name} className="main-product-image" />
                <h1>{productMin.name}</h1>
                <p>{productMin.price} AED</p>
              </div>
            )}

            {/* Full gallery & description */}
            {productFull && (
              <>
                <ProductGallery
                  images={combinedImages}
                  mainImageUrl={mainImageUrl}
                  setMainImageUrl={setMainImageUrl}
                  activeModal={activeModal}
                  openModal={openModal}
                  closeModal={closeModal}
                />

                <div className="product-review desktop-only">
                  {/* Wishlist/report can be enabled here */}
                </div>

                <div className="product-review desktop-only">
                  <Suspense fallback={<div>Loading reviews...</div>}>
                    <ProductReviewList
                      productId={productFull.id}
                      user={user}
                      onLogin={login}
                      reviews={reviews}
                      setReviews={setReviews}
                    />
                  </Suspense>
                </div>

                <div className="product-description desktop-only">
                  <ProductDescription product={productFull} selectedVariation={selectedVariation} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="right sticky-sidebar">
          {productFull && (
            <ProductInfo
              product={productFull}
              variations={variations}
              selectedVariation={selectedVariation}
              onVariationChange={handleVariationChange}
              loadingVariations={variations.length === 0 && !!productFull.variations?.length}
            />
          )}
        </div>
      </div>

      {/* Mobile sections */}
      {productFull && (
        <>
          <div className="product-description mobile-only">
            <ProductDescription product={productFull} selectedVariation={selectedVariation} />
          </div>
          <div className="product-review mobile-only">
            <Suspense fallback={<div>Loading reviews...</div>}>
              <ProductReviewList
                productId={productFull.id}
                user={user}
                onLogin={login}
                reviews={reviews}
                setReviews={setReviews}
              />
            </Suspense>
          </div>
          <div className="related-products-section">
            <Suspense fallback={<div>Loading related products...</div>}>
              <RelatedProducts
                productId={productFull.id}
                categories={productFull.categories || []}
                tags={productFull.tags || []}
              />
            </Suspense>
          </div>
        </>
      )}

      {/* Login modal */}
      {showLoginModal && (
        <div
          className="login-modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 20,
              borderRadius: 8,
              minWidth: 300,
            }}
          >
            <h3>Login Required</h3>
            <button onClick={mockLogin} style={{ marginRight: 10 }}>
              Mock Login
            </button>
            <button onClick={closeLoginModal}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
