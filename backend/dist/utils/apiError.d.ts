export declare class ApiError extends Error {
    statusCode: number;
    message: string;
    data?: any | undefined;
    constructor(statusCode: number, message: string, data?: any | undefined);
    static badRequest(message: string, data?: any): ApiError;
    static unauthorized(message: string, data?: any): ApiError;
    static forbidden(message: string, data?: any): ApiError;
    static notFound(message: string, data?: any): ApiError;
    static conflict(message: string, data?: any): ApiError;
    static internal(message: string, data?: any): ApiError;
    static internalServerError(message: string, data?: any): ApiError;
}
//# sourceMappingURL=apiError.d.ts.map