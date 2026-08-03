# MAKI Phase 2 - Setup and Integration Guide

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- SQLite (for development)
- Payment gateway test accounts (Telebirr, PayPal, Stripe)

### Environment Setup

#### Backend

1. **Update `.env`** with payment gateway credentials:
```env
# Payment Gateways
TELEBIRR_API_KEY=your_telebirr_api_key
TELEBIRR_SECRET_KEY=your_telebirr_secret
TELEBIRR_APP_ID=your_telebirr_app_id
TELEBIRR_MERCHANT_ID=your_telebirr_merchant_id
TELEBIRR_TEST_MODE=true

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_SANDBOX_MODE=true

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Commission (percentage)
PAYMENT_COMMISSION_PERCENTAGE=2.5

# Bank Transfer Details
BANK_ACCOUNT_NUMBER=your_bank_account
BANK_NAME=Your Bank
BANK_ACCOUNT_HOLDER=Your Name

# Email & Notifications (Optional - for production)
SENDGRID_API_KEY=your_sendgrid_key
AFRICAS_TALKING_API_KEY=your_africas_talking_key
AFRICAS_TALKING_USERNAME=your_africas_talking_username
```

2. **Install dependencies**:
```bash
cd backend
npm install
```

3. **Run migrations**:
```bash
npm run prisma:migrate
```

4. **Start backend**:
```bash
npm run dev
```

Backend will be available at `http://localhost:5000`

#### Frontend

1. **Update `.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

2. **Install dependencies**:
```bash
cd frontend
npm install
```

3. **Start frontend**:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## API Integration Guide

### Using the API Client

#### Payment Flow Example

```typescript
import { usePayment } from '@/hooks';

export function CheckoutComponent() {
  const { initiatePaymentMutation, selectedGateway, setSelectedGateway } = usePayment();

  const handlePayment = async () => {
    await initiatePaymentMutation.mutateAsync({
      bookingId: 'booking-123',
      amount: 15000, // ETB (in cents)
      currency: 'ETB',
      paymentGateway: 'TELEBIRR',
      paymentType: 'DEPOSIT',
    });
  };

  return (
    <div>
      <select 
        value={selectedGateway || ''} 
        onChange={(e) => setSelectedGateway(e.target.value)}
      >
        <option value="">Select Payment Method</option>
        <option value="TELEBIRR">Telebirr</option>
        <option value="PAYPAL">PayPal</option>
        <option value="STRIPE">Stripe Card</option>
        <option value="BANK_TRANSFER">Bank Transfer</option>
      </select>
      <button onClick={handlePayment} disabled={!selectedGateway}>
        Pay Now
      </button>
    </div>
  );
}
```

#### Booking Flow Example

```typescript
import { useBooking } from '@/hooks';

export function BookingRequestComponent({ propertyId }) {
  const { createBookingMutation } = useBooking();

  const handleBooking = async (formData) => {
    await createBookingMutation.mutateAsync({
      propertyId,
      moveInDate: formData.moveInDate.toISOString(),
      durationMonths: formData.durationMonths,
      monthlyRent: formData.monthlyRent,
      depositAmount: formData.depositAmount,
      message: formData.message,
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleBooking(Object.fromEntries(new FormData(e.target)));
    }}>
      {/* Form fields */}
    </form>
  );
}
```

#### Review Submission Example

```typescript
import { useReviews } from '@/hooks';

export function ReviewComponent({ bookingId }) {
  const { submitReviewMutation } = useReviews();

  const handleSubmitReview = async (rating, text) => {
    await submitReviewMutation.mutateAsync({
      bookingId,
      rating,
      text,
      reviewType: 'PROPERTY',
    });
  };

  return (
    <div>
      <RatingInput onChange={handleSubmitReview} />
    </div>
  );
}
```

#### Notifications Example

```typescript
import { useNotifications } from '@/hooks';

export function NotificationBell() {
  const { unreadCountQuery, notificationsQuery, markAsReadMutation } = useNotifications();

  return (
    <div>
      <span className="badge">{unreadCountQuery.data?.data.unreadCount}</span>
      <div className="dropdown">
        {notificationsQuery.data?.data.notifications.map(notif => (
          <div 
            key={notif.id}
            onClick={() => markAsReadMutation.mutate(notif.id)}
            className={notif.isRead ? 'read' : 'unread'}
          >
            {notif.title}
            <p>{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Webhook Configuration

### Telebirr Webhook

1. **Add webhook URL** in Telebirr dashboard:
   ```
   https://yourdomain.com/api/v1/payments/webhook/telebirr
   ```

2. **Backend receives webhook**:
   - Verifies `X-Telebirr-Signature` header
   - Checks timestamp for replay protection
   - Updates payment status
   - Processes booking activation

### PayPal Webhook

1. **Register webhook** in PayPal dashboard:
   ```
   https://yourdomain.com/api/v1/payments/webhook/paypal
   ```

2. **Subscribe to events**:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`

### Stripe Webhook

1. **Create endpoint** in Stripe dashboard:
   ```
   https://yourdomain.com/api/v1/payments/webhook/stripe
   ```

2. **Subscribe to events**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

---

## Testing Payment Gateways

### Telebirr Test Mode

```typescript
// In .env
TELEBIRR_TEST_MODE=true
TELEBIRR_API_KEY=test_api_key
```

Test credentials available in Telebirr sandbox documentation.

### PayPal Sandbox

```typescript
// In .env
PAYPAL_SANDBOX_MODE=true
PAYPAL_CLIENT_ID=sandbox_client_id
```

Test transactions: Use PayPal sandbox account

### Stripe Test Cards

```
4242 4242 4242 4242 - Success
4000 0000 0000 0002 - Decline
4000 0025 0000 3155 - 3D Secure Required
```

---

## Admin Dashboard

### Access Admin Panel

1. **Create admin user** via backend:
```typescript
// In seeding or backend
await prisma.user.create({
  data: {
    email: 'admin@maki.com',
    password: hashedPassword,
    role: 'ADMIN',
    // ... other fields
  }
});
```

2. **Login with admin account** - access restricted endpoints

### Admin Features Available

#### User Management
```typescript
// Verify user KYC
PUT /api/v1/admin/users/:userId/verify
{
  "status": "APPROVED|REJECTED",
  "reason": "Documents verified"
}

// Suspend user
PUT /api/v1/admin/users/:userId/suspend
{
  "reason": "Violation of terms",
  "duration": 30
}
```

#### Listing Moderation
```typescript
// Approve listing
PUT /api/v1/admin/listings/:listingId/approve
{
  "reason": "All requirements met"
}

// Reject listing
PUT /api/v1/admin/listings/:listingId/reject
{
  "reason": "Images do not match description"
}
```

#### Dispute Resolution
```typescript
// Resolve dispute
PUT /api/v1/admin/disputes/:disputeId/resolve
{
  "decision": "TENANT_WINS|LANDLORD_WINS|SPLIT",
  "refundAmount": 7500,
  "notes": "Landlord failed to provide amenities"
}
```

#### Analytics
```typescript
// Get dashboard metrics
GET /api/v1/admin/dashboard
// Returns: overview, pending items, activity metrics
```

---

## Database Schema Quick Reference

### Key Tables

```
Bookings
├── status: REQUESTED|CONFIRMED|COUNTER_OFFERED|PAID|ACTIVE|COMPLETED|CANCELLED|DECLINED
├── moveInDate: DateTime
├── durationMonths: Int
├── monthlyRent: Float
├── depositAmount: Float
└── relations: property, tenant, landlord, payments, reviews

Payments
├── status: PENDING|PROCESSING|COMPLETED|FAILED|REFUNDED|CANCELLED
├── paymentGateway: TELEBIRR|PAYPAL|STRIPE|BANK_TRANSFER|CHAPA
├── paymentType: DEPOSIT|MONTHLY_RENT|FULL_PAYMENT
├── idempotencyKey: String (unique)
├── amount: Float
└── metadata: JSON

Reviews
├── reviewType: PROPERTY|LANDLORD|TENANT
├── rating: 1-5 stars
├── isVerified: Boolean (from completed booking)
├── status: PUBLISHED|PENDING_MODERATION|REJECTED
└── relations: booking, reviewer, reviewee

Notifications
├── channels: IN_APP|EMAIL|SMS|PUSH (JSON array)
├── type: BOOKING_REQUEST|PAYMENT_RECEIVED|REVIEW_RECEIVED|etc
├── status: PENDING|SENT|DELIVERED|FAILED
├── isRead: Boolean
└── relations: user, related entity
```

---

## Performance Optimization Tips

### Database Queries
- Use indexes on frequently filtered fields (status, createdAt)
- Eager load related data to avoid N+1 queries
- Paginate large result sets

### Payment Processing
- Implement request debouncing for payment initiation
- Cache currency conversion rates (update daily)
- Use connection pooling for payment gateway requests

### Notifications
- Batch notification sends to reduce API calls
- Use message queue (Bull/RabbitMQ) for async delivery
- Implement exponential backoff for failed sends

---

## Monitoring & Logging

### Transaction Monitoring

```typescript
// View all transactions
GET /api/v1/admin/transaction-logs?status=COMPLETED&gateway=TELEBIRR

// Response includes:
// - User and booking IDs
// - Payment amount and gateway
// - Timestamp and status
// - Error messages (if failed)
```

### Admin Audit Logs

```typescript
// View all admin actions
GET /api/v1/admin/logs?action=VERIFY_USER&limit=50

// Logged actions:
// - User verifications/suspensions
// - Listing approvals/rejections
// - Dispute resolutions
// - Changes made
```

### Alert Thresholds

Set up monitoring for:
- High refund rate (>5%)
- Failed payments (>10%)
- Webhook processing delays (>30s)
- Database query slowness (>1s)

---

## Common Issues & Solutions

### Issue: "Webhook signature verification failed"
**Solution**: 
1. Verify secret key in env matches payment gateway dashboard
2. Check timestamp is within 5 minutes
3. Ensure request body is not modified

### Issue: "Idempotency key already exists"
**Solution**:
- Generate unique UUID for each payment request
- Don't reuse keys within 24 hours

### Issue: "Booking date unavailable"
**Solution**:
- Check for overlapping confirmed bookings
- Verify move-in date vs move-out date calculation
- Clear calendar dates from cancelled bookings

### Issue: "Payment gateway returns 401"
**Solution**:
- Verify API keys in env
- Check test/live mode setting
- Ensure IP whitelist is configured

---

## Production Deployment Checklist

- [ ] All env variables configured
- [ ] Database backups enabled
- [ ] Payment gateway credentials verified
- [ ] Webhook URLs updated to production domain
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up
- [ ] Error tracking (Sentry/etc) configured
- [ ] Logging aggregation (DataDog/etc) set up
- [ ] Database migrations tested
- [ ] Admin user created
- [ ] Email service configured (SendGrid)
- [ ] SMS service configured (Africa's Talking)
- [ ] Push notifications configured (Firebase)
- [ ] CDN configured for static assets
- [ ] Load balancing configured
- [ ] Security audit completed

---

## Support & Documentation

- **API Docs**: See `API_DOCUMENTATION.md`
- **Implementation Status**: See `PHASE2_IMPLEMENTATION_STATUS.md`
- **Requirements**: See `.kiro/specs/maki-phase-2/requirements.md`

---

## Next Steps

1. **Integrate Frontend Components**
   - Checkout/payment forms
   - Booking management pages
   - Review submission
   - Admin dashboard pages

2. **Configure Payment Gateways**
   - Get production credentials
   - Update webhook URLs
   - Test all payment flows

3. **Deploy to Staging**
   - Test with real payment gateways (test mode)
   - Run load testing
   - Security audit

4. **Deploy to Production**
   - Switch to production credentials
   - Enable monitoring
   - Setup incident response

5. **Post-Launch**
   - Monitor payment success rates
   - Collect user feedback
   - Iterate on UX/UI
   - Scale infrastructure as needed
