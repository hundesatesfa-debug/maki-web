"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refresh = exports.logout = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const apiResponse_1 = require("../../utils/apiResponse");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
const apiError_1 = require("../../utils/apiError");
const setTokenCookies = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env_1.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
const register = async (req, res, next) => {
    try {
        const result = await auth_service_1.AuthService.register(req.body);
        setTokenCookies(res, result.refreshToken);
        (0, apiResponse_1.sendResponse)(res, 201, true, 'Registration successful', {
            user: result.user,
            accessToken: result.accessToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const result = await auth_service_1.AuthService.login(req.body);
        setTokenCookies(res, result.refreshToken);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Login successful', {
            user: result.user,
            accessToken: result.accessToken,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        if (req.user) {
            await auth_service_1.AuthService.logout(req.user.userId);
        }
        res.clearCookie('refreshToken');
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Logged out successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            throw apiError_1.ApiError.unauthorized('Refresh token is required');
        }
        // Verify token expiration and signature
        (0, jwt_1.verifyRefreshToken)(refreshToken);
        const result = await auth_service_1.AuthService.refreshToken(refreshToken);
        setTokenCookies(res, result.refreshToken);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Token refreshed successfully', {
            accessToken: result.accessToken,
        });
    }
    catch (error) {
        res.clearCookie('refreshToken');
        next(error);
    }
};
exports.refresh = refresh;
const forgotPassword = async (req, res, next) => {
    try {
        await auth_service_1.AuthService.forgotPassword(req.body.email);
        // Always return success to prevent email enumeration
        (0, apiResponse_1.sendResponse)(res, 200, true, 'If that email exists, a password reset link has been sent');
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    try {
        await auth_service_1.AuthService.resetPassword(req.body);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Password has been reset successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map