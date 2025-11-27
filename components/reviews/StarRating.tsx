// src/components/reviews/StarRating.tsx
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  readOnly = false, 
  size = 'md' 
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  const handleKeyDown = (e: React.KeyboardEvent, starIndex: number) => {
    if (readOnly || !onChange) return;
    if (e.key === 'Enter' || e.key === ' ') {
      onChange(starIndex);
    }
  };

  return (
    <div 
      className="flex gap-1" 
      role={readOnly ? 'img' : 'radiogroup'} 
      aria-label={`Rating: ${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverValue ?? value) >= star;
        
        return (
          <button
            key={star}
            type="button"
            className={`
              focus:outline-none focus:ring-2 focus:ring-brand/50 rounded-sm transition-transform
              ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            `}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            disabled={readOnly}
            aria-checked={value === star}
            role={readOnly ? 'presentation' : 'radio'}
            aria-label={`${star} stars`}
            tabIndex={readOnly ? -1 : 0}
          >
            <Star 
              className={`
                ${sizes[size]} 
                transition-colors duration-200
                ${isFilled ? 'fill-brand text-brand' : 'text-neutral-600'}
              `} 
            />
          </button>
        );
      })}
    </div>
  );
};
