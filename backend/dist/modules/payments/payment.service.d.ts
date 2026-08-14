import { PaymentResult } from './gateways/paymentGateway.interface';
/**
 * Payment Service
 * Orchestrates payment processing across multiple gateways
 */
export declare class PaymentService {
    private gateways;
    constructor();
    /**
     * Initialize all payment gateways
     */
    private initializeGateways;
    /**
     * Get gateway instance by name
     */
    private getGateway;
    /**
     * Initiate payment process
     */
    initiatePayment(data: {
        bookingId: string;
        amount: number;
        currency: string;
        paymentGateway: string;
        paymentType: string;
        idempotencyKey?: string;
        userId: string;
    }): Promise<{
        success: boolean;
        payment: any;
        isIdempotent?: boolean;
        message?: string;
        paymentResult?: PaymentResult;
    }>;
    /**
     * Handle bank transfer payment
     */
    private initiateBankTransfer;
    /**
     * Process webhook from payment gateway
     */
    processWebhook(data: {
        gatewayName: string;
        rawBody: string;
        signature: string;
        headers: Record<string, string>;
    }): Promise<{
        success: boolean;
        message: string;
        payment?: undefined;
        webhookData?: undefined;
    } | {
        success: boolean;
        payment: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentReference: string | null;
            amount: number;
            currency: string;
            metadata: string | null;
            bookingId: string;
            idempotencyKey: string | null;
            paymentGateway: string;
            paymentType: string;
        };
        webhookData: any;
        message?: undefined;
    }>;
    /**
     * Handle successful payment
     */
    private handlePaymentSuccess;
    /**
     * Generate invoice for payment
     */
    private generateInvoice;
    /**
     * Process refund
     */
    refundPayment(data: {
        paymentId: string;
        amount?: number;
        reason: string;
        userId: string;
    }): Promise<{
        success: boolean;
        payment: {
            booking: {
                message: string | null;
                status: string;
                id: string;
                responseTimeHours: number | null;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                landlordId: string;
                propertyId: string;
                moveInDate: Date;
                durationMonths: number;
                monthlyRent: number;
                depositAmount: number;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentReference: string | null;
            amount: number;
            currency: string;
            metadata: string | null;
            bookingId: string;
            idempotencyKey: string | null;
            paymentGateway: string;
            paymentType: string;
        };
        refundAmount: number;
    }>;
    /**
     * Get payment status
     */
    getPaymentStatus(paymentId: string): Promise<{
        booking: {
            message: string | null;
            status: string;
            id: string;
            responseTimeHours: number | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            landlordId: string;
            propertyId: string;
            moveInDate: Date;
            durationMonths: number;
            monthlyRent: number;
            depositAmount: number;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentReference: string | null;
        amount: number;
        currency: string;
        metadata: string | null;
        bookingId: string;
        idempotencyKey: string | null;
        paymentGateway: string;
        paymentType: string;
    }>;
    /**
     * List user's payments
     */
    listUserPayments(userId: string, filters?: any): Promise<({
        booking: {
            message: string | null;
            status: string;
            id: string;
            responseTimeHours: number | null;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            landlordId: string;
            propertyId: string;
            moveInDate: Date;
            durationMonths: number;
            monthlyRent: number;
            depositAmount: number;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        paymentReference: string | null;
        amount: number;
        currency: string;
        metadata: string | null;
        bookingId: string;
        idempotencyKey: string | null;
        paymentGateway: string;
        paymentType: string;
    })[]>;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=payment.service.d.ts.map