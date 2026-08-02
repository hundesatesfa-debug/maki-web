'use client';

import { Star } from 'lucide-react';
import { ReviewCard } from './ReviewCard';

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  createdAt: string;
  isVerifiedStay: boolean;
  reviewerRole: 'tenant' | 'landlord';
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  title?: string;
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  title = 'Reviews',
}: ReviewsSectionProps) {
  const getRatingBadgeColor = () => {
    if (averageRating >= 4.5) return 'bg-green-50 text-green-700';
    if (averageRating >= 3.5) return 'bg-yellow-50 text-yellow-700';
    return 'bg-red-50 text-red-700';
  };

  const getHighlyRatedBadge = () => {
    return averageRating >= 4.5 ? (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        ⭐ Highly Rated
      </span>
    ) : null;
  };

  if (totalReviews === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {getHighlyRatedBadge()}
        </div>

        <div className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 ${getRatingBadgeColor()}`}>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
          <span className="text-sm">({totalReviews} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length > 3 && (
        <button className="w-full rounded-lg border border-emerald-600 py-2 text-center font-medium text-emerald-600 hover:bg-emerald-50">
          Load More Reviews
        </button>
      )}
    </div>
  );
}
