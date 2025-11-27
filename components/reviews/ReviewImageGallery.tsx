// src/components/reviews/ReviewImageGallery.tsx
import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewImage } from '../../types/reviews';

interface ReviewImageGalleryProps {
  images: ReviewImage[];
  initialIndex?: number;
  onClose: () => void;
}

export const ReviewImageGallery: React.FC<ReviewImageGalleryProps> = ({
  images,
  initialIndex = 0,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();
    
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  const showPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images.length) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Image Gallery"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 bg-black/50 rounded-full transition-colors"
        aria-label="Close gallery"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        onClick={showPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-3 bg-black/50 rounded-full transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <div className="max-w-5xl max-h-[85vh] relative">
        <img 
          src={images[currentIndex].url} 
          alt={images[currentIndex].alt || `Review image ${currentIndex + 1}`}
          className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <button
        onClick={showNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-3 bg-black/50 rounded-full transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
};
