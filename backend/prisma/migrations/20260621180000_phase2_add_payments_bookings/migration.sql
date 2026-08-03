-- Phase 2 Migration: Add Payments, Bookings, Reviews, Contracts, Notifications, and Admin features

-- AlterTable: Update Users table
ALTER TABLE "users" ADD COLUMN "kyc_status" TEXT DEFAULT 'NOT_SUBMITTED'; -- NOT_SUBMITTED, PENDING, APPROVED, REJECTED
ALTER TABLE "users" ADD COLUMN "verified_badge" BOOLEAN DEFAULT false;
ALTER TABLE "users" ADD COLUMN "response_time_hours" REAL;
ALTER TABLE "users" ADD COLUMN "response_rate" REAL DEFAULT 0;

-- AlterTable: Update Listings table
ALTER TABLE "listings" ADD COLUMN "amenities" TEXT DEFAULT '[]'; -- JSON array stored as text
ALTER TABLE "listings" ADD COLUMN "available_from" DATETIME;
ALTER TABLE "listings" ADD COLUMN "available_to" DATETIME;
ALTER TABLE "listings" ADD COLUMN "min_stay" INTEGER DEFAULT 1;
ALTER TABLE "listings" ADD COLUMN "average_rating" REAL DEFAULT 0;
ALTER TABLE "listings" ADD COLUMN "cancellation_policy" TEXT DEFAULT 'MODERATE'; -- STRICT, MODERATE, FLEXIBLE, NON_REFUNDABLE

-- CreateTable: Bookings
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "property_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "landlord_id" TEXT NOT NULL,
    "move_in_date" DATETIME NOT NULL,
    "duration_months" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, CONFIRMED, COUNTER_OFFERED, PAID, ACTIVE, COMPLETED, CANCELLED, DECLINED
    "monthly_rent" REAL NOT NULL,
    "deposit_amount" REAL NOT NULL,
    "message" TEXT,
    "response_time_hours" REAL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("property_id") REFERENCES "listings" ("id") ON DELETE RESTRICT,
    FOREIGN KEY ("tenant_id") REFERENCES "users" ("id") ON DELETE RESTRICT,
    FOREIGN KEY ("landlord_id") REFERENCES "users" ("id") ON DELETE RESTRICT
);

-- CreateTable: Payments
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB', -- ETB, USD
    "payment_gateway" TEXT NOT NULL, -- TELEBIRR, PAYPAL, STRIPE, BANK_TRANSFER, CHAPA
    "payment_reference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED, CANCELLED
    "payment_type" TEXT NOT NULL DEFAULT 'DEPOSIT', -- DEPOSIT, MONTHLY_RENT, FULL_PAYMENT
    "metadata" TEXT, -- JSON object stored as text
    "idempotency_key" TEXT UNIQUE,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE CASCADE
);

-- CreateTable: Transactions
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL, -- CHARGE, REFUND, COMMISSION_DEDUCTION
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
    "idempotency_key" TEXT UNIQUE,
    "gateway_response" TEXT, -- JSON response from gateway
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("payment_id") REFERENCES "payments" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT
);

-- CreateTable: Reviews
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "reviewee_id" TEXT NOT NULL,
    "review_type" TEXT NOT NULL, -- PROPERTY, LANDLORD, TENANT
    "rating" INTEGER NOT NULL, -- 1-5 stars
    "text" TEXT,
    "is_verified" BOOLEAN DEFAULT true, -- Verified if booking was completed
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED', -- PUBLISHED, PENDING_MODERATION, REJECTED
    "moderation_notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("reviewer_id") REFERENCES "users" ("id") ON DELETE RESTRICT,
    FOREIGN KEY ("reviewee_id") REFERENCES "users" ("id") ON DELETE RESTRICT
);

-- CreateTable: Contracts
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_id" TEXT NOT NULL,
    "document_url" TEXT,
    "signed_by" TEXT, -- Comma-separated user IDs who have signed
    "signed_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, SIGNED, EXPIRED
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE CASCADE
);

-- CreateTable: Notifications
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL, -- BOOKING_REQUEST, BOOKING_ACCEPTED, PAYMENT_RECEIVED, REVIEW_RECEIVED, etc.
    "title" TEXT NOT NULL,
    "message" TEXT,
    "related_id" TEXT, -- ID of related entity (booking, payment, review, etc.)
    "related_type" TEXT, -- Type of related entity (BOOKING, PAYMENT, REVIEW, etc.)
    "channels" TEXT DEFAULT 'IN_APP', -- JSON array: IN_APP, EMAIL, SMS, PUSH
    "is_read" BOOLEAN DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, SENT, DELIVERED, FAILED
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable: NotificationPreferences
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "channel" TEXT NOT NULL, -- IN_APP, EMAIL, SMS, PUSH
    "enabled" BOOLEAN DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    UNIQUE("user_id", "channel"),
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable: AdminLogs
CREATE TABLE "admin_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admin_id" TEXT NOT NULL,
    "action" TEXT NOT NULL, -- APPROVE_LISTING, REJECT_LISTING, VERIFY_USER, SUSPEND_USER, etc.
    "target_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL, -- LISTING, USER, BOOKING, REVIEW, etc.
    "changes" TEXT, -- JSON describing what changed
    "reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("admin_id") REFERENCES "users" ("id") ON DELETE RESTRICT
);

-- CreateTable: Disputes
CREATE TABLE "disputes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_id" TEXT NOT NULL,
    "filed_by" TEXT NOT NULL, -- User ID who filed the dispute
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "evidence_urls" TEXT, -- JSON array of URLs
    "status" TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, UNDER_REVIEW, RESOLVED, CLOSED
    "admin_decision" TEXT,
    "refund_amount" REAL,
    "resolved_by" TEXT, -- Admin user ID
    "resolved_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("filed_by") REFERENCES "users" ("id") ON DELETE RESTRICT,
    FOREIGN KEY ("resolved_by") REFERENCES "users" ("id") ON DELETE SET NULL
);

-- CreateTable: PayoutAccounts
CREATE TABLE "payout_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "landlord_id" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_holder_name" TEXT NOT NULL,
    "verified" BOOLEAN DEFAULT false,
    "verification_document_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("landlord_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

-- CreateTable: SubscriptionPlans (for recurring monthly rent)
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "booking_id" TEXT NOT NULL,
    "gateway_subscription_id" TEXT,
    "payment_gateway" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, ACTIVE, PAUSED, CANCELLED
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "next_charge_date" DATETIME,
    "cycle_count" INTEGER DEFAULT 0,
    "failed_attempts" INTEGER DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE CASCADE
);

-- CreateTable: Invoices
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "payment_id" TEXT NOT NULL,
    "invoice_number" TEXT UNIQUE NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "landlord_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "pdf_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("payment_id") REFERENCES "payments" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("tenant_id") REFERENCES "users" ("id") ON DELETE RESTRICT,
    FOREIGN KEY ("landlord_id") REFERENCES "users" ("id") ON DELETE RESTRICT,
    FOREIGN KEY ("property_id") REFERENCES "listings" ("id") ON DELETE RESTRICT
);

-- CreateTable: TransactionAuditLogs
CREATE TABLE "transaction_audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "booking_id" TEXT,
    "gateway_name" TEXT,
    "amount" REAL,
    "currency" TEXT,
    "status" TEXT,
    "action" TEXT, -- PAYMENT_INITIATED, WEBHOOK_RECEIVED, PAYMENT_COMPLETED, REFUND_PROCESSED, etc.
    "error_message" TEXT,
    "metadata" TEXT, -- JSON
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL,
    FOREIGN KEY ("booking_id") REFERENCES "bookings" ("id") ON DELETE SET NULL
);

-- CreateIndex for faster queries
CREATE INDEX "idx_bookings_tenant_id" ON "bookings"("tenant_id");
CREATE INDEX "idx_bookings_landlord_id" ON "bookings"("landlord_id");
CREATE INDEX "idx_bookings_property_id" ON "bookings"("property_id");
CREATE INDEX "idx_bookings_status" ON "bookings"("status");
CREATE INDEX "idx_payments_booking_id" ON "payments"("booking_id");
CREATE INDEX "idx_payments_user_id" ON "payments"("user_id");
CREATE INDEX "idx_payments_status" ON "payments"("status");
CREATE INDEX "idx_transactions_payment_id" ON "transactions"("payment_id");
CREATE INDEX "idx_reviews_booking_id" ON "reviews"("booking_id");
CREATE INDEX "idx_reviews_reviewer_id" ON "reviews"("reviewer_id");
CREATE INDEX "idx_reviews_reviewee_id" ON "reviews"("reviewee_id");
CREATE INDEX "idx_notifications_user_id" ON "notifications"("user_id");
CREATE INDEX "idx_notifications_is_read" ON "notifications"("is_read");
CREATE INDEX "idx_admin_logs_admin_id" ON "admin_logs"("admin_id");
CREATE INDEX "idx_disputes_booking_id" ON "disputes"("booking_id");
CREATE INDEX "idx_disputes_status" ON "disputes"("status");
