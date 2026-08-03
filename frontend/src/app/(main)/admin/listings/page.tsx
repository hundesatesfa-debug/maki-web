'use client';

import { Building2 } from 'lucide-react';
import { ListingModeration } from '@/components/admin/ListingModeration';
import { api } from '@/lib/api';

export default function AdminListingsPage() {
  const handleApproveListing = async (listingId: string) => {
    try {
      await api.admin.approveListing(listingId);
      // Refresh or show success
    } catch (err) {
      console.error('Failed to approve listing:', err);
    }
  };

  const handleRejectListing = async (listingId: string, reason: string) => {
    try {
      await api.admin.rejectListing(listingId, { reason });
      // Refresh or show success
    } catch (err) {
      console.error('Failed to reject listing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Listing Moderation</h1>
          </div>
          <p className="text-gray-600">Review and approve property listings</p>
        </div>

        {/* Listing Moderation Component */}
        <ListingModeration onApprove={handleApproveListing} onReject={handleRejectListing} />
      </div>
    </div>
  );
}
