"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    statusCode;
    message;
    data;
    constructor(statusCode, message, data) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.name = 'ApiError';
    }
    static badRequest(message, data) {
        return new ApiError(400, message, data);
    }
    static unauthorized(message, data) {
        return new ApiError(401, message, data);
    }
    static forbidden(message, data) {
        return new ApiError(403, message, data);
    }
    static notFound(message, data) {
        return new ApiError(404, message, data);
    }
    static conflict(message, data) {
        return new ApiError(409, message, data);
    }
    static internal(message, data) {
        return new ApiError(500, message, data);
    }
    static internalServerError(message, data) {
        return new ApiError(500, message, data);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=apiError.js.map