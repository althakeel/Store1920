import React, { useEffect, useState, useCallback, Suspense, lazy, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductDescription from '../components/products/ProductDescription';
import SkeletonLoader from '../components/SkeletonLoader';
import ProductReviewList from '../components/products/ProductReviewList';
import { getProductReviewsWoo } from '../data/wooReviews';



const RelatedProducts = lazy(() => import('../components/RelatedProducts'));


const ReviewStars = ({ rating, onRate }) => (
  <div className="stars" role="radiogroup" aria-label="Rating">
    {[1, 2, 3, 4, 5].map(i => (
      <span
        key={i}
        role={onRate ? 'radio' : undefined}
        aria-checked={i === rating}
        tabIndex={onRate ? 0 : -1}
        className={i <= rating ? 'star filled' : 'star'}
        onClick={() => onRate && onRate(i)}
        onKeyDown={e => {
          if (!onRate) return;
          if (e.key === 'Enter' || e.key === ' ') onRate(i);
        }}
        style={{ cursor: onRate ? 'pointer' : 'default' }}
        aria-label={`${i} Star${i > 1 ? 's' : ''}`}
      >
        ★
      </span>
    ))}
  </div>
);

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const leftColumnRef = useRef(null);
  const isLoggedIn = !!user;

  // Restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) login(JSON.parse(storedUser));
  }, [user, login]);

  // Update window width
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  // Fetch Minimal Product
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

  // Fetch Full Product
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

  const product = productFull || productMin;

  // Fetch Variations
  useEffect(() => {
    if (!productFull?.variations?.length) return setVariations([]);
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

  useEffect(() => {
    if (variations.length > 0 && !selectedVariation) setSelectedVariation(variations[0]);
  }, [variations, selectedVariation]);

  // Set main image
  useEffect(() => {
    if (!productMin?.images?.length) return;
    const firstValidImage = productMin.images.find(img => img?.src) || null;
    if (firstValidImage && mainImageUrl !== firstValidImage.src) {
      setMainImageUrl(firstValidImage.src);
    }
  }, [productMin, mainImageUrl]);

  useEffect(() => {
    if (!selectedVariation) return;
    if (selectedVariation.image?.src) {
      setMainImageUrl(selectedVariation.image.src);
    } else if (productMin?.images?.[0]?.src) {
      setMainImageUrl(productMin.images[0].src);
    }
  }, [selectedVariation, productMin]);

  // Gather variation images
  useEffect(() => {
    if (variations.length > 0) {
      const imgs = variations
        .map(v => v.image)
        .filter(img => img?.src)
        .filter((img, i, arr) => arr.findIndex(x => x.src === img.src) === i);
      setExtraImages(imgs);
    }
  }, [variations]);

  const combinedImages = useMemo(() => {
    if (!productFull) return [];
    return [...(productFull.images || []), ...extraImages].filter(
      (img, idx, arr) => arr.findIndex(i => i.src === img.src) === idx
    );
  }, [productFull, extraImages]);

  // Fetch Reviews
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
  const handleVariationChange = useCallback(v => setSelectedVariation(v), []);
  const openModal = useCallback(type => setActiveModal(type), []);
  const closeModal = useCallback(() => setActiveModal(null), []);
  const showToast = message => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };
  const handleAddToWishlist = () =>
    !isLoggedIn ? setShowLoginModal(true) : showToast('✅ Product added to wishlist!');
  const handleReportProduct = () => showToast('⚠️ Product reported!');
  const handleAddReview = () =>
    !isLoggedIn ? setShowLoginModal(true) : setActiveModal('review');
  const closeLoginModal = () => setShowLoginModal(false);
  const mockLogin = () => {
    const mockUser = { id: '123', name: 'Test User', token: 'mock-token' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    login(mockUser);
    closeLoginModal();
    showToast('✅ Logged in successfully!');
  };

  if (loadingMin || loadingFull) return <SkeletonLoader />;
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
            fontWeight: 'bold',
          }}
        >
          {toast}
        </div>
      )}

      {/* Main container */}
      <div
        style={{
          display: isMobile ? 'block' : 'flex',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '20px',
          gap: isMobile ? 0 : 5,
        }}
      >
        {/* Left Column */}
      <div
  ref={leftColumnRef}
  style={{
    flex: isMobile ? 'auto' : '1',
    boxSizing: 'border-box',
    maxHeight: isMobile ? 'auto' : '80vh', // fixed height on desktop
    overflowY: isMobile ? 'visible' : 'auto', // scrollable on desktop
    paddingRight: isMobile ? 0 : 10,
    /* Thin scrollbar for desktop only */
    scrollbarWidth: isMobile ? 'auto' : 'none', // Firefox
    msOverflowStyle: isMobile ? 'auto' : 'auto', // IE 10+
  }}
  className={isMobile ? '' : 'thin-scrollbar'}
>
          <ProductGallery
            images={combinedImages.length > 0 ? combinedImages : productMin?.images || []}
            mainImageUrl={mainImageUrl || productMin?.images?.[0]?.src}
            setMainImageUrl={setMainImageUrl}
            activeModal={activeModal}
            openModal={openModal}
            closeModal={closeModal}
          />

          {isMobile && productFull && (
            <div style={{ marginTop: 20 }}>
              <ProductInfo
                product={productFull}
                variations={variations}
                selectedVariation={selectedVariation}
                onVariationChange={handleVariationChange}
                loadingVariations={variations.length === 0 && !!productFull.variations?.length}
              />
            </div>
          )}




          <div style={{ marginTop: 20 }}>
          <div className="review-summary" aria-live="polite">
        <strong>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</strong> &nbsp;|&nbsp;
        <span>
          {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0).toFixed(1)}{' '}
          <ReviewStars rating={Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0)} />
        </span>
      </div>
            <ProductDescription product={productFull} selectedVariation={selectedVariation} />
            
          </div>



 {isMobile && productFull && (
  <div style={{ marginTop: 20 }}>
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
)}

{!isMobile && productFull && (
  <div style={{ marginTop: 20 }}>
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
)}
        </div>

        {/* Right Column (Desktop only) */}
        {!isMobile && (
          <div
            style={{
              flex: 1,
              position: 'sticky',
              top: 20,
              alignSelf: 'flex-start',
            }}
          >
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
        )}

        
      </div>

      {/* Related Products */}
      {productFull && (
        <div style={{ maxWidth: 1400, margin: '40px auto', padding: '0 10px' }}>
          <Suspense fallback={<div>Loading related products...</div>}>
            <RelatedProducts
              productId={productFull.id}
              categories={productFull.categories || []}
              tags={productFull.tags || []}
            />
          </Suspense>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div
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
          <div style={{ background: '#fff', padding: 20, borderRadius: 8, minWidth: 300 }}>
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
