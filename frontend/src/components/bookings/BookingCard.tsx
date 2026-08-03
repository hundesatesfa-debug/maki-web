'use client';

import { format } from 'date-fns';
import { MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface BookingCardProps {
  booking: {
    id: string;
    propertyId: string;
    propertyTitle?: string;
    moveInDate: string;
    durationMonths: number;
    monthlyRent: number;
    depositAmount: number;
    status: 'REQUESTED' | 'CONFIRMED' | 'COUNTER_OFFERED' | 'PAID' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
  };
  role: 'tenant' | 'landlord';
  onAction?: (bookingId: string, action: string) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  REQUESTED: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Pending Review' },
  CONFIRMED: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Confirmed' },
  COUNTER_OFFERED: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Counter Offered' },
  PAID: { bg: 'bg-green-50', text: 'text-green-700', label: 'Paid' },
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Active Lease' },
  COMPLETED: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Completed' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', label: 'Cancelled' },
};

export function BookingCard({ booking, role, onAction }: BookingCardProps) {
  const statusColor = STATUS_COLORS[booking.status] || STATUS_COLORS.REQUESTED;
  const moveInDate = new Date(booking.moveInDate);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{booking.propertyTitle || 'Property'}</h3>
          <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
            {statusColor.label}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-emerald-600" />
          <span>Check-in: {format(moveInDate, 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-emerald-600" />
          <span>Duration: {booking.durationMonths} month{booking.durationMonths > 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          <span>Rent: ETB {booking.monthlyRent.toLocaleString()} / month | Deposit: ETB {booking.depositAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`${ROUTES.BOOKINGS}/${booking.id}`}
          className="flex-1 px-3 py-2 rounded-lg border border-emerald-600 text-emerald-600 text-sm font-medium hover:bg-emerald-50 text-center"
        >
          View Details
        </Link>
        {booking.status === 'REQUESTED' && role === 'landlord' && (
          <>
            <button
              onClick={() => onAction?.(booking.id, 'accept')}
              className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
            >
              Accept
            </button>
            <button
              onClick={() => onAction?.(booking.id, 'decline')}
              className="flex-1 px-3 py-2 rounded-lg border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50"
            >
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
}
