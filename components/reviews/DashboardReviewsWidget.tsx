// src/components/reviews/DashboardReviewsWidget.tsx
import React, { useEffect, useState } from 'react';
import { Review } from '../../types/reviews';
import { getReviews } from '../../mocks/reviewsApi';
import { StarRating } from './StarRating';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface DashboardReviewsWidgetProps {
  max?: number;
}

const DashboardReviewsWidget: React.FC<DashboardReviewsWidgetProps> = ({ max = 3 }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getReviews({ pageSize: max, filters: { sort: 'new' } })
      .then(res => {
        if (mounted) {
          setReviews(res.reviews);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setError(true);
          setIsLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [max]);

  if (error) return null; // Hide widget on error for dashboard cleanliness

  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand" />
          Latest Reviews
        </h2>
        <button 
          onClick={() => navigate('/reviews')}
          className="text-xs font-medium text-brand hover:text-white transition-colors"
        >
          View All
        </button>
      </div>

      <div className="flex-1 space-y-4">
        {isLoading ? (
          // Skeletons
          [1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
              <div className="h-3 bg-neutral-800 rounded w-full"></div>
            </div>
          ))
        ) : reviews.length === 0 ? (
          <p className="text-neutral-500 text-sm">No reviews yet.</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="group border-b border-neutral-800 last:border-0 pb-4 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium text-white group-hover:text-brand transition-colors">
                  {review.reviewerName}
                </span>
                <span className="text-xs text-neutral-500">
                  {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="mb-2">
                 <StarRating value={review.rating} readOnly size="sm" />
              </div>
              <p className="text-xs text-neutral-400 line-clamp-2">
                "{review.comment}"
              </p>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={() => navigate('/reviews')}
        className="w-full mt-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        Write a Review <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DashboardReviewsWidget;