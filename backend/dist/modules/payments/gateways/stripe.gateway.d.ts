import { PaymentGateway, InitiatePaymentDTO, PaymentResult, WebhookVerificationResult, RefundResult } from './paymentGateway.interface';
/**
 * Stripe Payment Gateway Integration
 * Handles credit/debit card payments with support for 3D Secure
 */
export declare class StripeGateway extends PaymentGateway {
    name: string;
    supportedCurrencies: string[];
    private stripe;
    private secretKey;
    private webhookSecret;
    constructor();
    /**
     * Initiate Stripe payment intent
     */
    initiatePayment(dto: InitiatePaymentDTO): Promise<PaymentResult>;
    /**
     * Verify Stripe webhook signature
     */
    verifyWebhook(rawBody: string, signature: string, headers: Record<string, string>): Promise<WebhookVerificationResult>;
    /**
     * Confirm/Capture Stripe payment
     */
    confirmPayment(transactionId: string): Promise<PaymentResult>;
    /**
     * Process refund
     */
    refundPayment(transactionId: string, amount: number, reason: string): Promise<RefundResult>;
    /**
     * Get payment status
     */
    getPaymentStatus(transactionId: string): Promise<{
        status: string;
        amount: number;
        currency: string;
    }>;
}
//# sourceMappingURL=stripe.gateway.d.ts.map