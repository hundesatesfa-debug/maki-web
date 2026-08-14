import { Request, Response, NextFunction } from 'express';
/**
 * Notification Controller
 */
export declare const getNotifications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const markAllAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPreferences: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updatePreferences: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUnreadCount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteNotification: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=notification.controller.d.ts.map