import { PaymentGateway, InitiatePaymentDTO, PaymentResult, WebhookVerificationResult, RefundResult } from './paymentGateway.interface';
/**
 * PayPal Checkout Integration
 * Handles payments via PayPal for international users
 */
export declare class PayPalGateway extends PaymentGateway {
    name: string;
    supportedCurrencies: string[];
    private clientId;
    private clientSecret;
    private isSandbox;
    private apiUrl;
    private accessToken;
    private tokenExpiry;
    constructor();
    /**
     * Get PayPal access token (cached for performance)
     */
    private getAccessToken;
    /**
     * Initiate PayPal checkout
     */
    initiatePayment(dto: InitiatePaymentDTO): Promise<PaymentResult>;
    /**
     * Verify PayPal webhook signature
     */
    verifyWebhook(rawBody: string, signature: string, headers: Record<string, string>): Promise<WebhookVerificationResult>;
    /**
     * Confirm/Capture PayPal payment
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
//# sourceMappingURL=paypal.gateway.d.ts.map