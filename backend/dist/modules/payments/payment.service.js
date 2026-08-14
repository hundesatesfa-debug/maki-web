"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const apiError_1 = require("../../utils/apiError");
const paymentSecurity_1 = require("../../utils/paymentSecurity");
const env_1 = require("../../config/env");
const telebirr_gateway_1 = require("./gateways/telebirr.gateway");
const paypal_gateway_1 = require("./gateways/paypal.gateway");
const stripe_gateway_1 = require("./gateways/stripe.gateway");
/**
 * Payment Service
 * Orchestrates payment processing across multiple gateways
 */
class PaymentService {
    gateways = new Map();
    constructor() {
        this.initializeGateways();
    }
    /**
     * Initialize all payment gateways
     */
    initializeGateways() {
        this.gateways.set('TELEBIRR', new telebirr_gateway_1.TelebirrGateway());
        this.gateways.set('PAYPAL', new paypal_gateway_1.PayPalGateway());
        this.gateways.set('STRIPE', new stripe_gateway_1.StripeGateway());
        // BANK_TRANSFER and CHAPA are handled manually
    }
    /**
     * Get gateway instance by name
     */
    getGateway(gatewayName) {
        const gateway = this.gateways.get(gatewayName);
        if (!gateway) {
            throw apiError_1.ApiError.badRequest(`Payment gateway not supported: ${gatewayName}`);
        }
        return gateway;
    }
    /**
     * Initiate payment process
     */
    async initiatePayment(data) {
        try {
            // Validate booking exists
            const booking = await database_1.default.booking.findUnique({
                where: { id: data.bookingId },
                include: { property: true },
            });
            if (!booking) {
                throw apiError_1.ApiError.notFound('Booking not found');
            }
            // Generate or validate idempotency key
            const idempotencyKey = data.idempotencyKey || paymentSecurity_1.PaymentSecurity.generateIdempotencyKey();
            // Check for duplicate payment (idempotency)
            const existingPayment = await database_1.default.payment.findUnique({
                where: { idempotencyKey },
            });
            if (existingPayment) {
                // Return previous result for idempotent request
                return {
                    success: true,
                    message: 'Payment already initiated with this idempotency key',
                    payment: existingPayment,
                    isIdempotent: true,
                };
            }
            // Create payment record in DB
            const payment = await database_1.default.payment.create({
                data: {
                    bookingId: data.bookingId,
                    amount: data.amount,
                    currency: data.currency,
                    paymentGateway: data.paymentGateway,
                    paymentType: data.paymentType,
                    status: 'PENDING',
                    idempotencyKey,
                    metadata: JSON.stringify({
                        initiatedAt: new Date().toISOString(),
                        initiatedBy: data.userId,
                    }),
                },
            });
            // Log audit
            await database_1.default.transactionAuditLog.create({
                data: paymentSecurity_1.PaymentSecurity.createAuditLog({
                    userId: data.userId,
                    bookingId: data.bookingId,
                    gatewayName: data.paymentGateway,
                    amount: data.amount,
                    currency: data.currency,
                    status: 'PENDING',
                    action: 'PAYMENT_INITIATED',
                    metadata: { paymentId: payment.id },
                }),
            });
            // Handle different payment gateways
            let paymentResult;
            if (data.paymentGateway === 'BANK_TRANSFER') {
                paymentResult = await this.initiateBankTransfer(payment.id, data);
            }
            else {
                const gateway = this.getGateway(data.paymentGateway);
                paymentResult = await gateway.initiatePayment({
                    amount: data.amount,
                    currency: data.currency,
                    orderId: payment.id,
                    bookingId: data.bookingId,
                    tenantId: booking.tenantId,
                    landlordId: booking.landlordId,
                    propertyTitle: booking.property.title,
                    metadata: { paymentId: payment.id },
                });
            }
            // Update payment with gateway reference
            await database_1.default.payment.update({
                where: { id: payment.id },
                data: {
                    paymentReference: paymentResult.paymentReference,
                    metadata: JSON.stringify(paymentResult.metadata || {}),
                },
            });
            return {
                success: true,
                payment,
                paymentResult,
            };
        }
        catch (error) {
            console.error('Payment initiation error:', error);
            throw error;
        }
    }
    /**
     * Handle bank transfer payment
     */
    async initiateBankTransfer(paymentId, data) {
        const bankDetails = {
            bankName: env_1.env.BANK_NAME || 'Dashen Bank',
            accountNumber: env_1.env.BANK_ACCOUNT_NUMBER || '1234567890',
            accountHolder: env_1.env.BANK_ACCOUNT_HOLDER || 'MAKI Platform',
            amount: data.amount,
            currency: data.currency,
            reference: `MAKI-${paymentId.substring(0, 8).toUpperCase()}`,
            dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
        };
        return {
            success: true,
            transactionId: paymentId,
            paymentReference: bankDetails.reference,
            status: 'PENDING',
            amount: data.amount,
            currency: data.currency,
            gatewayName: 'BANK_TRANSFER',
            metadata: bankDetails,
        };
    }
    /**
     * Process webhook from payment gateway
     */
    async processWebhook(data) {
        try {
            let webhookData;
            if (data.gatewayName === 'BANK_TRANSFER') {
                // Bank transfer webhook would be manual admin verification
                return { success: true, message: 'Bank transfer verified manually' };
            }
            const gateway = this.getGateway(data.gatewayName);
            webhookData = await gateway.verifyWebhook(data.rawBody, data.signature, data.headers);
            // Log webhook receipt
            await database_1.default.transactionAuditLog.create({
                data: paymentSecurity_1.PaymentSecurity.createAuditLog({
                    bookingId: webhookData.orderId,
                    gatewayName: data.gatewayName,
                    amount: webhookData.amount,
                    currency: webhookData.currency,
                    status: webhookData.status,
                    action: 'WEBHOOK_RECEIVED',
                    metadata: webhookData.metadata,
                }),
            });
            // Update payment status
            const payment = await database_1.default.payment.findFirst({
                where: { paymentReference: webhookData.transactionId },
            });
            if (!payment) {
                throw apiError_1.ApiError.notFound('Payment not found for webhook');
            }
            // Update payment status
            await database_1.default.payment.update({
                where: { id: payment.id },
                data: {
                    status: webhookData.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
                    metadata: JSON.stringify({
                        ...JSON.parse(payment.metadata || '{}'),
                        webhookData,
                    }),
                },
            });
            // If payment completed, update booking status
            if (webhookData.status === 'COMPLETED') {
                await this.handlePaymentSuccess(payment.id, payment.bookingId);
            }
            return { success: true, payment, webhookData };
        }
        catch (error) {
            console.error('Webhook processing error:', error);
            // Log webhook error
            await database_1.default.transactionAuditLog.create({
                data: paymentSecurity_1.PaymentSecurity.createAuditLog({
                    gatewayName: data.gatewayName,
                    status: 'FAILED',
                    action: 'WEBHOOK_ERROR',
                    errorMessage: error.message,
                }),
            });
            throw error;
        }
    }
    /**
     * Handle successful payment
     */
    async handlePaymentSuccess(paymentId, bookingId) {
        const payment = await database_1.default.payment.findUnique({
            where: { id: paymentId },
            include: { booking: true },
        });
        if (!payment)
            return;
        // Calculate commission
        const { commission, netAmount } = paymentSecurity_1.PaymentSecurity.calculateCommission(payment.amount, env_1.env.PAYMENT_COMMISSION_PERCENTAGE);
        // Create transaction records
        await database_1.default.transaction.create({
            data: {
                paymentId,
                userId: payment.booking.tenantId,
                amount: commission,
                type: 'COMMISSION_DEDUCTION',
                status: 'COMPLETED',
                idempotencyKey: `${paymentId}-commission`,
            },
        });
        await database_1.default.transaction.create({
            data: {
                paymentId,
                userId: payment.booking.landlordId,
                amount: netAmount,
                type: 'CHARGE',
                status: 'COMPLETED',
                idempotencyKey: `${paymentId}-landlord`,
            },
        });
        // Update booking status if deposit is paid
        if (payment.paymentType === 'DEPOSIT') {
            await database_1.default.booking.update({
                where: { id: bookingId },
                data: { status: 'PAID' },
            });
        }
        // Generate invoice
        await this.generateInvoice(paymentId);
        // Send notifications
        // This will be handled by notification service
    }
    /**
     * Generate invoice for payment
     */
    async generateInvoice(paymentId) {
        try {
            const payment = await database_1.default.payment.findUnique({
                where: { id: paymentId },
                include: {
                    booking: {
                        include: {
                            property: true,
                            tenant: true,
                            landlord: true,
                        },
                    },
                },
            });
            if (!payment)
                return;
            const invoiceNumber = paymentSecurity_1.PaymentSecurity.generateInvoiceNumber();
            const invoice = await database_1.default.invoice.create({
                data: {
                    paymentId,
                    invoiceNumber,
                    tenantId: payment.booking.tenantId,
                    landlordId: payment.booking.landlordId,
                    propertyId: payment.booking.propertyId,
                    amount: payment.amount,
                    currency: payment.currency,
                    pdfUrl: null, // PDF generation would happen asynchronously
                },
            });
            // In production, generate actual PDF and upload to cloud storage
            // For now, just store the invoice record
            return invoice;
        }
        catch (error) {
            console.error('Invoice generation error:', error);
            // Don't throw - invoice generation is non-critical
        }
    }
    /**
     * Process refund
     */
    async refundPayment(data) {
        try {
            const payment = await database_1.default.payment.findUnique({
                where: { id: data.paymentId },
                include: { booking: true },
            });
            if (!payment) {
                throw apiError_1.ApiError.notFound('Payment not found');
            }
            if (payment.status !== 'COMPLETED') {
                throw apiError_1.ApiError.badRequest('Only completed payments can be refunded');
            }
            const refundAmount = data.amount || payment.amount;
            if (refundAmount > payment.amount) {
                throw apiError_1.ApiError.badRequest('Refund amount cannot exceed payment amount');
            }
            // Process refund through gateway
            if (payment.paymentGateway !== 'BANK_TRANSFER') {
                const gateway = this.getGateway(payment.paymentGateway);
                const refundResult = await gateway.refundPayment(payment.paymentReference || '', refundAmount, data.reason);
                if (!refundResult.success) {
                    throw apiError_1.ApiError.internalServerError(`Refund failed: ${refundResult.errorMessage}`);
                }
            }
            // Update payment status
            await database_1.default.payment.update({
                where: { id: data.paymentId },
                data: { status: 'REFUNDED' },
            });
            // Log refund
            await database_1.default.transactionAuditLog.create({
                data: paymentSecurity_1.PaymentSecurity.createAuditLog({
                    userId: data.userId,
                    bookingId: payment.bookingId,
                    gatewayName: payment.paymentGateway,
                    amount: refundAmount,
                    currency: payment.currency,
                    status: 'COMPLETED',
                    action: 'REFUND_PROCESSED',
                    metadata: { reason: data.reason },
                }),
            });
            return { success: true, payment, refundAmount };
        }
        catch (error) {
            console.error('Refund error:', error);
            throw error;
        }
    }
    /**
     * Get payment status
     */
    async getPaymentStatus(paymentId) {
        const payment = await database_1.default.payment.findUnique({
            where: { id: paymentId },
            include: { booking: true },
        });
        if (!payment) {
            throw apiError_1.ApiError.notFound('Payment not found');
        }
        return payment;
    }
    /**
     * List user's payments
     */
    async listUserPayments(userId, filters = {}) {
        const payments = await database_1.default.payment.findMany({
            where: {
                booking: {
                    OR: [{ tenantId: userId }, { landlordId: userId }],
                },
                status: filters.status,
            },
            include: { booking: true },
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 20,
            skip: filters.offset || 0,
        });
        return payments;
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
//# sourceMappingURL=payment.service.js.map