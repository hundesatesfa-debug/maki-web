'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Bed, Bath, MapPin, Star, MessageCircle, Heart, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageOwnerModal } from '@/components/listings/MessageOwnerModal';
import { ListingMap } from '@/components/listings/ListingMap';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/axios';
import { formatHouseType, formatPrice, getListingImage } from '@/lib/listingImages';

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.id as string;
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${listingId}`);
        setListing(response.data.data.listing);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-2 text-gray-500">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Listing not found</p>
        </div>
      </div>
    );
  }

  const imageUrl = getListingImage(listing.houseType, listing.images[0]?.url);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Images Section */}
      <div className="mb-8 overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={listing.title}
          className="h-96 w-full object-cover"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                {listing.isPremium && (
                  <div className="mt-2 flex items-center gap-2 text-amber-600">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-semibold">Premium Listing</span>
                  </div>
                )}
              </div>
              <p className="text-right text-3xl font-bold text-emerald-600">
                {formatPrice(listing.price)}
              </p>
            </div>

            <div className="mb-6 space-y-2 text-gray-600">
              <p className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {listing.address}, {listing.city}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold">{formatHouseType(listing.houseType)}</span>
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Bed className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.bedrooms}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <Bath className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="text-lg font-semibold text-gray-900">{listing.bathrooms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">About this property</h2>
            <p className="text-gray-600">{listing.description}</p>
          </div>

          {/* Map */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Location</h2>
            <ListingMap
              listings={[
                {
                  id: listing.id,
                  title: listing.title,
                  latitude: listing.latitude,
                  longitude: listing.longitude,
                  price: listing.price,
                  address: listing.address,
                },
              ]}
              center={[listing.latitude, listing.longitude]}
              zoom={15}
              height="300px"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Owner Card */}
          <div className="sticky top-4 rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-500">Listed by</p>
              <h3 className="text-xl font-semibold text-gray-900">
                {listing.owner.firstName} {listing.owner.lastName}
              </h3>
              {listing.owner.phone && (
                <p className="text-sm text-gray-600">{listing.owner.phone}</p>
              )}
            </div>

            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => setShowMessageModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Save to Favorites
                  </Button>
                </>
              ) : (
                <Button
                  disabled
                  className="w-full"
                >
                  Login to Send Message
                </Button>
              )}
            </div>

            <div className="mt-6 space-y-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p>✅ Verified owner</p>
              <p>✅ Secure messaging</p>
              <p>✅ Protected payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {listing.owner && (
        <MessageOwnerModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          ownerId={listing.owner.id}
          ownerName={listing.owner.firstName}
          listingTitle={listing.title}
        />
      )}
    </div>
  );
}
