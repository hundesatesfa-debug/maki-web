---

## REQUIREMENT 39: ADMIN DASHBOARD - USER MANAGEMENT

**User Story:** As an admin, I want to manage all platform users so that I can verify, suspend, or investigate problematic accounts.

#### Acceptance Criteria

1. IN admin dashboard, THE System SHALL provide "Users" page listing all registered users (tenants, landlords, admins)
2. FOR each user, THE System SHALL display: user ID, name, email, phone, role, account status, KYC status, created date, last login
3. WHEN admin clicks on user, THE System SHALL open detail page with: profile information, contact history, booking history, payment history, reviews, and action buttons
4. WHERE admin suspends user, THE System SHALL prevent login and display message: "Your account has been suspended. Contact admin for details"
5. WHERE admin bans user, THE System SHALL permanently disable account and remove active listings
6. WHERE admin verifies user identity, THE System SHALL update KYC status to "Verified" and display verified badge on profile
7. THE Admin SHALL be able to search users by: name, email, phone, or user ID
8. THE System SHALL display user registration source (web signup, mobile app, etc.) and IP address for signup

### REQUIREMENT 40: ADMIN DASHBOARD - LISTING MODERATION

**User Story:** As an admin, I want to moderate listings before they go live so that only high-quality properties are visible on the platform.

#### Acceptance Criteria

1. IN admin dashboard, THE System SHALL provide "Listings Moderation" page showing pending listings queue
2. FOR each pending listing, THE System SHALL display: property photos, address, landlord name, price, amenities, and moderation buttons
3. WHEN admin clicks on pending listing, THE System SHALL open detail page showing: full listing description, all photos, amenities, terms, landlord info
4. WHERE admin clicks "Approve", THE System SHALL change listing status to "Published" and notify landlord
5. WHERE admin clicks "Reject", THE System SHALL change listing status to "Rejected" and prompt admin to enter rejection reason
6. WHEN listing is rejected, THE System SHALL send notification to landlord with rejection reason and allow resubmission after revisions
7. WHERE admin clicks "Request Revisions", THE System SHALL send list of required changes to landlord without rejecting listing
8. THE Admin SHALL be able to view all published listings with filters by: location, price range, landlord, created date

### REQUIREMENT 41: ADMIN DASHBOARD - TRANSACTION MONITORING

**User Story:** As an admin, I want to monitor all transactions so that I can detect fraud, reconcile payments, and track platform revenue.

#### Acceptance Criteria

1. IN admin dashboard, THE System SHALL provide "Transactions" page with table of all transactions
2. FOR each transaction, THE System SHALL display: transaction ID, date, user (tenant), landlord, amount, currency, gateway, status, commission amount
3. WHERE admin views transaction details, THE System SHALL show: full transaction record, webhook status, idempotency key, payment method, and audit trail
4. WHEN admin filters transactions, THE System SHALL support filters by: date range, gateway, payment method, status (success/failed/pending), user
5. WHEN admin views pending transactions, THE System SHALL highlight transactions awaiting webhook confirmation (older than 5 minutes)
6. THE Admin SHALL have export function to generate transaction report (PDF/CSV) with selected date range and filters
7. WHEN exporting transactions, THE Report SHALL include: transaction totals, commission totals, gateway breakdown, and user breakdown
8. THE System SHALL display gateway reconciliation: total platform collected, total disbursed to landlords, total retained (commission), discrepancies
9. WHERE discrepancies exist between platform records and gateway reports, THE System SHALL flag them for admin investigation

### REQUIREMENT 42: ADMIN DASHBOARD - DISPUTE RESOLUTION

**User Story:** As an admin, I want to resolve disputes between tenants and landlords so that I can maintain platform trust and handle refund claims.

#### Acceptance Criteria

1. IN admin dashboard, THE System SHALL provide "Disputes" page with list of open disputes
2. FOR each dispute, THE System SHALL display: dispute ID, involved parties (tenant, landlord), booking details, dispute type, filed date, status
3. WHEN admin clicks on dispute, THE System SHALL open detail page showing: chat logs between parties, evidence uploaded by both, current status
4. WHERE dispute exists, THE System SHALL display all messages between tenant and landlord leading up to dispute
5. WHERE evidence is uploaded by parties, THE System SHALL display: file names, upload dates, file previews (for images)
6. WHEN admin reviews dispute, THE System SHALL have "Resolve" panel where admin can: select outcome (full refund to tenant, partial refund, no refund), enter decision reason
7. WHEN admin selects refund amount, THE System SHALL calculate: amount to refund to tenant, amount to retain as commission, amount to return to landlord
8. WHEN admin submits decision, THE System SHALL: process refund, update dispute status to "Resolved", send decision notification to both parties
9. THE Admin SHALL be able to add admin notes to dispute for future reference

### REQUIREMENT 43: ADMIN DASHBOARD - COMMISSION CONFIGURATION

**User Story:** As an admin, I want to configure commission rates and payment method settings so that I can optimize platform revenue and payment flows.

#### Acceptance Criteria

1. IN admin settings, THE System SHALL provide "Commission Configuration" page
2. WHERE admin sets commission rate, THE System SHALL specify: percentage (e.g., 10%) or fixed amount
3. WHEN commission is calculated, THE System SHALL deduct from each confirmed payment (deposit or rent) before disbursing to landlord
4. WHEN admin views payment method settings, THE System SHALL display: enabled gateways, API keys (masked), webhook URLs, and test/live mode status
5. WHERE admin configures Telebirr, THE System SHALL set: API endpoint, merchant ID, webhook URL for callbacks
6. WHERE admin configures PayPal, THE System SHALL set: client ID, client secret, mode (sandbox/live)
7. WHERE admin configures Stripe, THE System SHALL set: API key, webhook secret, supported currencies
8. WHERE admin updates payment method settings, THE System SHALL validate settings before saving (test API connection)
9. WHEN settings are saved, THE System SHALL log configuration change with admin user ID and timestamp

### REQUIREMENT 44: ADMIN DASHBOARD - ANALYTICS AND REPORTING

**User Story:** As an admin, I want to see analytics and business metrics so that I can make data-driven decisions about platform growth.

#### Acceptance Criteria

1. IN admin dashboard, THE System SHALL provide "Analytics" page with key metrics dashboard
2. WHEN analytics page loads, THE System SHALL display: total active listings, total bookings this month, total revenue (ETB and USD), top regions by listings, top regions by bookings
3. THE System SHALL display time-series charts for: listings created per month (last 12 months), bookings per month, revenue per month
4. WHERE admin filters by date range, THE System SHALL recalculate all metrics for that range
5. THE System SHALL display top 10 landlords by: earnings, number of bookings, average rating
6. THE System SHALL display top 10 locations by: number of listings, occupancy rate, average rent price
7. WHERE admin downloads report, THE System SHALL generate PDF with: selected metrics, charts, date range, and timestamp
8. THE System SHALL track and display: user growth (new tenants/landlords per month), payment method usage, payment success rate by gateway
9. WHEN viewing occupancy metrics, THE System SHALL show: total days across all properties, total booked days, occupancy percentage

### REQUIREMENT 45: ADMIN DASHBOARD - CONTENT MANAGEMENT

**User Story:** As an admin, I want to manage featured listings, banners, and content so that I can promote properties and provide information to users.

#### Acceptance Criteria

1. IN admin dashboard, THE System SHALL provide "Content Management" page with: featured listings, banners, FAQ/blog management
2. WHEN admin selects listing to feature, THE System SHALL promote it to top of search results and display "Featured" badge
3. WHERE admin can set feature duration (days or until revoked), THE System SHALL auto-expire feature after duration
4. WHEN admin creates banner, THE System SHALL display banner on platform homepage with: title, description, image, and call-to-action link
5. WHERE admin manages FAQ, THE System SHALL display FAQ section on platform with Q&A pairs admin has created
6. THE Admin SHALL be able to add/edit/delete FAQ entries and set display order
7. WHEN admin previews banner or featured listing, THE System SHALL show what users will see
8. THE Admin SHALL be able to schedule banners to display on specific dates

### REQUIREMENT 46: ADMIN DASHBOARD - REPORTS AND EXPORTS

**User Story:** As an admin, I want to generate and export reports so that I can analyze data and share with stakeholders.

#### Acceptance Criteria

1. IN admin dashboard, THE System SHALL provide "Reports" page with report generation interface
2. WHEN admin generates transaction report, THE System SHALL query transactions by: date range, gateway, payment method, user, status
3. WHEN report is generated, THE System SHALL calculate: total transactions, successful count, failed count, total amount, average amount, commission total
4. WHEN admin exports report, THE System SHALL support formats: PDF (formatted, visually appealing), CSV (raw data)
5. WHEN admin generates user report, THE System SHALL show: total users, breakdown by role (tenant/landlord), verified count, suspended count
6. WHEN admin generates booking report, THE System SHALL show: total bookings, completed count, cancelled count, average booking duration, total revenue from bookings
7. WHEN admin exports report, THE Report SHALL include: header with report name, date range, generated date/time, footer with admin user
8. THE System SHALL allow admin to schedule reports to be generated and emailed on specific dates/times

---

## REQUIREMENT 47: LANDLORD EARNINGS AND ANALYTICS DASHBOARD

**User Story:** As a landlord, I want to see my earnings and key metrics so that I understand my property's financial performance.

#### Acceptance Criteria

1. IN landlord dashboard, THE System SHALL display "Earnings" card showing: total earnings (this month), total earnings (last month), total earnings (all-time)
2. WHEN landlord views earnings, THE System SHALL calculate: deposit payments received, monthly rent payments received, total platform commission deducted
3. WHEN landlord views monthly income, THE System SHALL display line chart showing earnings per month for last 12 months
4. WHEN landlord views bookings history, THE System SHALL list all past and current bookings with: tenant name, property name, move-in date, move-out date, monthly rent, status
5. WHEN landlord views occupancy rate, THE System SHALL calculate: days property was booked / total days available * 100
6. WHERE occupancy rate is high (>80%), THE System SHALL display: "Great occupancy! Your property is in high demand"
7. WHEN landlord views average rating, THE System SHALL display: total number of reviews, average rating (out of 5), and link to view reviews
8. WHEN landlord views response rate, THE System SHALL display: percentage of booking requests responded to within 48 hours
9. WHEN landlord views top-performing listings, THE System SHALL rank properties by: total bookings, occupancy rate, or average rating

### REQUIREMENT 48: LANDLORD PENDING PAYMENTS AND PAYOUT SCHEDULE

**User Story:** As a landlord, I want to see when my payments will be disbursed so that I can plan my cash flow.

#### Acceptance Criteria

1. IN landlord dashboard, THE System SHALL display "Pending Payments" section showing: amounts held in escrow, escrow release dates, and reasons for hold
2. WHEN deposit is held in escrow, THE System SHALL show: property name, tenant name, deposit amount, expected release date (move-in + lease duration)
3. WHEN landlord views payout schedule, THE System SHALL display: next scheduled payout date, payout amount, payment method (bank account), and payout history
4. THE System SHALL process payouts automatically every 2 weeks if there are pending earnings
5. WHEN payout is processed, THE System SHALL send notification to landlord with: payout amount, date processed, expected delivery date (1-3 business days)
6. WHEN landlord views payout history, THE System SHALL list: payout date, amount, status (pending, completed), transaction reference number
7. WHERE landlord has unpaid deposit escrows or pending rent, THE System SHALL display: total on hold, reasons, and expected release dates

### REQUIREMENT 49: LANDLORD BANK ACCOUNT SETUP FOR PAYOUTS

**User Story:** As a landlord, I want to add my bank account so that I can receive my earnings via bank transfer.

#### Acceptance Criteria

1. IN landlord profile settings, THE System SHALL provide "Payout Method" section
2. WHEN landlord adds bank account, THE System SHALL collect: bank name, account number, account holder name, account type (checking/savings)
3. WHEN landlord submits bank account, THE System SHALL verify format (valid account number length, valid bank name)
4. AFTER bank account is added, THE System SHALL initiate micro-deposit verification (optional, for security)
5. WHEN bank account is verified, THE System SHALL display green checkmark and set as default payout method
6. WHERE landlord has multiple bank accounts, THE System SHALL allow selection of which account receives payouts
7. THE System SHALL encrypt and securely store bank account details (not visible in plain text to landlord after submission)

---

## REQUIREMENT 50: LANDLORD AVAILABILITY CALENDAR

**User Story:** As a landlord, I want to manage an availability calendar so that I can control when my property is available for booking.

#### Acceptance Criteria

1. IN landlord property management, THE System SHALL display large calendar view of available/blocked/booked dates
2. WHEN landlord views calendar, THE System SHALL show current month with: green dates (available), red dates (blocked/booked), grey dates (past)
3. WHEN landlord clicks available date, THE System SHALL allow blocking that date with reason (e.g., "Maintenance", "Personal use")
4. WHERE landlord blocks date(s), THE System SHALL prevent new booking requests for blocked dates
5. WHEN a booking is confirmed by landlord, THE System SHALL auto-block calendar dates from move-in to move-out
6. WHEN a booking is cancelled, THE System SHALL auto-release blocked dates within 1 second
7. WHEN landlord releases manual block, THE System SHALL make dates available for booking again
8. WHEN landlord sets "available from" and "available to" dates, THE System SHALL only allow bookings within that date range
9. WHEN landlord sets minimum lease term, THE System SHALL prevent bookings shorter than minimum (e.g., minimum 1 month)

### REQUIREMENT 51: LANDLORD LEASE TERM SETTINGS

**User Story:** As a landlord, I want to set lease term minimums and other requirements so that I attract the right tenants.

#### Acceptance Criteria

1. IN property settings, THE System SHALL provide "Lease Requirements" section with: minimum lease term (days or months), preferred lease term
2. WHERE minimum lease term is set (e.g., minimum 2 months), THE System SHALL prevent booking requests shorter than minimum
3. WHERE landlord sets preferred lease term (e.g., 12 months), THE System SHALL show preference but still allow different terms
4. WHERE landlord sets "available from" date, THE System SHALL only show property available starting that date
5. WHERE landlord sets "available to" date, THE System SHALL only show property available until that date
6. WHEN landlord saves lease requirements, THE System SHALL update property immediately and notify existing pending bookings if they don't meet new requirements
7. THE System SHALL display lease requirements prominently on listing so tenants can see requirements before requesting

---

## REQUIREMENT 52: KYC IDENTITY VERIFICATION - LANDLORD

**User Story:** As a landlord, I want to verify my identity with the platform so that I can get a verified badge and gain tenant trust.

#### Acceptance Criteria

1. IN landlord profile, THE System SHALL display "Get Verified" badge with KYC verification flow
2. WHEN landlord starts KYC, THE System SHALL collect: full legal name, date of birth, national ID type (passport, national ID, driver's license)
3. WHEN landlord uploads ID photo, THE System SHALL accept image file (JPG, PNG) and validate file size (<5MB)
4. AFTER ID is uploaded, THE System SHALL display: "ID verification under review. We typically verify within 24 hours"
5. WHERE ID verification is approved, THE System SHALL update KYC status to "Verified" and display verified badge on profile and listings
6. WHERE ID verification is rejected, THE System SHALL send notification with rejection reason and allow resubmission
7. WHEN landlord is KYC-verified, THE System SHALL display "Verified Landlord" badge on profile, listing pages, and in search results

### REQUIREMENT 53: KYC IDENTITY VERIFICATION - BANK ACCOUNT

**User Story:** As a platform, I want to verify landlord bank accounts so that I know payouts go to legitimate bank accounts.

#### Acceptance Criteria

1. WHEN a landlord adds bank account, THE System SHALL initiate bank account verification
2. WHERE bank account verification is required, THE System SHALL send micro-deposits (2 small transactions) to bank account
3. WHEN landlord receives micro-deposits, THE Landlord SHALL confirm the deposit amounts in the platform
4. WHERE confirmed amounts match the actual deposits, THE System SHALL mark bank account as "Verified"
5. WHERE landlord enters incorrect amounts, THE System SHALL require retry and limit to 3 attempts before flagging account as suspicious
6. WHEN bank account is verified, THE System SHALL allow payouts to be processed to that account

### REQUIREMENT 54: OPTIONAL KYC - PROPERTY OWNERSHIP PROOF

**User Story:** As a landlord, I want to prove property ownership so that I can establish even higher trust with tenants.

#### Acceptance Criteria

1. IN landlord KYC section, THE System SHALL provide optional "Property Ownership Verification"
2. WHEN landlord uploads property proof, THE System SHALL accept: deed, property tax certificate, property registration document
3. WHERE property proof is uploaded, THE System SHALL display: "Property ownership under review"
4. WHERE property ownership is verified, THE System SHALL display "Property Owner Verified" badge on profile and listings
5. WHERE property proof cannot be verified, THE System SHALL allow resubmission without rejecting main KYC

### REQUIREMENT 55: ADMIN KYC REVIEW AND APPROVAL

**User Story:** As an admin, I want to review and approve KYC documents so that I can verify landlord identity before they can list properties.

#### Acceptance Criteria

1. IN admin dashboard, THE System SHALL provide "KYC Verification Queue" showing pending KYC reviews
2. FOR each pending KYC, THE System SHALL display: landlord name, KYC type (personal ID, bank account, property proof), uploaded documents, submission date
3. WHEN admin reviews KYC document, THE System SHALL display: document image, landlord details, and approval/rejection buttons
4. WHERE admin approves KYC, THE System SHALL update landlord's KYC status to "Verified" and send notification
5. WHERE admin rejects KYC, THE System SHALL send notification to landlord with: rejection reason and instructions to resubmit corrected documents
6. WHEN KYC is rejected, THE System SHALL allow landlord to resubmit within 7 days without losing listing status
7. AFTER 7 days without resubmission, THE System SHALL delist property and send warning notification

---

## REQUIREMENT 56: ADVANCED TENANT SEARCH FILTERS

**User Story:** As a tenant, I want to filter properties by multiple criteria so that I can find exactly what I'm looking for.

#### Acceptance Criteria

1. ON search page, THE System SHALL display filter panel with: price range slider, amenities checkboxes, availability date picker, minimum stay, landlord verification filter
2. WHEN tenant moves price slider, THE System SHALL instantly update results to show only properties within selected range
3. WHEN tenant selects amenities (WiFi, parking, water tank, generator, security, elevator, furnished), THE System SHALL filter results to properties with all selected amenities
4. WHEN tenant selects "Available from" date, THE System SHALL only show properties available from that date forward
5. WHEN tenant enters minimum stay requirement, THE System SHALL only show properties matching minimum stay duration
6. WHEN tenant checks "Verified Landlord" filter, THE System SHALL only show properties from KYC-verified landlords
7. WHERE tenant applies multiple filters, THE System SHALL apply all filters in combination (AND logic, not OR)
8. WHEN tenant searches, THE System SHALL display applied filters with "Clear filters" button to reset

### REQUIREMENT 57: ADVANCED TENANT SEARCH SORTING

**User Story:** As a tenant, I want to sort search results by price, rating, and other factors so that I can find the best property for my needs.

#### Acceptance Criteria

1. ON search results, THE System SHALL provide sort options: Price (low-to-high, high-to-low), Newest first, Highest rated, Best response time
2. WHERE tenant selects "Price low-to-high", THE System SHALL sort results by monthly rent ascending
3. WHERE tenant selects "Highest rated", THE System SHALL sort by property average rating (and show rating on each result)
4. WHERE tenant selects "Best response time", THE System SHALL sort by landlord average response time (fastest first)
5. WHERE tenant selects sort option, THE Results SHALL update immediately without page reload
6. WHEN no properties match selected filters, THE System SHALL display: "No properties found. Try adjusting filters"

### REQUIREMENT 58: LANDLORD VERIFIED BADGE FILTER AND DISPLAY

**User Story:** As a tenant, I want to filter properties by landlord verification so that I can prioritize trusted landlords.

#### Acceptance Criteria

1. ON search page, THE System SHALL display checkbox filter: "Verified Landlord" (only show properties from verified landlords)
2. WHEN tenant checks "Verified Landlord", THE System SHALL filter results to show only properties from landlords with KYC-verified status
3. ON property listing preview, THE System SHALL display "Verified Landlord" badge if landlord is KYC-verified
4. ON property detail page, THE System SHALL display landlord verification badge on landlord profile section
5. ON landlord profile page, THE System SHALL display "Verified Landlord" badge prominently with verification date
6. WHERE landlord is NOT verified, THE System SHALL display no badge (to encourage verification for competitive advantage)

---

## Technical Implementation Constraints

### API Security Requirements

1. ALL payment-related endpoints SHALL require authentication via JWT token
2. ALL payment endpoints SHALL implement rate limiting: 100 requests/minute per user, 10 requests/minute per IP for payment submissions
3. ALL payment requests SHALL validate input: amount range (ETB min 1,000, USD min 10), currency value, date formats
4. ALL responses SHALL never expose sensitive data: raw card numbers, bank account details, API keys
5. ALL errors SHALL return generic message to prevent information leakage: "Payment processing error. Please contact support" instead of specific reasons

### Database Schema Changes

1. System SHALL migrate from SQLite to PostgreSQL for production deployments
2. System SHALL create new tables: Bookings, Payments, Transactions, Reviews, Contracts, AdminLogs, Disputes, NotificationQueue, NotificationPreferences
3. System SHALL add columns to existing tables: User.kycStatus, User.verifiedBadge, Listing.availableFrom, Listing.availableTo, Listing.amenities
4. System SHALL create indexes on: payment gateway, transaction status, booking status, user ID for query performance
5. ALL database transactions SHALL maintain ACID properties for payment operations

### Performance Targets

- Payment redirect time: < 2 seconds
- Admin dashboard load: < 3 seconds
- Calendar rendering: < 1 second
- Search with filters: < 2 seconds
- Notification delivery: < 5 seconds
- Report generation (1 month data): < 10 seconds

### Localization Requirements

1. ALL UI text SHALL be translated to: English, Amharic, Oromo
2. Currency display SHALL use: ETB for local transactions, USD for international
3. Date formats SHALL be localized: DD/MM/YYYY for Ethiopia, MM/DD/YYYY for US
4. Contract templates SHALL be available in: English, Amharic
5. Notifications SHALL be sent in user's preferred language

