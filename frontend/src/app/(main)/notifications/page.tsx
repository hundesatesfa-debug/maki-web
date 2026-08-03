'use client';

import { useState, useEffect } from 'react';
import { Loader, AlertCircle, Bell, CheckCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export default function NotificationsPage() {
  const { notifications, isLoading, error, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    IN_APP: true,
    EMAIL: true,
    SMS: false,
    PUSH: false,
  });
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);

  const filteredNotifications = filter === 'unread' ? notifications?.filter((n) => !n.isRead) : notifications;

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, { emoji: string; color: string }> = {
      BOOKING_REQUEST: { emoji: '📋', color: 'bg-blue-100 text-blue-600' },
      PAYMENT_COMPLETED: { emoji: '✓', color: 'bg-green-100 text-green-600' },
      REVIEW_RECEIVED: { emoji: '⭐', color: 'bg-yellow-100 text-yellow-600' },
      BOOKING_ACCEPTED: { emoji: '✓', color: 'bg-emerald-100 text-emerald-600' },
      BOOKING_DECLINED: { emoji: '✗', color: 'bg-red-100 text-red-600' },
      KYC_VERIFIED: { emoji: '✓', color: 'bg-emerald-100 text-emerald-600' },
      LISTING_APPROVED: { emoji: '✓', color: 'bg-emerald-100 text-emerald-600' },
      LISTING_REJECTED: { emoji: '✗', color: 'bg-red-100 text-red-600' },
    };
    return icons[type] || { emoji: '📬', color: 'bg-gray-100 text-gray-600' };
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handlePreferenceChange = (channel: string) => {
    setPreferences({
      ...preferences,
      [channel]: !preferences[channel],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-6 w-6 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
          <p className="text-gray-600">Stay updated with booking requests, payments, and reviews</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex gap-2">
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
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Unread
                </button>
              </div>

              {notifications?.some((n) => !n.isRead) && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 rounded-lg bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Loading */}
            {isLoading ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white">
                <div className="text-center">
                  <Loader className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
                  <p className="mt-2 text-gray-600">Loading notifications...</p>
                </div>
              </div>
            ) : filteredNotifications && filteredNotifications.length > 0 ? (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => {
                  const { emoji, color } = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`rounded-lg border p-4 transition-colors ${
                        notification.isRead
                          ? 'bg-white border-gray-200 hover:bg-gray-50'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 text-lg ${color}`}>
                          {emoji}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{notification.title}</h4>
                              <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                              <p className="mt-2 text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex-shrink-0 rounded-full bg-blue-600 h-2 w-2 mt-2"
                                title="Mark as read"
                              />
                            )}
                          </div>

                          <div className="mt-3 flex gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="text-xs font-medium text-gray-500 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-gray-600">You're all caught up!</p>
              </div>
            )}
          </div>

          {/* Preferences Sidebar */}
          <div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>

              <div className="space-y-4">
                {Object.entries(preferences).map(([channel, enabled]) => (
                  <label key={channel} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => handlePreferenceChange(channel)}
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      disabled={isUpdatingPreferences}
                    />
                    <span className="text-sm font-medium text-gray-700">{channel}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500 p-3 bg-gray-50 rounded">
                <p className="font-medium mb-1">How notifications work:</p>
                <ul className="space-y-1 ml-2">
                  <li>• <strong>IN_APP:</strong> Show in your notification bell</li>
                  <li>• <strong>EMAIL:</strong> Send to your email address</li>
                  <li>• <strong>SMS:</strong> Text message to your phone</li>
                  <li>• <strong>PUSH:</strong> Mobile push notification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
