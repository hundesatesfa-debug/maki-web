import { Request, Response, NextFunction } from 'express';
/**
 * Review Controller
 */
export declare const submitReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPropertyReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserReviews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getModerationQueue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const moderateReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=review.controller.d.ts.map