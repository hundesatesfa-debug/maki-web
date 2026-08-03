import { Request, Response, NextFunction } from 'express';
import { paymentService } from './payment.service';
import { sendResponse } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';

/**
 * Payment Controller
 * Handles payment-related HTTP requests
 */

export const initiatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, amount, currency, paymentGateway, paymentType, idempotencyKey } =
      req.body;

    const result = await paymentService.initiatePayment({
      bookingId,
      amount,
      currency,
      paymentGateway,
      paymentType: paymentType || 'DEPOSIT',
      idempotencyKey,
      userId: req.user?.userId || '',
    });

    if (result.isIdempotent) {
      sendResponse(res, 200, true, 'Payment already initiated (idempotent)', {
        payment: result.payment,
        redirectUrl: result.paymentResult?.redirectUrl,
      });
    } else {
      sendResponse(res, 201, true, 'Payment initiated successfully', {
        payment: result.payment,
        redirectUrl: result.paymentResult?.redirectUrl,
        clientSecret: result.paymentResult?.metadata?.clientSecret,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Telebirr Webhook Handler
 */
export const handleTelebirrWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['x-telebirr-signature'] as string;

    if (!signature) {
      throw ApiError.unauthorized('Missing signature header');
    }

    const result = await paymentService.processWebhook({
      gatewayName: 'TELEBIRR',
      rawBody: JSON.stringify(req.body),
      signature,
      headers: req.headers as Record<string, string>,
    });

    // Always return 200 to acknowledge webhook
    sendResponse(res, 200, true, 'Webhook processed', result);
  } catch (error) {
    console.error('Telebirr webhook error:', error);
    // Return 200 even on error to prevent webhook retry storms
    res.status(200).json({ success: false, error: (error as Error).message });
  }
};

/**
 * PayPal Webhook Handler
 */
export const handlePayPalWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['paypal-transmission-sig'] as string;

    if (!signature) {
      throw ApiError.unauthorized('Missing PayPal signature');
    }

    const result = await paymentService.processWebhook({
      gatewayName: 'PAYPAL',
      rawBody: JSON.stringify(req.body),
      signature,
      headers: req.headers as Record<string, string>,
    });

    sendResponse(res, 200, true, 'PayPal webhook processed', result);
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(200).json({ success: false, error: (error as Error).message });
  }
};

/**
 * Stripe Webhook Handler
 */
export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      throw ApiError.unauthorized('Missing Stripe signature');
    }

    const result = await paymentService.processWebhook({
      gatewayName: 'STRIPE',
      rawBody: JSON.stringify(req.body),
      signature,
      headers: req.headers as Record<string, string>,
    });

    sendResponse(res, 200, true, 'Stripe webhook processed', result);
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(200).json({ success: false, error: (error as Error).message });
  }
};

/**
 * Confirm Payment (after 3D Secure or other verification)
 */
export const confirmPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transactionId, bookingId } = req.body;

    // Verify booking belongs to user
    const booking = await (require('../../config/database').default).booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.tenantId !== req.user?.userId && booking.landlordId !== req.user?.userId) {
      throw ApiError.forbidden('Not authorized to confirm this payment');
    }

    // Process refund through payment service
    const result = await paymentService.getPaymentStatus(transactionId);

    sendResponse(res, 200, true, 'Payment confirmed', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Payment Details
 */
export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentId } = req.params;

    const payment = await paymentService.getPaymentStatus(paymentId);

    // Check authorization
    if (
      payment.booking.tenantId !== req.user?.userId &&
      payment.booking.landlordId !== req.user?.userId
    ) {
      throw ApiError.forbidden('Not authorized to view this payment');
    }

    sendResponse(res, 200, true, 'Payment retrieved', payment);
  } catch (error) {
    next(error);
  }
};

/**
 * List User Payments
 */
export const listPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    const payments = await paymentService.listUserPayments(req.user?.userId || '', {
      status,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'Payments retrieved', { payments });
  } catch (error) {
    next(error);
  }
};

/**
 * Process Refund
 */
export const refundPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!reason) {
      throw ApiError.badRequest('Refund reason is required');
    }

    const result = await paymentService.refundPayment({
      paymentId,
      amount,
      reason,
      userId: req.user?.userId || '',
    });

    sendResponse(res, 200, true, 'Refund processed successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Download Invoice
 */
export const downloadInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      throw ApiError.notFound('Invoice not found');
    }

    // Check authorization
    if (
      invoice.payment.booking.tenantId !== req.user?.userId &&
      invoice.payment.booking.landlordId !== req.user?.userId
    ) {
      throw ApiError.forbidden('Not authorized to download this invoice');
    }

    // In production, generate or fetch PDF from cloud storage
    // For now, return invoice data
    sendResponse(res, 200, true, 'Invoice retrieved', {
      invoiceNumber: invoice.invoiceNumber,
      tenantName: `${invoice.payment.booking.tenant.firstName} ${invoice.payment.booking.tenant.lastName}`,
      landlordName: `${invoice.payment.booking.landlord.firstName} ${invoice.payment.booking.landlord.lastName}`,
      propertyTitle: invoice.payment.booking.property.title,
      amount: invoice.amount,
      currency: invoice.currency,
      createdAt: invoice.createdAt,
      pdfUrl: invoice.pdfUrl,
    });
  } catch (error) {
    next(error);
  }
};
