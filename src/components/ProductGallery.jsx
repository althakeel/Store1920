import React, { useState, useEffect, useRef } from 'react';
import '../assets/styles/ProductGallery.css';

export default function ProductGallery({ images, mainImageUrl, setMainImageUrl, activeModal, openModal, closeModal }) {
  const [mainIndex, setMainIndex] = useState(0);
  const [mainLoading, setMainLoading] = useState(true);
  const modalThumbListRef = useRef(null);

  useEffect(() => {
    const index = images.findIndex(img => img.src === mainImageUrl);
    if (index !== -1) setMainIndex(index);
  }, [mainImageUrl, images]);

  useEffect(() => {
    setMainLoading(true);
  }, [mainIndex]);

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

  const handleModalPrev = (e) => {
    e.stopPropagation();
    handlePrev();
    scrollModalThumbnails(mainIndex === 0 ? images.length - 1 : mainIndex - 1);
  };

  const handleModalNext = (e) => {
    e.stopPropagation();
    handleNext();
    scrollModalThumbnails(mainIndex === images.length - 1 ? 0 : mainIndex + 1);
  };

  const scrollModalThumbnails = (index) => {
    if (!modalThumbListRef.current) return;
    const thumbWidth = 108; // 100px width + 8px gap approx
    const scrollPos = Math.max(0, (index * thumbWidth) - (thumbWidth * 2));
    modalThumbListRef.current.scrollTo({
      left: scrollPos,
      behavior: 'smooth',
    });
  };

  const scrollModalThumbsLeft = (e) => {
    e.stopPropagation();
    modalThumbListRef.current?.scrollBy({ left: -100, behavior: 'smooth' });
  };

  const scrollModalThumbsRight = (e) => {
    e.stopPropagation();
    modalThumbListRef.current?.scrollBy({ left: 100, behavior: 'smooth' });
  };

  if (!images || images.length === 0) {
    return <div className="product-gallery no-images"><p>No images available</p></div>;
  }

  const isZoomModalOpen = activeModal === 'zoom';

  return (
    <>
      <div className="product-gallery-wrapper">
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

      {isZoomModalOpen && (
        <ModalWrapper onClose={closeModal} titleId="zoomModalTitle" label="Zoomed Image Modal">
          <img
            src={images[mainIndex].src}
            alt={images[mainIndex].alt || 'Zoomed Product Image'}
            className="zoomed-image"
            draggable={false}
            style={{ cursor: 'default' }}
          />

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
