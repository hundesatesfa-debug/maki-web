import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { sendResponse } from '../../utils/apiResponse';

/**
 * Notification Controller
 */

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isRead, limit = 20, offset = 0 } = req.query;

    const result = await NotificationService.getUserNotifications(
      req.user?.userId || '',
      {
        isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      }
    );

    sendResponse(res, 200, true, 'Notifications retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.params;

    const notification = await NotificationService.markAsRead(
      notificationId,
      req.user?.userId || ''
    );

    sendResponse(res, 200, true, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await NotificationService.markAllAsRead(req.user?.userId || '');

    sendResponse(res, 200, true, 'All notifications marked as read', result);
  } catch (error) {
    next(error);
  }
};

export const getPreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const preferences = await NotificationService.getPreferences(req.user?.userId || '');

    sendResponse(res, 200, true, 'Notification preferences retrieved', { preferences });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { channel, enabled } = req.body;

    const preference = await NotificationService.updatePreferences(
      req.user?.userId || '',
      channel,
      enabled
    );

    sendResponse(res, 200, true, 'Notification preferences updated', preference);
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await NotificationService.getUnreadCount(req.user?.userId || '');

    sendResponse(res, 200, true, 'Unread count retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.params;

    await NotificationService.deleteNotification(notificationId, req.user?.userId || '');

    sendResponse(res, 200, true, 'Notification deleted');
  } catch (error) {
    next(error);
  }
};
