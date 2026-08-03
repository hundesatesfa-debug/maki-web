'use client';

import { AlertTriangle } from 'lucide-react';
import { DisputeResolution } from '@/components/admin/DisputeResolution';
import { api } from '@/lib/api';

export default function AdminDisputesPage() {
  const handleResolveDispute = async (
    disputeId: string,
    decision: string,
    refundAmount: number
  ) => {
    try {
      await api.admin.resolveDispute(disputeId, {
        decision,
        refundAmount,
        notes: 'Dispute resolved',
      });
      // Refresh or show success
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Dispute Resolution</h1>
          </div>
          <p className="text-gray-600">Review and resolve booking disputes</p>
        </div>

        {/* Dispute Resolution Component */}
        <DisputeResolution onResolve={handleResolveDispute} />
      </div>
    </div>
  );
}
