"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listNotificationsSchema = exports.updateNotificationPreferencesSchema = exports.createNotificationSchema = void 0;
const zod_1 = require("zod");
exports.createNotificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
        type: zod_1.z.string(),
        title: zod_1.z.string(),
        message: zod_1.z.string().optional(),
        relatedId: zod_1.z.string().optional(),
        relatedType: zod_1.z.string().optional(),
        channels: zod_1.z.array(zod_1.z.enum(['IN_APP', 'EMAIL', 'SMS', 'PUSH'])).default(['IN_APP']),
    }),
});
exports.updateNotificationPreferencesSchema = zod_1.z.object({
    body: zod_1.z.object({
        channel: zod_1.z.enum(['IN_APP', 'EMAIL', 'SMS', 'PUSH']),
        enabled: zod_1.z.boolean(),
    }),
});
exports.listNotificationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        isRead: zod_1.z.enum(['true', 'false']).optional(),
        limit: zod_1.z.coerce.number().default(20),
        offset: zod_1.z.coerce.number().default(0),
    }),
});
//# sourceMappingURL=notification.validation.js.map