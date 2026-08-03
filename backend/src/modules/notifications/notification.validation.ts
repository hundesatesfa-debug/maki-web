import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    type: z.string(),
    title: z.string(),
    message: z.string().optional(),
    relatedId: z.string().optional(),
    relatedType: z.string().optional(),
    channels: z.array(z.enum(['IN_APP', 'EMAIL', 'SMS', 'PUSH'])).default(['IN_APP']),
  }),
});

export const updateNotificationPreferencesSchema = z.object({
  body: z.object({
    channel: z.enum(['IN_APP', 'EMAIL', 'SMS', 'PUSH']),
    enabled: z.boolean(),
  }),
});

export const listNotificationsSchema = z.object({
  query: z.object({
    isRead: z.enum(['true', 'false']).optional(),
    limit: z.coerce.number().default(20),
    offset: z.coerce.number().default(0),
  }),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>['body'];
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>['body'];
