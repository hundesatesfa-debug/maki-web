'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, Search, Shield, Ban } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  kycStatus: string;
  verified: boolean;
  createdAt: string;
}

interface UserManagementProps {
  onVerifyKYC?: (userId: string, status: 'APPROVED' | 'REJECTED') => void;
  onSuspendUser?: (userId: string, duration: number) => void;
}

export function UserManagement({ onVerifyKYC, onSuspendUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'OWNER' | 'RENTER'>('all');
  const [filterKYC, setFilterKYC] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');

  useEffect(() => {
    // Simulate fetching users
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'owner@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'OWNER',
        kycStatus: 'PENDING',
        verified: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'renter@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'RENTER',
        kycStatus: 'APPROVED',
        verified: true,
        createdAt: new Date().toISOString(),
      },
    ];
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesKYC = filterKYC === 'all' || user.kycStatus === filterKYC;

    return matchesSearch && matchesRole && matchesKYC;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Users
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email, name..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="roleFilter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Roles</option>
              <option value="OWNER">Owner</option>
              <option value="RENTER">Renter</option>
            </select>
          </div>

          <div>
            <label htmlFor="kycFilter" className="block text-sm font-medium text-gray-700 mb-2">
              KYC Status
            </label>
            <select
              id="kycFilter"
              value={filterKYC}
              onChange={(e) => setFilterKYC(e.target.value as typeof filterKYC)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">KYC Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      user.kycStatus === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : user.kycStatus === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.kycStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {user.verified ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Shield className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-gray-500">Not verified</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    {user.kycStatus === 'PENDING' && (
                      <>
                        <button
                          onClick={() => onVerifyKYC?.(user.id, 'APPROVED')}
                          className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onVerifyKYC?.(user.id, 'REJECTED')}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onSuspendUser?.(user.id, 30)}
                      className="flex items-center gap-1 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      <Ban className="h-4 w-4" />
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}
