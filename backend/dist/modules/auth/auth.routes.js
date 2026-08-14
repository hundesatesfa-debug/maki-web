"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../../middleware/validate");
const auth_1 = require("../../middleware/auth");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const AuthController = __importStar(require("./auth.controller"));
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// Apply strict rate limiting to auth routes
router.use(rateLimiter_1.authLimiter);
router.post('/register', (0, validate_1.validate)(auth_validation_1.registerSchema), AuthController.register);
router.post('/login', (0, validate_1.validate)(auth_validation_1.loginSchema), AuthController.login);
router.post('/logout', auth_1.authenticate, AuthController.logout);
router.post('/refresh', AuthController.refresh);
router.post('/forgot-password', (0, validate_1.validate)(auth_validation_1.forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', (0, validate_1.validate)(auth_validation_1.resetPasswordSchema), AuthController.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map