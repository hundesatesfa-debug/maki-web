/**
 * Review Service
 * Manages review creation, moderation, and ratings calculation
 */
export declare class ReviewService {
    /**
     * Submit a review
     */
    static submitReview(data: {
        bookingId: string;
        reviewerId: string;
        rating: number;
        text?: string;
        reviewType: string;
    }): Promise<{
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
        reviewer: {
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
        reviewee: {
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
        text: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        reviewerId: string;
        revieweeId: string;
        reviewType: string;
        rating: number;
        isVerified: boolean;
        moderationNotes: string | null;
    }>;
    /**
     * Get reviews for property
     */
    static getPropertyReviews(propertyId: string, filters?: {
        verified?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<({
        reviewer: {
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
        reviewee: {
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
        text: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        reviewerId: string;
        revieweeId: string;
        reviewType: string;
        rating: number;
        isVerified: boolean;
        moderationNotes: string | null;
    })[]>;
    /**
     * Get reviews for user (as landlord/tenant being reviewed)
     */
    static getUserReviews(userId: string, filters?: {
        reviewType?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        reviews: ({
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
            reviewer: {
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
            text: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
            reviewType: string;
            rating: number;
            isVerified: boolean;
            moderationNotes: string | null;
        })[];
        averageRating: number;
        totalReviews: number;
    }>;
    /**
     * Get moderation queue (admin)
     */
    static getModerationQueue(filters?: {
        limit?: number;
        offset?: number;
    }): Promise<{
        reviews: ({
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
            reviewer: {
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
            reviewee: {
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
            text: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
            reviewType: string;
            rating: number;
            isVerified: boolean;
            moderationNotes: string | null;
        })[];
        total: number;
    }>;
    /**
     * Moderate review (admin)
     */
    static moderateReview(reviewId: string, adminId: string, data: {
        status: 'PUBLISHED' | 'REJECTED';
        moderationNotes?: string;
    }): Promise<{
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
        reviewer: {
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
        reviewee: {
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
        text: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        reviewerId: string;
        revieweeId: string;
        reviewType: string;
        rating: number;
        isVerified: boolean;
        moderationNotes: string | null;
    }>;
    /**
     * Update property average rating
     */
    private static updatePropertyRating;
    /**
     * Update landlord average rating
     */
    private static updateLandlordRating;
    /**
     * Update tenant rating
     */
    private static updateTenantRating;
    /**
     * Notify reviewee of new review
     */
    private static notifyReviewee;
}
//# sourceMappingURL=review.service.d.ts.map