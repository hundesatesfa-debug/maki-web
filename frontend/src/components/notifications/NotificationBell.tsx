'use client';

import { Bell, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationBellProps {
  unreadCount?: number;
  recentNotifications?: Notification[];
  onViewAll?: () => void;
}

export function NotificationBell({
  unreadCount = 0,
  recentNotifications = [],
  onViewAll,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BOOKING_REQUEST':
        return '📋';
      case 'PAYMENT_COMPLETED':
        return '✓';
      case 'REVIEW_RECEIVED':
        return '⭐';
      case 'BOOKING_ACCEPTED':
        return '✓';
      case 'BOOKING_DECLINED':
        return '✗';
      default:
        return '📬';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
          <div className="border-b border-gray-200 px-4 py-3">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
            <Link
              href={ROUTES.NOTIFICATIONS}
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
