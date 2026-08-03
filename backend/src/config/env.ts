import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default('noreply@houserentethiopia.com'),

  GOOGLE_MAPS_API_KEY: z.string().optional(),

  // Payment Gateway Configuration
  TELEBIRR_API_KEY: z.string().optional(),
  TELEBIRR_SECRET_KEY: z.string().optional(),
  TELEBIRR_APP_ID: z.string().optional(),
  TELEBIRR_MERCHANT_ID: z.string().optional(),
  TELEBIRR_TEST_MODE: z.coerce.boolean().default(true),

  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_SANDBOX_MODE: z.coerce.boolean().default(true),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  CHAPA_API_KEY: z.string().optional(),
  CHAPA_SECRET_KEY: z.string().optional(),
  CHAPA_TEST_MODE: z.coerce.boolean().default(true),

  // Commission Configuration
  PAYMENT_COMMISSION_PERCENTAGE: z.coerce.number().default(2.5),

  // Bank Transfer Configuration
  BANK_ACCOUNT_NUMBER: z.string().optional(),
  BANK_NAME: z.string().optional(),
  BANK_ACCOUNT_HOLDER: z.string().optional(),

  // SendGrid for Email
  SENDGRID_API_KEY: z.string().optional(),

  // Africa's Talking for SMS
  AFRICAS_TALKING_API_KEY: z.string().optional(),
  AFRICAS_TALKING_USERNAME: z.string().optional(),

  // Firebase for Push Notifications
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),

  // DocuSign for E-Signature
  DOCUSIGN_INTEGRATION_KEY: z.string().optional(),
  DOCUSIGN_SECRET_KEY: z.string().optional(),
  DOCUSIGN_ACCOUNT_ID: z.string().optional(),
  DOCUSIGN_API_USERNAME: z.string().optional(),
  DOCUSIGN_API_PASSWORD: z.string().optional(),
  DOCUSIGN_SANDBOX_MODE: z.coerce.boolean().default(true),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
