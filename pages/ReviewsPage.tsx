// src/pages/ReviewsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReviewList, 
  ReviewForm, 
  ReviewFilterBar, 
  ReviewImageGallery 
} from '../components/reviews';
import { getReviews, createReview } from '../mocks/reviewsApi';
import { Review, ReviewFilters, ReviewImage, NewReviewPayload } from '../types/reviews';
import { Star, TrendingUp } from 'lucide-react';
import { Button } from '../components/atoms/Button';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReviewFilters>({
    rating: null,
    withImages: false,
    sort: 'new'
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Gallery State
  const [galleryImages, setGalleryImages] = useState<ReviewImage[] | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const fetchReviews = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      const nextPage = isLoadMore ? page + 1 : 1;
      
      const res = await getReviews({ 
        page: nextPage, 
        pageSize: 6, 
        filters 
      });

      if (isLoadMore) {
        setReviews(prev => [...prev, ...res.reviews]);
        setPage(nextPage);
      } else {
        setReviews(res.reviews);
        setPage(1);
      }
      
      setTotal(res.total);
      setHasMore(reviews.length + res.reviews.length < res.total);
      // Logic fix for hasMore check on loadMore vs reset
      if (isLoadMore) {
         setHasMore(reviews.length + res.reviews.length < res.total);
      } else {
         setHasMore(res.reviews.length < res.total);
      }

    } catch (err) {
      setError('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [filters, page, reviews.length]);

  // Initial fetch and filter change
  useEffect(() => {
    fetchReviews(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCreateReview = async (payload: NewReviewPayload) => {
    await createReview(payload);
    // Refresh list to show new review
    fetchReviews(false);
  };

  const handleImageClick = (images: ReviewImage[], index: number) => {
    setGalleryImages(images);
    setGalleryIndex(index);
  };

  // Calculate Avg Rating (Mock calculation based on current view or fixed stats)
  const avgRating = 4.2; 
  const totalReviews = 128;

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Client Reviews</h1>
          <p className="text-neutral-400 mt-1">See what our partners are saying about their experience.</p>
        </div>
        
        <div className="flex items-center gap-6 bg-brand-surface border border-neutral-800 p-4 rounded-xl">
          <div className="text-center px-4 border-r border-neutral-800">
            <div className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              {avgRating} <Star className="w-6 h-6 text-brand fill-brand" />
            </div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Average Rating</p>
          </div>
          <div className="text-center px-4">
            <div className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              {totalReviews} <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-xs text-neutral-400 uppercase tracking-wider mt-1">Total Reviews</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form (Sticky on Desktop) */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit space-y-6 order-2 lg:order-1">
          <ReviewForm onSubmit={handleCreateReview} />
          
          <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6 hidden lg:block">
            <h3 className="text-white font-bold mb-4">Rating Breakdown</h3>
            {[5, 4, 3, 2, 1].map(stars => (
               <div key={stars} className="flex items-center gap-2 mb-2">
                 <span className="text-sm font-medium text-neutral-400 w-8">{stars} ★</span>
                 <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-brand" 
                     style={{ width: `${stars === 5 ? 65 : stars === 4 ? 20 : 5}%` }} // Mock distribution
                   ></div>
                 </div>
                 <span className="text-xs text-neutral-500 w-8 text-right">
                    {stars === 5 ? '65%' : stars === 4 ? '20%' : '5%'}
                 </span>
               </div>
            ))}
          </div>
        </div>

        {/* Right Column: Filter & List */}
        <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
          <ReviewFilterBar filters={filters} onChange={setFilters} />
          
          <ReviewList 
            reviews={reviews} 
            isLoading={loading} 
            error={error}
            onRetry={() => fetchReviews(false)}
            onImageClick={handleImageClick}
          />
          
          {hasMore && !loading && (
            <div className="text-center pt-4">
              <Button variant="secondary" onClick={() => fetchReviews(true)}>
                Load More Reviews
              </Button>
            </div>
          )}
          
          {loading && reviews.length > 0 && (
             <div className="text-center py-4 text-neutral-500 text-sm">Loading more...</div>
          )}
        </div>
      </div>

      {galleryImages && (
        <ReviewImageGallery 
          images={galleryImages} 
          initialIndex={galleryIndex} 
          onClose={() => setGalleryImages(null)} 
        />
      )}
    </div>
  );
};
