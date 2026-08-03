'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

/**
 * useNotifications Hook
 * Manages notification fetching, marking as read, and preferences
 */
export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Get notifications
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.notifications.getAll(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Get unread count
  const unreadCountQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.notifications.getUnreadCount(),
    refetchInterval: 30000,
  });

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      api.notifications.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications marked as read');
    },
  });

  // Get preferences
  const preferencesQuery = useQuery({
    queryKey: ['notifications', 'preferences'],
    queryFn: () => api.notifications.getPreferences(),
  });

  // Update preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: (data: { channel: string; enabled: boolean }) =>
      api.notifications.updatePreferences(data.channel, data.enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'preferences'] });
      toast.success('Notification preferences updated');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update preferences'
      );
    },
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) =>
      api.notifications.delete(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notificationsQuery,
    unreadCountQuery,
    markAsReadMutation,
    markAllAsReadMutation,
    preferencesQuery,
    updatePreferencesMutation,
    deleteNotificationMutation,
  };
};

export default useNotifications;
