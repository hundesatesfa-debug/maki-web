"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookingController = __importStar(require("./booking.controller"));
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const booking_validation_1 = require("./booking.validation");
const router = (0, express_1.Router)();
/**
 * Booking Routes
 */
// Create new booking request
router.post('/', auth_1.authenticate, (0, validate_1.validate)(booking_validation_1.createBookingSchema), BookingController.createBooking);
// Get user's bookings
router.get('/', auth_1.authenticate, BookingController.listBookings);
// Get booking details
router.get('/:bookingId', auth_1.authenticate, BookingController.getBooking);
// Accept booking request
router.put('/:bookingId/accept', auth_1.authenticate, (0, validate_1.validate)(booking_validation_1.acceptBookingSchema), BookingController.acceptBooking);
// Decline booking request
router.put('/:bookingId/decline', auth_1.authenticate, (0, validate_1.validate)(booking_validation_1.declineBookingSchema), BookingController.declineBooking);
// Send counter offer
router.put('/:bookingId/counter-offer', auth_1.authenticate, (0, validate_1.validate)(booking_validation_1.counterOfferSchema), BookingController.counterOffer);
// Cancel booking
router.put('/:bookingId/cancel', auth_1.authenticate, (0, validate_1.validate)(booking_validation_1.cancelBookingSchema), BookingController.cancelBooking);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map