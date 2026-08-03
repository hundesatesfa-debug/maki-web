'use client';

import { format } from 'date-fns';
import { Download, AlertCircle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

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

interface PaymentHistoryProps {
  payments?: Payment[];
  isLoading?: boolean;
  error?: string;
  onDownloadInvoice?: (invoiceId: string) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', label: 'Completed' },
  FAILED: { bg: 'bg-red-50', text: 'text-red-700', label: 'Failed' },
  REFUNDED: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Refunded' },
};

export function PaymentHistory({
  payments = [],
  isLoading = false,
  error = '',
  onDownloadInvoice,
}: PaymentHistoryProps) {
  if (error) {
    return (
      <div className="flex gap-3 rounded-lg bg-red-50 p-4">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No payment history yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Gateway</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const statusColor = STATUS_COLORS[payment.status] || STATUS_COLORS.PENDING;
            return (
              <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {payment.currency === 'ETB' ? 'ETB ' : '$'}
                  {payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                  {payment.paymentType.replace('_', ' ')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.paymentGateway}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                    {statusColor.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {payment.invoiceId && (
                    <button
                      onClick={() => onDownloadInvoice?.(payment.invoiceId!)}
                      className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                      <Download className="h-4 w-4" />
                      Invoice
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
