import { Request, Response, NextFunction } from 'express';
/**
 * Booking Controller
 * Handles booking-related HTTP requests
 */
export declare const createBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const acceptBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const declineBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const counterOffer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cancelBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getBooking: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listBookings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=booking.controller.d.ts.map