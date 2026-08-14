export declare class AuthService {
    static register(data: any): Promise<{
        user: {
            email: string;
            role: string;
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profilePicture: string | null;
            isBanned: boolean;
            kycStatus: string;
            verifiedBadge: boolean;
            responseTimeHours: number | null;
            responseRate: number;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    static login(data: any): Promise<{
        user: {
            email: string;
            role: string;
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profilePicture: string | null;
            isBanned: boolean;
            kycStatus: string;
            verifiedBadge: boolean;
            responseTimeHours: number | null;
            responseRate: number;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    static logout(userId: string): Promise<void>;
    static refreshToken(oldRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    static forgotPassword(email: string): Promise<void>;
    static resetPassword(data: any): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map