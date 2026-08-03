import { Request, Response, NextFunction } from 'express';
import { BookingService } from './booking.service';
import { sendResponse } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';

/**
 * Booking Controller
 * Handles booking-related HTTP requests
 */

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { propertyId, moveInDate, durationMonths, monthlyRent, depositAmount, message } =
      req.body;

    const booking = await BookingService.createBooking({
      propertyId,
      tenantId: req.user?.userId || '',
      moveInDate: new Date(moveInDate),
      durationMonths,
      monthlyRent,
      depositAmount,
      message,
    });

    sendResponse(res, 201, true, 'Booking request created', booking);
  } catch (error) {
    next(error);
  }
};

export const acceptBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.body;

    const booking = await BookingService.acceptBooking(bookingId, req.user?.userId || '');

    sendResponse(res, 200, true, 'Booking accepted', booking);
  } catch (error) {
    next(error);
  }
};

export const declineBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, reason } = req.body;

    const booking = await BookingService.declineBooking(
      bookingId,
      req.user?.userId || '',
      reason
    );

    sendResponse(res, 200, true, 'Booking declined', booking);
  } catch (error) {
    next(error);
  }
};

export const counterOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, moveInDate, monthlyRent, depositAmount, durationMonths, message } =
      req.body;

    const booking = await BookingService.counterOffer(bookingId, req.user?.userId || '', {
      moveInDate: moveInDate ? new Date(moveInDate) : undefined,
      monthlyRent,
      depositAmount,
      durationMonths,
      message,
    });

    sendResponse(res, 200, true, 'Counter offer sent', booking);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId, reason } = req.body;

    const result = await BookingService.cancelBooking(
      bookingId,
      req.user?.userId || '',
      reason
    );

    sendResponse(res, 200, true, 'Booking cancelled', result);
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingService.getBooking(bookingId, req.user?.userId);

    sendResponse(res, 200, true, 'Booking retrieved', booking);
  } catch (error) {
    next(error);
  }
};

export const listBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, role, limit = 20, offset = 0 } = req.query;

    const result = await BookingService.listUserBookings(req.user?.userId || '', {
      status: status as string | undefined,
      role: role as 'tenant' | 'landlord' | undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'Bookings retrieved', result);
  } catch (error) {
    next(error);
  }
};
