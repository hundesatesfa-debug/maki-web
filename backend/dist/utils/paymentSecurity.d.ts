/**
 * Payment Security Utilities for handling idempotency, webhook verification, and audit logging
 */
export declare class PaymentSecurity {
    /**
     * Generate a unique idempotency key
     */
    static generateIdempotencyKey(): string;
    /**
     * Verify webhook signature using HMAC-SHA256
     * @param payload - Raw request body (before parsing)
     * @param signature - Signature from webhook header
     * @param secret - Gateway secret key
     * @param headerName - Name of the signature header (e.g., 'X-Telebirr-Signature')
     */
    static verifyWebhookSignature(payload: string, signature: string, secret: string, headerName?: string): boolean;
    /**
     * Verify Telebirr webhook signature
     */
    static verifyTelebirrSignature(payload: string, signature: string, secret: string): boolean;
    /**
     * Verify PayPal webhook signature
     */
    static verifyPayPalSignature(webhookId: string, eventBody: string, signature: string, certUrl: string): boolean;
    /**
     * Verify Stripe webhook signature
     */
    static verifyStripeSignature(payload: string, signature: string, endpointSecret: string): boolean;
    /**
     * Calculate platform commission and net amount
     * @param amount - Gross payment amount
     * @param commissionPercentage - Platform commission rate (e.g., 2.5 for 2.5%)
     */
    static calculateCommission(amount: number, commissionPercentage: number): {
        commission: number;
        netAmount: number;
    };
    /**
     * Generate invoice number with format: INV-YYYYMMDD-XXXXX
     */
    static generateInvoiceNumber(): string;
    /**
     * Validate idempotency key format (should be UUID)
     */
    static isValidIdempotencyKey(key: string): boolean;
    /**
     * Create audit log object for transaction
     */
    static createAuditLog(data: {
        userId?: string;
        bookingId?: string;
        gatewayName: string;
        amount?: number;
        currency?: string;
        status: string;
        action: string;
        errorMessage?: string;
        metadata?: Record<string, any>;
    }): {
        userId: string | undefined;
        bookingId: string | undefined;
        gatewayName: string;
        amount: number | null;
        currency: string | null;
        status: string;
        action: string;
        errorMessage: string | null;
        metadata: string;
        createdAt: Date;
    };
    /**
     * Retry logic with exponential backoff for webhook processing
     */
    static retryWithBackoff<T>(fn: () => Promise<T>, maxRetries?: number, baseDelayMs?: number): Promise<T>;
    /**
     * Validate webhook timestamp to prevent replay attacks
     * @param timestamp - Webhook timestamp
     * @param maxAgeSeconds - Maximum age allowed (default 5 minutes)
     */
    static isValidWebhookTimestamp(timestamp: number, maxAgeSeconds?: number): boolean;
    /**
     * Hash sensitive data for logging (don't log full payment details)
     */
    static hashSensitiveData(data: string): string;
    /**
     * Mask card number for display: 4111****1111
     */
    static maskCardNumber(cardNumber: string): string;
}
/**
 * Idempotency Key Manager - Ensures requests are only processed once
 */
export declare class IdempotencyKeyManager {
    /**
     * Check if key has been processed before and return cached result
     */
    static checkAndStore(key: string, processor: () => Promise<any>, cache?: Map<string, any>): Promise<any>;
}
//# sourceMappingURL=paymentSecurity.d.ts.map