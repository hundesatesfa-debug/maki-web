"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionLogs = exports.getAdminLogs = exports.resolveDispute = exports.listDisputes = exports.rejectListing = exports.approveListing = exports.suspendUser = exports.verifyUser = exports.listUsers = exports.getDashboard = void 0;
const admin_service_1 = require("./admin.service");
const apiResponse_1 = require("../../utils/apiResponse");
/**
 * Admin Controller
 */
const getDashboard = async (req, res, next) => {
    try {
        const metrics = await admin_service_1.AdminService.getDashboardMetrics();
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Dashboard metrics retrieved', metrics);
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboard = getDashboard;
const listUsers = async (req, res, next) => {
    try {
        const { role, kycStatus, isBanned, limit = 20, offset = 0 } = req.query;
        const result = await admin_service_1.AdminService.listUsers({
            role: role,
            kycStatus: kycStatus,
            isBanned: isBanned === 'true' ? true : isBanned === 'false' ? false : undefined,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Users retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.listUsers = listUsers;
const verifyUser = async (req, res, next) => {
    try {
        const { userId, status, reason } = req.body;
        const user = await admin_service_1.AdminService.verifyUser(req.user?.userId || '', userId, status, reason);
        (0, apiResponse_1.sendResponse)(res, 200, true, `User ${status.toLowerCase()}`, user);
    }
    catch (error) {
        next(error);
    }
};
exports.verifyUser = verifyUser;
const suspendUser = async (req, res, next) => {
    try {
        const { userId, reason, duration } = req.body;
        const user = await admin_service_1.AdminService.suspendUser(req.user?.userId || '', userId, reason, duration);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'User suspended', user);
    }
    catch (error) {
        next(error);
    }
};
exports.suspendUser = suspendUser;
const approveListing = async (req, res, next) => {
    try {
        const { listingId, reason } = req.body;
        const listing = await admin_service_1.AdminService.approveListing(req.user?.userId || '', listingId, reason);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Listing approved', listing);
    }
    catch (error) {
        next(error);
    }
};
exports.approveListing = approveListing;
const rejectListing = async (req, res, next) => {
    try {
        const { listingId, reason } = req.body;
        const listing = await admin_service_1.AdminService.rejectListing(req.user?.userId || '', listingId, reason);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Listing rejected', listing);
    }
    catch (error) {
        next(error);
    }
};
exports.rejectListing = rejectListing;
const listDisputes = async (req, res, next) => {
    try {
        const { status, limit = 20, offset = 0 } = req.query;
        const result = await admin_service_1.AdminService.listDisputes({
            status: status,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Disputes retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.listDisputes = listDisputes;
const resolveDispute = async (req, res, next) => {
    try {
        const { disputeId } = req.params;
        const { decision, refundAmount, notes } = req.body;
        const dispute = await admin_service_1.AdminService.resolveDispute(req.user?.userId || '', disputeId, { decision, refundAmount, notes });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Dispute resolved', dispute);
    }
    catch (error) {
        next(error);
    }
};
exports.resolveDispute = resolveDispute;
const getAdminLogs = async (req, res, next) => {
    try {
        const { adminId, action, limit = 50, offset = 0 } = req.query;
        const result = await admin_service_1.AdminService.getAdminLogs({
            adminId: adminId,
            action: action,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Admin logs retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminLogs = getAdminLogs;
const getTransactionLogs = async (req, res, next) => {
    try {
        const { status, gateway, limit = 50, offset = 0 } = req.query;
        const result = await admin_service_1.AdminService.getTransactionLogs({
            status: status,
            gateway: gateway,
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Transaction logs retrieved', result);
    }
    catch (error) {
        next(error);
    }
};
exports.getTransactionLogs = getTransactionLogs;
//# sourceMappingURL=admin.controller.js.map