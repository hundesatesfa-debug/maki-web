"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const apiError_1 = require("../utils/apiError");
const authenticate = (req, _res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw apiError_1.ApiError.unauthorized('No token provided');
        }
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = {
            userId: decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            next(apiError_1.ApiError.unauthorized('Invalid or expired token'));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(apiError_1.ApiError.unauthorized('Not authenticated'));
        }
        if (!roles.includes(req.user.role)) {
            return next(apiError_1.ApiError.forbidden('You do not have permission to perform this action'));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.js.map