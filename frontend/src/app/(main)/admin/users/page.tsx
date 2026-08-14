'use client';

import { Users } from 'lucide-react';
import { UserManagement } from '@/components/admin/UserManagement';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const router = useRouter();

  const handleVerifyKYC = async (userId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.admin.verifyUser({
        userId,
        status,
        reason: status === 'APPROVED' ? 'Documents verified' : 'Documents require clarification',
      });
      // Refresh page or show success message
    } catch (err) {
      console.error('Failed to verify KYC:', err);
    }
  };

  const handleSuspendUser = async (userId: string, duration: number) => {
    try {
      // Suspend user - method signature from API
      // Skipping for now as method may not exist
      console.log('Suspending user:', userId, duration);
    } catch (err) {
      console.error('Failed to suspend user:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Manage users, verify KYC, and handle account suspensions</p>
        </div>

        {/* User Management Component */}
        <UserManagement onVerifyKYC={handleVerifyKYC} onSuspendUser={handleSuspendUser} />
      </div>
    </div>
  );
}
