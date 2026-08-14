"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderateReview = exports.getModerationQueue = exports.getUserReviews = exports.getPropertyReviews = exports.submitReview = void 0;
const review_service_1 = require("./review.service");
const apiResponse_1 = require("../../utils/apiResponse");
/**
 * Review Controller
 */
const submitReview = async (req, res, next) => {
    try {
        const { bookingId, rating, text, reviewType } = req.body;
        const review = await review_service_1.ReviewService.submitReview({
            bookingId,
            reviewerId: req.user?.userId || '',
            rating,
            text,
            reviewType,
        });
        const statusMessage = review.status === 'PENDING_MODERATION'
            ? 'Review submitted and is pending moderation'
            : 'Review published successfully';
        (0, apiResponse_1.sendResponse)(res, 201, true, statusMessage, review);
    }
    catch (error) {
        next(error);
    }
};
exports.submitReview = submitReview;
const getPropertyReviews = async (req, res, next) => {
    try {
        const { propertyId } = req.params;
        const { verified, limit = 20, offset = 0 } = req.query;
        const reviews = await review_service_1.ReviewService.getPropertyReviews(propertyId, {
            verified: verified === 'true',
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Property reviews retrieved', { reviews });
    }
    catch (error) {
        next(error);
    }
};
exports.getPropertyReviews = getPropertyReviews;
const getUserReviews = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { reviewType, limit = 20, offset = 0 } = req.query;
        const result = await review_service_1.ReviewService.getUserReviews(userId, {
            reviewType: reviewType,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'User reviews retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserReviews = getUserReviews;
const getModerationQueue = async (req, res, next) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const result = await review_service_1.ReviewService.getModerationQueue({
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Moderation queue retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.getModerationQueue = getModerationQueue;
const moderateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { status, moderationNotes } = req.body;
        const review = await review_service_1.ReviewService.moderateReview(reviewId, req.user?.userId || '', {
            status,
            moderationNotes,
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Review moderated', review);
    }
    catch (error) {
        next(error);
    }
};
exports.moderateReview = moderateReview;
//# sourceMappingURL=review.controller.js.map