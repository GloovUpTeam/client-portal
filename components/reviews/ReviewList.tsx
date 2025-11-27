// src/components/reviews/ReviewList.tsx
import React from 'react';
import { Review, ReviewImage } from '../../types/reviews';
import { ReviewCard } from './ReviewCard';
import { Button } from '../atoms/Button';
import { MessageSquare } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onImageClick?: (images: ReviewImage[], index: number) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({ 
  reviews, 
  isLoading, 
  error, 
  onRetry,
  onImageClick 
}) => {
  if (isLoading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-brand-surface border border-neutral-800 rounded-xl p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-neutral-800 rounded"></div>
                  <div className="h-3 w-24 bg-neutral-800 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-20 bg-neutral-800 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-neutral-800 rounded"></div>
              <div className="h-3 w-5/6 bg-neutral-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-brand-surface border border-neutral-800 rounded-xl">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={onRetry} variant="secondary">Try Again</Button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 bg-brand-surface border border-neutral-800 rounded-xl">
        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-neutral-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No reviews found</h3>
        <p className="text-neutral-400 max-w-sm mx-auto">
          We couldn't find any reviews matching your current filters. Try adjusting them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard 
          key={review.id} 
          review={review} 
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
};
