# MAKI Phase 2 Requirements Specification

## Introduction

MAKI Phase 2 expands the rental platform with critical payment infrastructure, booking/reservation system, reviews & ratings, digital contracts, multi-channel notifications, and comprehensive admin/landlord dashboards. This phase transforms MAKI from a listing platform into a complete end-to-end rental marketplace with payment processing, trust mechanisms, and operational management tools.

## Glossary

- **System**: The MAKI rental platform backend and frontend services
- **Tenant**: User seeking rental accommodation
- **Landlord**: User offering residential properties for rent
- **Admin**: Platform administrator with moderation and oversight privileges
- **Payment_Gateway**: Third-party service (Telebirr, PayPal, Stripe, Chapa) handling payment transactions
- **Booking**: A tenant's request to rent a property with specific move-in date and duration
- **Lease**: Active rental agreement between tenant and landlord
- **Deposit**: Security deposit held by platform (escrow-style) until lease completion
- **Idempotency_Key**: Unique identifier preventing duplicate payment processing
- **Webhook**: HTTP callback from payment gateway to system for transaction confirmation
- **KYC**: Know-Your-Customer verification process (identity verification)
- **Contract**: Digitally signed lease agreement between tenant and landlord
- **Review**: Tenant or Landlord rating and written feedback after lease completion
- **Admin_Log**: Audit trail entry recording admin action with user, timestamp, and details
- **Notification**: Message delivered via in-app, email, SMS, or push notification channels
- **Commission**: Platform revenue percentage deducted from each transaction
- **Payout**: Transfer of landlord earnings to their bank account
- **Escrow**: Deposit held by platform, released only after verified move-in
- **ETB**: Ethiopian Birr (primary currency)
- **USD**: United States Dollar (international currency)
- **Telebirr**: Ethiopia-based mobile money service
- **Chapa**: Payment aggregator supporting multiple Ethiopia payment methods
- **Verified_Badge**: Trust indicator shown on landlord profile and listings after KYC completion
- **Response_Rate**: Percentage of tenant inquiries landlord has responded to within SLA
- **Occupancy_Rate**: Percentage of calendar days property is booked/active

---

## Requirements

### REQUIREMENT 1: MULTI-GATEWAY PAYMENT PROCESSING

**User Story:** As a tenant, I want to pay for my rental deposits and monthly rent using multiple payment methods (Telebirr, PayPal, Stripe, bank transfer) so that I can choose the most convenient option for me, without exposing my card data to the platform.

#### Acceptance Criteria

1. WHEN a tenant initiates a payment, THE System SHALL display available payment gateways based on user's country and currency selection
2. WHEN a tenant selects a gateway, THE System SHALL redirect to the gateway's checkout without storing raw card data
3. WHEN a payment gateway processes a transaction, THE System SHALL verify the webhook signature before processing the callback
4. IF a payment webhook is not received within 30 seconds, THE System SHALL retry the webhook endpoint up to 3 times with exponential backoff
5. IF a webhook signature verification fails, THEN THE System SHALL reject the webhook and log the security event for admin review
6. WHEN a payment is processed successfully, THE System SHALL record the transaction with idempotency key to prevent duplicate charges
7. WHEN a duplicate payment request arrives (same idempotency key), THE System SHALL return the original transaction result without reprocessing
8. WHEN a payment is confirmed, THE System SHALL deduct the platform commission percentage and transfer remaining amount to landlord's account
9. WHEN a payment completes, THE System SHALL generate an invoice PDF with transaction details, amount, date, and download link
10. THE System SHALL maintain audit logs for every payment attempt, success, failure, and refund with timestamp, user ID, and gateway response


### REQUIREMENT 2: TELEBIRR INTEGRATION

**User Story:** As a tenant in Ethiopia, I want to pay rent using Telebirr so that I can pay conveniently through my mobile money account without using international payment methods.

#### Acceptance Criteria

1. WHEN a tenant in Ethiopia selects Telebirr, THE System SHALL initiate payment request with Telebirr API including amount (in ETB), order ID, and callback URL
2. WHEN a Telebirr payment completes, THE System SHALL receive webhook callback with transaction ID and status
3. WHEN Telebirr webhook is received, THE System SHALL verify webhook signature using Telebirr's public key
4. IF Telebirr payment succeeds, THE System SHALL update booking status to "Paid" and notify both tenant and landlord
5. IF Telebirr payment fails or is cancelled, THE System SHALL revert booking status to "Pending Payment" and allow tenant to retry
6. WHERE Telebirr is selected, THE System SHALL display transaction confirmation with Telebirr reference number

### REQUIREMENT 3: PAYPAL CHECKOUT INTEGRATION

**User Story:** As an international tenant, I want to pay using PayPal so that I can use my international payment methods without exposing card details to the platform.

#### Acceptance Criteria

1. WHEN a tenant outside Ethiopia selects PayPal, THE System SHALL initiate PayPal Checkout session with order details (amount, currency, items)
2. WHEN PayPal redirects to System's return URL, THE System SHALL capture the PayPal transaction ID and verify payment status
3. WHEN PayPal payment completes, THE System SHALL retrieve transaction details via PayPal API and record order ID as payment reference
4. WHEN a PayPal payment is verified as successful, THE System SHALL proceed with booking activation and notify parties
5. IF PayPal payment authorization fails, THE System SHALL return user to payment method selection with clear error message
6. WHERE PayPal is selected, THE System SHALL support USD currency only for PayPal transactions

### REQUIREMENT 4: STRIPE INTEGRATION FOR CARDS

**User Story:** As a tenant with credit/debit cards, I want to pay using Stripe so that I have access to international card payment processing.

#### Acceptance Criteria

1. WHEN a tenant selects Stripe for card payment, THE System SHALL present Stripe Elements payment form (card number, expiry, CVC)
2. WHEN tenant submits card details, THE System SHALL create payment intent via Stripe API without handling raw card data
3. WHEN Stripe payment succeeds, THE System SHALL receive confirmation webhook and update transaction status to "Completed"
4. WHEN Stripe payment fails, THE System SHALL display specific error (declined, expired card, etc.) to tenant
5. IF Stripe payment requires 3D Secure authentication, THE System SHALL redirect to Stripe's 3D Secure verification page
6. WHEN 3D Secure verification completes, THE System SHALL finalize payment and proceed with booking activation

### REQUIREMENT 5: CHAPA AGGREGATOR INTEGRATION (ALTERNATIVE)

**User Story:** As a platform, I want to integrate Chapa as an alternative payment aggregator so that I have simplified integration to multiple Ethiopian payment methods (Telebirr, CBE Birr, Amole) through a single API.

#### Acceptance Criteria

1. WHEN a tenant selects "Pay with Chapa", THE System SHALL present list of payment methods supported by Chapa (Telebirr, CBE Birr, Amole, cards)
2. WHEN tenant selects a Chapa payment method, THE System SHALL initiate Chapa payment request with order details and callback URL
3. WHEN Chapa payment completes, THE System SHALL receive webhook with transaction reference and payment status
4. WHEN Chapa webhook is verified, THE System SHALL update payment status and proceed with booking activation
5. WHERE Chapa is used, THE System SHALL deduplicate payments by comparing Chapa reference numbers against existing records

### REQUIREMENT 6: BANK TRANSFER MANUAL PAYMENT METHOD

**User Story:** As a tenant without access to digital payment methods, I want to pay via bank transfer so that I can complete bookings through traditional banking.

#### Acceptance Criteria

1. WHEN a tenant selects bank transfer, THE System SHALL display bank account details and unique reference number for the transfer
2. WHEN tenant selects bank transfer, THE System SHALL set booking status to "Pending Bank Confirmation" and show 48-hour payment window
3. WHEN admin receives bank transfer notification, THE System SHALL provide interface to upload receipt image and confirm payment
4. WHEN admin uploads receipt and confirms payment, THE System SHALL verify tenant name matches and mark booking as "Paid"
5. IF 48 hours elapse without payment confirmation, THE System SHALL automatically cancel the booking and release property availability
6. WHERE bank transfer is selected, THE System SHALL require admin manual verification (not fully automated)

### REQUIREMENT 7: CURRENCY SUPPORT (ETB AND USD)

**User Story:** As a platform, I want to support both ETB and USD currencies so that I can serve both local and international users while maintaining clear pricing.

#### Acceptance Criteria

1. WHEN a landlord creates a listing, THE System SHALL display default currency based on landlord's country (ETB for Ethiopia, USD for others)
2. WHERE a listing is priced in ETB, THE System SHALL display prices in ETB and refuse USD payments (except PayPal international users)
3. WHERE a listing is priced in USD, THE System SHALL display prices in USD and enable PayPal/Stripe for international payments
4. WHEN a tenant from different country views listing, THE System SHALL display estimated USD equivalent (ETB conversion rate updated daily)
5. WHEN payment gateway selection happens, THE System SHALL restrict available gateways based on currency and tenant location


### REQUIREMENT 8: SPLIT PAYMENT - DEPOSIT AND MONTHLY RENT

**User Story:** As a tenant, I want to split payments between deposit (paid upfront) and monthly rent (recurring) so that my immediate cash requirement is lower while committing to monthly rent payment.

#### Acceptance Criteria

1. WHEN a booking is confirmed, THE System SHALL present two separate payment flows: deposit payment and monthly rent setup
2. WHEN a tenant initiates deposit payment, THE System SHALL hold deposit in escrow until lease completion or cancellation
3. WHEN deposit payment is confirmed, THE System SHALL require tenant to authorize monthly rent recurring payment (with explicit consent)
4. WHEN monthly rent recurring payment is authorized, THE System SHALL create subscription schedule for automatic charges on 1st of each month
5. WHEN first monthly rent payment is due, THE System SHALL send reminder notification 5 days before due date
6. WHEN monthly rent payment fails, THE System SHALL retry payment 2 days later and send alert to landlord
7. IF monthly rent payment fails after 2 retries, THE System SHALL notify landlord and tenant that lease is at risk of termination

### REQUIREMENT 9: RECURRING MONTHLY RENT COLLECTION

**User Story:** As a landlord, I want automatic monthly rent collection on a recurring schedule so that I don't have to manually request payment each month.

#### Acceptance Criteria

1. WHERE a tenant has authorized recurring payments, THE System SHALL automatically charge rent on the 1st of each month
2. WHEN recurring payment is authorized, THE System SHALL store subscription details with payment gateway (Stripe/Telebirr recurring capability)
3. WHEN monthly charge is processed, THE System SHALL notify both tenant and landlord with payment confirmation
4. IF a recurring charge fails, THE System SHALL retry after 2 days and send alert to both parties
5. WHEN tenant or landlord cancels the lease, THE System SHALL stop recurring charges immediately and cancel subscription
6. THE System SHALL maintain audit log of all recurring payment attempts with success/failure status

### REQUIREMENT 10: ESCROW-STYLE DEPOSIT HOLDING AND RELEASE

**User Story:** As a tenant, I want my security deposit held in escrow until move-in confirmation so that I know my deposit is protected and will be refunded if the landlord cancels.

#### Acceptance Criteria

1. WHEN a tenant pays deposit, THE System SHALL hold amount in escrow account and set status to "Held"
2. WHEN tenant confirms move-in via in-app confirmation, THE System SHALL unlock deposit status to "Move-In Confirmed"
3. WHEN lease completes normally (move-out date reached), THE System SHALL retain deposit for 30 days pending disputes
4. AFTER 30-day dispute period expires without disputes, THE System SHALL refund deposit to tenant's original payment method
5. IF tenant initiates cancellation before move-in, THE System SHALL refund full deposit within 5 business days
6. IF landlord initiates cancellation before move-in, THE System SHALL refund full deposit to tenant within 3 business days
7. WHERE disputes exist, THE Admin SHALL have interface to adjust refund amount (partial or full) and process refund decision

### REQUIREMENT 11: REFUND WORKFLOW FOR CANCELLATIONS AND DISPUTES

**User Story:** As a platform, I want to manage refunds for cancellations and disputes so that both tenants and landlords trust the platform with their money.

#### Acceptance Criteria

1. WHEN a tenant cancels booking before move-in, THE System SHALL calculate refund amount based on cancellation policy (days of notice)
2. IF tenant cancels within 3 days of move-in, THE System SHALL refund 0% of deposit (cancellation fee retained)
3. IF tenant cancels 3-7 days before move-in, THE System SHALL refund 50% of deposit to tenant
4. IF tenant cancels more than 7 days before move-in, THE System SHALL refund 100% of deposit to tenant
5. WHERE a dispute is filed, THE Admin SHALL review chat logs, uploaded evidence, and determine refund percentage
6. WHEN admin makes refund decision, THE System SHALL execute refund via payment gateway to original payment method
7. WHEN refund is processed, THE System SHALL notify both tenant and landlord with refund confirmation and amount
8. THE System SHALL maintain detailed refund audit logs showing reason, amount, decision maker, and processing date

### REQUIREMENT 12: TRANSACTION AUDIT LOGGING

**User Story:** As a platform, I want detailed audit logs of all transactions so that I can investigate disputes, detect fraud, and reconcile with payment providers.

#### Acceptance Criteria

1. EVERY transaction attempt SHALL be logged with: user ID, booking ID, gateway name, amount, currency, timestamp, and status
2. EVERY payment gateway callback (webhook) SHALL be logged with: webhook timestamp, signature verification result, parsed data, and processing result
3. EVERY refund decision SHALL be logged with: admin user ID, decision reason, refund amount, original transaction ID, and timestamp
4. WHERE a transaction fails, THE System SHALL log specific error message from payment gateway for debugging
5. THE System SHALL maintain transaction logs for minimum 7 years for compliance and audit purposes
6. THE Admin SHALL have export interface to generate transaction reports (PDF/CSV) filtered by date range, gateway, user, or status

### REQUIREMENT 13: IDEMPOTENCY FOR PAYMENT PROCESSING

**User Story:** As a platform, I want to prevent accidental duplicate charges if a payment request is retried or a webhook is processed twice.

#### Acceptance Criteria

1. EVERY payment request SHALL include unique idempotency key generated by frontend (UUID format)
2. WHEN a payment is processed, THE System SHALL store idempotency key with transaction result
3. IF the same idempotency key is submitted again within 24 hours, THE System SHALL return the original result without reprocessing
4. WHEN webhook is received, THE System SHALL check transaction by payment gateway reference ID to prevent duplicate processing
5. IF a webhook is received twice, THE System SHALL idempotently process it (return success for both calls, process logic only once)


### REQUIREMENT 14: WEBHOOK SIGNATURE VERIFICATION

**User Story:** As a platform, I want to verify that payment webhooks are genuinely from payment gateways so that I don't process fraudulent callbacks.

#### Acceptance Criteria

1. WHEN a webhook is received from a payment gateway, THE System SHALL extract the signature from webhook headers
2. WHEN signature verification is needed, THE System SHALL retrieve the gateway's public key from secure configuration
3. WHEN verifying signature, THE System SHALL use HMAC-SHA256 to verify request body against provided signature
4. IF signature verification fails, THE System SHALL reject the webhook and return HTTP 401 Unauthorized
5. IF signature verification fails, THE System SHALL log security event with gateway, timestamp, and signature data for admin review
6. WHERE signature verification succeeds, THE System SHALL proceed with transaction processing
7. THE System SHALL support signature verification for all integrated gateways: Telebirr, PayPal, Stripe, Chapa

### REQUIREMENT 15: INVOICE GENERATION AND DOWNLOAD

**User Story:** As a tenant, I want to download invoices for my payments so that I have proof of payment for tax and record-keeping purposes.

#### Acceptance Criteria

1. AFTER a payment is confirmed, THE System SHALL generate PDF invoice containing: invoice number, date, tenant name, property details, amount, currency, payment method, and transaction ID
2. WHEN a tenant views their booking/payment, THE System SHALL display "Download Invoice" button
3. WHEN tenant clicks download, THE System SHALL generate fresh PDF invoice and serve it to browser
4. THE PDF invoice SHALL be formatted professionally with platform logo, payment details, and landlord details
5. THE System SHALL store generated invoices for audit purposes (retain for 7 years)
6. THE System SHALL include both tenant and landlord contact details on invoice for record-keeping

---

## REQUIREMENT 16: BOOKING REQUEST AND STATUS WORKFLOW

**User Story:** As a tenant, I want to request a booking with my move-in date and message so that the landlord understands my requirements before accepting.

#### Acceptance Criteria

1. WHEN a tenant initiates booking on a property, THE System SHALL present form asking for: move-in date, duration (number of months), and optional message
2. WHEN tenant submits booking request, THE System SHALL create Booking record with status "Requested" and timestamp
3. WHEN booking is created, THE System SHALL send in-app and email notification to landlord about new booking request
4. WHEN booking status is "Requested", THE System SHALL not block calendar dates (landlord can still decline)
5. WHERE booking request is submitted, THE System SHALL store: tenant ID, property ID, move-in date, duration, message, created timestamp, and requester contact info

### REQUIREMENT 17: LANDLORD BOOKING ACCEPTANCE AND COUNTER-OFFER

**User Story:** As a landlord, I want to accept, decline, or counter-offer booking requests so that I can manage which tenants occupy my property.

#### Acceptance Criteria

1. WHEN landlord receives booking request, THE System SHALL display request details: tenant info, move-in date, duration, and message
2. WHEN landlord clicks "Accept", THE System SHALL change booking status to "Confirmed" and lock calendar dates
3. WHEN landlord clicks "Decline", THE System SHALL change booking status to "Declined" and send notification to tenant
4. WHERE landlord wants to counter-offer, THE System SHALL allow modification of: move-in date, duration, or monthly rent
5. WHEN landlord submits counter-offer, THE System SHALL change booking status to "Counter-Offered" and send details to tenant
6. WHEN tenant receives counter-offer, THE System SHALL notify tenant and allow tenant to accept, decline, or re-counter-offer
7. IF tenant doesn't respond to counter-offer within 7 days, THE System SHALL auto-expire the counter-offer
8. WHERE either party declines or counter-offer expires, THE System SHALL release calendar dates and reset booking status to allow new requests

### REQUIREMENT 18: CALENDAR BLOCKING ON CONFIRMED BOOKING

**User Story:** As a landlord, I want the calendar automatically blocked when a booking is confirmed so that no one else can book overlapping dates.

#### Acceptance Criteria

1. WHEN a booking status changes to "Confirmed", THE System SHALL immediately block all dates from move-in date through move-out date (move-in + duration)
2. WHEN dates are blocked, THE System SHALL remove property from search results for those dates
3. WHEN a tenant searches for availability, THE System SHALL exclude properties with blocked/booked dates
4. WHERE a booking is cancelled, THE System SHALL release blocked dates within 1 second
5. THE System SHALL prevent any new booking request on blocked dates with message: "Property unavailable during requested dates"

### REQUIREMENT 19: PAYMENT REQUIREMENT BEFORE LEASE ACTIVATION

**User Story:** As a landlord, I want to ensure payment is received before the lease becomes active so that I have guaranteed income.

#### Acceptance Criteria

1. WHEN a booking is confirmed, THE System SHALL set status to "Confirmed" (not yet active)
2. WHEN booking is confirmed, THE System SHALL prompt tenant to pay deposit and authorize monthly rent
3. UNTIL payment is confirmed, THE System SHALL NOT activate the lease (status stays "Confirmed")
4. WHEN payment is confirmed, THE System SHALL change booking status to "Paid" and set lease activation date to move-in date
5. WHEN move-in date arrives, THE System SHALL change booking status to "Active" and notify both parties

### REQUIREMENT 20: CANCELLATION POLICY MANAGEMENT

**User Story:** As a landlord, I want to set cancellation policies so that I'm protected when tenants cancel last-minute.

#### Acceptance Criteria

1. WHEN landlord creates or edits property listing, THE System SHALL display cancellation policy options: Strict, Moderate, Flexible, Non-Refundable
2. WHERE cancellation policy is set to "Strict", THE System SHALL refund: 0% if cancelled within 7 days, 50% if 7-14 days, 100% if 14+ days
3. WHERE cancellation policy is set to "Moderate", THE System SHALL refund: 0% if cancelled within 3 days, 50% if 3-7 days, 100% if 7+ days
4. WHERE cancellation policy is set to "Flexible", THE System SHALL refund: 100% if cancelled 3+ days before move-in, 50% if 1-3 days, 0% if within 24 hours
5. WHERE cancellation policy is set to "Non-Refundable", THE System SHALL refund: 0% regardless of cancellation timing
6. WHEN a booking is cancelled, THE System SHALL apply the cancellation policy and calculate refund percentage
7. THE Admin SHALL have ability to override cancellation policy on disputed cancellations

### REQUIREMENT 21: BOOKING TIMELINE VISUALIZATION

**User Story:** As a tenant or landlord, I want to see the booking status timeline so that I understand what stage we're at in the rental process.

#### Acceptance Criteria

1. ON booking detail page, THE System SHALL display timeline with steps: Requested → Confirmed → Paid → Active → Completed (or Cancelled)
2. THE System SHALL show current status highlighted with completion timestamp for each step
3. WHERE a step is completed, THE System SHALL show checkmark and timestamp
4. WHERE a step is pending, THE System SHALL show expected action (e.g., "Awaiting landlord response")
5. THE System SHALL display estimated dates for future steps based on booking details

### REQUIREMENT 22: LANDLORD RESPONSE TIME TRACKING FOR RATINGS

**User Story:** As a tenant, I want to see landlord's average response time so that I know if they'll communicate quickly with me.

#### Acceptance Criteria

1. THE System SHALL track landlord response time for every booking request: time from request creation to first landlord action (accept/decline/counter-offer)
2. WHEN a landlord responds to a booking, THE System SHALL calculate response time in hours
3. WHERE landlord doesn't respond within 48 hours, THE System SHALL mark as "Slow to Respond" in booking record
4. THE System SHALL calculate landlord's average response time across all bookings
5. WHERE landlord's average response time is displayed, THE System SHALL show: "Average response: X hours"
6. WHEN tenant views landlord profile, THE System SHALL display response rate metric: "Responds to X% of inquiries"


---

## REQUIREMENT 23: TENANT REVIEWS AND RATINGS FOR PROPERTY/LANDLORD

**User Story:** As a tenant, I want to rate and review the property and landlord after my lease completes so that future renters can make informed decisions.

#### Acceptance Criteria

1. AFTER a lease status changes to "Completed", THE System SHALL prompt tenant to leave a review (within 7 days of move-out)
2. WHEN a tenant leaves a review, THE System SHALL collect: 5-star rating for property, 5-star rating for landlord, and written review (optional, max 500 characters)
3. WHEN review is submitted, THE System SHALL store review with reviewer ID, listing ID, landlord ID, rating, text, and timestamp
4. WHERE review content is submitted, THE System SHALL attach "Verified Stay" badge to review to indicate booking authenticity
5. WHEN a review is published, THE System SHALL recalculate property's average rating and update search/detail page
6. WHEN a review is published, THE System SHALL notify landlord of new review via in-app and email notification
7. THE System SHALL display reviews on property detail page with reviewer name (first name + last initial), rating, text, and "Verified Stay" badge

### REQUIREMENT 24: LANDLORD REVIEWS AND RATINGS FOR TENANT

**User Story:** As a landlord, I want to rate tenants after they move out so that future landlords can identify reliable tenants.

#### Acceptance Criteria

1. AFTER a lease status changes to "Completed", THE System SHALL prompt landlord to leave a review (within 7 days of move-out)
2. WHEN a landlord leaves a review, THE System SHALL collect: 5-star rating for tenant and written review (optional, max 500 characters)
3. WHEN landlord submits review, THE System SHALL store review with landlord ID, tenant ID, rating, text, and timestamp
4. WHERE review content is submitted, THE System SHALL attach "Verified Landlord" badge to indicate landlord's verified status (if KYC-verified)
5. WHEN a review is published, THE System SHALL notify tenant via in-app and email notification
6. WHEN tenant views their profile, THE System SHALL display average tenant rating and individual reviews from landlords
7. THE System SHALL not allow reviews to be deleted by users; Admin can remove abusive reviews

### REQUIREMENT 25: VERIFIED STAY BADGE FOR REVIEWS

**User Story:** As a platform, I want to indicate which reviews are from verified bookings so that users trust review authenticity.

#### Acceptance Criteria

1. WHEN a review is submitted by tenant, THE System SHALL check if reviewer's booking was completed (booking status = "Completed")
2. WHERE booking is verified as completed, THE System SHALL automatically attach "Verified Stay" badge to review
3. WHERE review has "Verified Stay" badge, THE System SHALL display badge prominently on review
4. WHEN users sort or filter reviews, THE System SHALL allow filtering to show only "Verified Stay" reviews
5. THE System SHALL prioritize displaying verified reviews higher in the review list

### REQUIREMENT 26: ADMIN REVIEW MODERATION QUEUE

**User Story:** As an admin, I want to review flagged or suspicious reviews before they appear publicly so that the platform maintains quality and prevents abuse.

#### Acceptance Criteria

1. WHEN a review is submitted, THE System SHALL scan it for prohibited content (harassment, spam, profanity) using keyword detection
2. IF review contains flagged keywords or has low rating (1-2 stars) with short text (< 20 chars), THE System SHALL add to moderation queue automatically
3. WHERE review is flagged, THE System SHALL set review status to "Pending Moderation"
4. WHEN review is pending, THE System SHALL NOT display it publicly until admin approves
5. THE Admin SHALL view moderation queue with: reviewer, review text, rating, reason for flag, and approve/reject buttons
6. WHEN admin approves flagged review, THE System SHALL change status to "Published" and display publicly
7. WHEN admin rejects flagged review, THE System SHALL change status to "Rejected" and notify reviewer of rejection reason
8. WHEN review is rejected, THE System SHALL offer tenant ability to resubmit edited review

### REQUIREMENT 27: REVIEW VISIBILITY ON LISTING AND PROFILE PAGES

**User Story:** As a tenant, I want to see average rating and individual reviews on property detail page so that I can assess property quality before booking.

#### Acceptance Criteria

1. ON property detail page, THE System SHALL display: overall property rating (out of 5 stars), number of reviews, and written reviews list
2. WHERE property has no reviews, THE System SHALL display: "No reviews yet. Be the first to review!"
3. ON property detail page, THE System SHALL display individual reviews sorted by recency (newest first)
4. FOR each review, THE System SHALL show: reviewer name (first name + last initial), rating, review text, date, and "Verified Stay" badge
5. ON landlord profile page, THE System SHALL display: landlord average rating, tenant reviews, and response rate metric
6. THE System SHALL calculate property average rating excluding rejected/deleted reviews
7. WHERE property has average rating >= 4.5, THE System SHALL display "Highly Rated" badge on listing preview
8. WHERE landlord has average rating >= 4.5, THE System SHALL display "Highly Rated Landlord" badge on profile

---

## REQUIREMENT 28: DIGITAL CONTRACT AUTO-GENERATION

**User Story:** As a platform, I want to automatically generate lease agreements populated with booking details so that tenants and landlords don't have to negotiate contracts manually.

#### Acceptance Criteria

1. AFTER a booking is confirmed and before payment is required, THE System SHALL generate lease agreement PDF template
2. WHEN contract is generated, THE System SHALL populate with: property address, property details, tenant name, landlord name, move-in date, duration, monthly rent, deposit amount, payment schedule, and terms
3. WHERE contract is generated, THE System SHALL include standard terms from admin-configured template: pet policy, smoking policy, utilities included, maintenance responsibility
4. WHEN contract is displayed, THE System SHALL format as professional PDF with platform logo, clear sections, and signature blocks
5. WHEN contract is ready for signature, THE System SHALL display to both parties before e-signature flow begins
6. THE System SHALL support contract template customization by admin with variable placeholders for auto-population

### REQUIREMENT 29: E-SIGNATURE INTEGRATION

**User Story:** As a tenant and landlord, I want to digitally sign the lease agreement so that we have a legally binding contract without printing and scanning.

#### Acceptance Criteria

1. WHEN both parties are ready to sign contract, THE System SHALL initiate e-signature flow via DocuSign API (or alternative e-signature provider)
2. WHEN e-signature flow starts, THE System SHALL create DocuSign envelope with: contract PDF, signature fields for tenant, signature fields for landlord
3. WHEN DocuSign envelope is created, THE System SHALL send signing URL to both tenant and landlord via email
4. WHEN tenant receives signing URL, THE Tenant SHALL click link to review and electronically sign contract
5. WHEN landlord receives signing URL, THE Landlord SHALL click link to review and electronically sign contract
6. WHEN both parties have signed, THE System SHALL receive webhook notification from DocuSign with signed document
7. WHEN both signatures are collected, THE System SHALL update contract status to "Signed" and download signed PDF from DocuSign
8. WHEN contract is fully signed, THE System SHALL notify both parties and activate lease (set booking status to "Active")

### REQUIREMENT 30: CONTRACT STORAGE AND DOWNLOAD

**User Story:** As a tenant or landlord, I want to download my signed contract so that I have a record for my files.

#### Acceptance Criteria

1. AFTER contract is signed, THE System SHALL store signed contract PDF in secure storage (AWS S3 or similar)
2. WHEN tenant or landlord views booking details, THE System SHALL display "Download Contract" button
3. WHEN download button is clicked, THE System SHALL serve signed contract PDF to user
4. WHERE contract is stored, THE System SHALL retain for minimum 7 years for legal compliance
5. THE System SHALL maintain separate copies: original unsigned template, signed contract with timestamps
6. WHEN landlord creates new booking with same tenant, THE System SHALL reference previous contract and offer to reuse template terms

### REQUIREMENT 31: CONTRACT HISTORY PER LISTING

**User Story:** As a landlord, I want to see all contracts and booking history for a property so that I can track occupancy and reference previous lease terms.

#### Acceptance Criteria

1. ON property detail page in landlord dashboard, THE System SHALL display "Contract History" section
2. WHERE contract history is shown, THE System SHALL list all previous bookings: tenant name, move-in date, move-out date, duration, monthly rent, and link to download contract
3. WHEN landlord clicks contract link, THE System SHALL open or download signed contract PDF
4. THE System SHALL sort contract history by move-in date (newest first)
5. WHERE no previous bookings exist, THE System SHALL display "No lease history yet"

---

## REQUIREMENT 32: MULTI-CHANNEL NOTIFICATIONS (IN-APP, EMAIL, SMS, PUSH)

**User Story:** As a user, I want to receive notifications via my preferred channels (in-app, email, SMS, push) so that I don't miss important updates about bookings and payments.

#### Acceptance Criteria

1. WHEN a notification event occurs, THE System SHALL create notification record
2. WHEN notification is created, THE System SHALL queue notification for delivery via enabled channels: in-app, email, SMS, push (based on user preferences)
3. WHEN in-app notification is queued, THE System SHALL store in notification inbox with: title, message, related booking/payment ID, timestamp, and read status
4. WHEN email notification is queued, THE System SHALL send HTML email with: subject, message body, related booking/payment details, and call-to-action button
5. WHEN SMS notification is queued, THE System SHALL send SMS message (if user has provided phone number) with: brief message and tracking link
6. WHEN push notification is queued, THE System SHALL send to user's mobile device with: title, message, and deep link to related booking/payment
7. WHERE user has not provided phone number, THE System SHALL not queue SMS notifications
8. WHERE user has not enabled push notifications, THE System SHALL not queue push notifications

### REQUIREMENT 33: NOTIFICATION TRIGGERS - BOOKING EVENTS

**User Story:** As a platform, I want to notify users about booking status changes so that they stay informed about their rental application progress.

#### Acceptance Criteria

1. WHEN a tenant submits a booking request, THE System SHALL send notification to landlord with: "New booking request from {tenant_name} for {property_name}"
2. WHEN a landlord accepts a booking, THE System SHALL send notification to tenant with: "Your booking for {property_name} has been confirmed!"
3. WHEN a landlord declines a booking, THE System SHALL send notification to tenant with: "Your booking request for {property_name} was declined"
4. WHEN a landlord submits counter-offer, THE System SHALL send notification to tenant with: "Counter-offer received for {property_name}: New dates {date_range}, new rent {amount}"
5. WHEN a tenant accepts counter-offer, THE System SHALL send notification to landlord with: "{tenant_name} accepted your counter-offer"
6. WHEN a booking is cancelled, THE System SHALL send notifications to both tenant and landlord with: "Booking for {property_name} has been cancelled"
7. WHEN booking status changes to "Active" (lease starts), THE System SHALL send notification to both parties: "Your lease for {property_name} is now active!"
8. WHEN booking status changes to "Completed" (lease ends), THE System SHALL send notification to both parties: "Your lease for {property_name} is complete. Please leave a review."

### REQUIREMENT 34: NOTIFICATION TRIGGERS - PAYMENT EVENTS

**User Story:** As a user, I want to be notified about payment confirmations and due dates so that I stay on top of my rental payments.

#### Acceptance Criteria

1. WHEN a payment is successfully processed, THE System SHALL send notification to both tenant and landlord with: "Payment confirmed: {amount} {currency} for {property_name}"
2. WHEN a payment fails, THE System SHALL send notification to tenant with: "Payment failed. Please try again or select different payment method"
3. WHEN monthly rent is due within 5 days, THE System SHALL send reminder notification to tenant with: "Monthly rent due in 5 days: {amount} for {property_name}"
4. WHEN monthly rent payment is due today, THE System SHALL send notification to tenant with: "Monthly rent due today: {amount}"
5. WHEN monthly rent payment is overdue by 1 day, THE System SHALL send notification to both tenant and landlord: "Rent payment is overdue by 1 day"
6. WHEN refund is processed, THE System SHALL send notification to tenant and landlord with: "Refund of {amount} has been processed"

### REQUIREMENT 35: NOTIFICATION TRIGGERS - ADMIN AND LISTING EVENTS

**User Story:** As an admin or landlord, I want to be notified about listing approvals and rejections so that I can take action quickly.

#### Acceptance Criteria

1. WHEN a listing is submitted for moderation, THE System SHALL send notification to admin: "New listing to review: {property_name} by {landlord_name}"
2. WHEN a listing is approved by admin, THE System SHALL send notification to landlord: "Your listing {property_name} has been approved and is now live!"
3. WHEN a listing is rejected by admin, THE System SHALL send notification to landlord with: "Your listing {property_name} was rejected. Reason: {rejection_reason}. Please revise and resubmit."

### REQUIREMENT 36: NOTIFICATION TRIGGERS - REVIEW AND OTHER EVENTS

**User Story:** As a user, I want to be notified when someone reviews me or my property so that I can respond or manage my reputation.

#### Acceptance Criteria

1. WHEN a review is published about landlord, THE System SHALL send notification: "{tenant_name} left a review of you: {rating} stars. '{review_text}'"
2. WHEN a review is published about property, THE System SHALL send notification to landlord: "New review of your property {property_name}: {rating} stars"
3. WHEN a dispute is filed by tenant or landlord, THE System SHALL send notification to admin: "New dispute filed for {booking_id}: {reason}"
4. WHEN admin makes dispute decision, THE System SHALL send notifications to both tenant and landlord: "Dispute resolved. Refund amount: {amount}. Decision: {reason}"

### REQUIREMENT 37: ADMIN NOTIFICATION PREFERENCES CONFIGURATION

**User Story:** As an admin, I want to configure which notification channels are enabled and set quiet hours so that I'm not overwhelmed with notifications.

#### Acceptance Criteria

1. IN admin settings, THE System SHALL provide configuration for: enabled channels (in-app, email, SMS, push), quiet hours (start time, end time), frequency limits
2. WHERE admin disables a channel, THE System SHALL not send notifications via that channel for any events
3. WHERE quiet hours are set, THE System SHALL queue notifications sent during quiet hours and deliver after quiet hours end
4. WHEN admin sets frequency limit (e.g., max 5 emails per day), THE System SHALL batch notifications and deliver in digest if limit is reached
5. WHERE notification preferences are saved, THE System SHALL apply to all future notifications for that admin

### REQUIREMENT 38: USER NOTIFICATION PREFERENCES AND SUBSCRIPTION

**User Story:** As a user, I want to manage my notification preferences so that I only receive notifications relevant to me.

#### Acceptance Criteria

1. IN user settings, THE System SHALL provide toggles for: in-app notifications, email notifications, SMS notifications, push notifications
2. WHERE a notification channel is disabled, THE System SHALL not send notifications via that channel
3. IN user settings, THE System SHALL display subscription list: notification types user is subscribed to (bookings, payments, reviews, marketing)
4. WHERE user unsubscribes from a notification type, THE System SHALL not send notifications of that type
5. WHERE user updates preferences, THE System SHALL apply immediately to future notifications (not retroactively)
