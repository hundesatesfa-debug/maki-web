"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const apiError_1 = require("../../utils/apiError");
/**
 * Booking Service
 * Manages booking requests, confirmations, and status updates
 */
class BookingService {
    /**
     * Create booking request
     */
    static async createBooking(data) {
        // Verify property exists
        const property = await database_1.default.listing.findUnique({
            where: { id: data.propertyId },
            include: { owner: true },
        });
        if (!property) {
            throw apiError_1.ApiError.notFound('Property not found');
        }
        // Check if tenant has existing active booking for same property
        const existingBooking = await database_1.default.booking.findFirst({
            where: {
                propertyId: data.propertyId,
                tenantId: data.tenantId,
                status: {
                    in: ['REQUESTED', 'CONFIRMED', 'COUNTER_OFFERED', 'PAID', 'ACTIVE'],
                },
            },
        });
        if (existingBooking) {
            throw apiError_1.ApiError.conflict('You already have an active booking request for this property');
        }
        // Check date availability
        const conflictingBooking = await database_1.default.booking.findFirst({
            where: {
                propertyId: data.propertyId,
                moveInDate: { lt: new Date(data.moveInDate.getTime() + data.durationMonths * 30 * 24 * 60 * 60 * 1000) },
                status: { in: ['CONFIRMED', 'PAID', 'ACTIVE', 'COMPLETED'] },
            },
        });
        if (conflictingBooking) {
            throw apiError_1.ApiError.badRequest('Property is not available for selected dates');
        }
        const booking = await database_1.default.booking.create({
            data: {
                propertyId: data.propertyId,
                tenantId: data.tenantId,
                landlordId: property.ownerId,
                moveInDate: data.moveInDate,
                durationMonths: data.durationMonths,
                monthlyRent: data.monthlyRent,
                depositAmount: data.depositAmount,
                message: data.message,
                status: 'REQUESTED',
            },
            include: {
                property: true,
                tenant: true,
                landlord: true,
            },
        });
        // Send notification to landlord
        await this.notifyLandlord(booking, 'BOOKING_REQUEST');
        return booking;
    }
    /**
     * Accept booking request
     */
    static async acceptBooking(bookingId, landlordId) {
        const booking = await database_1.default.booking.findUnique({
            where: { id: bookingId },
            include: { property: true, tenant: true },
        });
        if (!booking) {
            throw apiError_1.ApiError.notFound('Booking not found');
        }
        if (booking.landlordId !== landlordId) {
            throw apiError_1.ApiError.forbidden('Only landlord can accept this booking');
        }
        if (booking.status !== 'REQUESTED' && booking.status !== 'COUNTER_OFFERED') {
            throw apiError_1.ApiError.badRequest(`Cannot accept booking with status: ${booking.status}`);
        }
        // Block calendar dates
        await this.blockCalendarDates(booking.propertyId, booking.moveInDate, booking.durationMonths);
        const updated = await database_1.default.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' },
            include: { property: true, tenant: true, landlord: true },
        });
        // Record response time
        const responseTimeHours = (new Date().getTime() - booking.createdAt.getTime()) / (1000 * 60 * 60);
        await database_1.default.booking.update({
            where: { id: bookingId },
            data: { responseTimeHours },
        });
        // Send notifications
        await this.notifyTenant(updated, 'BOOKING_ACCEPTED');
        await this.notifyLandlord(updated, 'BOOKING_ACCEPTED');
        return updated;
    }
    /**
     * Decline booking request
     */
    static async declineBooking(bookingId, landlordId, reason) {
        const booking = await database_1.default.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw apiError_1.ApiError.notFound('Booking not found');
        }
        if (booking.landlordId !== landlordId) {
            throw apiError_1.ApiError.forbidden('Only landlord can decline this booking');
        }
        if (booking.status !== 'REQUESTED' && booking.status !== 'COUNTER_OFFERED') {
            throw apiError_1.ApiError.badRequest(`Cannot decline booking with status: ${booking.status}`);
        }
        const updated = await database_1.default.booking.update({
            where: { id: bookingId },
            data: { status: 'DECLINED' },
            include: { property: true, tenant: true, landlord: true },
        });
        // Send notification to tenant
        await this.notifyTenant(updated, 'BOOKING_DECLINED');
        return updated;
    }
    /**
     * Counter-offer booking
     */
    static async counterOffer(bookingId, landlordId, data) {
        const booking = await database_1.default.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw apiError_1.ApiError.notFound('Booking not found');
        }
        if (booking.landlordId !== landlordId) {
            throw apiError_1.ApiError.forbidden('Only landlord can make counter-offers');
        }
        if (booking.status !== 'REQUESTED' && booking.status !== 'COUNTER_OFFERED') {
            throw apiError_1.ApiError.badRequest(`Cannot counter-offer booking with status: ${booking.status}`);
        }
        const updated = await database_1.default.booking.update({
            where: { id: bookingId },
            data: {
                status: 'COUNTER_OFFERED',
                moveInDate: data.moveInDate || booking.moveInDate,
                monthlyRent: data.monthlyRent || booking.monthlyRent,
                depositAmount: data.depositAmount || booking.depositAmount,
                durationMonths: data.durationMonths || booking.durationMonths,
                message: data.message || booking.message,
            },
            include: { property: true, tenant: true, landlord: true },
        });
        // Send notification to tenant
        await this.notifyTenant(updated, 'BOOKING_COUNTER_OFFERED');
        return updated;
    }
    /**
     * Cancel booking
     */
    static async cancelBooking(bookingId, userId, reason) {
        const booking = await database_1.default.booking.findUnique({
            where: { id: bookingId },
            include: { property: true },
        });
        if (!booking) {
            throw apiError_1.ApiError.notFound('Booking not found');
        }
        // Check authorization
        if (booking.tenantId !== userId && booking.landlordId !== userId) {
            throw apiError_1.ApiError.forbidden('Not authorized to cancel this booking');
        }
        if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
            throw apiError_1.ApiError.badRequest(`Cannot cancel booking with status: ${booking.status}`);
        }
        // Calculate refund based on cancellation policy
        let refundPercentage = 0;
        if (booking.status === 'PAID' || booking.status === 'ACTIVE') {
            const daysUntilMoveIn = Math.floor((booking.moveInDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const policy = booking.property.cancellationPolicy || 'MODERATE';
            if (policy === 'STRICT') {
                if (daysUntilMoveIn > 14)
                    refundPercentage = 100;
                else if (daysUntilMoveIn > 7)
                    refundPercentage = 50;
                else
                    refundPercentage = 0;
            }
            else if (policy === 'MODERATE') {
                if (daysUntilMoveIn > 7)
                    refundPercentage = 100;
                else if (daysUntilMoveIn > 3)
                    refundPercentage = 50;
                else
                    refundPercentage = 0;
            }
            else if (policy === 'FLEXIBLE') {
                if (daysUntilMoveIn > 3)
                    refundPercentage = 100;
                else if (daysUntilMoveIn > 1)
                    refundPercentage = 50;
                else
                    refundPercentage = 0;
            }
            else if (policy === 'NON_REFUNDABLE') {
                refundPercentage = 0;
            }
        }
        else {
            // Full refund if not yet paid or active
            refundPercentage = 100;
        }
        const updated = await database_1.default.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' },
            include: { property: true, tenant: true, landlord: true },
        });
        // Release calendar dates
        await this.releaseCalendarDates(booking.propertyId, booking.moveInDate, booking.durationMonths);
        // Handle refunds if applicable
        if (refundPercentage > 0 && booking.status === 'PAID') {
            // Refund will be processed through payment service
            // For now, just create dispute/refund record
        }
        // Send notifications
        const canceledByLandlord = booking.landlordId === userId;
        if (canceledByLandlord) {
            await this.notifyTenant(updated, 'BOOKING_CANCELLED_BY_LANDLORD');
        }
        else {
            await this.notifyLandlord(updated, 'BOOKING_CANCELLED_BY_TENANT');
        }
        return { booking: updated, refundPercentage };
    }
    /**
     * Get booking details
     */
    static async getBooking(bookingId, userId) {
        const booking = await database_1.default.booking.findUnique({
            where: { id: bookingId },
            include: {
                property: true,
                tenant: true,
                landlord: true,
                payments: true,
                reviews: true,
                contracts: true,
            },
        });
        if (!booking) {
            throw apiError_1.ApiError.notFound('Booking not found');
        }
        // Check authorization if user is provided
        if (userId && booking.tenantId !== userId && booking.landlordId !== userId) {
            throw apiError_1.ApiError.forbidden('Not authorized to view this booking');
        }
        return booking;
    }
    /**
     * List user's bookings
     */
    static async listUserBookings(userId, filters = {}) {
        const where = {};
        if (filters.role === 'tenant') {
            where.tenantId = userId;
        }
        else if (filters.role === 'landlord') {
            where.landlordId = userId;
        }
        else {
            where.OR = [{ tenantId: userId }, { landlordId: userId }];
        }
        if (filters.status) {
            where.status = filters.status;
        }
        const bookings = await database_1.default.booking.findMany({
            where,
            include: {
                property: true,
                tenant: true,
                landlord: true,
                payments: { take: 1, orderBy: { createdAt: 'desc' } },
            },
            orderBy: { createdAt: 'desc' },
            take: filters.limit || 20,
            skip: filters.offset || 0,
        });
        const total = await database_1.default.booking.count({ where });
        return { bookings, total };
    }
    /**
     * Block calendar dates for property
     */
    static async blockCalendarDates(propertyId, moveInDate, durationMonths) {
        // Update property availability
        const moveOutDate = new Date(moveInDate);
        moveOutDate.setMonth(moveOutDate.getMonth() + durationMonths);
        // In a real system, you might use a separate Calendar table
        // For now, we manage this through booking status
        return { propertyId, moveInDate, moveOutDate };
    }
    /**
     * Release calendar dates
     */
    static async releaseCalendarDates(propertyId, moveInDate, durationMonths) {
        return { propertyId, moveInDate, durationMonths };
    }
    /**
     * Notify tenant
     */
    static async notifyTenant(booking, eventType) {
        const messages = {
            BOOKING_REQUEST: {
                title: 'New Booking Request',
                message: `${booking.tenant.firstName} has requested to book your property: ${booking.property.title}`,
            },
            BOOKING_ACCEPTED: {
                title: 'Booking Accepted',
                message: `Your booking request for ${booking.property.title} has been accepted!`,
            },
            BOOKING_DECLINED: {
                title: 'Booking Declined',
                message: `Your booking request for ${booking.property.title} has been declined.`,
            },
            BOOKING_COUNTER_OFFERED: {
                title: 'Counter Offer Received',
                message: `${booking.landlord.firstName} has sent you a counter offer for ${booking.property.title}`,
            },
            BOOKING_CANCELLED_BY_LANDLORD: {
                title: 'Booking Cancelled',
                message: `The booking for ${booking.property.title} has been cancelled by the landlord.`,
            },
        };
        const msg = messages[eventType];
        if (msg) {
            await database_1.default.notification.create({
                data: {
                    userId: booking.tenantId,
                    type: eventType,
                    title: msg.title,
                    message: msg.message,
                    relatedId: booking.id,
                    relatedType: 'BOOKING',
                    channels: '["IN_APP", "EMAIL"]',
                    status: 'PENDING',
                },
            });
        }
    }
    /**
     * Notify landlord
     */
    static async notifyLandlord(booking, eventType) {
        const messages = {
            BOOKING_REQUEST: {
                title: 'New Booking Request',
                message: `${booking.tenant.firstName} has requested to book your property: ${booking.property.title}`,
            },
            BOOKING_ACCEPTED: {
                title: 'Booking Accepted',
                message: `You have accepted the booking request from ${booking.tenant.firstName}`,
            },
            BOOKING_CANCELLED_BY_TENANT: {
                title: 'Booking Cancelled',
                message: `${booking.tenant.firstName} has cancelled the booking for ${booking.property.title}`,
            },
        };
        const msg = messages[eventType];
        if (msg) {
            await database_1.default.notification.create({
                data: {
                    userId: booking.landlordId,
                    type: eventType,
                    title: msg.title,
                    message: msg.message,
                    relatedId: booking.id,
                    relatedType: 'BOOKING',
                    channels: '["IN_APP", "EMAIL"]',
                    status: 'PENDING',
                },
            });
        }
    }
}
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map