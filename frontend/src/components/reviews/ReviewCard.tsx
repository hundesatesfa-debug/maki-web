'use client';

import { Star } from 'lucide-react';

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  createdAt: string;
  isVerifiedStay: boolean;
  reviewerRole: 'tenant' | 'landlord';
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-900">{review.reviewerName}</p>
          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>

      {review.text && <p className="mb-3 text-sm text-gray-700">{review.text}</p>}

      <div className="flex flex-wrap gap-2">
        {review.isVerifiedStay && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            ✓ Verified Stay
          </span>
        )}
        {review.reviewerRole === 'landlord' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            ★ Verified Landlord
          </span>
        )}
      </div>
    </div>
  );
}
