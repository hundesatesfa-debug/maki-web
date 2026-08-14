"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsSchema = exports.cancelBookingSchema = exports.counterOfferSchema = exports.declineBookingSchema = exports.acceptBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
const isValidDate = (value) => !Number.isNaN(Date.parse(value));
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        propertyId: zod_1.z.string().uuid(),
        moveInDate: zod_1.z.string().refine(isValidDate, 'Invalid date'),
        durationMonths: zod_1.z.number().int().positive().min(1),
        monthlyRent: zod_1.z.number().positive(),
        depositAmount: zod_1.z.number().positive(),
        message: zod_1.z.string().max(500).optional(),
    }),
});
exports.acceptBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string().uuid(),
    }),
});
exports.declineBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string().uuid(),
        reason: zod_1.z.string().optional(),
    }),
});
exports.counterOfferSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string().uuid(),
        moveInDate: zod_1.z.string().refine(isValidDate, 'Invalid date').optional(),
        monthlyRent: zod_1.z.number().positive().optional(),
        depositAmount: zod_1.z.number().positive().optional(),
        durationMonths: zod_1.z.number().int().positive().optional(),
        message: zod_1.z.string().optional(),
    }),
});
exports.cancelBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string().uuid(),
        reason: zod_1.z.string().optional(),
    }),
});
exports.getBookingsSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.string().optional(),
        limit: zod_1.z.coerce.number().default(20),
        offset: zod_1.z.coerce.number().default(0),
    }),
});
//# sourceMappingURL=booking.validation.js.map