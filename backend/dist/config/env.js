"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    CLIENT_URL: zod_1.z.string().url().default('http://localhost:3000'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
    JWT_ACCESS_EXPIRY: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRY: zod_1.z.string().default('7d'),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
    CLOUDINARY_API_KEY: zod_1.z.string().min(1, 'CLOUDINARY_API_KEY is required'),
    CLOUDINARY_API_SECRET: zod_1.z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
    SMTP_HOST: zod_1.z.string().default('smtp.gmail.com'),
    SMTP_PORT: zod_1.z.coerce.number().default(587),
    SMTP_USER: zod_1.z.string().email().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().default('noreply@houserentethiopia.com'),
    GOOGLE_MAPS_API_KEY: zod_1.z.string().optional(),
    // Payment Gateway Configuration
    TELEBIRR_API_KEY: zod_1.z.string().optional(),
    TELEBIRR_SECRET_KEY: zod_1.z.string().optional(),
    TELEBIRR_APP_ID: zod_1.z.string().optional(),
    TELEBIRR_MERCHANT_ID: zod_1.z.string().optional(),
    TELEBIRR_TEST_MODE: zod_1.z.coerce.boolean().default(true),
    PAYPAL_CLIENT_ID: zod_1.z.string().optional(),
    PAYPAL_CLIENT_SECRET: zod_1.z.string().optional(),
    PAYPAL_SANDBOX_MODE: zod_1.z.coerce.boolean().default(true),
    STRIPE_SECRET_KEY: zod_1.z.string().optional(),
    STRIPE_PUBLISHABLE_KEY: zod_1.z.string().optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().optional(),
    CHAPA_API_KEY: zod_1.z.string().optional(),
    CHAPA_SECRET_KEY: zod_1.z.string().optional(),
    CHAPA_TEST_MODE: zod_1.z.coerce.boolean().default(true),
    // Commission Configuration
    PAYMENT_COMMISSION_PERCENTAGE: zod_1.z.coerce.number().default(2.5),
    // Bank Transfer Configuration
    BANK_ACCOUNT_NUMBER: zod_1.z.string().optional(),
    BANK_NAME: zod_1.z.string().optional(),
    BANK_ACCOUNT_HOLDER: zod_1.z.string().optional(),
    // SendGrid for Email
    SENDGRID_API_KEY: zod_1.z.string().optional(),
    // Africa's Talking for SMS
    AFRICAS_TALKING_API_KEY: zod_1.z.string().optional(),
    AFRICAS_TALKING_USERNAME: zod_1.z.string().optional(),
    // Firebase for Push Notifications
    FIREBASE_PROJECT_ID: zod_1.z.string().optional(),
    FIREBASE_PRIVATE_KEY: zod_1.z.string().optional(),
    FIREBASE_CLIENT_EMAIL: zod_1.z.string().optional(),
    // DocuSign for E-Signature
    DOCUSIGN_INTEGRATION_KEY: zod_1.z.string().optional(),
    DOCUSIGN_SECRET_KEY: zod_1.z.string().optional(),
    DOCUSIGN_ACCOUNT_ID: zod_1.z.string().optional(),
    DOCUSIGN_API_USERNAME: zod_1.z.string().optional(),
    DOCUSIGN_API_PASSWORD: zod_1.z.string().optional(),
    DOCUSIGN_SANDBOX_MODE: zod_1.z.coerce.boolean().default(true),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.format());
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map