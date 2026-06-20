export type NotificationType = 'NEW_MESSAGE' | 'LISTING_UPDATE' | 'PREMIUM_EXPIRY';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}
