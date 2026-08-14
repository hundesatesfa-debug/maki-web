import { Request, Response, NextFunction } from 'express';
/**
 * Payment Controller
 * Handles payment-related HTTP requests
 */
export declare const initiatePayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Telebirr Webhook Handler
 */
export declare const handleTelebirrWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * PayPal Webhook Handler
 */
export declare const handlePayPalWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Stripe Webhook Handler
 */
export declare const handleStripeWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Confirm Payment (after 3D Secure or other verification)
 */
export declare const confirmPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Get Payment Details
 */
export declare const getPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * List User Payments
 */
export declare const listPayments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Process Refund
 */
export declare const refundPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Download Invoice
 */
export declare const downloadInvoice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=payment.controller.d.ts.map