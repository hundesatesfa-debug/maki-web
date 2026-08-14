'use client';

import { useEffect, useState } from 'react';
import { Loader, AlertCircle, BarChart3, Users, Building2, DollarSign, Clock } from 'lucide-react';
import { api } from '@/lib/api';

interface DashboardMetrics {
  overview: {
    totalUsers: number;
    totalListings: number;
    totalBookings: number;
    totalPayments: number;
    totalRevenue: number;
  };
  pending: {
    listings: number;
    kyc: number;
    disputes: number;
  };
  activity: {
    bookingsThisMonth: number;
    paymentsThisMonth: number;
  };
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.admin.getDashboard?.();
        if (response) {
          setMetrics(response.data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color = 'emerald',
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: string;
  }) => {
    const colorClasses = {
      emerald: 'bg-emerald-50 text-emerald-600',
      blue: 'bg-blue-50 text-blue-600',
      purple: 'bg-purple-50 text-purple-600',
      amber: 'bg-amber-50 text-amber-600',
    };

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className={`inline-block rounded-lg p-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
          {Icon}
        </div>
        <h3 className="mt-4 text-sm font-medium text-gray-600">{label}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Monitor platform metrics and manage content</p>
        </div>

        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Overview</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={<Users className="h-6 w-6" />}
              label="Total Users"
              value={metrics.overview.totalUsers.toLocaleString()}
              color="blue"
            />
            <StatCard
              icon={<Building2 className="h-6 w-6" />}
              label="Total Listings"
              value={metrics.overview.totalListings.toLocaleString()}
              color="purple"
            />
            <StatCard
              icon={<Clock className="h-6 w-6" />}
              label="Total Bookings"
              value={metrics.overview.totalBookings.toLocaleString()}
              color="amber"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6" />}
              label="Payments"
              value={metrics.overview.totalPayments.toLocaleString()}
              color="emerald"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6" />}
              label="Revenue"
              value={`ETB ${(metrics.overview.totalRevenue / 1000000).toFixed(1)}M`}
              color="emerald"
            />
          </div>
        </div>

        {/* Pending Items */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-yellow-900">Pending Listings</h3>
                <p className="mt-1 text-sm text-yellow-700">Awaiting approval</p>
              </div>
              <span className="inline-block rounded-full bg-yellow-200 px-3 py-1 text-2xl font-bold text-yellow-900">
                {metrics.pending.listings}
              </span>
            </div>
            <a
              href="/admin/listings"
              className="mt-4 inline-block text-sm font-medium text-yellow-600 hover:text-yellow-700"
            >
              Review listings →
            </a>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Pending KYC</h3>
                <p className="mt-1 text-sm text-blue-700">Awaiting verification</p>
              </div>
              <span className="inline-block rounded-full bg-blue-200 px-3 py-1 text-2xl font-bold text-blue-900">
                {metrics.pending.kyc}
              </span>
            </div>
            <a
              href="/admin/kyc"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Review KYC →
            </a>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-red-900">Open Disputes</h3>
                <p className="mt-1 text-sm text-red-700">Need resolution</p>
              </div>
              <span className="inline-block rounded-full bg-red-200 px-3 py-1 text-2xl font-bold text-red-900">
                {metrics.pending.disputes}
              </span>
            </div>
            <a
              href="/admin/disputes"
              className="mt-4 inline-block text-sm font-medium text-red-600 hover:text-red-700"
            >
              Resolve disputes →
            </a>
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <span className="text-gray-600">Bookings</span>
                <span className="text-2xl font-bold text-gray-900">
                  {metrics.activity.bookingsThisMonth}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payments</span>
                <span className="text-2xl font-bold text-gray-900">
                  {metrics.activity.paymentsThisMonth}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="/admin/users"
                className="block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Manage Users
              </a>
              <a
                href="/admin/listings"
                className="block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Review Listings
              </a>
              <a
                href="/admin/transactions"
                className="block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Transaction Logs
              </a>
              <a
                href="/admin/reports"
                className="block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Generate Reports
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
