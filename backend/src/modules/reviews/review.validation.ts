import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    text: z.string().max(500).optional(),
    reviewType: z.enum(['PROPERTY', 'LANDLORD', 'TENANT']),
  }),
});

export const moderateReviewSchema = z.object({
  body: z.object({
    reviewId: z.string().uuid(),
    status: z.enum(['PUBLISHED', 'REJECTED']),
    moderationNotes: z.string().optional(),
  }),
});

export const getReviewsSchema = z.object({
  query: z.object({
    verified: z.enum(['true', 'false']).optional(),
    limit: z.coerce.number().default(20),
    offset: z.coerce.number().default(0),
  }),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type ModerateReviewInput = z.infer<typeof moderateReviewSchema>['body'];
