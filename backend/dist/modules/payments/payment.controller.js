"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadInvoice = exports.refundPayment = exports.listPayments = exports.getPayment = exports.confirmPayment = exports.handleStripeWebhook = exports.handlePayPalWebhook = exports.handleTelebirrWebhook = exports.initiatePayment = void 0;
const payment_service_1 = require("./payment.service");
const apiResponse_1 = require("../../utils/apiResponse");
const apiError_1 = require("../../utils/apiError");
/**
 * Payment Controller
 * Handles payment-related HTTP requests
 */
const initiatePayment = async (req, res, next) => {
    try {
        const { bookingId, amount, currency, paymentGateway, paymentType, idempotencyKey } = req.body;
        const result = await payment_service_1.paymentService.initiatePayment({
            bookingId,
            amount,
            currency,
            paymentGateway,
            paymentType: paymentType || 'DEPOSIT',
            idempotencyKey,
            userId: req.user?.userId || '',
        });
        if (result.isIdempotent) {
            (0, apiResponse_1.sendResponse)(res, 200, true, 'Payment already initiated (idempotent)', {
                payment: result.payment,
                redirectUrl: result.paymentResult?.redirectUrl,
            });
        }
        else {
            (0, apiResponse_1.sendResponse)(res, 201, true, 'Payment initiated successfully', {
                payment: result.payment,
                redirectUrl: result.paymentResult?.redirectUrl,
                clientSecret: result.paymentResult?.metadata?.clientSecret,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.initiatePayment = initiatePayment;
/**
 * Telebirr Webhook Handler
 */
const handleTelebirrWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['x-telebirr-signature'];
        if (!signature) {
            throw apiError_1.ApiError.unauthorized('Missing signature header');
        }
        const result = await payment_service_1.paymentService.processWebhook({
            gatewayName: 'TELEBIRR',
            rawBody: JSON.stringify(req.body),
            signature,
            headers: req.headers,
        });
        // Always return 200 to acknowledge webhook
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Webhook processed', result);
    }
    catch (error) {
        console.error('Telebirr webhook error:', error);
        // Return 200 even on error to prevent webhook retry storms
        res.status(200).json({ success: false, error: error.message });
    }
};
exports.handleTelebirrWebhook = handleTelebirrWebhook;
/**
 * PayPal Webhook Handler
 */
const handlePayPalWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['paypal-transmission-sig'];
        if (!signature) {
            throw apiError_1.ApiError.unauthorized('Missing PayPal signature');
        }
        const result = await payment_service_1.paymentService.processWebhook({
            gatewayName: 'PAYPAL',
            rawBody: JSON.stringify(req.body),
            signature,
            headers: req.headers,
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'PayPal webhook processed', result);
    }
    catch (error) {
        console.error('PayPal webhook error:', error);
        res.status(200).json({ success: false, error: error.message });
    }
};
exports.handlePayPalWebhook = handlePayPalWebhook;
/**
 * Stripe Webhook Handler
 */
const handleStripeWebhook = async (req, res, next) => {
    try {
        const signature = req.headers['stripe-signature'];
        if (!signature) {
            throw apiError_1.ApiError.unauthorized('Missing Stripe signature');
        }
        const result = await payment_service_1.paymentService.processWebhook({
            gatewayName: 'STRIPE',
            rawBody: JSON.stringify(req.body),
            signature,
            headers: req.headers,
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Stripe webhook processed', result);
    }
    catch (error) {
        console.error('Stripe webhook error:', error);
        res.status(200).json({ success: false, error: error.message });
    }
};
exports.handleStripeWebhook = handleStripeWebhook;
/**
 * Confirm Payment (after 3D Secure or other verification)
 */
const confirmPayment = async (req, res, next) => {
    try {
        const { transactionId, bookingId } = req.body;
        // Verify booking belongs to user
        const booking = await (require('../../config/database').default).booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw apiError_1.ApiError.notFound('Booking not found');
        }
        if (booking.tenantId !== req.user?.userId && booking.landlordId !== req.user?.userId) {
            throw apiError_1.ApiError.forbidden('Not authorized to confirm this payment');
        }
        // Process refund through payment service
        const result = await payment_service_1.paymentService.getPaymentStatus(transactionId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Payment confirmed', result);
    }
    catch (error) {
        next(error);
    }
};
exports.confirmPayment = confirmPayment;
/**
 * Get Payment Details
 */
const getPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const payment = await payment_service_1.paymentService.getPaymentStatus(paymentId);
        // Check authorization
        if (payment.booking.tenantId !== req.user?.userId &&
            payment.booking.landlordId !== req.user?.userId) {
            throw apiError_1.ApiError.forbidden('Not authorized to view this payment');
        }
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Payment retrieved', payment);
    }
    catch (error) {
        next(error);
    }
};
exports.getPayment = getPayment;
/**
 * List User Payments
 */
const listPayments = async (req, res, next) => {
    try {
        const { status, limit = 20, offset = 0 } = req.query;
        const payments = await payment_service_1.paymentService.listUserPayments(req.user?.userId || '', {
            status,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Payments retrieved', { payments });
    }
    catch (error) {
        next(error);
    }
};
exports.listPayments = listPayments;
/**
 * Process Refund
 */
const refundPayment = async (req, res, next) => {
    try {
        const { paymentId, amount, reason } = req.body;
        if (!reason) {
            throw apiError_1.ApiError.badRequest('Refund reason is required');
        }
        const result = await payment_service_1.paymentService.refundPayment({
            paymentId,
            amount,
            reason,
            userId: req.user?.userId || '',
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Refund processed successfully', result);
    }
    catch (error) {
        next(error);
    }
};
exports.refundPayment = refundPayment;
/**
 * Download Invoice
 */
const downloadInvoice = async (req, res, next) => {
    try {
        const { invoiceId } = req.params;
        // Get invoice from database
        const prisma = require('../../config/database').default;
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                payment: {
                    include: {
                        booking: {
                            include: {
                                tenant: true,
                                landlord: true,
                                property: true,
                            },
                        },
                    },
                },
            },
        });
        if (!invoice) {
            throw apiError_1.ApiError.notFound('Invoice not found');
        }
        // Check authorization
        if (invoice.payment.booking.tenantId !== req.user?.userId &&
            invoice.payment.booking.landlordId !== req.user?.userId) {
            throw apiError_1.ApiError.forbidden('Not authorized to download this invoice');
        }
        // In production, generate or fetch PDF from cloud storage
        // For now, return invoice data
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Invoice retrieved', {
            invoiceNumber: invoice.invoiceNumber,
            tenantName: `${invoice.payment.booking.tenant.firstName} ${invoice.payment.booking.tenant.lastName}`,
            landlordName: `${invoice.payment.booking.landlord.firstName} ${invoice.payment.booking.landlord.lastName}`,
            propertyTitle: invoice.payment.booking.property.title,
            amount: invoice.amount,
            currency: invoice.currency,
            createdAt: invoice.createdAt,
            pdfUrl: invoice.pdfUrl,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.downloadInvoice = downloadInvoice;
//# sourceMappingURL=payment.controller.js.map