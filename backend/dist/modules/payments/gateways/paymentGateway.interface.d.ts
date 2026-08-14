/**
 * Abstract Payment Gateway Interface
 * All payment gateway implementations should extend this
 */
export interface InitiatePaymentDTO {
    amount: number;
    currency: string;
    orderId: string;
    bookingId: string;
    tenantId: string;
    landlordId: string;
    propertyTitle: string;
    description?: string;
    metadata?: Record<string, any>;
    returnUrl?: string;
    cancelUrl?: string;
}
export interface PaymentResult {
    success: boolean;
    transactionId: string;
    paymentReference: string;
    status: string;
    redirectUrl?: string;
    amount: number;
    currency: string;
    gatewayName: string;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
export interface WebhookVerificationResult {
    isValid: boolean;
    transactionId: string;
    status: string;
    amount: number;
    currency: string;
    orderId: string;
    metadata?: Record<string, any>;
}
export interface RefundResult {
    success: boolean;
    refundId: string;
    amount: number;
    currency: string;
    status: string;
    errorMessage?: string;
}
export declare abstract class PaymentGateway {
    abstract name: string;
    abstract supportedCurrencies: string[];
    /**
     * Initialize payment with the gateway
     */
    abstract initiatePayment(dto: InitiatePaymentDTO): Promise<PaymentResult>;
    /**
     * Verify webhook signature and extract payment information
     */
    abstract verifyWebhook(rawBody: string, signature: string, headers: Record<string, string>): Promise<WebhookVerificationResult>;
    /**
     * Confirm/capture a payment after successful transaction
     */
    abstract confirmPayment(transactionId: string): Promise<PaymentResult>;
    /**
     * Process refund for a transaction
     */
    abstract refundPayment(transactionId: string, amount: number, reason: string): Promise<RefundResult>;
    /**
     * Get payment status
     */
    abstract getPaymentStatus(transactionId: string): Promise<{
        status: string;
        amount: number;
        currency: string;
    }>;
    /**
     * Check if gateway supports currency
     */
    supportsCurrency(currency: string): boolean;
}
//# sourceMappingURL=paymentGateway.interface.d.ts.map