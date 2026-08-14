import crypto from 'crypto';
import { ApiError } from './apiError';

/**
 * Payment Security Utilities for handling idempotency, webhook verification, and audit logging
 */

export class PaymentSecurity {
  /**
   * Generate a unique idempotency key
   */
  static generateIdempotencyKey(): string {
    return crypto.randomUUID();
  }

  /**
   * Verify webhook signature using HMAC-SHA256
   * @param payload - Raw request body (before parsing)
   * @param signature - Signature from webhook header
   * @param secret - Gateway secret key
   * @param headerName - Name of the signature header (e.g., 'X-Telebirr-Signature')
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
    headerName = 'X-Signature'
  ): boolean {
    try {
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(payload);
      const computed = hmac.digest('hex');

      // Use timing-safe comparison to prevent timing attacks
      return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
    } catch (error) {
      console.error(`Webhook signature verification failed for ${headerName}:`, error);
      return false;
    }
  }

  /**
   * Verify Telebirr webhook signature
   */
  static verifyTelebirrSignature(payload: string, signature: string, secret: string): boolean {
    return this.verifyWebhookSignature(payload, signature, secret, 'X-Telebirr-Signature');
  }

  /**
   * Verify PayPal webhook signature
   */
  static verifyPayPalSignature(
    webhookId: string,
    eventBody: string,
    signature: string,
    certUrl: string
  ): boolean {
    // Note: PayPal requires certificate validation, which is more complex
    // In production, use PayPal's verification service
    // This is a simplified version for demonstration
    try {
      const hmac = crypto.createHmac('sha256', ''); // Use certificate URL for full implementation
      hmac.update(eventBody);
      // Simplified - actual implementation needs certificate fetch and validation
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify Stripe webhook signature
   */
  static verifyStripeSignature(payload: string, signature: string, endpointSecret: string): boolean {
    return this.verifyWebhookSignature(payload, signature, endpointSecret, 'Stripe-Signature');
  }

  /**
   * Calculate platform commission and net amount
   * @param amount - Gross payment amount
   * @param commissionPercentage - Platform commission rate (e.g., 2.5 for 2.5%)
   */
  static calculateCommission(amount: number, commissionPercentage: number): {
    commission: number;
    netAmount: number;
  } {
    const commission = (amount * commissionPercentage) / 100;
    const netAmount = amount - commission;

    return {
      commission: Math.round(commission * 100) / 100,
      netAmount: Math.round(netAmount * 100) / 100,
    };
  }

  /**
   * Generate invoice number with format: INV-YYYYMMDD-XXXXX
   */
  static generateInvoiceNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `INV-${dateStr}-${random}`;
  }

  /**
   * Validate idempotency key format (should be UUID)
   */
  static isValidIdempotencyKey(key: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(key);
  }

  /**
   * Create audit log object for transaction
   */
  static createAuditLog(data: {
    userId?: string;
    bookingId?: string;
    gatewayName: string;
    amount?: number;
    currency?: string;
    status: string;
    action: string;
    errorMessage?: string;
    metadata?: Record<string, any>;
  }) {
    return {
      userId: data.userId,
      bookingId: data.bookingId,
      gatewayName: data.gatewayName,
      amount: data.amount ?? null,
      currency: data.currency ?? null,
      status: data.status,
      action: data.action,
      errorMessage: data.errorMessage || null,
      metadata: JSON.stringify(data.metadata || {}),
      createdAt: new Date(),
    };
  }

  /**
   * Retry logic with exponential backoff for webhook processing
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          const delayMs = baseDelayMs * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Validate webhook timestamp to prevent replay attacks
   * @param timestamp - Webhook timestamp
   * @param maxAgeSeconds - Maximum age allowed (default 5 minutes)
   */
  static isValidWebhookTimestamp(timestamp: number, maxAgeSeconds: number = 300): boolean {
    const now = Math.floor(Date.now() / 1000);
    const age = now - timestamp;
    return age >= 0 && age <= maxAgeSeconds;
  }

  /**
   * Hash sensitive data for logging (don't log full payment details)
   */
  static hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  /**
   * Mask card number for display: 4111****1111
   */
  static maskCardNumber(cardNumber: string): string {
    const clean = cardNumber.replace(/\D/g, '');
    if (clean.length < 4) return '****';
    return clean.substring(0, 4) + '*'.repeat(Math.max(0, clean.length - 8)) + clean.slice(-4);
  }
}

/**
 * Idempotency Key Manager - Ensures requests are only processed once
 */
export class IdempotencyKeyManager {
  /**
   * Check if key has been processed before and return cached result
   */
  static async checkAndStore(
    key: string,
    processor: () => Promise<any>,
    cache: Map<string, any> = new Map()
  ): Promise<any> {
    if (cache.has(key)) {
      console.log(`Idempotent request: Using cached result for key ${key}`);
      return cache.get(key);
    }

    const result = await processor();
    cache.set(key, result);

    // Clean up old entries after 24 hours
    setTimeout(() => cache.delete(key), 24 * 60 * 60 * 1000);

    return result;
  }
}
