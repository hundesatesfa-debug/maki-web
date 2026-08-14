"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const apiError_1 = require("../../utils/apiError");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const email_1 = require("../../utils/email");
const crypto_1 = __importDefault(require("crypto"));
class AuthService {
    static async register(data) {
        const existingUser = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw apiError_1.ApiError.conflict('User with this email already exists');
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        const user = await database_1.default.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                role: data.role,
            },
        });
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.email, user.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await database_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        const { password, refreshToken: _, ...userWithoutSensitiveInfo } = user;
        return { user: userWithoutSensitiveInfo, accessToken, refreshToken };
    }
    static async login(data) {
        const user = await database_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw apiError_1.ApiError.unauthorized('Invalid email or password');
        }
        if (user.isBanned) {
            throw apiError_1.ApiError.forbidden('Your account has been banned. Please contact support.');
        }
        const isPasswordValid = await (0, password_1.comparePassword)(data.password, user.password);
        if (!isPasswordValid) {
            throw apiError_1.ApiError.unauthorized('Invalid email or password');
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.email, user.role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await database_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        const { password, refreshToken: _, ...userWithoutSensitiveInfo } = user;
        return { user: userWithoutSensitiveInfo, accessToken, refreshToken };
    }
    static async logout(userId) {
        await database_1.default.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
    static async refreshToken(oldRefreshToken) {
        // Note: The actual JWT verification is done in the controller
        // Here we just check if it matches what's in the DB
        const user = await database_1.default.user.findFirst({
            where: { refreshToken: oldRefreshToken },
        });
        if (!user) {
            throw apiError_1.ApiError.unauthorized('Invalid refresh token');
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)(user.id, user.email, user.role);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await database_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    static async forgotPassword(email) {
        const user = await database_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            // We don't throw an error here to prevent email enumeration attacks
            return;
        }
        // Generate a random token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        // Save token with 1 hour expiry
        await database_1.default.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            },
        });
        // Send email (un-hashed token sent to user)
        await (0, email_1.sendPasswordResetEmail)(user.email, resetToken);
    }
    static async resetPassword(data) {
        const hashedToken = crypto_1.default.createHash('sha256').update(data.token).digest('hex');
        const user = await database_1.default.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            throw apiError_1.ApiError.badRequest('Invalid or expired reset token');
        }
        const hashedPassword = await (0, password_1.hashPassword)(data.password);
        await database_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                // Optionally invalidate all sessions by clearing refresh token
                refreshToken: null,
            },
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map