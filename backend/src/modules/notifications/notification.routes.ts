import { Router } from 'express';
import * as NotificationController from './notification.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { updateNotificationPreferencesSchema } from './notification.validation';

const router = Router();

/**
 * Notification Routes
 */

// Get user notifications
router.get(
  '/',
  authenticate,
  NotificationController.getNotifications
);

// Get unread count
router.get(
  '/unread-count',
  authenticate,
  NotificationController.getUnreadCount
);

// Mark notification as read
router.put(
  '/:notificationId/read',
  authenticate,
  NotificationController.markAsRead
);

// Mark all as read
router.put(
  '/mark-all-as-read',
  authenticate,
  NotificationController.markAllAsRead
);

// Get notification preferences
router.get(
  '/preferences',
  authenticate,
  NotificationController.getPreferences
);

// Update notification preferences
router.put(
  '/preferences',
  authenticate,
  validate(updateNotificationPreferencesSchema),
  NotificationController.updatePreferences
);

// Delete notification
router.delete(
  '/:notificationId',
  authenticate,
  NotificationController.deleteNotification
);

export default router;
