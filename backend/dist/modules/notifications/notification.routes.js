"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotificationController = __importStar(require("./notification.controller"));
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const notification_validation_1 = require("./notification.validation");
const router = (0, express_1.Router)();
/**
 * Notification Routes
 */
// Get user notifications
router.get('/', auth_1.authenticate, NotificationController.getNotifications);
// Get unread count
router.get('/unread-count', auth_1.authenticate, NotificationController.getUnreadCount);
// Mark notification as read
router.put('/:notificationId/read', auth_1.authenticate, NotificationController.markAsRead);
// Mark all as read
router.put('/mark-all-as-read', auth_1.authenticate, NotificationController.markAllAsRead);
// Get notification preferences
router.get('/preferences', auth_1.authenticate, NotificationController.getPreferences);
// Update notification preferences
router.put('/preferences', auth_1.authenticate, (0, validate_1.validate)(notification_validation_1.updateNotificationPreferencesSchema), NotificationController.updatePreferences);
// Delete notification
router.delete('/:notificationId', auth_1.authenticate, NotificationController.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map