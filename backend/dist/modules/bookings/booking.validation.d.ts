import { z } from 'zod';
export declare const createBookingSchema: z.ZodObject<{
    body: z.ZodObject<{
        propertyId: z.ZodString;
        moveInDate: z.ZodString;
        durationMonths: z.ZodNumber;
        monthlyRent: z.ZodNumber;
        depositAmount: z.ZodNumber;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        propertyId: string;
        moveInDate: string;
        durationMonths: number;
        monthlyRent: number;
        depositAmount: number;
        message?: string | undefined;
    }, {
        propertyId: string;
        moveInDate: string;
        durationMonths: number;
        monthlyRent: number;
        depositAmount: number;
        message?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        propertyId: string;
        moveInDate: string;
        durationMonths: number;
        monthlyRent: number;
        depositAmount: number;
        message?: string | undefined;
    };
}, {
    body: {
        propertyId: string;
        moveInDate: string;
        durationMonths: number;
        monthlyRent: number;
        depositAmount: number;
        message?: string | undefined;
    };
}>;
export declare const acceptBookingSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        bookingId: string;
    }, {
        bookingId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        bookingId: string;
    };
}, {
    body: {
        bookingId: string;
    };
}>;
export declare const declineBookingSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        bookingId: string;
        reason?: string | undefined;
    }, {
        bookingId: string;
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        bookingId: string;
        reason?: string | undefined;
    };
}, {
    body: {
        bookingId: string;
        reason?: string | undefined;
    };
}>;
export declare const counterOfferSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
        moveInDate: z.ZodOptional<z.ZodString>;
        monthlyRent: z.ZodOptional<z.ZodNumber>;
        depositAmount: z.ZodOptional<z.ZodNumber>;
        durationMonths: z.ZodOptional<z.ZodNumber>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        bookingId: string;
        message?: string | undefined;
        moveInDate?: string | undefined;
        durationMonths?: number | undefined;
        monthlyRent?: number | undefined;
        depositAmount?: number | undefined;
    }, {
        bookingId: string;
        message?: string | undefined;
        moveInDate?: string | undefined;
        durationMonths?: number | undefined;
        monthlyRent?: number | undefined;
        depositAmount?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        bookingId: string;
        message?: string | undefined;
        moveInDate?: string | undefined;
        durationMonths?: number | undefined;
        monthlyRent?: number | undefined;
        depositAmount?: number | undefined;
    };
}, {
    body: {
        bookingId: string;
        message?: string | undefined;
        moveInDate?: string | undefined;
        durationMonths?: number | undefined;
        monthlyRent?: number | undefined;
        depositAmount?: number | undefined;
    };
}>;
export declare const cancelBookingSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        bookingId: string;
        reason?: string | undefined;
    }, {
        bookingId: string;
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        bookingId: string;
        reason?: string | undefined;
    };
}, {
    body: {
        bookingId: string;
        reason?: string | undefined;
    };
}>;
export declare const getBookingsSchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodString>;
        limit: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        offset: number;
        status?: string | undefined;
    }, {
        status?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        offset: number;
        status?: string | undefined;
    };
}, {
    query: {
        status?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    };
}>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
export type AcceptBookingInput = z.infer<typeof acceptBookingSchema>['body'];
export type DeclineBookingInput = z.infer<typeof declineBookingSchema>['body'];
export type CounterOfferInput = z.infer<typeof counterOfferSchema>['body'];
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>['body'];
//# sourceMappingURL=booking.validation.d.ts.map