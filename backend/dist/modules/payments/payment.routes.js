"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController = __importStar(require("./payment.controller"));
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const payment_validation_1 = require("./payment.validation");
const router = (0, express_1.Router)();
/**
 * Payment Routes
 */
// Initialize payment (requires authentication)
router.post('/initiate', auth_1.authenticate, (0, validate_1.validate)(payment_validation_1.initiatePaymentSchema), PaymentController.initiatePayment);
// Confirm payment (e.g., after 3D Secure)
router.post('/confirm', auth_1.authenticate, PaymentController.confirmPayment);
// Get payment details
router.get('/:paymentId', auth_1.authenticate, PaymentController.getPayment);
// List user's payments
router.get('/', auth_1.authenticate, PaymentController.listPayments);
// Process refund
router.post('/:paymentId/refund', auth_1.authenticate, (0, validate_1.validate)(payment_validation_1.refundPaymentSchema), PaymentController.refundPayment);
// Download invoice
router.get('/invoices/:invoiceId/download', auth_1.authenticate, PaymentController.downloadInvoice);
/**
 * Webhook Routes (no authentication required)
 */
// Telebirr webhook
router.post('/webhook/telebirr', PaymentController.handleTelebirrWebhook);
// PayPal webhook
router.post('/webhook/paypal', PaymentController.handlePayPalWebhook);
// Stripe webhook
router.post('/webhook/stripe', PaymentController.handleStripeWebhook);
exports.default = router;
//# sourceMappingURL=payment.routes.js.map