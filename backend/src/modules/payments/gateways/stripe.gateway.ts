import Stripe from 'stripe';
import { PaymentGateway, InitiatePaymentDTO, PaymentResult, WebhookVerificationResult, RefundResult } from './paymentGateway.interface';
import { env } from '../../../config/env';
import { ApiError } from '../../../utils/apiError';

/**
 * Stripe Payment Gateway Integration
 * Handles credit/debit card payments with support for 3D Secure
 */
export class StripeGateway extends PaymentGateway {
  name = 'STRIPE';
  supportedCurrencies = ['USD', 'ETB'];

  private stripe: Stripe;
  private secretKey = env.STRIPE_SECRET_KEY || '';
  private webhookSecret = env.STRIPE_WEBHOOK_SECRET || '';

  constructor() {
    super();
    this.stripe = new Stripe(this.secretKey || '', {
      apiVersion: '2024-06-20', // Use compatible API version
    });

    if (!this.secretKey) {
      console.warn('Stripe secret key not configured');
    }
  }

  /**
   * Initiate Stripe payment intent
   */
  async initiatePayment(dto: InitiatePaymentDTO): Promise<PaymentResult> {
    if (!this.supportsCurrency(dto.currency)) {
      throw ApiError.badRequest(`Stripe does not support currency: ${dto.currency}`);
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
        return_url: dto.returnUrl || `${env.CLIENT_URL}/checkout/success`,
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
    } catch (error: any) {
      console.error('Stripe payment intent creation error:', error.message);
      throw ApiError.internalServerError(
        `Stripe payment creation failed: ${error.message}`
      );
    }
  }

  /**
   * Verify Stripe webhook signature
   */
  async verifyWebhook(
    rawBody: string,
    signature: string,
    headers: Record<string, string>
  ): Promise<WebhookVerificationResult> {
    try {
      // Verify webhook signature using Stripe's verification method
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret
      );

      // Handle different event types
      let transactionId = '';
      let status = 'PENDING';
      let amount = 0;
      let currency = 'USD';
      let orderId = '';

      if (
        event.type === 'payment_intent.succeeded' ||
        event.type === 'payment_intent.payment_failed' ||
        event.type === 'payment_intent.canceled'
      ) {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        transactionId = paymentIntent.id;
        status =
          paymentIntent.status === 'succeeded'
            ? 'COMPLETED'
            : paymentIntent.status === 'requires_action'
              ? 'PENDING'
              : 'FAILED';
        amount = paymentIntent.amount;
        currency = paymentIntent.currency.toUpperCase();
        orderId = (paymentIntent.metadata?.orderId as string) || paymentIntent.id;
      } else if (event.type === 'charge.refunded') {
        const charge = event.data.object as Stripe.Charge;
        transactionId = charge.payment_intent as string;
        status = 'COMPLETED'; // Refund successful
        amount = charge.amount_refunded;
        currency = charge.currency.toUpperCase();
      } else {
        throw ApiError.badRequest('Unsupported event type');
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
    } catch (error: any) {
      console.error('Stripe webhook verification error:', error.message);
      throw ApiError.unauthorized(`Webhook verification failed: ${error.message}`);
    }
  }

  /**
   * Confirm/Capture Stripe payment
   */
  async confirmPayment(transactionId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(transactionId, {
        return_url: `${env.CLIENT_URL}/checkout/success`,
      });

      return {
        success: paymentIntent.status === 'succeeded',
        transactionId: paymentIntent.id,
        paymentReference: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'COMPLETED' : 'FAILED',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
        gatewayName: this.name,
        errorMessage:
          paymentIntent.last_payment_error?.message || undefined,
        metadata: {
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
        },
      };
    } catch (error: any) {
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
  async refundPayment(
    transactionId: string,
    amount: number,
    reason: string
  ): Promise<RefundResult> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: transactionId,
        amount,
        reason: reason as Stripe.RefundCreateParams.Reason,
        metadata: { reason },
      });

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        amount: refund.amount,
        currency: refund.currency.toUpperCase(),
        status: refund.status === 'succeeded' ? 'COMPLETED' : 'FAILED',
      };
    } catch (error: any) {
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
  async getPaymentStatus(
    transactionId: string
  ): Promise<{ status: string; amount: number; currency: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);

      return {
        status: paymentIntent.status === 'succeeded' ? 'COMPLETED' : paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
      };
    } catch (error: any) {
      console.error('Stripe status check error:', error.message);
      throw ApiError.internalServerError(`Status check failed: ${error.message}`);
    }
  }
}
