import { z } from 'zod';
export declare const initiatePaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
        amount: z.ZodNumber;
        currency: z.ZodEnum<["ETB", "USD"]>;
        paymentGateway: z.ZodEnum<["TELEBIRR", "PAYPAL", "STRIPE", "BANK_TRANSFER", "CHAPA"]>;
        paymentType: z.ZodDefault<z.ZodEnum<["DEPOSIT", "MONTHLY_RENT", "FULL_PAYMENT"]>>;
        idempotencyKey: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "ETB" | "USD";
        bookingId: string;
        paymentGateway: "TELEBIRR" | "PAYPAL" | "STRIPE" | "BANK_TRANSFER" | "CHAPA";
        paymentType: "DEPOSIT" | "MONTHLY_RENT" | "FULL_PAYMENT";
        idempotencyKey?: string | undefined;
    }, {
        amount: number;
        currency: "ETB" | "USD";
        bookingId: string;
        paymentGateway: "TELEBIRR" | "PAYPAL" | "STRIPE" | "BANK_TRANSFER" | "CHAPA";
        idempotencyKey?: string | undefined;
        paymentType?: "DEPOSIT" | "MONTHLY_RENT" | "FULL_PAYMENT" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        amount: number;
        currency: "ETB" | "USD";
        bookingId: string;
        paymentGateway: "TELEBIRR" | "PAYPAL" | "STRIPE" | "BANK_TRANSFER" | "CHAPA";
        paymentType: "DEPOSIT" | "MONTHLY_RENT" | "FULL_PAYMENT";
        idempotencyKey?: string | undefined;
    };
}, {
    body: {
        amount: number;
        currency: "ETB" | "USD";
        bookingId: string;
        paymentGateway: "TELEBIRR" | "PAYPAL" | "STRIPE" | "BANK_TRANSFER" | "CHAPA";
        idempotencyKey?: string | undefined;
        paymentType?: "DEPOSIT" | "MONTHLY_RENT" | "FULL_PAYMENT" | undefined;
    };
}>;
export declare const confirmPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        transactionId: z.ZodString;
        bookingId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        transactionId: string;
        bookingId: string;
    }, {
        transactionId: string;
        bookingId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        transactionId: string;
        bookingId: string;
    };
}, {
    body: {
        transactionId: string;
        bookingId: string;
    };
}>;
export declare const webhookPayloadSchema: z.ZodObject<{
    gatewayName: z.ZodString;
    rawBody: z.ZodString;
    signature: z.ZodString;
    headers: z.ZodRecord<z.ZodString, z.ZodString>;
}, "strip", z.ZodTypeAny, {
    headers: Record<string, string>;
    gatewayName: string;
    rawBody: string;
    signature: string;
}, {
    headers: Record<string, string>;
    gatewayName: string;
    rawBody: string;
    signature: string;
}>;
export declare const refundPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        paymentId: z.ZodString;
        amount: z.ZodOptional<z.ZodNumber>;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        paymentId: string;
        reason: string;
        amount?: number | undefined;
    }, {
        paymentId: string;
        reason: string;
        amount?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        paymentId: string;
        reason: string;
        amount?: number | undefined;
    };
}, {
    body: {
        paymentId: string;
        reason: string;
        amount?: number | undefined;
    };
}>;
export declare const bankTransferPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
        amount: z.ZodNumber;
        currency: z.ZodEnum<["ETB", "USD"]>;
        reference: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        currency: "ETB" | "USD";
        bookingId: string;
        reference: string;
    }, {
        amount: number;
        currency: "ETB" | "USD";
        bookingId: string;
        reference: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        amount: number;
        currency: "ETB" | "USD";
        bookingId: string;
        reference: string;
    };
}, {
    body: {
        amount: number;
        currency: "ETB" | "USD";
        bookingId: string;
        reference: string;
    };
}>;
export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>['body'];
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>['body'];
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>['body'];
export type BankTransferPaymentInput = z.infer<typeof bankTransferPaymentSchema>['body'];
//# sourceMappingURL=payment.validation.d.ts.map