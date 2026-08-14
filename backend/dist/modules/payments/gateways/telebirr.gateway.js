"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelebirrGateway = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const paymentGateway_interface_1 = require("./paymentGateway.interface");
const env_1 = require("../../../config/env");
const apiError_1 = require("../../../utils/apiError");
const paymentSecurity_1 = require("../../../utils/paymentSecurity");
/**
 * Telebirr Payment Gateway Integration
 * Handles payments via Ethiopia's Telebirr mobile money service
 */
class TelebirrGateway extends paymentGateway_interface_1.PaymentGateway {
    name = 'TELEBIRR';
    supportedCurrencies = ['ETB'];
    apiUrl = env_1.env.TELEBIRR_TEST_MODE
        ? 'https://test.telebirr.api/api'
        : 'https://api.telebirr.com/api';
    apiKey = env_1.env.TELEBIRR_API_KEY || '';
    secretKey = env_1.env.TELEBIRR_SECRET_KEY || '';
    appId = env_1.env.TELEBIRR_APP_ID || '';
    merchantId = env_1.env.TELEBIRR_MERCHANT_ID || '';
    constructor() {
        super();
        if (!this.apiKey || !this.secretKey) {
            console.warn('Telebirr credentials not configured');
        }
    }
    /**
     * Initiate payment request with Telebirr
     */
    async initiatePayment(dto) {
        if (!this.supportsCurrency(dto.currency)) {
            throw apiError_1.ApiError.badRequest(`Telebirr does not support currency: ${dto.currency}`);
        }
        try {
            const payload = {
                appId: this.appId,
                merchantId: this.merchantId,
                orderId: dto.orderId,
                amount: dto.amount,
                currency: dto.currency,
                description: dto.description || `Rent payment for ${dto.propertyTitle}`,
                callbackUrl: `${env_1.env.CLIENT_URL}/api/v1/payments/webhook/telebirr`,
                returnUrl: dto.returnUrl || `${env_1.env.CLIENT_URL}/checkout/success`,
                notifyUrl: `${env_1.env.CLIENT_URL}/api/v1/payments/webhook/telebirr`,
                metadata: {
                    bookingId: dto.bookingId,
                    tenantId: dto.tenantId,
                    landlordId: dto.landlordId,
                    ...dto.metadata,
                },
            };
            const signature = this.generateSignature(payload);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'X-Telebirr-Signature': signature,
            };
            const response = await axios_1.default.post(`${this.apiUrl}/payment/initiate`, payload, { headers });
            if (!response.data.success) {
                throw apiError_1.ApiError.badRequest(`Telebirr error: ${response.data.message}`);
            }
            return {
                success: true,
                transactionId: response.data.transactionId,
                paymentReference: response.data.orderId,
                status: 'PENDING',
                redirectUrl: response.data.redirectUrl || `https://telebirr.et/pay/${response.data.transactionId}`,
                amount: dto.amount,
                currency: dto.currency,
                gatewayName: this.name,
                metadata: response.data,
            };
        }
        catch (error) {
            console.error('Telebirr initiate payment error:', error.message);
            throw apiError_1.ApiError.internalServerError(`Telebirr payment initiation failed: ${error.message}`);
        }
    }
    /**
     * Verify Telebirr webhook signature and extract payment info
     */
    async verifyWebhook(rawBody, signature, headers) {
        // Verify signature
        const isValid = paymentSecurity_1.PaymentSecurity.verifyTelebirrSignature(rawBody, signature, this.secretKey);
        if (!isValid) {
            throw apiError_1.ApiError.unauthorized('Invalid Telebirr webhook signature');
        }
        try {
            const payload = JSON.parse(rawBody);
            // Verify timestamp to prevent replay attacks
            const webhookTimestamp = parseInt(headers['x-telebirr-timestamp'] || '0');
            if (!paymentSecurity_1.PaymentSecurity.isValidWebhookTimestamp(webhookTimestamp)) {
                throw apiError_1.ApiError.badRequest('Webhook timestamp too old');
            }
            return {
                isValid: true,
                transactionId: payload.transactionId,
                status: payload.status === 'SUCCESS' ? 'COMPLETED' : payload.status,
                amount: payload.amount,
                currency: payload.currency || 'ETB',
                orderId: payload.orderId,
                metadata: payload.metadata,
            };
        }
        catch (error) {
            console.error('Telebirr webhook verification error:', error.message);
            throw apiError_1.ApiError.badRequest(`Webhook verification failed: ${error.message}`);
        }
    }
    /**
     * Confirm payment after successful transaction
     */
    async confirmPayment(transactionId) {
        try {
            const signature = this.generateSignature({ transactionId });
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'X-Telebirr-Signature': signature,
            };
            const response = await axios_1.default.get(`${this.apiUrl}/payment/status/${transactionId}`, { headers });
            if (!response.data.success) {
                return {
                    success: false,
                    transactionId,
                    paymentReference: '',
                    status: 'FAILED',
                    amount: 0,
                    currency: 'ETB',
                    gatewayName: this.name,
                    errorMessage: response.data.message,
                };
            }
            return {
                success: response.data.status === 'SUCCESS',
                transactionId: response.data.transactionId,
                paymentReference: response.data.orderId,
                status: response.data.status === 'SUCCESS' ? 'COMPLETED' : 'FAILED',
                amount: response.data.amount,
                currency: response.data.currency || 'ETB',
                gatewayName: this.name,
                metadata: response.data,
            };
        }
        catch (error) {
            console.error('Telebirr confirm payment error:', error.message);
            throw apiError_1.ApiError.internalServerError(`Payment confirmation failed: ${error.message}`);
        }
    }
    /**
     * Process refund
     */
    async refundPayment(transactionId, amount, reason) {
        try {
            const payload = {
                transactionId,
                amount,
                reason,
                appId: this.appId,
            };
            const signature = this.generateSignature(payload);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'X-Telebirr-Signature': signature,
            };
            const response = await axios_1.default.post(`${this.apiUrl}/payment/refund`, payload, { headers });
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            return {
                success: true,
                refundId: response.data.refundId,
                amount,
                currency: 'ETB',
                status: 'COMPLETED',
            };
        }
        catch (error) {
            console.error('Telebirr refund error:', error.message);
            return {
                success: false,
                refundId: '',
                amount,
                currency: 'ETB',
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
            const signature = this.generateSignature({ transactionId });
            const headers = {
                'Authorization': `Bearer ${this.apiKey}`,
                'X-Telebirr-Signature': signature,
            };
            const response = await axios_1.default.get(`${this.apiUrl}/payment/status/${transactionId}`, { headers });
            return {
                status: response.data.status === 'SUCCESS' ? 'COMPLETED' : response.data.status,
                amount: response.data.amount,
                currency: response.data.currency || 'ETB',
            };
        }
        catch (error) {
            console.error('Telebirr status check error:', error.message);
            throw apiError_1.ApiError.internalServerError(`Status check failed: ${error.message}`);
        }
    }
    /**
     * Generate HMAC signature for Telebirr requests
     */
    generateSignature(payload) {
        const jsonString = JSON.stringify(payload);
        const hmac = crypto_1.default.createHmac('sha256', this.secretKey);
        hmac.update(jsonString);
        return hmac.digest('hex');
    }
}
exports.TelebirrGateway = TelebirrGateway;
//# sourceMappingURL=telebirr.gateway.js.map