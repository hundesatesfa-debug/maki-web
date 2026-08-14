"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const apiError_1 = require("../../utils/apiError");
/**
 * Notification Service
 * Manages notifications across multiple channels
 */
class NotificationService {
    /**
     * Create and send notification
     */
    static async createNotification(data) {
        // Check user notification preferences
        const preferences = await database_1.default.notificationPreference.findMany({
            where: { userId: data.userId },
        });
        const preferenceMap = new Map(preferences.map((p) => [p.channel, p.enabled]));
        // Filter channels based on user preferences
        const enabledChannels = data.channels.filter((channel) => {
            const pref = preferenceMap.get(channel);
            return pref !== false; // Default to true if not explicitly disabled
        });
        if (enabledChannels.length === 0) {
            return { success: false, message: 'No enabled channels for this user' };
        }
        // Create notification record
        const notification = await database_1.default.notification.create({
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
    static async queueChannelDelivery(notificationId, channels) {
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
    static async getUserNotifications(userId, filters = {}) {
        const where = { userId };
        if (filters.isRead !== undefined) {
            where.isRead = filters.isRead;
        }
        const notifications = await database_1.default.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 20,
            skip: filters.offset || 0,
        });
        const total = await database_1.default.notification.count({ where });
        // Get unread count
        const unreadCount = await database_1.default.notification.count({
            where: { userId, isRead: false },
        });
        return { notifications, total, unreadCount };
    }
    /**
     * Mark notification as read
     */
    static async markAsRead(notificationId, userId) {
        const notification = await database_1.default.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw apiError_1.ApiError.notFound('Notification not found');
        }
        if (notification.userId !== userId) {
            throw apiError_1.ApiError.forbidden('Not authorized to update this notification');
        }
        return await database_1.default.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }
    /**
     * Mark all notifications as read
     */
    static async markAllAsRead(userId) {
        return await database_1.default.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
    /**
     * Get notification preferences
     */
    static async getPreferences(userId) {
        let preferences = await database_1.default.notificationPreference.findMany({
            where: { userId },
        });
        // If no preferences exist, create defaults
        if (preferences.length === 0) {
            const channels = ['IN_APP', 'EMAIL', 'SMS', 'PUSH'];
            const created = await Promise.all(channels.map((channel) => database_1.default.notificationPreference.create({
                data: {
                    userId,
                    channel,
                    enabled: channel === 'IN_APP' || channel === 'EMAIL', // Default: enable IN_APP and EMAIL
                },
            })));
            preferences = created;
        }
        return preferences;
    }
    /**
     * Update notification preferences
     */
    static async updatePreferences(userId, channel, enabled) {
        let preference = await database_1.default.notificationPreference.findFirst({
            where: { userId, channel },
        });
        if (!preference) {
            preference = await database_1.default.notificationPreference.create({
                data: { userId, channel, enabled },
            });
        }
        else {
            preference = await database_1.default.notificationPreference.update({
                where: { id: preference.id },
                data: { enabled },
            });
        }
        return preference;
    }
    /**
     * Delete notification
     */
    static async deleteNotification(notificationId, userId) {
        const notification = await database_1.default.notification.findUnique({
            where: { id: notificationId },
        });
        if (!notification) {
            throw apiError_1.ApiError.notFound('Notification not found');
        }
        if (notification.userId !== userId) {
            throw apiError_1.ApiError.forbidden('Not authorized to delete this notification');
        }
        return await database_1.default.notification.delete({
            where: { id: notificationId },
        });
    }
    /**
     * Get unread count
     */
    static async getUnreadCount(userId) {
        const count = await database_1.default.notification.count({
            where: { userId, isRead: false },
        });
        return { unreadCount: count };
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map