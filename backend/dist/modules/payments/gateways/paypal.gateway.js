"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayPalGateway = void 0;
const axios_1 = __importDefault(require("axios"));
const paymentGateway_interface_1 = require("./paymentGateway.interface");
const env_1 = require("../../../config/env");
const apiError_1 = require("../../../utils/apiError");
/**
 * PayPal Checkout Integration
 * Handles payments via PayPal for international users
 */
class PayPalGateway extends paymentGateway_interface_1.PaymentGateway {
    name = 'PAYPAL';
    supportedCurrencies = ['USD', 'ETB']; // PayPal primarily uses USD internationally
    clientId = env_1.env.PAYPAL_CLIENT_ID || '';
    clientSecret = env_1.env.PAYPAL_CLIENT_SECRET || '';
    isSandbox = env_1.env.PAYPAL_SANDBOX_MODE;
    apiUrl = this.isSandbox
        ? 'https://api-m.sandbox.paypal.com'
        : 'https://api-m.paypal.com';
    accessToken = '';
    tokenExpiry = 0;
    constructor() {
        super();
        if (!this.clientId || !this.clientSecret) {
            console.warn('PayPal credentials not configured');
        }
    }
    /**
     * Get PayPal access token (cached for performance)
     */
    async getAccessToken() {
        // Return cached token if still valid
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }
        try {
            const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            const response = await axios_1.default.post(`${this.apiUrl}/v1/oauth2/token`, 'grant_type=client_credentials', {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + response.data.expires_in * 1000 - 60000; // Refresh 1 min before expiry
            return this.accessToken;
        }
        catch (error) {
            console.error('PayPal token error:', error.message);
            throw apiError_1.ApiError.internalServerError('Failed to authenticate with PayPal');
        }
    }
    /**
     * Initiate PayPal checkout
     */
    async initiatePayment(dto) {
        // PayPal for international users should typically use USD
        const currency = dto.currency === 'ETB' ? 'USD' : dto.currency;
        if (!this.supportsCurrency(currency)) {
            throw apiError_1.ApiError.badRequest(`PayPal does not support currency: ${currency}`);
        }
        try {
            const accessToken = await this.getAccessToken();
            const payload = {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        reference_id: dto.orderId,
                        amount: {
                            currency_code: currency,
                            value: (dto.amount / 100).toFixed(2), // Convert cents to dollars
                            breakdown: {
                                item_total: {
                                    currency_code: currency,
                                    value: (dto.amount / 100).toFixed(2),
                                },
                            },
                        },
                        items: [
                            {
                                name: dto.propertyTitle,
                                description: dto.description || 'Rental payment',
                                quantity: '1',
                                unit_amount: {
                                    currency_code: currency,
                                    value: (dto.amount / 100).toFixed(2),
                                },
                            },
                        ],
                        custom_id: dto.bookingId,
                    },
                ],
                payment_source: {
                    paypal: {
                        experience_context: {
                            return_url: dto.returnUrl || `${env_1.env.CLIENT_URL}/checkout/success`,
                            cancel_url: dto.cancelUrl || `${env_1.env.CLIENT_URL}/checkout/cancel`,
                            shipping_preference: 'NO_SHIPPING',
                            user_action: 'PAY_NOW',
                        },
                    },
                },
                metadata: dto.metadata,
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'PayPal-Request-Id': dto.orderId, // Idempotency key
            };
            const response = await axios_1.default.post(`${this.apiUrl}/v2/checkout/orders`, payload, { headers });
            // Find approval link
            const approvalLink = response.data.links.find((link) => link.rel === 'approve');
            if (!approvalLink) {
                throw apiError_1.ApiError.internalServerError('No approval URL from PayPal');
            }
            return {
                success: true,
                transactionId: response.data.id,
                paymentReference: response.data.id,
                status: 'PENDING',
                redirectUrl: approvalLink.href,
                amount: dto.amount,
                currency: currency,
                gatewayName: this.name,
                metadata: {
                    orderId: response.data.id,
                    status: response.data.status,
                },
            };
        }
        catch (error) {
            console.error('PayPal initiate payment error:', error.message);
            throw apiError_1.ApiError.internalServerError(`PayPal payment initiation failed: ${error.message}`);
        }
    }
    /**
     * Verify PayPal webhook signature
     */
    async verifyWebhook(rawBody, signature, headers) {
        try {
            const accessToken = await this.getAccessToken();
            // PayPal webhook verification
            const verifyPayload = {
                transmission_id: headers['paypal-transmission-id'],
                transmission_time: headers['paypal-transmission-time'],
                cert_url: headers['paypal-cert-url'],
                auth_algo: headers['paypal-auth-algo'],
                transmission_sig: signature,
                webhook_id: env_1.env.PAYPAL_CLIENT_ID, // Use webhook ID from PayPal dashboard
                webhook_event: JSON.parse(rawBody),
            };
            const verifyResponse = await axios_1.default.post(`${this.apiUrl}/v1/notifications/verify-webhook-signature`, verifyPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (verifyResponse.data.verification_status !== 'SUCCESS') {
                throw apiError_1.ApiError.unauthorized('Invalid PayPal webhook signature');
            }
            // Extract payment information
            const event = JSON.parse(rawBody);
            const resource = event.resource;
            return {
                isValid: true,
                transactionId: resource.id,
                status: resource.status === 'COMPLETED' ? 'COMPLETED' : resource.status,
                amount: parseFloat(resource.amount_with_breakdown.gross_amount.value) * 100, // Convert to cents
                currency: resource.amount_with_breakdown.gross_amount.currency_code,
                orderId: resource.custom_id || event.id,
                metadata: { event_type: event.event_type, resource },
            };
        }
        catch (error) {
            console.error('PayPal webhook verification error:', error.message);
            throw apiError_1.ApiError.unauthorized(`Webhook verification failed: ${error.message}`);
        }
    }
    /**
     * Confirm/Capture PayPal payment
     */
    async confirmPayment(transactionId) {
        try {
            const accessToken = await this.getAccessToken();
            const response = await axios_1.default.post(`${this.apiUrl}/v2/checkout/orders/${transactionId}/capture`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const purchase = response.data.purchase_units[0];
            const payment = purchase.payments.captures[0];
            return {
                success: payment.status === 'COMPLETED',
                transactionId: response.data.id,
                paymentReference: payment.id,
                status: payment.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
                amount: parseFloat(payment.amount.value) * 100, // Convert to cents
                currency: payment.amount.currency_code,
                gatewayName: this.name,
                metadata: { orderId: response.data.id, paymentId: payment.id },
            };
        }
        catch (error) {
            console.error('PayPal confirm payment error:', error.message);
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
            const accessToken = await this.getAccessToken();
            const payload = {
                amount: {
                    currency_code: 'USD',
                    value: (amount / 100).toFixed(2),
                },
                note_to_payer: reason,
            };
            const response = await axios_1.default.post(`${this.apiUrl}/v2/payments/captures/${transactionId}/refund`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            return {
                success: response.data.status === 'COMPLETED',
                refundId: response.data.id,
                amount,
                currency: 'USD',
                status: response.data.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
            };
        }
        catch (error) {
            console.error('PayPal refund error:', error.message);
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
            const accessToken = await this.getAccessToken();
            const response = await axios_1.default.get(`${this.apiUrl}/v2/checkout/orders/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const purchase = response.data.purchase_units[0];
            const amount = purchase.payments.captures[0]
                ? parseFloat(purchase.payments.captures[0].amount.value) * 100
                : 0;
            return {
                status: response.data.status === 'APPROVED' ? 'PENDING' : response.data.status,
                amount,
                currency: purchase.amount.currency_code,
            };
        }
        catch (error) {
            console.error('PayPal status check error:', error.message);
            throw apiError_1.ApiError.internalServerError(`Status check failed: ${error.message}`);
        }
    }
}
exports.PayPalGateway = PayPalGateway;
//# sourceMappingURL=paypal.gateway.js.map