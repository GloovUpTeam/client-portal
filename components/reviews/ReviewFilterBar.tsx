// src/components/reviews/ReviewFilterBar.tsx
import React from 'react';
import { Filter, Image as ImageIcon } from 'lucide-react';

interface ReviewFilterBarProps {
  filters: {
    rating: number | null;
    withImages: boolean;
    sort: 'new' | 'old' | 'high' | 'low';
  };
  onChange: (newFilters: any) => void;
}

export const ReviewFilterBar: React.FC<ReviewFilterBarProps> = ({ filters, onChange }) => {
  const handleRatingClick = (r: number | null) => {
    onChange({ ...filters, rating: filters.rating === r ? null : r });
  };

  const toggleImages = () => {
    onChange({ ...filters, withImages: !filters.withImages });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sort: e.target.value as any });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-brand-surface border border-neutral-800 p-4 rounded-xl">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium text-neutral-400 mr-2 flex items-center">
          <Filter className="w-4 h-4 mr-2" /> Filter:
        </span>
        
        <button
          onClick={() => handleRatingClick(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
            filters.rating === null 
              ? 'bg-neutral-100 text-black border-neutral-100' 
              : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'
          }`}
        >
          All
        </button>

        {[5, 4, 3, 2, 1].map(star => (
          <button
            key={star}
            onClick={() => handleRatingClick(star)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              filters.rating === star
                ? 'bg-brand/20 text-brand border-brand' 
                : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'
            }`}
          >
            {star} ★
          </button>
        ))}
        
        <div className="w-px h-6 bg-neutral-800 mx-2 hidden md:block"></div>

        <button
          onClick={toggleImages}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border flex items-center gap-1.5 ${
            filters.withImages
              ? 'bg-blue-500/20 text-blue-500 border-blue-500'
              : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500'
          }`}
        >
          <ImageIcon className="w-3 h-3" /> With Images
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sortReviews" className="text-sm text-neutral-400">Sort by:</label>
        <select
          id="sortReviews"
          value={filters.sort}
          onChange={handleSortChange}
          className="bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg focus:ring-brand focus:border-brand p-2 outline-none"
        >
          <option value="new">Newest First</option>
          <option value="old">Oldest First</option>
          <option value="high">Highest Rated</option>
          <option value="low">Lowest Rated</option>
        </select>
      </div>
    </div>
  );
};
