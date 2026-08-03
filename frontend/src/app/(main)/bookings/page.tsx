'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, Calendar } from 'lucide-react';
import { BookingCard } from '@/components/bookings/BookingCard';
import { useBooking } from '@/hooks/useBooking';

export default function BookingsPage() {
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { bookings, isLoading: isLoadingBookings, error, acceptBooking, declineBooking } = useBooking();

  useEffect(() => {
    // Get user role from auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decoded.role?.toLowerCase() || 'tenant');
        setRole(decoded.role?.toLowerCase() === 'owner' ? 'landlord' : 'tenant');
      } catch (err) {
        console.error('Failed to decode token:', err);
        setRole('tenant');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAccept = async (bookingId: string) => {
    try {
      await acceptBooking(bookingId);
      // Refresh bookings
    } catch (err) {
      console.error('Failed to accept booking:', err);
    }
  };

  const handleDecline = async (bookingId: string) => {
    try {
      await declineBooking(bookingId);
      // Refresh bookings
    } catch (err) {
      console.error('Failed to decline booking:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          </div>
          <p className="text-gray-600">Manage your booking requests and reservations</p>
        </div>

        {/* Role Toggle (if admin/owner can view both) */}
        {userRole === 'owner' && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setRole('tenant')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                role === 'tenant'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              My Bookings (Tenant)
            </button>
            <button
              onClick={() => setRole('landlord')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                role === 'landlord'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              Booking Requests (Landlord)
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {isLoadingBookings && (
          <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <div className="text-center">
              <Loader className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
              <p className="mt-2 text-gray-600">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {!isLoadingBookings && bookings && bookings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                role={role}
                onAction={(bookingId, action) => {
                  if (action === 'accept') handleAccept(bookingId);
                  if (action === 'decline') handleDecline(bookingId);
                }}
              />
            ))}
          </div>
        ) : !isLoadingBookings ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-gray-600">
              {role === 'tenant'
                ? 'Start by requesting to book a property'
                : 'Booking requests from tenants will appear here'}
            </p>
          </div>
        ) : null}

        {/* Booking Status Info */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { status: 'REQUESTED', label: 'Pending', color: 'bg-blue-50 text-blue-700' },
            { status: 'CONFIRMED', label: 'Confirmed', color: 'bg-yellow-50 text-yellow-700' },
            { status: 'PAID', label: 'Paid', color: 'bg-green-50 text-green-700' },
            { status: 'ACTIVE', label: 'Active Lease', color: 'bg-emerald-50 text-emerald-700' },
          ].map(({ status, label, color }) => (
            <div key={status} className={`rounded-lg p-4 ${color}`}>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-2xl font-bold mt-1">
                {bookings?.filter((b) => b.status === status).length || 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
