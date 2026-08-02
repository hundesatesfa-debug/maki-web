'use client';

import { Star, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandlordCardProps {
  landlordId: string;
  name: string;
  avatar?: string;
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
  responseTimeHours?: number;
  responseRate?: number;
  totalListings?: number;
  onContact?: () => void;
}

export function LandlordCard({
  landlordId,
  name,
  avatar,
  averageRating,
  totalReviews,
  isVerified,
  responseTimeHours,
  responseRate,
  totalListings,
  onContact,
}: LandlordCardProps) {
  const getResponseQuality = () => {
    if (!responseTimeHours) return null;
    if (responseTimeHours < 2) return { label: 'Very Fast', color: 'text-green-600' };
    if (responseTimeHours < 12) return { label: 'Fast', color: 'text-emerald-600' };
    if (responseTimeHours < 48) return { label: 'Moderate', color: 'text-yellow-600' };
    return { label: 'Slow', color: 'text-red-600' };
  };

  const response = getResponseQuality();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex gap-4">
          {avatar ? (
            <img src={avatar} alt={name} className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  ✓ Verified
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3">
              {totalReviews > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {averageRating.toFixed(1)} ({totalReviews})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-4">
        {responseTimeHours !== undefined && (
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600">Avg. Response</span>
            </div>
            <p className={`mt-1 text-sm font-semibold ${response?.color}`}>
              ~{responseTimeHours}h
            </p>
            {response && <p className="text-xs text-gray-500">{response.label}</p>}
          </div>
        )}

        {responseRate !== undefined && (
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600">Response Rate</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-900">{responseRate}%</p>
            <p className="text-xs text-gray-500">Responds to inquiries</p>
          </div>
        )}

        {totalListings !== undefined && (
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-600">Listings</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-900">{totalListings}</p>
            <p className="text-xs text-gray-500">Active properties</p>
          </div>
        )}
      </div>

      {onContact && (
        <Button onClick={onContact} className="w-full bg-emerald-600 hover:bg-emerald-700">
          Contact Landlord
        </Button>
      )}
    </div>
  );
}
