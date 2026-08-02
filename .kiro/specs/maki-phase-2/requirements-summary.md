# MAKI Phase 2 Requirements - Complete Index

## Document Structure

This Phase 2 specification is organized across three documents:

### 1. **requirements.md** - Core Features (Requirements 1-38)
- **Payment Integration (Req 1-15)**: Multi-gateway payment processing, Telebirr, PayPal, Stripe, Chapa, bank transfer, currency support, split payments, recurring rent, escrow, refunds, audit logging, idempotency, webhook verification, invoices

- **Booking & Reservation System (Req 16-22)**: Booking request workflow, landlord acceptance/counter-offer, calendar blocking, payment requirements, cancellation policies, timeline visualization, response time tracking

- **Reviews & Ratings (Req 23-27)**: Tenant reviews of properties/landlords, landlord reviews of tenants, verified stay badges, admin moderation queue, review visibility on pages

- **Digital Contracts & E-Signature (Req 28-31)**: Contract auto-generation with booking details, DocuSign e-signature integration, contract storage, contract history per listing

- **Multi-Channel Notifications (Req 32-38)**: In-app, email, SMS, push notifications; booking triggers; payment triggers; admin/listing triggers; review triggers; admin config; user preferences

### 2. **requirements-admin.md** - Admin & Landlord Features (Requirements 39-58)
- **Admin Dashboard (Req 39-46)**: User management, listing moderation, transaction monitoring, dispute resolution, commission configuration, analytics/reporting, content management, reports/exports

- **Landlord Earnings (Req 47-49)**: Earnings dashboard, occupancy metrics, pending payments, payout schedule, bank account setup

- **Landlord Calendar (Req 50-51)**: Availability calendar with blocking, lease term settings, minimum stay requirements

- **KYC Verification (Req 52-55)**: Landlord identity verification, bank account verification, property ownership proof, admin KYC review

- **Advanced Search (Req 56-58)**: Price/amenities/date filters, sorting options, verified landlord filter

### 3. **requirements-summary.md** - This Document
- Executive overview
- Requirements organization
- Key acceptance criteria patterns
- Technical constraints
- User story alignment

---

## Core User Stories Covered

### Tenant User Stories
1. Request booking with move-in date and duration
2. See booking status workflow
3. Pay rent/deposit via multiple gateways
4. Download contract & invoice
5. Leave reviews after lease ends
6. Receive notifications about bookings/payments
7. See landlord response time and rating
8. Filter/sort properties by multiple criteria
9. View verified landlord badge
10. See property reviews and ratings

### Landlord User Stories
1. Accept/decline/counter-offer bookings
2. See earnings dashboard with metrics
3. Set up automatic monthly rent collection
4. Block maintenance dates in calendar
5. Receive payment notifications
6. Rate tenants after move-out
7. Verify identity with KYC
8. See payout schedule and earnings
9. Manage availability calendar
10. Set lease term minimums

### Admin User Stories
1. Moderate listings before publishing
2. Monitor all transactions
3. Resolve disputes between tenants/landlords
4. Set commission rates and payment methods
5. View analytics and business metrics
6. Generate transaction reports
7. Verify landlord KYC documents
8. Manage featured listings and content
9. View user management tools
10. Track platform-wide metrics

---

## Payment Gateway Integration Matrix

| Gateway | Supported | Currency | User Base | Auth Required |
|---------|-----------|----------|-----------|---------------|
| Telebirr | Yes | ETB | Local (Ethiopia) | Yes |
| PayPal Checkout | Yes | USD | International | Yes |
| Stripe | Yes | USD/ETB | Global | Yes |
| Chapa Aggregator | Yes | ETB | Local (Ethiopia) | Yes |
| Bank Transfer | Yes | ETB | All | Manual |

---

## Key Feature Dependencies

### Payment → Booking Workflow
1. Tenant requests booking → Landlord confirms → System blocks dates
2. Landlord accepts → System prompts for payment
3. Tenant pays deposit + authorizes recurring rent
4. System confirms payment → Lease becomes "Paid" → Activates at move-in

### KYC → Trust System
1. Landlord verifies identity (KYC)
2. System displays "Verified Landlord" badge
3. Tenant sees badge on listing → Higher trust
4. After lease completion → Tenant can leave verified review
5. Verified reviews boost property ranking

### Notifications → User Engagement
1. Booking event occurs → Notification triggered
2. Notification routed to enabled channels (in-app, email, SMS, push)
3. User receives notification in preferred language
4. User clicks notification → Deep link to related booking/payment

---

## Acceptance Criteria Patterns Used

### Property-Based Testing Opportunities

**Round-Trip Properties:**
- Payment idempotency: `process(request) == process(request)` (same result)
- Invoice generation: `generate_invoice(payment) == read_invoice(payment_id)` (data consistency)
- Contract signing: `sign(contract) == download(contract)` (document integrity)

**Invariants:**
- Booking status never goes backwards (Requested → Confirmed → Paid → Active → Completed)
- Deposited amount in escrow never decreases except on explicit refund
- Commission calculation always extracts same percentage: `landlord_amount = total - (total * commission_rate)`

**Idempotence:**
- Recurring rent payment in month 1 = recurring rent payment in month 2 (same behavior)
- Webhook processing: `process_webhook(webhook) == process_webhook(webhook)` (idempotent)

**Metamorphic Relations:**
- `len(filtered_reviews(property)) <= len(all_reviews(property))`
- `landlord_rating_average >= min(all_landlord_ratings)`
- `paid_bookings >= 0` and `paid_bookings <= total_bookings`

### Integration Test Scenarios
- End-to-end booking flow: request → confirm → pay → activate → complete → review
- Admin dispute resolution: file dispute → admin review → apply decision → verify refund processed
- Payment gateway webhook: send webhook → verify signature → update transaction → notify user

---

## Security Implementation Checklist

- [ ] All card data handled by payment gateways (NEVER stored by MAKI)
- [ ] Webhook signatures verified before processing
- [ ] Idempotency keys prevent duplicate charges
- [ ] Rate limiting on payment endpoints (10 req/min)
- [ ] Input validation on all payment fields
- [ ] JWT authentication on all API routes
- [ ] Role-based access control (Tenant/Landlord/Admin)
- [ ] Admin actions logged with user ID and timestamp
- [ ] PCI-DSS compliance delegated to payment providers
- [ ] Email verification required for payment operations
- [ ] 2FA recommended (optional) for landlord accounts before settlement

---

## Glossary of Key Terms

- **Booking**: Tenant's formal request to rent a property with specific dates
- **Lease**: Active rental agreement once booking is confirmed and paid
- **Deposit**: Security deposit held in escrow, released after move-out
- **Idempotency Key**: Unique ID preventing duplicate payment processing
- **Webhook**: Payment gateway callback to confirm transaction
- **KYC**: Know-Your-Customer identity verification process
- **Verified Badge**: Trust indicator for KYC-verified landlords
- **Escrow**: Funds held by platform, released per policy
- **Commission**: Platform revenue % deducted from transactions
- **Payout**: Landlord earnings transferred to bank account

---

## Next Steps for Implementation

### Phase 2 Design Phase (After Requirements Approval)
- Create system architecture diagrams (payment flows, notification queue, database schema)
- Design API endpoints for each feature
- Create database schema migration scripts
- Design UI mockups for admin dashboard, landlord analytics, search filters
- Create payment gateway integration architecture

### Phase 2 Development Phase (After Design Approval)
- Backend: Payment gateway integrations, webhook handlers, transaction logging
- Backend: Booking status workflow engine, calendar blocking logic
- Backend: Review/rating system with moderation queue
- Backend: Contract generation and e-signature integration
- Backend: Notification queue and multi-channel delivery
- Frontend: Booking request interface, payment checkout
- Frontend: Admin dashboard pages (users, listings, transactions, disputes)
- Frontend: Landlord analytics and earnings pages
- Frontend: Search filters and sorting
- Frontend: Contract signing interface

### Phase 2 Testing Phase
- Integration tests for each payment gateway
- Property-based tests for payment idempotency and booking status transitions
- End-to-end tests for complete booking workflow
- Admin dashboard integration tests
- Notification delivery tests across all channels

---

## Metrics for Phase 2 Success

- Zero duplicate charge incidents (idempotency working)
- 99.9% payment success rate (webhooks received and processed)
- < 2 second payment redirect time
- < 3 second admin dashboard load
- < 5 second notification delivery
- 100% of landlords verified within 7 days (KYC automation)
- 95%+ of reviews published without moderation rejection
- 100% contract signature completion (no abandoned e-signatures)

---

**Phase 2 Requirements Specification Complete**

Document Status: **Ready for Design Phase**
Total Requirements: **58**
Payment Gateways: **5**
Notification Channels: **4**
User Roles: **3**
