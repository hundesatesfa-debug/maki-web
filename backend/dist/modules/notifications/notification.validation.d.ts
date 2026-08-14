import { z } from 'zod';
export declare const createNotificationSchema: z.ZodObject<{
    body: z.ZodObject<{
        userId: z.ZodString;
        type: z.ZodString;
        title: z.ZodString;
        message: z.ZodOptional<z.ZodString>;
        relatedId: z.ZodOptional<z.ZodString>;
        relatedType: z.ZodOptional<z.ZodString>;
        channels: z.ZodDefault<z.ZodArray<z.ZodEnum<["IN_APP", "EMAIL", "SMS", "PUSH"]>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        userId: string;
        title: string;
        channels: ("IN_APP" | "EMAIL" | "SMS" | "PUSH")[];
        message?: string | undefined;
        relatedId?: string | undefined;
        relatedType?: string | undefined;
    }, {
        type: string;
        userId: string;
        title: string;
        message?: string | undefined;
        relatedId?: string | undefined;
        relatedType?: string | undefined;
        channels?: ("IN_APP" | "EMAIL" | "SMS" | "PUSH")[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        type: string;
        userId: string;
        title: string;
        channels: ("IN_APP" | "EMAIL" | "SMS" | "PUSH")[];
        message?: string | undefined;
        relatedId?: string | undefined;
        relatedType?: string | undefined;
    };
}, {
    body: {
        type: string;
        userId: string;
        title: string;
        message?: string | undefined;
        relatedId?: string | undefined;
        relatedType?: string | undefined;
        channels?: ("IN_APP" | "EMAIL" | "SMS" | "PUSH")[] | undefined;
    };
}>;
export declare const updateNotificationPreferencesSchema: z.ZodObject<{
    body: z.ZodObject<{
        channel: z.ZodEnum<["IN_APP", "EMAIL", "SMS", "PUSH"]>;
        enabled: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        channel: "IN_APP" | "EMAIL" | "SMS" | "PUSH";
        enabled: boolean;
    }, {
        channel: "IN_APP" | "EMAIL" | "SMS" | "PUSH";
        enabled: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        channel: "IN_APP" | "EMAIL" | "SMS" | "PUSH";
        enabled: boolean;
    };
}, {
    body: {
        channel: "IN_APP" | "EMAIL" | "SMS" | "PUSH";
        enabled: boolean;
    };
}>;
export declare const listNotificationsSchema: z.ZodObject<{
    query: z.ZodObject<{
        isRead: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        limit: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        offset: number;
        isRead?: "true" | "false" | undefined;
    }, {
        limit?: number | undefined;
        isRead?: "true" | "false" | undefined;
        offset?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        offset: number;
        isRead?: "true" | "false" | undefined;
    };
}, {
    query: {
        limit?: number | undefined;
        isRead?: "true" | "false" | undefined;
        offset?: number | undefined;
    };
}>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>['body'];
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>['body'];
//# sourceMappingURL=notification.validation.d.ts.map