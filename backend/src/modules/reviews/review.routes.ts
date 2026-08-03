import { Router } from 'express';
import * as ReviewController from './review.controller';
import { authenticate, authorizeRoles } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createReviewSchema,
  moderateReviewSchema,
} from './review.validation';

const router = Router();

/**
 * Review Routes
 */

// Submit review
router.post(
  '/',
  authenticate,
  validate(createReviewSchema),
  ReviewController.submitReview
);

// Get property reviews
router.get(
  '/property/:propertyId',
  ReviewController.getPropertyReviews
);

// Get user reviews
router.get(
  '/user/:userId',
  ReviewController.getUserReviews
);

// Get moderation queue (admin only)
router.get(
  '/admin/moderation-queue',
  authenticate,
  authorizeRoles('ADMIN'),
  ReviewController.getModerationQueue
);

// Moderate review (admin only)
router.put(
  '/:reviewId/moderate',
  authenticate,
  authorizeRoles('ADMIN'),
  validate(moderateReviewSchema),
  ReviewController.moderateReview
);

export default router;
