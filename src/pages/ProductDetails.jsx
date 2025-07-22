import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import ProductGallery from '../components/ProductGallery';
import ProductInfo from '../components/ProductInfo';
import ProductDescription from '../components/products/ProductDescription';
import SkeletonLoader from '../components/SkeletonLoader';
import RelatedProducts from '../components/RelatedProducts';
import Whislistreport from '../components/products/Whislist-report';
import ProductReviewList from '../components/products/ProductReviewList';

import '../assets/styles/product-details.css';

const API_BASE = 'https://store1920.com/wp-json/wc/v3/products';
const AUTH = {
  username: 'ck_8adb881aaff96e651cf69b9a8128aa5d9c80eb46',
  password: 'cs_595f6cb2c159c14024d77a2a87fa0b6947041f9f',
};

export default function ProductDetails() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);

  // Initialize mainImageUrl with null to avoid undefined 'images' error
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  // Derive images array safely from product (after product is loaded)
  const images = product?.images || [];

  // Set initial mainImageUrl when images are available
  useEffect(() => {
    if (images.length > 0 && !mainImageUrl) {
      setMainImageUrl(images[0].src);
    }
  }, [images, mainImageUrl]);

  // Login modal and user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    async function fetchProductData() {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}?slug=${slug}`, { auth: AUTH });

        if (!response.data.length) {
          setProduct(null);
          setVariations([]);
          setSelectedVariation(null);
          setMainImageUrl(null);
          setLoading(false);
          return;
        }

        const prod = response.data[0];
        setProduct(prod);
        setSelectedVariation(null);
        // Note: Do not setMainImageUrl here, handled by useEffect above

        if (prod.variations?.length) {
          const variationsData = await Promise.all(
            prod.variations.map(async (id) => {
              const varRes = await axios.get(`${API_BASE}/${id}`, { auth: AUTH });
              return varRes.data;
            })
          );
          setVariations(variationsData);
        } else {
          setVariations([]);
        }
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        setProduct(null);
        setVariations([]);
        setSelectedVariation(null);
        setMainImageUrl(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [slug]);

  const handleVariationChange = (variation) => {
    setSelectedVariation(variation);
    setMainImageUrl(variation.image?.src || product.images?.[0]?.src || null);
  };

  // Wishlist handler
  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    alert('Added to wishlist!');
    // Your API call or state update for wishlist goes here
  };

  const handleReportProduct = () => {
    alert('Reported this product!');
    // Your report logic or modal goes here
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const mockLogin = () => {
    setIsLoggedIn(true);
    closeLoginModal();
  };

  if (loading) return <SkeletonLoader />;

  if (!product) return <div>Product not found.</div>;

  return (
    <>
      <div className="product-details-container">
        <div className="left">
          <div className="gallery-and-description">
            <ProductGallery
              images={images}
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
            <ProductReviewList />

            <ProductDescription
              product={product}
              selectedVariation={selectedVariation}
            />
          </div>
        </div>

        <div className="right sticky-sidebar">
          <ProductInfo
            product={product}
            variations={variations}
            selectedVariation={selectedVariation}
            onVariationChange={handleVariationChange}
          />
        </div>
      </div>

      <div className="related-products-section">
        <RelatedProducts productId={product.id} />
      </div>

      {showLoginModal && (
        <div
          className="login-modal"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
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
            {/* Replace below with your real login form */}
            <button onClick={mockLogin} style={{ marginRight: 10 }}>Mock Login</button>
            <button onClick={closeLoginModal}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
