import { Router } from 'express';
import * as PaymentController from './payment.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { initiatePaymentSchema, refundPaymentSchema } from './payment.validation';

const router = Router();

/**
 * Payment Routes
 */

// Initialize payment (requires authentication)
router.post(
  '/initiate',
  authenticate,
  validate(initiatePaymentSchema),
  PaymentController.initiatePayment
);

// Confirm payment (e.g., after 3D Secure)
router.post(
  '/confirm',
  authenticate,
  PaymentController.confirmPayment
);

// Get payment details
router.get(
  '/:paymentId',
  authenticate,
  PaymentController.getPayment
);

// List user's payments
router.get(
  '/',
  authenticate,
  PaymentController.listPayments
);

// Process refund
router.post(
  '/:paymentId/refund',
  authenticate,
  validate(refundPaymentSchema),
  PaymentController.refundPayment
);

// Download invoice
router.get(
  '/invoices/:invoiceId/download',
  authenticate,
  PaymentController.downloadInvoice
);

/**
 * Webhook Routes (no authentication required)
 */

// Telebirr webhook
router.post(
  '/webhook/telebirr',
  PaymentController.handleTelebirrWebhook
);

// PayPal webhook
router.post(
  '/webhook/paypal',
  PaymentController.handlePayPalWebhook
);

// Stripe webhook
router.post(
  '/webhook/stripe',
  PaymentController.handleStripeWebhook
);

export default router;
