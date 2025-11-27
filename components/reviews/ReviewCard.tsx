// src/components/reviews/ReviewCard.tsx
import React from 'react';
import { Review, ReviewImage } from '../../types/reviews';
import { StarRating } from './StarRating';
import { User, Image as ImageIcon } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onImageClick?: (images: ReviewImage[], index: number) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onImageClick }) => {
  // Format date
  const dateObj = new Date(review.createdAt);
  const dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  
  // Calculate relative time (e.g. "2 days ago")
  const getRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    return `${Math.floor(months / 12)} years ago`;
  };

  return (
    <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6 transition-all hover:border-neutral-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white leading-tight">{review.reviewerName}</h4>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>{getRelativeTime(dateObj)}</span>
              <span>•</span>
              <time dateTime={review.createdAt}>{dateStr}</time>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <StarRating value={review.rating} readOnly size="sm" />
        </div>
      </div>

      <p className="text-neutral-300 text-sm leading-relaxed mb-4">
        {review.comment}
      </p>

      {review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {review.images.map((img, idx) => (
            <button 
              key={img.id}
              onClick={() => onImageClick?.(review.images, idx)}
              className="relative group shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label={`View image ${idx + 1}`}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
