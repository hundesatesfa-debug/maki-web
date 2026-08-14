import { Request, Response, NextFunction } from 'express';
export declare const sendMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getConversation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getConversations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=message.controller.d.ts.map