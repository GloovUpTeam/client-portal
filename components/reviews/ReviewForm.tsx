// src/components/reviews/ReviewForm.tsx
import React, { useState, useRef } from 'react';
import { StarRating } from './StarRating';
import { NewReviewPayload } from '../../types/reviews';
import { Button } from '../atoms/Button';
import { Upload, X, AlertCircle } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (payload: NewReviewPayload) => Promise<void> | void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (comment.trim().length < 10) {
      setError('Please write a comment of at least 10 characters.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        reviewerName: name,
        rating: rating as 1|2|3|4|5,
        comment,
        images
      });
      // Reset form
      setName('');
      setComment('');
      setRating(0);
      setImages([]);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((f: File) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
      
      if (validFiles.length !== newFiles.length) {
        // Could show a toast warning about invalid files here
      }

      setImages(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-brand-surface border border-neutral-800 rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 flex items-center text-sm" role="alert">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Rating</label>
          <StarRating value={rating} onChange={setRating} size="lg" />
        </div>

        <div>
          <label htmlFor="reviewerName" className="block text-sm font-medium text-neutral-400 mb-2">Your Name</label>
          <input
            id="reviewerName"
            type="text"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="reviewComment" className="block text-sm font-medium text-neutral-400 mb-2">Review</label>
          <textarea
            id="reviewComment"
            rows={4}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all resize-none"
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex justify-between mt-1 text-xs text-neutral-500">
            <span>Min 10 characters</span>
            <span className={comment.length >= 10 ? 'text-brand' : ''}>{comment.length} chars</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Attachments (Optional)</label>
          <div className="flex flex-wrap gap-3">
            {images.map((file, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center text-neutral-500 hover:border-brand hover:text-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-brand-surface"
              >
                <Upload className="w-6 h-6" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2">Max 5 images, 5MB each.</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        )}
        <Button type="submit" isLoading={isSubmitting}>Submit Review</Button>
      </div>
    </form>
  );
};