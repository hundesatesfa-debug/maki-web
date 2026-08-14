/**
 * Admin Service
 * Handles admin dashboard operations and moderation
 */
export declare class AdminService {
    /**
     * Get dashboard metrics
     */
    static getDashboardMetrics(): Promise<{
        overview: {
            totalUsers: number;
            totalListings: number;
            totalBookings: number;
            totalPayments: number;
            totalRevenue: number;
        };
        pending: {
            listings: number;
            kyc: number;
            disputes: number;
        };
        activity: {
            bookingsThisMonth: number;
            paymentsThisMonth: number;
        };
    }>;
    /**
     * List all users (with filters)
     */
    static listUsers(filters?: {
        role?: string;
        kycStatus?: string;
        isBanned?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<{
        users: {
            email: string;
            role: string;
            id: string;
            firstName: string;
            lastName: string;
            isBanned: boolean;
            kycStatus: string;
            verifiedBadge: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    /**
     * Verify/Reject user KYC
     */
    static verifyUser(adminId: string, userId: string, status: 'APPROVED' | 'REJECTED', reason?: string): Promise<{
        email: string;
        role: string;
        id: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        profilePicture: string | null;
        isBanned: boolean;
        kycStatus: string;
        verifiedBadge: boolean;
        responseTimeHours: number | null;
        responseRate: number;
        refreshToken: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Suspend user
     */
    static suspendUser(adminId: string, userId: string, reason: string, duration?: number): Promise<{
        email: string;
        role: string;
        id: string;
        password: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        profilePicture: string | null;
        isBanned: boolean;
        kycStatus: string;
        verifiedBadge: boolean;
        responseTimeHours: number | null;
        responseRate: number;
        refreshToken: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    /**
     * Approve listing
     */
    static approveListing(adminId: string, listingId: string, reason?: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string | null;
        houseType: string;
        ownerId: string;
        imageUrls: string;
        isPremium: boolean;
        availableFrom: Date | null;
        availableTo: Date | null;
        minStay: number;
        averageRating: number;
        cancellationPolicy: string;
    }>;
    /**
     * Reject listing
     */
    static rejectListing(adminId: string, listingId: string, reason: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string | null;
        houseType: string;
        ownerId: string;
        imageUrls: string;
        isPremium: boolean;
        availableFrom: Date | null;
        availableTo: Date | null;
        minStay: number;
        averageRating: number;
        cancellationPolicy: string;
    }>;
    /**
     * Get open disputes
     */
    static listDisputes(filters?: {
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        disputes: ({
            booking: {
                property: {
                    status: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    description: string;
                    price: number;
                    address: string;
                    city: string;
                    latitude: number;
                    longitude: number;
                    bedrooms: number;
                    bathrooms: number;
                    amenities: string | null;
                    houseType: string;
                    ownerId: string;
                    imageUrls: string;
                    isPremium: boolean;
                    availableFrom: Date | null;
                    availableTo: Date | null;
                    minStay: number;
                    averageRating: number;
                    cancellationPolicy: string;
                };
                tenant: {
                    email: string;
                    role: string;
                    id: string;
                    password: string;
                    firstName: string;
                    lastName: string;
                    phone: string | null;
                    profilePicture: string | null;
                    isBanned: boolean;
                    kycStatus: string;
                    verifiedBadge: boolean;
                    responseTimeHours: number | null;
                    responseRate: number;
                    refreshToken: string | null;
                    resetToken: string | null;
                    resetTokenExpiry: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
                landlord: {
                    email: string;
                    role: string;
                    id: string;
                    password: string;
                    firstName: string;
                    lastName: string;
                    phone: string | null;
                    profilePicture: string | null;
                    isBanned: boolean;
                    kycStatus: string;
                    verifiedBadge: boolean;
                    responseTimeHours: number | null;
                    responseRate: number;
                    refreshToken: string | null;
                    resetToken: string | null;
                    resetTokenExpiry: Date | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                message: string | null;
                status: string;
                id: string;
                responseTimeHours: number | null;
                createdAt: Date;
                updatedAt: Date;
                tenantId: string;
                landlordId: string;
                propertyId: string;
                moveInDate: Date;
                durationMonths: number;
                monthlyRent: number;
                depositAmount: number;
            };
            filer: {
                email: string;
                role: string;
                id: string;
                password: string;
                firstName: string;
                lastName: string;
                phone: string | null;
                profilePicture: string | null;
                isBanned: boolean;
                kycStatus: string;
                verifiedBadge: boolean;
                responseTimeHours: number | null;
                responseRate: number;
                refreshToken: string | null;
                resetToken: string | null;
                resetTokenExpiry: Date | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            bookingId: string;
            reason: string;
            filedBy: string;
            evidenceUrls: string | null;
            adminDecision: string | null;
            refundAmount: number | null;
            resolvedBy: string | null;
            resolvedAt: Date | null;
        })[];
        total: number;
    }>;
    /**
     * Resolve dispute
     */
    static resolveDispute(adminId: string, disputeId: string, data: {
        decision: string;
        refundAmount: number;
        notes?: string;
    }): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        bookingId: string;
        reason: string;
        filedBy: string;
        evidenceUrls: string | null;
        adminDecision: string | null;
        refundAmount: number | null;
        resolvedBy: string | null;
        resolvedAt: Date | null;
    }>;
    /**
     * Get admin logs
     */
    static getAdminLogs(filters?: {
        adminId?: string;
        action?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        logs: ({
            admin: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            reason: string | null;
            action: string;
            targetId: string;
            targetType: string;
            changes: string | null;
            adminId: string;
        })[];
        total: number;
    }>;
    /**
     * Get transaction audit logs
     */
    static getTransactionLogs(filters?: {
        status?: string;
        gateway?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        logs: {
            status: string | null;
            userId: string | null;
            id: string;
            createdAt: Date;
            amount: number | null;
            currency: string | null;
            metadata: string | null;
            gatewayName: string | null;
            errorMessage: string | null;
            bookingId: string | null;
            action: string | null;
        }[];
        total: number;
    }>;
}
//# sourceMappingURL=admin.service.d.ts.map