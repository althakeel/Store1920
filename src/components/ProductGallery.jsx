// ProductGallery.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../assets/styles/ProductGallery.css';

export default function ProductGallery({ images, mainImageUrl, setMainImageUrl, activeModal, openModal, closeModal }) {
  const [mainIndex, setMainIndex] = useState(0);
  const [mainLoading, setMainLoading] = useState(true);
  const modalThumbListRef = useRef(null);

  // Zoom and pan state for modal
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomTranslate, setZoomTranslate] = useState({ x: 0, y: 0 });
  const zoomedImageRef = useRef(null);
  const containerRef = useRef(null);
  const lastDragPosition = useRef(null);
 

  // Sync mainIndex when mainImageUrl changes
  useEffect(() => {
    const idx = images.findIndex(img => img.src === mainImageUrl);
    if (idx !== -1) setMainIndex(idx);
  }, [mainImageUrl, images]);

  // Reset loading and zoom state when mainIndex changes
  useEffect(() => {
    setMainLoading(true);
    setZoomScale(1);
    setZoomTranslate({ x: 0, y: 0 });
    if (modalThumbListRef.current) {
      scrollModalThumbnails(mainIndex);
    }
  }, [mainIndex]);

  // Thumbnail scrolling inside modal to keep active thumb visible
  const scrollModalThumbnails = (index) => {
    if (!modalThumbListRef.current) return;
    const thumbWidth = 108; // 100px width + 8px gap approx
    const scrollPos = Math.max(0, (index * thumbWidth) - (thumbWidth * 2));
    modalThumbListRef.current.scrollTo({
      left: scrollPos,
      behavior: 'smooth',
    });
  };

  // Handlers for previous/next image in gallery
  const handlePrev = () => {
    const newIndex = mainIndex === 0 ? images.length - 1 : mainIndex - 1;
    setMainIndex(newIndex);
    setMainImageUrl(images[newIndex].src);
  };

  const handleNext = () => {
    const newIndex = mainIndex === images.length - 1 ? 0 : mainIndex + 1;
    setMainIndex(newIndex);
    setMainImageUrl(images[newIndex].src);
  };

  // Modal prev/next buttons with thumbnail scroll
const handleModalPrev = (e) => {
  e.stopPropagation();
  const newIndex = mainIndex === 0 ? images.length - 1 : mainIndex - 1;
  setMainIndex(newIndex);
  setMainImageUrl(images[newIndex].src);
  scrollModalThumbnails(newIndex);
};

const handleModalNext = (e) => {
  e.stopPropagation();
  const newIndex = mainIndex === images.length - 1 ? 0 : mainIndex + 1;
  setMainIndex(newIndex);
  setMainImageUrl(images[newIndex].src);
  scrollModalThumbnails(newIndex);
};

  // Modal thumbnail scroll buttons
  const scrollModalThumbsLeft = (e) => {
    e.stopPropagation();
    modalThumbListRef.current?.scrollBy({ left: -100, behavior: 'smooth' });
  };

  const scrollModalThumbsRight = (e) => {
    e.stopPropagation();
    modalThumbListRef.current?.scrollBy({ left: 100, behavior: 'smooth' });
  };

  // Zoom and pan logic inside modal

  // Handle wheel zoom on modal image container
  const onWheel = (e) => {
    e.preventDefault();
    if (e.deltaY === 0) return;
    let newScale = zoomScale - e.deltaY * 0.001;
    newScale = Math.min(Math.max(newScale, 1), 4); // clamp between 1 and 4
    setZoomScale(newScale);
    if (newScale === 1) {
      setZoomTranslate({ x: 0, y: 0 });
    }
  };

  // Handle drag start on zoomed image
  const onDragStart = (e) => {
    e.preventDefault();
    lastDragPosition.current = {
      x: e.clientX || e.touches?.[0]?.clientX,
      y: e.clientY || e.touches?.[0]?.clientY,
    };
    containerRef.current.style.cursor = 'grabbing';
  };

  // Handle drag move on zoomed image
  const onDragMove = (e) => {
    if (!lastDragPosition.current) return;
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;
    if (x === undefined || y === undefined) return;
    const dx = x - lastDragPosition.current.x;
    const dy = y - lastDragPosition.current.y;
    lastDragPosition.current = { x, y };

    // Calculate new translate but limit it to avoid empty spaces (basic clamp)
    const maxTranslateX = (zoomScale - 1) * containerRef.current.clientWidth / 2;
    const maxTranslateY = (zoomScale - 1) * containerRef.current.clientHeight / 2;

    setZoomTranslate(prev => {
      let newX = prev.x + dx;
      let newY = prev.y + dy;
      newX = Math.min(Math.max(newX, -maxTranslateX), maxTranslateX);
      newY = Math.min(Math.max(newY, -maxTranslateY), maxTranslateY);
      return { x: newX, y: newY };
    });
  };

  // Handle drag end
  const onDragEnd = (e) => {
    e.preventDefault();
    lastDragPosition.current = null;
    if (containerRef.current) containerRef.current.style.cursor = zoomScale > 1 ? 'grab' : 'default';
  };

  // Prevent scrolling the background when modal is open
  useEffect(() => {
    if (activeModal === 'zoom') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeModal]);

  if (!images || images.length === 0) {
    return <div className="product-gallery no-images"><p>No images available</p></div>;
  }

  const isZoomModalOpen = activeModal === 'zoom';

  return (
    <>
      <div className="product-gallery-wrapper">
        {/* Thumbnail strip */}
        <div className="thumbnail-list" role="list">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              className={`thumbnail-btn ${idx === mainIndex ? 'active' : ''}`}
              onClick={() => {
                setMainImageUrl(img.src);
                setMainIndex(idx);
              }}
              type="button"
              aria-label={`Thumbnail ${idx + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt || `Thumbnail ${idx + 1}`}
                className="thumbnail-image"
                loading="lazy"
                draggable={false}
              />
            </button>
          ))}
        </div>

        {/* Main image area */}
        <div className="main-image-wrapper">
          {mainLoading && <div className="main-skeleton" />}
          <img
            src={images[mainIndex].src}
            alt={images[mainIndex].alt || 'Product Image'}
            className="main-image"
            loading="lazy"
            onLoad={() => setMainLoading(false)}
            onClick={() => openModal('zoom')}
            draggable={false}
          />

          <button
            className="arrow-btn arrow-left"
            onClick={handlePrev}
            aria-label="Previous Image"
            type="button"
          >
            ‹
          </button>

          <button
            className="arrow-btn arrow-right"
            onClick={handleNext}
            aria-label="Next Image"
            type="button"
          >
            ›
          </button>
        </div>
      </div>

      {/* Zoom modal */}
      {isZoomModalOpen && (
        <ModalWrapper onClose={closeModal} titleId="zoomModalTitle" label="Zoomed Image Modal">
          <div
            className="zoomed-image-container"
            ref={containerRef}
            onWheel={onWheel}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
          >
            <img
              src={images[mainIndex].src}
              alt={images[mainIndex].alt || 'Zoomed Product Image'}
              className="zoomed-image"
              draggable={false}
              ref={zoomedImageRef}
              style={{
                transform: `translate(calc(-50% + ${zoomTranslate.x}px), calc(-50% + ${zoomTranslate.y}px)) scale(${zoomScale})`,
              }}
            />
          </div>

          {/* Modal navigation arrows */}
          <button
            className="modal-arrow-btn modal-arrow-left"
            onClick={handleModalPrev}
            aria-label="Previous Image"
            type="button"
          >
            ‹
          </button>

          <button
            className="modal-arrow-btn modal-arrow-right"
            onClick={handleModalNext}
            aria-label="Next Image"
            type="button"
          >
            ›
          </button>

          {/* Modal thumbnail strip */}
          <div className="modal-thumbnail-container" onClick={e => e.stopPropagation()}>
            <button
              className="modal-thumb-scroll arrow-left"
              onClick={scrollModalThumbsLeft}
              aria-label="Scroll thumbnails left"
              type="button"
            >
              ‹
            </button>

            <div className="modal-thumbnail-list" ref={modalThumbListRef}>
              {images.map((img, idx) => (
                <button
                  key={`modal-thumb-${img.id || idx}`}
                  className={`thumbnail-btn ${idx === mainIndex ? 'active' : ''}`}
                  onClick={() => {
                    setMainImageUrl(img.src);
                    setMainIndex(idx);
                    setZoomScale(1);
                    setZoomTranslate({ x: 0, y: 0 });
                  }}
                  type="button"
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Thumbnail ${idx + 1}`}
                    className="thumbnail-image"
                    loading="lazy"
                    draggable={false}
                  />
                </button>
              ))}
            </div>

            <button
              className="modal-thumb-scroll arrow-right"
              onClick={scrollModalThumbsRight}
              aria-label="Scroll thumbnails right"
              type="button"
            >
              ›
            </button>
          </div>
        </ModalWrapper>
      )}
    </>
  );
}

function ModalWrapper({ onClose, titleId, label, children }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="zoom-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={label}
    >
      <div className="zoom-modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
