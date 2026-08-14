"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendResponse = void 0;
const sendResponse = (res, statusCode, success, message, data) => {
    const payload = {
        success,
        message,
    };
    if (data) {
        payload.data = data;
    }
    return res.status(statusCode).json(payload);
};
exports.sendResponse = sendResponse;
const sendError = (res, statusCode, message, errors) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
};
exports.sendError = sendError;
//# sourceMappingURL=apiResponse.js.map