'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader, AlertCircle, Calendar, DollarSign, MapPin, User } from 'lucide-react';
import { CheckoutForm } from '@/components/payments/CheckoutForm';
import { ReviewSubmit } from '@/components/reviews/ReviewSubmit';
import { api } from '@/lib/api';

interface BookingDetails {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  tenantId: string;
  tenantName?: string;
  landlordId: string;
  landlordName?: string;
  moveInDate: string;
  durationMonths: number;
  monthlyRent: number;
  depositAmount: number;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState<'details' | 'payment' | 'review'>('details');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.bookings.getDetails(bookingId);
        setBooking(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch booking details');
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-2 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-red-700">{error || 'Booking not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const moveInDate = new Date(booking.moveInDate);
  const canPay = booking.status === 'CONFIRMED' || booking.status === 'COUNTER_OFFERED';
  const canReview = booking.status === 'COMPLETED';

  const tabs = [
    { id: 'details', label: 'Booking Details' },
    ...(canPay ? [{ id: 'payment', label: 'Make Payment' }] : []),
    ...(canReview ? [{ id: 'review', label: 'Leave Review' }] : []),
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking #{booking.id.slice(0, 8)}</h1>
          <p className="mt-1 text-gray-600">{booking.propertyTitle || 'Property'}</p>
        </div>

        {/* Status Badge */}
        <div className="mb-6 flex items-center gap-2">
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : booking.status === 'PAID'
                  ? 'bg-emerald-100 text-emerald-800'
                  : booking.status === 'CONFIRMED'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'COMPLETED'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
            }`}
          >
            {booking.status}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCurrentTab(id as typeof currentTab)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                currentTab === id
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {currentTab === 'details' && (
              <div className="space-y-6">
                {/* Booking Info */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 font-semibold text-gray-900">Booking Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Move-in Date</p>
                        <p className="font-medium text-gray-900">
                          {moveInDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium text-gray-900">
                          {booking.durationMonths} month{booking.durationMonths > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {booking.message && (
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-gray-600 mb-1">Message from {booking.tenantName || 'Tenant'}</p>
                        <p className="text-sm text-gray-900">{booking.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parties Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Tenant</h4>
                    </div>
                    <p className="font-medium text-gray-900">{booking.tenantName || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mt-1">Created {new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">Landlord</h4>
                    </div>
                    <p className="font-medium text-gray-900">{booking.landlordName || 'N/A'}</p>
                    <p className="text-sm text-gray-500 mt-1">Property Owner</p>
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'payment' && (
              <CheckoutForm
                bookingId={booking.id}
                amount={booking.depositAmount}
                currency="ETB"
                paymentType="DEPOSIT"
                onSubmit={async (method, amount) => {
                  // This will be replaced with actual API call
                  return { redirectUrl: `https://gateway.example.com/pay?amount=${amount}` };
                }}
              />
            )}

            {currentTab === 'review' && (
              <ReviewSubmit
                bookingId={booking.id}
                reviewType={booking.status === 'COMPLETED' && !booking.tenantId ? 'LANDLORD' : 'PROPERTY'}
                targetName={booking.propertyTitle || 'Property'}
                onSubmit={async (data) => {
                  // This will be replaced with actual API call
                  console.log('Review submitted:', data);
                }}
              />
            )}
          </div>

          {/* Sidebar: Cost Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm h-fit">
            <h3 className="mb-4 font-semibold text-gray-900">Cost Summary</h3>
            <div className="space-y-3 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Rent:</span>
                <span className="font-medium text-gray-900">ETB {booking.monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit:</span>
                <span className="font-medium text-gray-900">ETB {booking.depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">{booking.durationMonths} months</span>
              </div>
            </div>
            <div className="mt-4 pt-4 flex justify-between border-t border-gray-200">
              <span className="font-semibold text-gray-900">Total (First Month):</span>
              <span className="text-lg font-bold text-emerald-600">
                ETB {(booking.monthlyRent + booking.depositAmount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Clock } from 'lucide-react';
