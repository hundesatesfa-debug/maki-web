"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeGateway = void 0;
const stripe_1 = __importDefault(require("stripe"));
const paymentGateway_interface_1 = require("./paymentGateway.interface");
const env_1 = require("../../../config/env");
const apiError_1 = require("../../../utils/apiError");
/**
 * Stripe Payment Gateway Integration
 * Handles credit/debit card payments with support for 3D Secure
 */
class StripeGateway extends paymentGateway_interface_1.PaymentGateway {
    name = 'STRIPE';
    supportedCurrencies = ['USD', 'ETB'];
    stripe;
    secretKey = env_1.env.STRIPE_SECRET_KEY || '';
    webhookSecret = env_1.env.STRIPE_WEBHOOK_SECRET || '';
    constructor() {
        super();
        this.stripe = new stripe_1.default(this.secretKey || '', {
            apiVersion: '2023-10-16', // Use compatible API version
        });
        if (!this.secretKey) {
            console.warn('Stripe secret key not configured');
        }
    }
    /**
     * Initiate Stripe payment intent
     */
    async initiatePayment(dto) {
        if (!this.supportsCurrency(dto.currency)) {
            throw apiError_1.ApiError.badRequest(`Stripe does not support currency: ${dto.currency}`);
        }
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: dto.amount, // Amount in cents
                currency: dto.currency.toLowerCase(),
                description: `${dto.propertyTitle} - Rental Payment`,
                metadata: {
                    bookingId: dto.bookingId,
                    tenantId: dto.tenantId,
                    landlordId: dto.landlordId,
                    orderId: dto.orderId,
                    propertyTitle: dto.propertyTitle,
                    ...dto.metadata,
                },
                return_url: dto.returnUrl || `${env_1.env.CLIENT_URL}/checkout/success`,
                confirmation_method: 'manual', // Manual confirmation for better control
            });
            return {
                success: true,
                transactionId: paymentIntent.id,
                paymentReference: paymentIntent.id,
                status: 'PENDING',
                amount: dto.amount,
                currency: dto.currency,
                gatewayName: this.name,
                metadata: {
                    clientSecret: paymentIntent.client_secret,
                    paymentIntentId: paymentIntent.id,
                    status: paymentIntent.status,
                },
            };
        }
        catch (error) {
            console.error('Stripe payment intent creation error:', error.message);
            throw apiError_1.ApiError.internalServerError(`Stripe payment creation failed: ${error.message}`);
        }
    }
    /**
     * Verify Stripe webhook signature
     */
    async verifyWebhook(rawBody, signature, headers) {
        try {
            // Verify webhook signature using Stripe's verification method
            const event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
            // Handle different event types
            let transactionId = '';
            let status = 'PENDING';
            let amount = 0;
            let currency = 'USD';
            let orderId = '';
            if (event.type === 'payment_intent.succeeded' ||
                event.type === 'payment_intent.payment_failed' ||
                event.type === 'payment_intent.canceled') {
                const paymentIntent = event.data.object;
                transactionId = paymentIntent.id;
                status =
                    paymentIntent.status === 'succeeded'
                        ? 'COMPLETED'
                        : paymentIntent.status === 'requires_action'
                            ? 'PENDING'
                            : 'FAILED';
                amount = paymentIntent.amount;
                currency = paymentIntent.currency.toUpperCase();
                orderId = paymentIntent.metadata?.orderId || paymentIntent.id;
            }
            else if (event.type === 'charge.refunded') {
                const charge = event.data.object;
                transactionId = charge.payment_intent;
                status = 'COMPLETED'; // Refund successful
                amount = charge.amount_refunded;
                currency = charge.currency.toUpperCase();
            }
            else {
                throw apiError_1.ApiError.badRequest('Unsupported event type');
            }
            return {
                isValid: true,
                transactionId,
                status,
                amount,
                currency,
                orderId,
                metadata: { event_type: event.type, event_id: event.id },
            };
        }
        catch (error) {
            console.error('Stripe webhook verification error:', error.message);
            throw apiError_1.ApiError.unauthorized(`Webhook verification failed: ${error.message}`);
        }
    }
    /**
     * Confirm/Capture Stripe payment
     */
    async confirmPayment(transactionId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(transactionId, {
                return_url: `${env_1.env.CLIENT_URL}/checkout/success`,
            });
            return {
                success: paymentIntent.status === 'succeeded',
                transactionId: paymentIntent.id,
                paymentReference: paymentIntent.id,
                status: paymentIntent.status === 'succeeded' ? 'COMPLETED' : 'FAILED',
                amount: paymentIntent.amount,
                currency: paymentIntent.currency.toUpperCase(),
                gatewayName: this.name,
                errorMessage: paymentIntent.last_payment_error?.message || undefined,
                metadata: {
                    paymentIntentId: paymentIntent.id,
                    status: paymentIntent.status,
                },
            };
        }
        catch (error) {
            console.error('Stripe confirm payment error:', error.message);
            return {
                success: false,
                transactionId,
                paymentReference: '',
                status: 'FAILED',
                amount: 0,
                currency: 'USD',
                gatewayName: this.name,
                errorMessage: error.message,
            };
        }
    }
    /**
     * Process refund
     */
    async refundPayment(transactionId, amount, reason) {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: transactionId,
                amount,
                reason: reason,
                metadata: { reason },
            });
            return {
                success: refund.status === 'succeeded',
                refundId: refund.id,
                amount: refund.amount,
                currency: refund.currency.toUpperCase(),
                status: refund.status === 'succeeded' ? 'COMPLETED' : 'FAILED',
            };
        }
        catch (error) {
            console.error('Stripe refund error:', error.message);
            return {
                success: false,
                refundId: '',
                amount,
                currency: 'USD',
                status: 'FAILED',
                errorMessage: error.message,
            };
        }
    }
    /**
     * Get payment status
     */
    async getPaymentStatus(transactionId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);
            return {
                status: paymentIntent.status === 'succeeded' ? 'COMPLETED' : paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency.toUpperCase(),
            };
        }
        catch (error) {
            console.error('Stripe status check error:', error.message);
            throw apiError_1.ApiError.internalServerError(`Status check failed: ${error.message}`);
        }
    }
}
exports.StripeGateway = StripeGateway;
//# sourceMappingURL=stripe.gateway.js.map