'use client';

import { useState } from 'react';
import { Calendar, DollarSign, MessageSquare, Loader } from 'lucide-react';

interface BookingFormProps {
  propertyId: string;
  monthlyRent: number;
  depositAmount: number;
  onSubmit: (data: BookingRequest) => Promise<void>;
  isLoading?: boolean;
}

export interface BookingRequest {
  propertyId: string;
  moveInDate: string;
  durationMonths: number;
  monthlyRent: number;
  depositAmount: number;
  message: string;
}

export function BookingForm({
  propertyId,
  monthlyRent,
  depositAmount,
  onSubmit,
  isLoading = false,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    moveInDate: '',
    durationMonths: 1,
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.moveInDate) {
      setError('Please select a move-in date');
      return;
    }

    if (formData.durationMonths < 1 || formData.durationMonths > 60) {
      setError('Duration must be between 1 and 60 months');
      return;
    }

    try {
      await onSubmit({
        propertyId,
        moveInDate: formData.moveInDate,
        durationMonths: formData.durationMonths,
        monthlyRent,
        depositAmount,
        message: formData.message,
      });
      setSuccess(true);
      setFormData({ moveInDate: '', durationMonths: 1, message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold text-gray-900">Request to Book</h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Booking request sent! The owner will review and respond soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Move-in Date */}
        <div>
          <label htmlFor="moveInDate" className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline h-4 w-4 mr-1" />
            Move-in Date
          </label>
          <input
            id="moveInDate"
            type="date"
            value={formData.moveInDate}
            onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            disabled={isLoading}
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (months)
          </label>
          <input
            id="duration"
            type="number"
            min="1"
            max="60"
            value={formData.durationMonths}
            onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 1 })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            disabled={isLoading}
          />
        </div>

        {/* Cost Summary */}
        <div className="rounded-lg bg-gray-50 p-3 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Monthly Rent:</span>
            <span className="font-medium">ETB {monthlyRent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Deposit:</span>
            <span className="font-medium">ETB {depositAmount.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-gray-900 font-semibold">
            <span>Total (Deposit + First Month):</span>
            <span>ETB {(monthlyRent + depositAmount).toLocaleString()}</span>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            <MessageSquare className="inline h-4 w-4 mr-1" />
            Message to Owner (Optional)
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell the owner about yourself, any questions, etc."
            maxLength={300}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            disabled={isLoading}
          />
          <div className="mt-1 text-xs text-gray-500">
            {formData.message.length}/300 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Sending Request...' : 'Request to Book'}
        </button>
      </form>
    </div>
  );
}
