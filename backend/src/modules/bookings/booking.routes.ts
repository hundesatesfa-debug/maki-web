import { Router } from 'express';
import * as BookingController from './booking.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createBookingSchema,
  acceptBookingSchema,
  declineBookingSchema,
  counterOfferSchema,
  cancelBookingSchema,
} from './booking.validation';

const router = Router();

/**
 * Booking Routes
 */

// Create new booking request
router.post(
  '/',
  authenticate,
  validate(createBookingSchema),
  BookingController.createBooking
);

// Get user's bookings
router.get(
  '/',
  authenticate,
  BookingController.listBookings
);

// Get booking details
router.get(
  '/:bookingId',
  authenticate,
  BookingController.getBooking
);

// Accept booking request
router.put(
  '/:bookingId/accept',
  authenticate,
  validate(acceptBookingSchema),
  BookingController.acceptBooking
);

// Decline booking request
router.put(
  '/:bookingId/decline',
  authenticate,
  validate(declineBookingSchema),
  BookingController.declineBooking
);

// Send counter offer
router.put(
  '/:bookingId/counter-offer',
  authenticate,
  validate(counterOfferSchema),
  BookingController.counterOffer
);

// Cancel booking
router.put(
  '/:bookingId/cancel',
  authenticate,
  validate(cancelBookingSchema),
  BookingController.cancelBooking
);

export default router;
