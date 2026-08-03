import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid(),
    moveInDate: z.string().datetime(),
    durationMonths: z.number().int().positive().min(1),
    monthlyRent: z.number().positive(),
    depositAmount: z.number().positive(),
    message: z.string().max(500).optional(),
  }),
});

export const acceptBookingSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
  }),
});

export const declineBookingSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    reason: z.string().optional(),
  }),
});

export const counterOfferSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    moveInDate: z.string().datetime().optional(),
    monthlyRent: z.number().positive().optional(),
    depositAmount: z.number().positive().optional(),
    durationMonths: z.number().int().positive().optional(),
    message: z.string().optional(),
  }),
});

export const cancelBookingSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    reason: z.string().optional(),
  }),
});

export const getBookingsSchema = z.object({
  query: z.object({
    status: z.string().optional(),
    limit: z.coerce.number().default(20),
    offset: z.coerce.number().default(0),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
export type AcceptBookingInput = z.infer<typeof acceptBookingSchema>['body'];
export type DeclineBookingInput = z.infer<typeof declineBookingSchema>['body'];
export type CounterOfferInput = z.infer<typeof counterOfferSchema>['body'];
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>['body'];
