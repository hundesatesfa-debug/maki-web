import { z } from 'zod';

export const verifyUserSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    status: z.enum(['APPROVED', 'REJECTED']),
    reason: z.string().optional(),
  }),
});

export const suspendUserSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
    reason: z.string(),
    duration: z.number().optional(), // Duration in days
  }),
});

export const approveListingSchema = z.object({
  body: z.object({
    listingId: z.string().uuid(),
    reason: z.string().optional(),
  }),
});

export const rejectListingSchema = z.object({
  body: z.object({
    listingId: z.string().uuid(),
    reason: z.string(),
  }),
});

export const resolveDisputeSchema = z.object({
  body: z.object({
    decision: z.enum(['TENANT_WINS', 'LANDLORD_WINS', 'SPLIT']),
    refundAmount: z.number().positive(),
    notes: z.string().optional(),
  }),
});

export const setCommissionSchema = z.object({
  body: z.object({
    percentage: z.number().positive().max(100),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
  }),
});

export type VerifyUserInput = z.infer<typeof verifyUserSchema>['body'];
export type SuspendUserInput = z.infer<typeof suspendUserSchema>['body'];
export type ApproveListingInput = z.infer<typeof approveListingSchema>['body'];
export type RejectListingInput = z.infer<typeof rejectListingSchema>['body'];
export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>['body'];
export type SetCommissionInput = z.infer<typeof setCommissionSchema>['body'];
