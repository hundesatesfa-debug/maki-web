'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Bed, Bath, MapPin, Star, MessageCircle, Heart, Loader, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageOwnerModal } from '@/components/listings/MessageOwnerModal';
import { ListingMap } from '@/components/listings/ListingMap';
import { BookingForm } from '@/components/bookings/BookingForm';
import { ReviewsSection } from '@/components/reviews/ReviewsSection';
import { useAuthStore } from '@/store/authStore';
import { useBooking } from '@/hooks/useBooking';
import { api } from '@/lib/axios';
import { formatHouseType, formatPrice, getListingImage } from '@/lib/listingImages';

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.id as string;
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'booking' | 'reviews'>('details');
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { createBooking } = useBooking();

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

  const handleBookingSubmit = async (bookingData: any) => {
    try {
      await createBooking(bookingData);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  };

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

      {bookingSuccess && (
        <div className="mb-6 flex gap-3 rounded-lg bg-green-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
          <p className="text-green-700">Booking request sent successfully! Check your bookings page for updates.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'details'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'booking'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Book Now
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'reviews'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Reviews
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'details' && (
            <>
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
            </>
          )}

          {activeTab === 'booking' && (
            <>
              {isAuthenticated ? (
                <BookingForm
                  propertyId={listing.id}
                  monthlyRent={listing.price}
                  depositAmount={listing.price * 2}
                  onSubmit={handleBookingSubmit}
                />
              ) : (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-blue-600 mb-3" />
                  <p className="text-blue-900 font-medium">Login required</p>
                  <p className="text-blue-700 text-sm mt-1">Please login to send a booking request</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Login to Book
                  </Button>
                </div>
              )}
            </>
          )}

          {activeTab === 'reviews' && (
            <ReviewsSection propertyId={listing.id} />
          )}
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
