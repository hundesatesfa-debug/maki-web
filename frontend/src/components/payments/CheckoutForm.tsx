'use client';

import { useState } from 'react';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { PaymentMethodSelector, PaymentMethod } from './PaymentMethodSelector';

interface CheckoutFormProps {
  bookingId: string;
  amount: number;
  currency: 'ETB' | 'USD';
  paymentType: 'DEPOSIT' | 'MONTHLY_RENT' | 'FULL_PAYMENT';
  onSubmit: (method: PaymentMethod, amount: number) => Promise<{ redirectUrl?: string }>;
  isLoading?: boolean;
}

export function CheckoutForm({
  bookingId,
  amount,
  currency,
  paymentType,
  onSubmit,
  isLoading = false,
}: CheckoutFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleProceed = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await onSubmit(selectedMethod, amount);

      if (result?.redirectUrl) {
        // Redirect to payment gateway
        window.location.href = result.redirectUrl;
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initiation failed');
    } finally {
      setProcessing(false);
    }
  };

  const paymentTypeLabel = {
    DEPOSIT: 'Security Deposit',
    MONTHLY_RENT: 'Monthly Rent',
    FULL_PAYMENT: 'Full Payment',
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h3>

        <div className="space-y-3 pb-4 border-b border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Type:</span>
            <span className="font-medium text-gray-900">{paymentTypeLabel[paymentType]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-gray-900">
              {currency === 'ETB' ? 'ETB ' : '$'}
              {amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Currency:</span>
            <span className="font-medium text-gray-900">{currency}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between text-lg font-bold">
          <span className="text-gray-900">Total:</span>
          <span className="text-emerald-600">
            {currency === 'ETB' ? 'ETB ' : '$'}
            {amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <PaymentMethodSelector selected={selectedMethod} onSelect={setSelectedMethod} />

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex gap-3 rounded-lg bg-green-50 p-4">
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
          <p className="text-sm text-green-700">Payment initiated successfully. Redirecting to payment gateway...</p>
        </div>
      )}

      {/* Security Info */}
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">🔒 Secure Payment</p>
        <p>Your payment is processed by trusted payment gateways. We never store your card details.</p>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceed}
        disabled={processing || isLoading || !selectedMethod}
        className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-base font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing || isLoading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Proceed to Payment (${currency === 'ETB' ? 'ETB ' : '$'}${amount.toLocaleString()})`
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        By proceeding, you agree to our payment terms and conditions.
      </p>
    </div>
  );
}
