'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, Eye, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ListingForModeration {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  createdAt: string;
}

interface ListingModerationProps {
  onApprove?: (listingId: string) => void;
  onReject?: (listingId: string, reason: string) => void;
}

export function ListingModeration({ onApprove, onReject }: ListingModerationProps) {
  const [listings, setListings] = useState<ListingForModeration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<ListingForModeration | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    // Simulate fetching pending listings
    const mockListings: ListingForModeration[] = [
      {
        id: '1',
        title: 'Beautiful Apartment in Addis Ababa',
        ownerId: 'owner1',
        ownerName: 'John Doe',
        status: 'PENDING',
        city: 'Addis Ababa',
        price: 5000,
        bedrooms: 2,
        bathrooms: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Modern Villa in Bole',
        ownerId: 'owner2',
        ownerName: 'Jane Smith',
        status: 'PENDING',
        city: 'Addis Ababa',
        price: 12000,
        bedrooms: 4,
        bathrooms: 2,
        createdAt: new Date().toISOString(),
      },
    ];
    setListings(mockListings);
    setIsLoading(false);
  }, []);

  const pendingListings = listings.filter((l) => l.status === 'PENDING');

  const handleApprove = (listing: ListingForModeration) => {
    onApprove?.(listing.id);
    setListings(listings.filter((l) => l.id !== listing.id));
  };

  const handleReject = () => {
    if (selectedListing && rejectReason.trim()) {
      onReject?.(selectedListing.id, rejectReason);
      setListings(listings.filter((l) => l.id !== selectedListing.id));
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedListing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total Listings</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{listings.length}</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="mt-1 text-2xl font-bold text-yellow-700">{pendingListings.length}</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-700">
            {listings.filter((l) => l.status === 'APPROVED').length}
          </p>
        </div>
      </div>

      {/* Pending Listings */}
      <div className="space-y-4">
        {pendingListings.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-3" />
            <p className="text-gray-900 font-medium">All caught up!</p>
            <p className="text-gray-500 text-sm mt-1">No pending listings to review</p>
          </div>
        ) : (
          pendingListings.map((listing) => (
            <div key={listing.id} className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    By {listing.ownerName} • {listing.city}
                  </p>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium text-gray-900">ETB {listing.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                      <p className="font-medium text-gray-900">{listing.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bathrooms</p>
                      <p className="font-medium text-gray-900">{listing.bathrooms}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Submitted: {format(new Date(listing.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleApprove(listing)}
                    className="flex items-center justify-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedListing(listing);
                      setShowRejectModal(true);
                    }}
                    className="flex items-center justify-center gap-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button className="flex items-center justify-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Listing</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting "{selectedListing.title}"
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (e.g., Images don't match description, misleading pricing, etc.)"
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedListing(null);
                  setRejectReason('');
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
