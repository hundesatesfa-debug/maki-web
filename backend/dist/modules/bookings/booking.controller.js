"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookings = exports.getBooking = exports.cancelBooking = exports.counterOffer = exports.declineBooking = exports.acceptBooking = exports.createBooking = void 0;
const booking_service_1 = require("./booking.service");
const apiResponse_1 = require("../../utils/apiResponse");
/**
 * Booking Controller
 * Handles booking-related HTTP requests
 */
const createBooking = async (req, res, next) => {
    try {
        const { propertyId, moveInDate, durationMonths, monthlyRent, depositAmount, message } = req.body;
        const booking = await booking_service_1.BookingService.createBooking({
            propertyId,
            tenantId: req.user?.userId || '',
            moveInDate: new Date(moveInDate),
            durationMonths,
            monthlyRent,
            depositAmount,
            message,
        });
        (0, apiResponse_1.sendResponse)(res, 201, true, 'Booking request created', booking);
    }
    catch (error) {
        next(error);
    }
};
exports.createBooking = createBooking;
const acceptBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.body;
        const booking = await booking_service_1.BookingService.acceptBooking(bookingId, req.user?.userId || '');
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Booking accepted', booking);
    }
    catch (error) {
        next(error);
    }
};
exports.acceptBooking = acceptBooking;
const declineBooking = async (req, res, next) => {
    try {
        const { bookingId, reason } = req.body;
        const booking = await booking_service_1.BookingService.declineBooking(bookingId, req.user?.userId || '', reason);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Booking declined', booking);
    }
    catch (error) {
        next(error);
    }
};
exports.declineBooking = declineBooking;
const counterOffer = async (req, res, next) => {
    try {
        const { bookingId, moveInDate, monthlyRent, depositAmount, durationMonths, message } = req.body;
        const booking = await booking_service_1.BookingService.counterOffer(bookingId, req.user?.userId || '', {
            moveInDate: moveInDate ? new Date(moveInDate) : undefined,
            monthlyRent,
            depositAmount,
            durationMonths,
            message,
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Counter offer sent', booking);
    }
    catch (error) {
        next(error);
    }
};
exports.counterOffer = counterOffer;
const cancelBooking = async (req, res, next) => {
    try {
        const { bookingId, reason } = req.body;
        const result = await booking_service_1.BookingService.cancelBooking(bookingId, req.user?.userId || '', reason);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Booking cancelled', result);
    }
    catch (error) {
        next(error);
    }
};
exports.cancelBooking = cancelBooking;
const getBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const booking = await booking_service_1.BookingService.getBooking(bookingId, req.user?.userId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Booking retrieved', booking);
    }
    catch (error) {
        next(error);
    }
};
exports.getBooking = getBooking;
const listBookings = async (req, res, next) => {
    try {
        const { status, role, limit = 20, offset = 0 } = req.query;
        const result = await booking_service_1.BookingService.listUserBookings(req.user?.userId || '', {
            status: status,
            role: role,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Bookings retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.listBookings = listBookings;
//# sourceMappingURL=booking.controller.js.map