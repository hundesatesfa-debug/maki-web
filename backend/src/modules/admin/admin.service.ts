import prisma from '../../config/database';
import { ApiError } from '../../utils/apiError';

/**
 * Admin Service
 * Handles admin dashboard operations and moderation
 */
export class AdminService {
  /**
   * Get dashboard metrics
   */
  static async getDashboardMetrics() {
    const totalUsers = await prisma.user.count();
    const totalListings = await prisma.listing.count();
    const totalBookings = await prisma.booking.count();
    const totalPayments = await prisma.payment.count({
      where: { status: 'COMPLETED' },
    });
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' },
    });

    // Get pending items
    const pendingListings = await prisma.listing.count({
      where: { status: 'UNAVAILABLE' }, // Or use a separate approval status
    });
    const pendingKyc = await prisma.user.count({
      where: { kycStatus: 'PENDING' },
    });
    const openDisputes = await prisma.dispute.count({
      where: { status: 'OPEN' },
    });

    // Get activity this month
    const thisMonth = new Date();
    thisMonth.setDate(1);

    const bookingsThisMonth = await prisma.booking.count({
      where: { createdAt: { gte: thisMonth } },
    });
    const paymentsThisMonth = await prisma.payment.count({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: thisMonth },
      },
    });

    return {
      overview: {
        totalUsers,
        totalListings,
        totalBookings,
        totalPayments,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      pending: {
        listings: pendingListings,
        kyc: pendingKyc,
        disputes: openDisputes,
      },
      activity: {
        bookingsThisMonth,
        paymentsThisMonth,
      },
    };
  }

  /**
   * List all users (with filters)
   */
  static async listUsers(filters: {
    role?: string;
    kycStatus?: string;
    isBanned?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    const where: any = {};

    if (filters.role) where.role = filters.role;
    if (filters.kycStatus) where.kycStatus = filters.kycStatus;
    if (filters.isBanned !== undefined) where.isBanned = filters.isBanned;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        kycStatus: true,
        verifiedBadge: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    const total = await prisma.user.count({ where });

    return { users, total };
  }

  /**
   * Verify/Reject user KYC
   */
  static async verifyUser(
    adminId: string,
    userId: string,
    status: 'APPROVED' | 'REJECTED',
    reason?: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
        verifiedBadge: status === 'APPROVED',
      },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'VERIFY_USER',
        targetId: userId,
        targetType: 'USER',
        changes: JSON.stringify({ kycStatus: status }),
        reason,
      },
    });

    // Send notification
    await prisma.notification.create({
      data: {
        userId,
        type: status === 'APPROVED' ? 'KYC_APPROVED' : 'KYC_REJECTED',
        title: status === 'APPROVED' ? 'KYC Approved' : 'KYC Rejected',
        message:
          status === 'APPROVED'
            ? 'Your identity verification has been approved. You now have a verified badge!'
            : `Your KYC submission was rejected. ${reason || ''}`,
        status: 'PENDING',
        channels: '["IN_APP", "EMAIL"]',
      },
    });

    return updated;
  }

  /**
   * Suspend user
   */
  static async suspendUser(
    adminId: string,
    userId: string,
    reason: string,
    duration?: number
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'SUSPEND_USER',
        targetId: userId,
        targetType: 'USER',
        reason,
        changes: JSON.stringify({ isBanned: true, duration }),
      },
    });

    // Send notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'ACCOUNT_SUSPENDED',
        title: 'Account Suspended',
        message: `Your account has been suspended. Reason: ${reason}`,
        status: 'PENDING',
        channels: '["IN_APP", "EMAIL"]',
      },
    });

    return updated;
  }

  /**
   * Approve listing
   */
  static async approveListing(adminId: string, listingId: string, reason?: string) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw ApiError.notFound('Listing not found');
    }

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'AVAILABLE' },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'APPROVE_LISTING',
        targetId: listingId,
        targetType: 'LISTING',
        reason,
      },
    });

    // Send notification to landlord
    await prisma.notification.create({
      data: {
        userId: listing.ownerId,
        type: 'LISTING_APPROVED',
        title: 'Listing Approved',
        message: `Your listing "${listing.title}" has been approved and is now public!`,
        relatedId: listingId,
        relatedType: 'LISTING',
        status: 'PENDING',
        channels: '["IN_APP", "EMAIL"]',
      },
    });

    return updated;
  }

  /**
   * Reject listing
   */
  static async rejectListing(
    adminId: string,
    listingId: string,
    reason: string
  ) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw ApiError.notFound('Listing not found');
    }

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'UNAVAILABLE' },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'REJECT_LISTING',
        targetId: listingId,
        targetType: 'LISTING',
        reason,
      },
    });

    // Send notification to landlord
    await prisma.notification.create({
      data: {
        userId: listing.ownerId,
        type: 'LISTING_REJECTED',
        title: 'Listing Rejected',
        message: `Your listing "${listing.title}" was rejected. Reason: ${reason}`,
        relatedId: listingId,
        relatedType: 'LISTING',
        status: 'PENDING',
        channels: '["IN_APP", "EMAIL"]',
      },
    });

    return updated;
  }

  /**
   * Get open disputes
   */
  static async listDisputes(filters: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const where: any = {};

    if (filters.status) where.status = filters.status;

    const disputes = await prisma.dispute.findMany({
      where,
      include: {
        booking: {
          include: {
            property: true,
            tenant: true,
            landlord: true,
          },
        },
        filer: true,
      },
      orderBy: { createdAt: 'asc' },
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    const total = await prisma.dispute.count({ where });

    return { disputes, total };
  }

  /**
   * Resolve dispute
   */
  static async resolveDispute(
    adminId: string,
    disputeId: string,
    data: {
      decision: string;
      refundAmount: number;
      notes?: string;
    }
  ) {
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { booking: { include: { tenant: true, landlord: true } } },
    });

    if (!dispute) {
      throw ApiError.notFound('Dispute not found');
    }

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: 'RESOLVED',
        adminDecision: data.decision,
        refundAmount: data.refundAmount,
        resolvedBy: adminId,
        resolvedAt: new Date(),
      },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId,
        action: 'RESOLVE_DISPUTE',
        targetId: disputeId,
        targetType: 'DISPUTE',
        changes: JSON.stringify({
          decision: data.decision,
          refundAmount: data.refundAmount,
        }),
        reason: data.notes,
      },
    });

    // Send notifications
    const notificationMessage =
      data.decision === 'TENANT_WINS'
        ? `Dispute resolved. You will receive a refund of ${data.refundAmount}.`
        : `Dispute resolved. Decision: ${data.decision}.`;

    await prisma.notification.create({
      data: {
        userId: dispute.booking.tenantId,
        type: 'DISPUTE_RESOLVED',
        title: 'Dispute Resolved',
        message: notificationMessage,
        relatedId: disputeId,
        relatedType: 'DISPUTE',
        status: 'PENDING',
        channels: '["IN_APP", "EMAIL"]',
      },
    });

    await prisma.notification.create({
      data: {
        userId: dispute.booking.landlordId,
        type: 'DISPUTE_RESOLVED',
        title: 'Dispute Resolved',
        message: notificationMessage,
        relatedId: disputeId,
        relatedType: 'DISPUTE',
        status: 'PENDING',
        channels: '["IN_APP", "EMAIL"]',
      },
    });

    return updated;
  }

  /**
   * Get admin logs
   */
  static async getAdminLogs(filters: {
    adminId?: string;
    action?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const where: any = {};

    if (filters.adminId) where.adminId = filters.adminId;
    if (filters.action) where.action = filters.action;

    const logs = await prisma.adminLog.findMany({
      where,
      include: { admin: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });

    const total = await prisma.adminLog.count({ where });

    return { logs, total };
  }

  /**
   * Get transaction audit logs
   */
  static async getTransactionLogs(filters: {
    status?: string;
    gateway?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.gateway) where.gatewayName = filters.gateway;

    const logs = await prisma.transactionAuditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });

    const total = await prisma.transactionAuditLog.count({ where });

    return { logs, total };
  }
}
