import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductDescription from '../components/products/ProductDescription';
import SkeletonLoader from '../components/SkeletonLoader';
import Whislistreport from '../components/products/Whislist-report';

import { useQuery } from '@tanstack/react-query';

import '../assets/styles/product-details.css';

const RelatedProducts = lazy(() => import('../components/RelatedProducts'));
const ProductReviewList = lazy(() => import('../components/products/ProductReviewList'));

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3/products';
const AUTH = {
  username: 'ck_5441db4d77e2a329dc7d96d2db6a8e2d8b63c29f',
  password: 'cs_81384d5f9e75e0ab81d0ea6b0d2029cba2d52b63',
};

// Axios instance with auth for convenience
const axiosInstance = axios.create({
  auth: AUTH,
});

export default function ProductDetails() {
  const { slug, id } = useParams();
  const { user, login } = useAuth();

  const [selectedVariation, setSelectedVariation] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [variations, setVariations] = useState([]);

  const isLoggedIn = !!user;

  // Fetch main product - only needed fields, lightweight response
const { data: product, isLoading: loadingProduct, error } = useQuery({
  queryKey: ['product', id || slug],
  
  queryFn: async () => {
    console.log('Params:', { id, slug });
    const endpoint = id
      ? `${API_BASE}/${id}?_fields=id,name,images,variations,description`
      : `${API_BASE}?slug=${slug}&_fields=id,name,images,variations,description`;
    const res = await axiosInstance.get(endpoint);
    return id ? res.data : res.data[0] || null;
    
  },
  staleTime: 1000 * 60 * 5,
  retry: 1,
});




  // Fetch variations separately, only if product has variations
  useEffect(() => {
    async function fetchVariations() {
      if (product?.variations?.length) {
        try {
          const res = await axiosInstance.get(
            `${API_BASE}/${product.id}/variations?per_page=100&_fields=id,attributes,price,image`
          );
          setVariations(res.data || []);
        } catch {
          setVariations([]);
        }
      } else {
        setVariations([]);
      }
    }
    fetchVariations();
  }, [product]);



  useEffect(() => {
  if (variations.length > 0 && !selectedVariation) {
    setSelectedVariation(variations[0]);
  }
}, [variations, selectedVariation]);
  // Set main image from product or selected variation
  useEffect(() => {
    if (selectedVariation?.image?.src) {
      setMainImageUrl(selectedVariation.image.src);
    } else if (product?.images?.[0]?.src) {
      setMainImageUrl(product.images[0].src);
    } else {
      setMainImageUrl(null);
    }
  }, [product, selectedVariation]);

  const combinedImages = React.useMemo(() => {
    if (!product) return [];
    const variantImages = variations
      .map((v) => v.image)
      .filter((img) => img && img.src)
      .filter((img, idx, arr) => arr.findIndex((i) => i.src === img.src) === idx);

    const allImages = [...product.images, ...variantImages];
    return allImages.filter((img, idx, arr) => arr.findIndex((i) => i.src === img.src) === idx);
  }, [product, variations]);

  const handleVariationChange = useCallback(
    (variation) => {
      setSelectedVariation(variation);
    },
    []
  );

  const openModal = useCallback((type) => setActiveModal(type), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    alert('Added to wishlist!');
  };

  const handleReportProduct = () => {
    alert('Reported this product!');
  };

  const closeLoginModal = () => setShowLoginModal(false);

  const mockLogin = () => {
    login({ id: '123', name: 'Test User', token: 'mock-token' });
    closeLoginModal();
  };

  if (loadingProduct) return <SkeletonLoader />;
  if (error) return <div>Error loading product.</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <>
      <div className="product-details-container">
        <div className="left">
          <div className="gallery-and-description">
            <ProductGallery
              images={combinedImages}
              mainImageUrl={mainImageUrl}
              setMainImageUrl={setMainImageUrl}
              activeModal={activeModal}
              openModal={openModal}
              closeModal={closeModal}
            />

            <Whislistreport
              onAddToWishlist={handleAddToWishlist}
              onReportProduct={handleReportProduct}
              isLoggedIn={isLoggedIn}
              onOpenLoginPopup={() => setShowLoginModal(true)}
            />

            <Suspense fallback={<div>Loading reviews...</div>}>
              <ProductReviewList productId={product.id} user={user} onLogin={login} />
            </Suspense>

            <ProductDescription product={product} selectedVariation={selectedVariation} />
          </div>
        </div>

        <div className="right sticky-sidebar">
          <ProductInfo
            product={product}
            variations={variations}
            selectedVariation={selectedVariation}
            onVariationChange={handleVariationChange}
            loadingVariations={variations.length === 0 && !!product?.variations?.length}
          />
        </div>
      </div>

      <div className="related-products-section">
        <Suspense fallback={<div>Loading related products...</div>}>
          <RelatedProducts productId={product.id} />
        </Suspense>
      </div>

      {showLoginModal && (
        <div
          className="login-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
