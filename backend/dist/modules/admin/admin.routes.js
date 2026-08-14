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
const AdminController = __importStar(require("./admin.controller"));
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const admin_validation_1 = require("./admin.validation");
const router = (0, express_1.Router)();
// Protect all admin routes
router.use(auth_1.authenticate, (0, auth_1.authorizeRoles)('ADMIN'));
/**
 * Dashboard and Metrics
 */
router.get('/dashboard', AdminController.getDashboard);
/**
 * User Management
 */
router.get('/users', AdminController.listUsers);
router.put('/users/:userId/verify', (0, validate_1.validate)(admin_validation_1.verifyUserSchema), AdminController.verifyUser);
router.put('/users/:userId/suspend', (0, validate_1.validate)(admin_validation_1.suspendUserSchema), AdminController.suspendUser);
/**
 * Listing Moderation
 */
router.put('/listings/:listingId/approve', (0, validate_1.validate)(admin_validation_1.approveListingSchema), AdminController.approveListing);
router.put('/listings/:listingId/reject', (0, validate_1.validate)(admin_validation_1.rejectListingSchema), AdminController.rejectListing);
/**
 * Dispute Resolution
 */
router.get('/disputes', AdminController.listDisputes);
router.put('/disputes/:disputeId/resolve', (0, validate_1.validate)(admin_validation_1.resolveDisputeSchema), AdminController.resolveDispute);
/**
 * Admin Logs and Audit Trail
 */
router.get('/logs', AdminController.getAdminLogs);
router.get('/transaction-logs', AdminController.getTransactionLogs);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map