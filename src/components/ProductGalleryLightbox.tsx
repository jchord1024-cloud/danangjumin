"use client";

import { useEffect, useState } from "react";

type ProductGalleryLightboxProps = {
  images: string[];
  title: string;
};

export function ProductGalleryLightbox({
  images,
  title,
}: ProductGalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;
  const activeImage = activeIndex === null ? null : images[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length,
    );
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  return (
    <>
      <div className="detail-gallery-grid">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={index === 0 ? "wide" : ""}
            style={{ backgroundImage: `url(${image})` }}
            aria-label={`${title} gallery image ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {activeImage ? (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} enlarged image`}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            aria-label="Close image viewer"
            onClick={() => setActiveIndex(null)}
          >
            ×
          </button>
          <button
            type="button"
            className="gallery-lightbox-nav prev"
            aria-label="Previous image"
            onClick={showPrevious}
          >
            &lt;
          </button>
          <img src={activeImage} alt={`${title} enlarged image ${activeIndex! + 1}`} />
          <button
            type="button"
            className="gallery-lightbox-nav next"
            aria-label="Next image"
            onClick={showNext}
          >
            &gt;
          </button>
        </div>
      ) : null}
    </>
  );
}
