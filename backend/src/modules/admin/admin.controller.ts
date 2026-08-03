import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { sendResponse } from '../../utils/apiResponse';

/**
 * Admin Controller
 */

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const metrics = await AdminService.getDashboardMetrics();
    sendResponse(res, 200, true, 'Dashboard metrics retrieved', metrics);
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, kycStatus, isBanned, limit = 20, offset = 0 } = req.query;

    const result = await AdminService.listUsers({
      role: role as string | undefined,
      kycStatus: kycStatus as string | undefined,
      isBanned: isBanned === 'true' ? true : isBanned === 'false' ? false : undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'Users retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, status, reason } = req.body;

    const user = await AdminService.verifyUser(
      req.user?.userId || '',
      userId,
      status,
      reason
    );

    sendResponse(res, 200, true, `User ${status.toLowerCase()}`, user);
  } catch (error) {
    next(error);
  }
};

export const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, reason, duration } = req.body;

    const user = await AdminService.suspendUser(
      req.user?.userId || '',
      userId,
      reason,
      duration
    );

    sendResponse(res, 200, true, 'User suspended', user);
  } catch (error) {
    next(error);
  }
};

export const approveListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listingId, reason } = req.body;

    const listing = await AdminService.approveListing(
      req.user?.userId || '',
      listingId,
      reason
    );

    sendResponse(res, 200, true, 'Listing approved', listing);
  } catch (error) {
    next(error);
  }
};

export const rejectListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { listingId, reason } = req.body;

    const listing = await AdminService.rejectListing(
      req.user?.userId || '',
      listingId,
      reason
    );

    sendResponse(res, 200, true, 'Listing rejected', listing);
  } catch (error) {
    next(error);
  }
};

export const listDisputes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, limit = 20, offset = 0 } = req.query;

    const result = await AdminService.listDisputes({
      status: status as string | undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'Disputes retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const resolveDispute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { disputeId } = req.params;
    const { decision, refundAmount, notes } = req.body;

    const dispute = await AdminService.resolveDispute(
      req.user?.userId || '',
      disputeId,
      { decision, refundAmount, notes }
    );

    sendResponse(res, 200, true, 'Dispute resolved', dispute);
  } catch (error) {
    next(error);
  }
};

export const getAdminLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminId, action, limit = 50, offset = 0 } = req.query;

    const result = await AdminService.getAdminLogs({
      adminId: adminId as string | undefined,
      action: action as string | undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'Admin logs retrieved', result);
  } catch (error) {
    next(error);
  }
};

export const getTransactionLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, gateway, limit = 50, offset = 0 } = req.query;

    const result = await AdminService.getTransactionLogs({
      status: status as string | undefined,
      gateway: gateway as string | undefined,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    sendResponse(res, 200, true, 'Transaction logs retrieved', result);
  } catch (error) {
    next(error);
  }
};
