import { Request, Response, NextFunction } from 'express';
import { ReviewService } from './review.service';
import { sendResponse } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';

/**
 * Review Controller
 */

export const submitReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, rating, text, reviewType } = req.body;

    const review = await ReviewService.submitReview({
      bookingId,
      reviewerId: req.user?.userId || '',
      rating,
      text,
      reviewType,
    });

    const statusMessage =
      review.status === 'PENDING_MODERATION'
        ? 'Review submitted and is pending moderation'
        : 'Review published successfully';

    sendResponse(res, 201, true, statusMessage, review);
  } catch (error) {
    next(error);
  }
};

export const getPropertyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { propertyId } = req.params;
    const { verified, limit = 20, offset = 0 } = req.query;

    const reviews = await ReviewService.getPropertyReviews(propertyId, {
      verified: verified === 'true',
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'Property reviews retrieved', { reviews });
  } catch (error) {
    next(error);
  }
};

export const getUserReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { reviewType, limit = 20, offset = 0 } = req.query;

    const result = await ReviewService.getUserReviews(userId, {
      reviewType: reviewType as string | undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'User reviews retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const getModerationQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await ReviewService.getModerationQueue({
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'Moderation queue retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const moderateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reviewId } = req.params;
    const { status, moderationNotes } = req.body;

    const review = await ReviewService.moderateReview(reviewId, req.user?.userId || '', {
      status,
      moderationNotes,
    });

    sendResponse(res, 200, true, 'Review moderated', review);
  } catch (error) {
    next(error);
  }
};
