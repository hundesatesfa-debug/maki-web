/**
 * Notification Service
 * Manages notifications across multiple channels
 */
export declare class NotificationService {
    /**
     * Create and send notification
     */
    static createNotification(data: {
        userId: string;
        type: string;
        title: string;
        message?: string;
        relatedId?: string;
        relatedType?: string;
        channels: string[];
    }): Promise<{
        success: boolean;
        message: string;
        notification?: undefined;
    } | {
        success: boolean;
        notification: {
            message: string | null;
            type: string;
            status: string;
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isRead: boolean;
            relatedId: string | null;
            relatedType: string | null;
            channels: string;
        };
        message?: undefined;
    }>;
    /**
     * Queue notification delivery to channels
     */
    private static queueChannelDelivery;
    /**
     * Get user notifications
     */
    static getUserNotifications(userId: string, filters?: {
        isRead?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<{
        notifications: {
            message: string | null;
            type: string;
            status: string;
            userId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            isRead: boolean;
            relatedId: string | null;
            relatedType: string | null;
            channels: string;
        }[];
        total: number;
        unreadCount: number;
    }>;
    /**
     * Mark notification as read
     */
    static markAsRead(notificationId: string, userId: string): Promise<{
        message: string | null;
        type: string;
        status: string;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        isRead: boolean;
        relatedId: string | null;
        relatedType: string | null;
        channels: string;
    }>;
    /**
     * Mark all notifications as read
     */
    static markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    /**
     * Get notification preferences
     */
    static getPreferences(userId: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        channel: string;
        enabled: boolean;
    }[]>;
    /**
     * Update notification preferences
     */
    static updatePreferences(userId: string, channel: string, enabled: boolean): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        channel: string;
        enabled: boolean;
    }>;
    /**
     * Delete notification
     */
    static deleteNotification(notificationId: string, userId: string): Promise<{
        message: string | null;
        type: string;
        status: string;
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        isRead: boolean;
        relatedId: string | null;
        relatedType: string | null;
        channels: string;
    }>;
    /**
     * Get unread count
     */
    static getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
}
//# sourceMappingURL=notification.service.d.ts.map