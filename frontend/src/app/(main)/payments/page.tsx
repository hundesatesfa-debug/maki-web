'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, CreditCard } from 'lucide-react';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { api } from '@/lib/api';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentGateway: string;
  paymentType: string;
  bookingId: string;
  createdAt: string;
  invoiceId?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.payments.getAll({ status: filter === 'all' ? undefined : filter.toUpperCase() });
        setPayments(response.data.data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [filter]);

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await api.payments.downloadInvoice?.(invoiceId);
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    } catch (err) {
      console.error('Failed to download invoice:', err);
    }
  };

  const totalCompleted = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter((p) => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments =
    filter === 'all'
      ? payments
      : payments.filter((p) => p.status === filter.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          </div>
          <p className="text-gray-600">Track all your payments and download invoices</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Total Payments</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{payments.length}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
            <p className="text-sm text-green-700">Completed Payments</p>
            <p className="mt-2 text-3xl font-bold text-green-700">
              ETB {totalCompleted.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
            <p className="text-sm text-yellow-700">Pending Payments</p>
            <p className="mt-2 text-3xl font-bold text-yellow-700">
              ETB {totalPending.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Payment History */}
        <PaymentHistory
          payments={filteredPayments}
          isLoading={isLoading}
          onDownloadInvoice={handleDownloadInvoice}
        />

        {/* Help Section */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Payment Methods</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Telebirr - Ethiopia mobile money</li>
              <li>✓ PayPal - International payments</li>
              <li>✓ Stripe - Credit/Debit cards</li>
              <li>✓ Bank Transfer - Direct transfer</li>
            </ul>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="font-semibold text-green-900 mb-2">Security</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ PCI-DSS Compliant</li>
              <li>✓ HTTPS Encrypted</li>
              <li>✓ Secure Webhooks</li>
              <li>✓ Fraud Prevention</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
