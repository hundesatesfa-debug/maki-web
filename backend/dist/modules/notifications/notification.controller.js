"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.getUnreadCount = exports.updatePreferences = exports.getPreferences = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const notification_service_1 = require("./notification.service");
const apiResponse_1 = require("../../utils/apiResponse");
/**
 * Notification Controller
 */
const getNotifications = async (req, res, next) => {
    try {
        const { isRead, limit = 20, offset = 0 } = req.query;
        const result = await notification_service_1.NotificationService.getUserNotifications(req.user?.userId || '', {
            isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Notifications retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        const notification = await notification_service_1.NotificationService.markAsRead(notificationId, req.user?.userId || '');
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Notification marked as read', notification);
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res, next) => {
    try {
        const result = await notification_service_1.NotificationService.markAllAsRead(req.user?.userId || '');
        (0, apiResponse_1.sendResponse)(res, 200, true, 'All notifications marked as read', result);
    }
    catch (error) {
        next(error);
    }
};
exports.markAllAsRead = markAllAsRead;
const getPreferences = async (req, res, next) => {
    try {
        const preferences = await notification_service_1.NotificationService.getPreferences(req.user?.userId || '');
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Notification preferences retrieved', { preferences });
    }
    catch (error) {
        next(error);
    }
};
exports.getPreferences = getPreferences;
const updatePreferences = async (req, res, next) => {
    try {
        const { channel, enabled } = req.body;
        const preference = await notification_service_1.NotificationService.updatePreferences(req.user?.userId || '', channel, enabled);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Notification preferences updated', preference);
    }
    catch (error) {
        next(error);
    }
};
exports.updatePreferences = updatePreferences;
const getUnreadCount = async (req, res, next) => {
    try {
        const result = await notification_service_1.NotificationService.getUnreadCount(req.user?.userId || '');
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Unread count retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.getUnreadCount = getUnreadCount;
const deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;
        await notification_service_1.NotificationService.deleteNotification(notificationId, req.user?.userId || '');
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Notification deleted');
    }
    catch (error) {
        next(error);
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=notification.controller.js.map