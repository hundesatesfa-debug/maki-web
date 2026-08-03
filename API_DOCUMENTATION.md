# MAKI Phase 2 - API Documentation

## Overview

This document describes all Phase 2 API endpoints for payments, bookings, reviews, notifications, and admin features.

## Base URL

```
https://api.maki.com/api/v1
```

## Authentication

All endpoints (except auth and webhooks) require authentication via Bearer token in Authorization header:

```
Authorization: Bearer <access_token>
```

---

## 1. PAYMENT ENDPOINTS

### 1.1 Initiate Payment
- **Method**: `POST`
- **Endpoint**: `/payments/initiate`
- **Auth**: Required
- **Description**: Initialize payment request with selected gateway

**Request Body**:
```json
{
  "bookingId": "uuid",
  "amount": 10000,
  "currency": "ETB",
  "paymentGateway": "TELEBIRR|PAYPAL|STRIPE|BANK_TRANSFER|CHAPA",
  "paymentType": "DEPOSIT|MONTHLY_RENT|FULL_PAYMENT",
  "idempotencyKey": "uuid (optional)"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Payment initiated successfully",
  "data": {
    "payment": { ... },
    "redirectUrl": "https://gateway.com/pay/..."
  }
}
```

### 1.2 Confirm Payment (3D Secure)
- **Method**: `POST`
- **Endpoint**: `/payments/confirm`
- **Auth**: Required

**Request Body**:
```json
{
  "transactionId": "string",
  "bookingId": "uuid"
}
```

### 1.3 Get Payment Details
- **Method**: `GET`
- **Endpoint**: `/payments/:paymentId`
- **Auth**: Required

### 1.4 List User Payments
- **Method**: `GET`
- **Endpoint**: `/payments?status=COMPLETED&limit=20&offset=0`
- **Auth**: Required
- **Query Params**:
  - `status`: Filter by payment status
  - `limit`: Number of results (default: 20)
  - `offset`: Pagination offset (default: 0)

### 1.5 Process Refund
- **Method**: `POST`
- **Endpoint**: `/payments/:paymentId/refund`
- **Auth**: Required

**Request Body**:
```json
{
  "amount": 5000,
  "reason": "Booking cancelled"
}
```

### 1.6 Download Invoice
- **Method**: `GET`
- **Endpoint**: `/payments/invoices/:invoiceId/download`
- **Auth**: Required

### 1.7 Telebirr Webhook
- **Method**: `POST`
- **Endpoint**: `/payments/webhook/telebirr`
- **Auth**: None (signature verified)

### 1.8 PayPal Webhook
- **Method**: `POST`
- **Endpoint**: `/payments/webhook/paypal`
- **Auth**: None (signature verified)

### 1.9 Stripe Webhook
- **Method**: `POST`
- **Endpoint**: `/payments/webhook/stripe`
- **Auth**: None (signature verified)

---

## 2. BOOKING ENDPOINTS

### 2.1 Create Booking Request
- **Method**: `POST`
- **Endpoint**: `/bookings`
- **Auth**: Required

**Request Body**:
```json
{
  "propertyId": "uuid",
  "moveInDate": "2024-06-01T00:00:00Z",
  "durationMonths": 12,
  "monthlyRent": 5000,
  "depositAmount": 15000,
  "message": "Looking for a quiet place"
}
```

### 2.2 List User Bookings
- **Method**: `GET`
- **Endpoint**: `/bookings?status=CONFIRMED&role=tenant&limit=20&offset=0`
- **Auth**: Required
- **Query Params**:
  - `status`: Filter by status
  - `role`: `tenant` or `landlord`
  - `limit`: Results per page
  - `offset`: Pagination

### 2.3 Get Booking Details
- **Method**: `GET`
- **Endpoint**: `/bookings/:bookingId`
- **Auth**: Required

### 2.4 Accept Booking
- **Method**: `PUT`
- **Endpoint**: `/bookings/:bookingId/accept`
- **Auth**: Required (Landlord only)

### 2.5 Decline Booking
- **Method**: `PUT`
- **Endpoint**: `/bookings/:bookingId/decline`
- **Auth**: Required (Landlord only)

**Request Body**:
```json
{
  "reason": "Property no longer available"
}
```

### 2.6 Send Counter Offer
- **Method**: `PUT`
- **Endpoint**: `/bookings/:bookingId/counter-offer`
- **Auth**: Required (Landlord only)

**Request Body**:
```json
{
  "moveInDate": "2024-06-15T00:00:00Z",
  "monthlyRent": 5500,
  "depositAmount": 16500,
  "message": "Revised terms"
}
```

### 2.7 Cancel Booking
- **Method**: `PUT`
- **Endpoint**: `/bookings/:bookingId/cancel`
- **Auth**: Required

**Request Body**:
```json
{
  "reason": "Change of plans"
}
```

---

## 3. REVIEW ENDPOINTS

### 3.1 Submit Review
- **Method**: `POST`
- **Endpoint**: `/reviews`
- **Auth**: Required

**Request Body**:
```json
{
  "bookingId": "uuid",
  "rating": 5,
  "text": "Great property and responsive landlord!",
  "reviewType": "PROPERTY|LANDLORD|TENANT"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Review published successfully",
  "data": { ... }
}
```

### 3.2 Get Property Reviews
- **Method**: `GET`
- **Endpoint**: `/reviews/property/:propertyId?verified=true&limit=20&offset=0`
- **Auth**: Optional

### 3.3 Get User Reviews
- **Method**: `GET`
- **Endpoint**: `/reviews/user/:userId?reviewType=LANDLORD&limit=20&offset=0`
- **Auth**: Optional

### 3.4 Get Moderation Queue (Admin)
- **Method**: `GET`
- **Endpoint**: `/reviews/admin/moderation-queue?limit=20&offset=0`
- **Auth**: Required (Admin)

### 3.5 Moderate Review (Admin)
- **Method**: `PUT`
- **Endpoint**: `/reviews/:reviewId/moderate`
- **Auth**: Required (Admin)

**Request Body**:
```json
{
  "status": "PUBLISHED|REJECTED",
  "moderationNotes": "Contains harmful content"
}
```

---

## 4. NOTIFICATION ENDPOINTS

### 4.1 Get Notifications
- **Method**: `GET`
- **Endpoint**: `/notifications?isRead=false&limit=20&offset=0`
- **Auth**: Required

### 4.2 Get Unread Count
- **Method**: `GET`
- **Endpoint**: `/notifications/unread-count`
- **Auth**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

### 4.3 Mark Notification as Read
- **Method**: `PUT`
- **Endpoint**: `/notifications/:notificationId/read`
- **Auth**: Required

### 4.4 Mark All as Read
- **Method**: `PUT`
- **Endpoint**: `/notifications/mark-all-as-read`
- **Auth**: Required

### 4.5 Delete Notification
- **Method**: `DELETE`
- **Endpoint**: `/notifications/:notificationId`
- **Auth**: Required

### 4.6 Get Notification Preferences
- **Method**: `GET`
- **Endpoint**: `/notifications/preferences`
- **Auth**: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "preferences": [
      {
        "channel": "IN_APP",
        "enabled": true
      },
      {
        "channel": "EMAIL",
        "enabled": true
      },
      {
        "channel": "SMS",
        "enabled": false
      },
      {
        "channel": "PUSH",
        "enabled": false
      }
    ]
  }
}
```

### 4.7 Update Notification Preferences
- **Method**: `PUT`
- **Endpoint**: `/notifications/preferences`
- **Auth**: Required

**Request Body**:
```json
{
  "channel": "EMAIL",
  "enabled": false
}
```

---

## 5. ADMIN ENDPOINTS

All admin endpoints require `Authorization: Bearer <admin_token>` and Admin role.

### 5.1 Get Dashboard Metrics
- **Method**: `GET`
- **Endpoint**: `/admin/dashboard`
- **Auth**: Required (Admin)

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalListings": 450,
      "totalBookings": 320,
      "totalPayments": 285,
      "totalRevenue": 4500000
    },
    "pending": {
      "listings": 12,
      "kyc": 8,
      "disputes": 3
    },
    "activity": {
      "bookingsThisMonth": 45,
      "paymentsThisMonth": 42
    }
  }
}
```

### 5.2 List All Users
- **Method**: `GET`
- **Endpoint**: `/admin/users?role=OWNER&kycStatus=PENDING&limit=20&offset=0`
- **Auth**: Required (Admin)

### 5.3 Verify User (KYC)
- **Method**: `PUT`
- **Endpoint**: `/admin/users/:userId/verify`
- **Auth**: Required (Admin)

**Request Body**:
```json
{
  "status": "APPROVED|REJECTED",
  "reason": "Documents verified"
}
```

### 5.4 Suspend User
- **Method**: `PUT`
- **Endpoint**: `/admin/users/:userId/suspend`
- **Auth**: Required (Admin)

**Request Body**:
```json
{
  "reason": "Violation of terms",
  "duration": 30
}
```

### 5.5 Approve Listing
- **Method**: `PUT`
- **Endpoint**: `/admin/listings/:listingId/approve`
- **Auth**: Required (Admin)

### 5.6 Reject Listing
- **Method**: `PUT`
- **Endpoint**: `/admin/listings/:listingId/reject`
- **Auth**: Required (Admin)

**Request Body**:
```json
{
  "reason": "Images do not match property description"
}
```

### 5.7 List Disputes
- **Method**: `GET`
- **Endpoint**: `/admin/disputes?status=OPEN&limit=20&offset=0`
- **Auth**: Required (Admin)

### 5.8 Resolve Dispute
- **Method**: `PUT`
- **Endpoint**: `/admin/disputes/:disputeId/resolve`
- **Auth**: Required (Admin)

**Request Body**:
```json
{
  "decision": "TENANT_WINS|LANDLORD_WINS|SPLIT",
  "refundAmount": 7500,
  "notes": "Landlord failed to provide agreed amenities"
}
```

### 5.9 Get Admin Logs
- **Method**: `GET`
- **Endpoint**: `/admin/logs?adminId=uuid&action=VERIFY_USER&limit=50&offset=0`
- **Auth**: Required (Admin)

### 5.10 Get Transaction Audit Logs
- **Method**: `GET`
- **Endpoint**: `/admin/transaction-logs?status=COMPLETED&gateway=TELEBIRR&limit=50&offset=0`
- **Auth**: Required (Admin)

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "data": null
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Server Error

### Common Error Messages

- `"Invalid email or password"` (401)
- `"Booking not found"` (404)
- `"You already have an active booking request for this property"` (409)
- `"Only completed bookings can be reviewed"` (400)
- `"Payment not found for webhook"` (404)
- `"Webhook signature verification failed"` (401)

---

## Pagination

Endpoints that support pagination use standard query parameters:

- `limit`: Number of results per page (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

**Response** includes:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 500,
    "limit": 20,
    "offset": 0
  }
}
```

---

## Rate Limiting

API rate limits:
- **Authentication endpoints**: 5 requests per minute
- **Regular endpoints**: 60 requests per minute
- **Admin endpoints**: 30 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1635456000
```

---

## Webhook Security

All webhooks are signed. Verify signature before processing:

**Telebirr**: Uses `X-Telebirr-Signature` header (HMAC-SHA256)
**PayPal**: Uses `PayPal-Transmission-Sig` header
**Stripe**: Uses `Stripe-Signature` header

---

## Code Examples

### JavaScript/TypeScript

```typescript
import { api } from '@/lib/api';

// Create booking
const booking = await api.bookings.create({
  propertyId: 'property-123',
  moveInDate: new Date().toISOString(),
  durationMonths: 12,
  monthlyRent: 5000,
  depositAmount: 15000,
});

// Initiate payment
const payment = await api.payments.initiate({
  bookingId: booking.data.data.id,
  amount: 15000,
  currency: 'ETB',
  paymentGateway: 'TELEBIRR',
});

// Submit review
const review = await api.reviews.submit({
  bookingId: booking.data.data.id,
  rating: 5,
  text: 'Excellent property!',
  reviewType: 'PROPERTY',
});
```

### cURL

```bash
# Create booking
curl -X POST https://api.maki.com/api/v1/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "property-123",
    "moveInDate": "2024-06-01T00:00:00Z",
    "durationMonths": 12,
    "monthlyRent": 5000,
    "depositAmount": 15000
  }'
```

---

## Version History

- **v1.0** (Current): All Phase 2 features including payments, bookings, reviews, notifications, and admin dashboard
