import prisma from '../../config/database';
import { ApiError } from '../../utils/apiError';

/**
 * Notification Service
 * Manages notifications across multiple channels
 */
export class NotificationService {
  /**
   * Create and send notification
   */
  static async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message?: string;
    relatedId?: string;
    relatedType?: string;
    channels: string[];
  }) {
    // Check user notification preferences
    const preferences = await prisma.notificationPreference.findMany({
      where: { userId: data.userId },
    });

    const preferenceMap = new Map(
      preferences.map((p) => [p.channel, p.enabled])
    );

    // Filter channels based on user preferences
    const enabledChannels = data.channels.filter((channel) => {
      const pref = preferenceMap.get(channel);
      return pref !== false; // Default to true if not explicitly disabled
    });

    if (enabledChannels.length === 0) {
      return { success: false, message: 'No enabled channels for this user' };
    }

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        relatedId: data.relatedId,
        relatedType: data.relatedType,
        channels: JSON.stringify(enabledChannels),
        status: 'PENDING',
      },
    });

    // Queue delivery to enabled channels
    // In production, this would dispatch to message queue (e.g., Bull, RabbitMQ)
    await this.queueChannelDelivery(notification.id, enabledChannels);

    return { success: true, notification };
  }

  /**
   * Queue notification delivery to channels
   */
  private static async queueChannelDelivery(notificationId: string, channels: string[]) {
    // This would typically dispatch to a message queue or background jobs processor
    // For now, we'll just log it
    console.log(`Queuing notification ${notificationId} to channels: ${channels.join(', ')}`);

    // In production:
    // - IN_APP: Already stored in database
    // - EMAIL: Queue with SendGrid
    // - SMS: Queue with Africa's Talking
    // - PUSH: Queue with Firebase Cloud Messaging
  }

  /**
   * Get user notifications
   */
  static async getUserNotifications(
    userId: string,
    filters: {
      isRead?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const where: any = { userId };

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    const total = await prisma.notification.count({ where });

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { notifications, total, unreadCount };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw ApiError.notFound('Notification not found');
    }

    if (notification.userId !== userId) {
      throw ApiError.forbidden('Not authorized to update this notification');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Get notification preferences
   */
  static async getPreferences(userId: string) {
    let preferences = await prisma.notificationPreference.findMany({
      where: { userId },
    });

    // If no preferences exist, create defaults
    if (preferences.length === 0) {
      const channels = ['IN_APP', 'EMAIL', 'SMS', 'PUSH'];
      const created = await Promise.all(
        channels.map((channel) =>
          prisma.notificationPreference.create({
            data: {
              userId,
              channel,
              enabled: channel === 'IN_APP' || channel === 'EMAIL', // Default: enable IN_APP and EMAIL
            },
          })
        )
      );
      preferences = created;
    }

    return preferences;
  }

  /**
   * Update notification preferences
   */
  static async updatePreferences(
    userId: string,
    channel: string,
    enabled: boolean
  ) {
    let preference = await prisma.notificationPreference.findFirst({
      where: { userId, channel },
    });

    if (!preference) {
      preference = await prisma.notificationPreference.create({
        data: { userId, channel, enabled },
      });
    } else {
      preference = await prisma.notificationPreference.update({
        where: { id: preference.id },
        data: { enabled },
      });
    }

    return preference;
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw ApiError.notFound('Notification not found');
    }

    if (notification.userId !== userId) {
      throw ApiError.forbidden('Not authorized to delete this notification');
    }

    return await prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { unreadCount: count };
  }
}
