'use client';

import { useState } from 'react';
import { Loader, AlertCircle, Star } from 'lucide-react';

interface ReviewSubmitProps {
  bookingId: string;
  reviewType: 'PROPERTY' | 'LANDLORD' | 'TENANT';
  targetName: string;
  onSubmit: (data: ReviewSubmitData) => Promise<void>;
  isLoading?: boolean;
}

export interface ReviewSubmitData {
  bookingId: string;
  rating: number;
  text: string;
  reviewType: 'PROPERTY' | 'LANDLORD' | 'TENANT';
}

export function ReviewSubmit({
  bookingId,
  reviewType,
  targetName,
  onSubmit,
  isLoading = false,
}: ReviewSubmitProps) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviewTypeLabel = {
    PROPERTY: 'Property',
    LANDLORD: 'Landlord',
    TENANT: 'Tenant',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating < 1 || rating > 5) {
      setError('Please select a rating');
      return;
    }

    if (text.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    if (text.length > 500) {
      setError('Review must not exceed 500 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        bookingId,
        rating,
        text: text.trim(),
        reviewType,
      });
      setSuccess(true);
      setRating(5);
      setText('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Review {reviewTypeLabel[reviewType]}
      </h3>
      <p className="mb-6 text-sm text-gray-600">Rate your experience with {targetName}</p>

      {error && (
        <div className="mb-4 flex gap-2 rounded-lg bg-red-50 p-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          ✓ Review submitted successfully! It will appear after moderation.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredStar || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {rating === 5 && 'Excellent!'}
            {rating === 4 && 'Very Good'}
            {rating === 3 && 'Good'}
            {rating === 2 && 'Fair'}
            {rating === 1 && 'Poor'}
          </p>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="reviewText" className="mb-2 block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="reviewText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience... (10-500 characters)"
            maxLength={500}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            disabled={isSubmitting || isLoading}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>{text.length}/500 characters</span>
            {text.length < 10 && <span>Minimum 10 characters required</span>}
          </div>
        </div>

        {/* Verified Badge Info */}
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <p className="font-medium">✓ Verified Stay</p>
          <p className="mt-1">Your review will display as verified since you completed this booking.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading || text.length < 10}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
}
