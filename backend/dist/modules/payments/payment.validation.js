"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankTransferPaymentSchema = exports.refundPaymentSchema = exports.webhookPayloadSchema = exports.confirmPaymentSchema = exports.initiatePaymentSchema = void 0;
const zod_1 = require("zod");
exports.initiatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string().uuid('Invalid booking ID'),
        amount: zod_1.z.number().positive('Amount must be positive'),
        currency: zod_1.z.enum(['ETB', 'USD'], { message: 'Currency must be ETB or USD' }),
        paymentGateway: zod_1.z.enum(['TELEBIRR', 'PAYPAL', 'STRIPE', 'BANK_TRANSFER', 'CHAPA']),
        paymentType: zod_1.z.enum(['DEPOSIT', 'MONTHLY_RENT', 'FULL_PAYMENT']).default('DEPOSIT'),
        idempotencyKey: zod_1.z.string().optional(), // UUID format
    }),
});
exports.confirmPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        transactionId: zod_1.z.string().min(1),
        bookingId: zod_1.z.string().uuid(),
    }),
});
exports.webhookPayloadSchema = zod_1.z.object({
    gatewayName: zod_1.z.string(),
    rawBody: zod_1.z.string(),
    signature: zod_1.z.string(),
    headers: zod_1.z.record(zod_1.z.string()),
});
exports.refundPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentId: zod_1.z.string().uuid(),
        amount: zod_1.z.number().positive().optional(),
        reason: zod_1.z.string().min(5, 'Reason must be at least 5 characters'),
    }),
});
exports.bankTransferPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string().uuid(),
        amount: zod_1.z.number().positive(),
        currency: zod_1.z.enum(['ETB', 'USD']),
        reference: zod_1.z.string(),
    }),
});
//# sourceMappingURL=payment.validation.js.map