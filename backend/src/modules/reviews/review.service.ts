import prisma from '../../config/database';
import { ApiError } from '../../utils/apiError';

/**
 * Review moderation keywords and patterns to flag suspicious content
 */
const FLAGGED_KEYWORDS = [
  'scam',
  'fraud',
  'fake',
  'spam',
  'hate',
  'harassment',
  'violence',
  'explicit',
];

/**
 * Review Service
 * Manages review creation, moderation, and ratings calculation
 */
export class ReviewService {
  /**
   * Submit a review
   */
  static async submitReview(data: {
    bookingId: string;
    reviewerId: string;
    rating: number;
    text?: string;
    reviewType: string;
  }) {
    // Verify booking exists and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { tenant: true, landlord: true, property: true },
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.status !== 'COMPLETED') {
      throw ApiError.badRequest('Can only review completed bookings');
    }

    // Determine reviewee based on review type and reviewer
    let revieweeId = '';
    if (data.reviewType === 'PROPERTY' || data.reviewType === 'LANDLORD') {
      if (booking.tenantId !== data.reviewerId) {
        throw ApiError.forbidden('Only tenant can review property/landlord');
      }
      revieweeId = booking.landlordId;
    } else if (data.reviewType === 'TENANT') {
      if (booking.landlordId !== data.reviewerId) {
        throw ApiError.forbidden('Only landlord can review tenant');
      }
      revieweeId = booking.tenantId;
    }

    // Check if already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        bookingId: data.bookingId,
        reviewerId: data.reviewerId,
        reviewType: data.reviewType,
      },
    });

    if (existingReview) {
      throw ApiError.conflict('You have already reviewed this booking');
    }

    // Check if review should be flagged for moderation
    let shouldFlag = false;
    if (data.text) {
      const lowerText = data.text.toLowerCase();

      // Flag if contains keywords
      if (FLAGGED_KEYWORDS.some((keyword) => lowerText.includes(keyword))) {
        shouldFlag = true;
      }

      // Flag if suspicious (low rating with very short text)
      if (data.rating <= 2 && data.text.length < 20) {
        shouldFlag = true;
      }
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        bookingId: data.bookingId,
        reviewerId: data.reviewerId,
        revieweeId,
        reviewType: data.reviewType,
        rating: data.rating,
        text: data.text || null,
        isVerified: true, // Always verified from completed booking
        status: shouldFlag ? 'PENDING_MODERATION' : 'PUBLISHED',
      },
      include: {
        reviewer: true,
        reviewee: true,
        booking: { include: { property: true } },
      },
    });

    // If review is published, recalculate ratings and send notifications
    if (review.status === 'PUBLISHED') {
      if (data.reviewType === 'PROPERTY' || data.reviewType === 'LANDLORD') {
        // Recalculate property rating
        await this.updatePropertyRating(booking.propertyId);
        // Recalculate landlord rating
        await this.updateLandlordRating(booking.landlordId);
      } else if (data.reviewType === 'TENANT') {
        // Recalculate tenant rating in user profile
        await this.updateTenantRating(booking.tenantId);
      }

      // Send notification to reviewee
      await this.notifyReviewee(review, booking);
    }

    return review;
  }

  /**
   * Get reviews for property
   */
  static async getPropertyReviews(propertyId: string, filters: { verified?: boolean; limit?: number; offset?: number } = {}) {
    const where: any = {
      booking: { propertyId },
      reviewType: { in: ['PROPERTY', 'LANDLORD'] },
      status: 'PUBLISHED',
    };

    if (filters.verified !== undefined) {
      where.isVerified = filters.verified;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewer: true,
        reviewee: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    return reviews;
  }

  /**
   * Get reviews for user (as landlord/tenant being reviewed)
   */
  static async getUserReviews(userId: string, filters: { reviewType?: string; limit?: number; offset?: number } = {}) {
    const where: any = {
      revieweeId: userId,
      status: 'PUBLISHED',
    };

    if (filters.reviewType) {
      where.reviewType = filters.reviewType;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewer: true,
        booking: { include: { property: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    // Calculate average rating
    const allReviews = await prisma.review.findMany({
      where: { revieweeId: userId, status: 'PUBLISHED' },
    });

    const averageRating =
      allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

    return {
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: allReviews.length,
    };
  }

  /**
   * Get moderation queue (admin)
   */
  static async getModerationQueue(filters: { limit?: number; offset?: number } = {}) {
    const reviews = await prisma.review.findMany({
      where: { status: 'PENDING_MODERATION' },
      include: {
        reviewer: true,
        reviewee: true,
        booking: { include: { property: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    const total = await prisma.review.count({
      where: { status: 'PENDING_MODERATION' },
    });

    return { reviews, total };
  }

  /**
   * Moderate review (admin)
   */
  static async moderateReview(
    reviewId: string,
    adminId: string,
    data: {
      status: 'PUBLISHED' | 'REJECTED';
      moderationNotes?: string;
    }
  ) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { booking: true },
    });

    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        status: data.status,
        moderationNotes: data.moderationNotes,
      },
      include: {
        reviewer: true,
        reviewee: true,
        booking: { include: { property: true } },
      },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'MODERATE_REVIEW',
        targetId: reviewId,
        targetType: 'REVIEW',
        changes: JSON.stringify({ status: data.status }),
        reason: data.moderationNotes,
      },
    });

    // If approved, recalculate ratings
    if (data.status === 'PUBLISHED') {
      if (review.reviewType === 'PROPERTY' || review.reviewType === 'LANDLORD') {
        await this.updatePropertyRating(review.booking.propertyId);
        await this.updateLandlordRating(review.booking.landlordId);
      } else if (review.reviewType === 'TENANT') {
        await this.updateTenantRating(review.booking.tenantId);
      }

      // Send approval notification
      await prisma.notification.create({
        data: {
          userId: review.reviewerId,
          type: 'REVIEW_APPROVED',
          title: 'Your review was approved',
          message: 'Your review has been published and is now visible to other users',
          relatedId: reviewId,
          relatedType: 'REVIEW',
          channels: '["IN_APP"]',
          status: 'PENDING',
        },
      });
    } else {
      // Send rejection notification
      await prisma.notification.create({
        data: {
          userId: review.reviewerId,
          type: 'REVIEW_REJECTED',
          title: 'Your review was rejected',
          message: data.moderationNotes || 'Your review does not meet our community standards',
          relatedId: reviewId,
          relatedType: 'REVIEW',
          channels: '["IN_APP"]',
          status: 'PENDING',
        },
      });
    }

    return updated;
  }

  /**
   * Update property average rating
   */
  private static async updatePropertyRating(propertyId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        booking: { propertyId },
        reviewType: { in: ['PROPERTY', 'LANDLORD'] },
        status: 'PUBLISHED',
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await prisma.listing.update({
      where: { id: propertyId },
      data: { averageRating: Math.round(averageRating * 10) / 10 },
    });
  }

  /**
   * Update landlord average rating
   */
  private static async updateLandlordRating(landlordId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: landlordId,
        reviewType: 'LANDLORD',
        status: 'PUBLISHED',
      },
    });

    if (reviews.length === 0) return;

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    // Note: User table doesn't have averageRating field - this would be calculated on-the-fly
  }

  /**
   * Update tenant rating
   */
  private static async updateTenantRating(tenantId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        revieweeId: tenantId,
        reviewType: 'TENANT',
        status: 'PUBLISHED',
      },
    });

    if (reviews.length === 0) return;

    // Tenant rating calculation
  }

  /**
   * Notify reviewee of new review
   */
  private static async notifyReviewee(review: any, booking: any) {
    const reviewTypeText =
      review.reviewType === 'PROPERTY'
        ? 'property'
        : review.reviewType === 'LANDLORD'
          ? 'landlord'
          : 'tenant';

    await prisma.notification.create({
      data: {
        userId: review.revieweeId,
        type: 'REVIEW_RECEIVED',
        title: `New ${reviewTypeText} review`,
        message: `${review.reviewer.firstName} left you a ${review.rating}-star review`,
        relatedId: review.id,
        relatedType: 'REVIEW',
        channels: '["IN_APP", "EMAIL"]',
        status: 'PENDING',
      },
    });
  }
}
