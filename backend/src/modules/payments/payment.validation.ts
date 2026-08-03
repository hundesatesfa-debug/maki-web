import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid('Invalid booking ID'),
    amount: z.number().positive('Amount must be positive'),
    currency: z.enum(['ETB', 'USD'], { message: 'Currency must be ETB or USD' }),
    paymentGateway: z.enum(['TELEBIRR', 'PAYPAL', 'STRIPE', 'BANK_TRANSFER', 'CHAPA']),
    paymentType: z.enum(['DEPOSIT', 'MONTHLY_RENT', 'FULL_PAYMENT']).default('DEPOSIT'),
    idempotencyKey: z.string().optional(), // UUID format
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    transactionId: z.string().min(1),
    bookingId: z.string().uuid(),
  }),
});

export const webhookPayloadSchema = z.object({
  gatewayName: z.string(),
  rawBody: z.string(),
  signature: z.string(),
  headers: z.record(z.string()),
});

export const refundPaymentSchema = z.object({
  body: z.object({
    paymentId: z.string().uuid(),
    amount: z.number().positive().optional(),
    reason: z.string().min(5, 'Reason must be at least 5 characters'),
  }),
});

export const bankTransferPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().uuid(),
    amount: z.number().positive(),
    currency: z.enum(['ETB', 'USD']),
    reference: z.string(),
  }),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>['body'];
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>['body'];
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>['body'];
export type BankTransferPaymentInput = z.infer<typeof bankTransferPaymentSchema>['body'];
