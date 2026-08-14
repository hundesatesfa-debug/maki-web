import { Request, Response, NextFunction } from 'express';
/**
 * Admin Controller
 */
export declare const getDashboard: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const suspendUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const approveListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const rejectListing: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listDisputes: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const resolveDispute: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAdminLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTransactionLogs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map