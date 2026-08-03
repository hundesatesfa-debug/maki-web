import { Router } from 'express';
import * as AdminController from './admin.controller';
import { authenticate, authorizeRoles } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  verifyUserSchema,
  suspendUserSchema,
  approveListingSchema,
  rejectListingSchema,
  resolveDisputeSchema,
} from './admin.validation';

const router = Router();

// Protect all admin routes
router.use(authenticate, authorizeRoles('ADMIN'));

/**
 * Dashboard and Metrics
 */
router.get('/dashboard', AdminController.getDashboard);

/**
 * User Management
 */
router.get('/users', AdminController.listUsers);
router.put('/users/:userId/verify', validate(verifyUserSchema), AdminController.verifyUser);
router.put('/users/:userId/suspend', validate(suspendUserSchema), AdminController.suspendUser);

/**
 * Listing Moderation
 */
router.put('/listings/:listingId/approve', validate(approveListingSchema), AdminController.approveListing);
router.put('/listings/:listingId/reject', validate(rejectListingSchema), AdminController.rejectListing);

/**
 * Dispute Resolution
 */
router.get('/disputes', AdminController.listDisputes);
router.put('/disputes/:disputeId/resolve', validate(resolveDisputeSchema), AdminController.resolveDispute);

/**
 * Admin Logs and Audit Trail
 */
router.get('/logs', AdminController.getAdminLogs);
router.get('/transaction-logs', AdminController.getTransactionLogs);

export default router;
