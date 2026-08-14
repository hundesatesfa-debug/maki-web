/**
 * Booking Service
 * Manages booking requests, confirmations, and status updates
 */
export declare class BookingService {
    /**
     * Create booking request
     */
    static createBooking(data: {
        propertyId: string;
        tenantId: string;
        moveInDate: Date;
        durationMonths: number;
        monthlyRent: number;
        depositAmount: number;
        message?: string;
    }): Promise<{
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
    }>;
    /**
     * Accept booking request
     */
    static acceptBooking(bookingId: string, landlordId: string): Promise<{
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
    }>;
    /**
     * Decline booking request
     */
    static declineBooking(bookingId: string, landlordId: string, reason?: string): Promise<{
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
    }>;
    /**
     * Counter-offer booking
     */
    static counterOffer(bookingId: string, landlordId: string, data: {
        moveInDate?: Date;
        monthlyRent?: number;
        depositAmount?: number;
        durationMonths?: number;
        message?: string;
    }): Promise<{
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
    }>;
    /**
     * Cancel booking
     */
    static cancelBooking(bookingId: string, userId: string, reason?: string): Promise<{
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
        refundPercentage: number;
    }>;
    /**
     * Get booking details
     */
    static getBooking(bookingId: string, userId?: string): Promise<{
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
        payments: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentReference: string | null;
            amount: number;
            currency: string;
            metadata: string | null;
            bookingId: string;
            idempotencyKey: string | null;
            paymentGateway: string;
            paymentType: string;
        }[];
        reviews: {
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
        }[];
        contracts: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            documentUrl: string | null;
            signedBy: string | null;
            signedAt: Date | null;
        }[];
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
    }>;
    /**
     * List user's bookings
     */
    static listUserBookings(userId: string, filters?: {
        status?: string;
        role?: 'tenant' | 'landlord';
        limit?: number;
        offset?: number;
    }): Promise<{
        bookings: ({
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
            payments: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                paymentReference: string | null;
                amount: number;
                currency: string;
                metadata: string | null;
                bookingId: string;
                idempotencyKey: string | null;
                paymentGateway: string;
                paymentType: string;
            }[];
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
        })[];
        total: number;
    }>;
    /**
     * Block calendar dates for property
     */
    static blockCalendarDates(propertyId: string, moveInDate: Date, durationMonths: number): Promise<{
        propertyId: string;
        moveInDate: Date;
        moveOutDate: Date;
    }>;
    /**
     * Release calendar dates
     */
    static releaseCalendarDates(propertyId: string, moveInDate: Date, durationMonths: number): Promise<{
        propertyId: string;
        moveInDate: Date;
        durationMonths: number;
    }>;
    /**
     * Notify tenant
     */
    private static notifyTenant;
    /**
     * Notify landlord
     */
    private static notifyLandlord;
}
//# sourceMappingURL=booking.service.d.ts.map