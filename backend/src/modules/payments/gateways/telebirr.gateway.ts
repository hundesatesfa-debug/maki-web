import axios from 'axios';
import crypto from 'crypto';
import { PaymentGateway, InitiatePaymentDTO, PaymentResult, WebhookVerificationResult, RefundResult } from './paymentGateway.interface';
import { env } from '../../../config/env';
import { ApiError } from '../../../utils/apiError';
import { PaymentSecurity } from '../../../utils/paymentSecurity';

/**
 * Telebirr Payment Gateway Integration
 * Handles payments via Ethiopia's Telebirr mobile money service
 */
export class TelebirrGateway extends PaymentGateway {
  name = 'TELEBIRR';
  supportedCurrencies = ['ETB'];

  private apiUrl = env.TELEBIRR_TEST_MODE
    ? 'https://test.telebirr.api/api'
    : 'https://api.telebirr.com/api';

  private apiKey = env.TELEBIRR_API_KEY || '';
  private secretKey = env.TELEBIRR_SECRET_KEY || '';
  private appId = env.TELEBIRR_APP_ID || '';
  private merchantId = env.TELEBIRR_MERCHANT_ID || '';

  constructor() {
    super();
    if (!this.apiKey || !this.secretKey) {
      console.warn('Telebirr credentials not configured');
    }
  }

  /**
   * Initiate payment request with Telebirr
   */
  async initiatePayment(dto: InitiatePaymentDTO): Promise<PaymentResult> {
    if (!this.supportsCurrency(dto.currency)) {
      throw ApiError.badRequest(`Telebirr does not support currency: ${dto.currency}`);
    }

    try {
      const payload = {
        appId: this.appId,
        merchantId: this.merchantId,
        orderId: dto.orderId,
        amount: dto.amount,
        currency: dto.currency,
        description: dto.description || `Rent payment for ${dto.propertyTitle}`,
        callbackUrl: `${env.CLIENT_URL}/api/v1/payments/webhook/telebirr`,
        returnUrl: dto.returnUrl || `${env.CLIENT_URL}/checkout/success`,
        notifyUrl: `${env.CLIENT_URL}/api/v1/payments/webhook/telebirr`,
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

      const response = await axios.post(`${this.apiUrl}/payment/initiate`, payload, { headers });

      if (!response.data.success) {
        throw ApiError.badRequest(`Telebirr error: ${response.data.message}`);
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
    } catch (error: any) {
      console.error('Telebirr initiate payment error:', error.message);
      throw ApiError.internalServerError(
        `Telebirr payment initiation failed: ${error.message}`
      );
    }
  }

  /**
   * Verify Telebirr webhook signature and extract payment info
   */
  async verifyWebhook(
    rawBody: string,
    signature: string,
    headers: Record<string, string>
  ): Promise<WebhookVerificationResult> {
    // Verify signature
    const isValid = PaymentSecurity.verifyTelebirrSignature(rawBody, signature, this.secretKey);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid Telebirr webhook signature');
    }

    try {
      const payload = JSON.parse(rawBody);

      // Verify timestamp to prevent replay attacks
      const webhookTimestamp = parseInt(headers['x-telebirr-timestamp'] || '0');
      if (!PaymentSecurity.isValidWebhookTimestamp(webhookTimestamp)) {
        throw ApiError.badRequest('Webhook timestamp too old');
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
    } catch (error: any) {
      console.error('Telebirr webhook verification error:', error.message);
      throw ApiError.badRequest(`Webhook verification failed: ${error.message}`);
    }
  }

  /**
   * Confirm payment after successful transaction
   */
  async confirmPayment(transactionId: string): Promise<PaymentResult> {
    try {
      const signature = this.generateSignature({ transactionId });
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Telebirr-Signature': signature,
      };

      const response = await axios.get(
        `${this.apiUrl}/payment/status/${transactionId}`,
        { headers }
      );

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
    } catch (error: any) {
      console.error('Telebirr confirm payment error:', error.message);
      throw ApiError.internalServerError(`Payment confirmation failed: ${error.message}`);
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

      const response = await axios.post(
        `${this.apiUrl}/payment/refund`,
        payload,
        { headers }
      );

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
    } catch (error: any) {
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
  async getPaymentStatus(
    transactionId: string
  ): Promise<{ status: string; amount: number; currency: string }> {
    try {
      const signature = this.generateSignature({ transactionId });
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Telebirr-Signature': signature,
      };

      const response = await axios.get(
        `${this.apiUrl}/payment/status/${transactionId}`,
        { headers }
      );

      return {
        status: response.data.status === 'SUCCESS' ? 'COMPLETED' : response.data.status,
        amount: response.data.amount,
        currency: response.data.currency || 'ETB',
      };
    } catch (error: any) {
      console.error('Telebirr status check error:', error.message);
      throw ApiError.internalServerError(`Status check failed: ${error.message}`);
    }
  }

  /**
   * Generate HMAC signature for Telebirr requests
   */
  private generateSignature(payload: any): string {
    const jsonString = JSON.stringify(payload);
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(jsonString);
    return hmac.digest('hex');
  }
}
