import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductDescription from '../components/products/ProductDescription';
import SkeletonLoader from '../components/SkeletonLoader';
import Whislistreport from '../components/products/Whislist-report';

import '../assets/styles/product-details.css';

const RelatedProducts = lazy(() => import('../components/RelatedProducts'));
const ProductReviewList = lazy(() => import('../components/products/ProductReviewList'));

const API_BASE = 'https://db.store1920.com/wp-json/wc/v3/products';
const AUTH = {
  username: 'ck_8adb881aaff96e651cf69b9a8128aa5d9c80eb46',
  password: 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f',
};

export default function ProductDetails() {
  const { slug, id } = useParams();

  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingVariations, setLoadingVariations] = useState(false);

  const [activeModal, setActiveModal] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openModal = useCallback((type) => setActiveModal(type), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  useEffect(() => {
    setLoadingProduct(true);
    setProduct(null);
    setVariations([]);
    setSelectedVariation(null);
    setMainImageUrl(null);

    const fetchProduct = async () => {
      try {
        let prod = null;

        if (id) {
          const res = await axios.get(`${API_BASE}/${id}`, { auth: AUTH });
          prod = res.data;
        } else if (slug) {
          const res = await axios.get(`${API_BASE}?slug=${slug}`, { auth: AUTH });
          prod = res.data.length > 0 ? res.data[0] : null;
        }

        if (!prod) {
          setProduct(null);
          return;
        }

        setProduct(prod);
        setMainImageUrl(prod.images?.[0]?.src || null);

        // Fetch all variations in ONE request, if available
        if (prod.variations?.length) {
          setLoadingVariations(true);
          try {
            // WooCommerce endpoint for variations of product
            const varRes = await axios.get(
              `${API_BASE}/${prod.id}/variations?per_page=100`,
              { auth: AUTH }
            );
            setVariations(varRes.data || []);
          } catch (err) {
            console.error('Error fetching variations:', err);
            setVariations([]);
          } finally {
            setLoadingVariations(false);
          }
        } else {
          setVariations([]);
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        setProduct(null);
        setVariations([]);
        setMainImageUrl(null);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [slug, id]);

  const handleVariationChange = useCallback(
    (variation) => {
      setSelectedVariation(variation);
      setMainImageUrl(variation.image?.src || product?.images?.[0]?.src || null);
    },
    [product]
  );

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
    setIsLoggedIn(true);
    closeLoginModal();
  };

  if (loadingProduct) return <SkeletonLoader />;
  if (!product) return <div>Product not found.</div>;

  return (
    <>
      <div className="product-details-container">
        <div className="left">
          <div className="gallery-and-description">
            <ProductGallery
              images={product.images || []}
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
              <ProductReviewList productId={product.id} />
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
            loadingVariations={loadingVariations}
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
