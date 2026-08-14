import { Response } from 'express';
export declare const sendResponse: (res: Response, statusCode: number, success: boolean, message: string, data?: any) => Response;
export declare const sendError: (res: Response, statusCode: number, message: string, errors?: any) => Response;
//# sourceMappingURL=apiResponse.d.ts.map