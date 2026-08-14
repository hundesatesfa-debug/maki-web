import { PaymentGateway, InitiatePaymentDTO, PaymentResult, WebhookVerificationResult, RefundResult } from './paymentGateway.interface';
/**
 * Telebirr Payment Gateway Integration
 * Handles payments via Ethiopia's Telebirr mobile money service
 */
export declare class TelebirrGateway extends PaymentGateway {
    name: string;
    supportedCurrencies: string[];
    private apiUrl;
    private apiKey;
    private secretKey;
    private appId;
    private merchantId;
    constructor();
    /**
     * Initiate payment request with Telebirr
     */
    initiatePayment(dto: InitiatePaymentDTO): Promise<PaymentResult>;
    /**
     * Verify Telebirr webhook signature and extract payment info
     */
    verifyWebhook(rawBody: string, signature: string, headers: Record<string, string>): Promise<WebhookVerificationResult>;
    /**
     * Confirm payment after successful transaction
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
    /**
     * Generate HMAC signature for Telebirr requests
     */
    private generateSignature;
}
//# sourceMappingURL=telebirr.gateway.d.ts.map