export interface JWTPayload {
    sub: string;
    email: string;
    role: string;
}
export declare const generateAccessToken: (userId: string, email: string, role: string) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => JWTPayload;
export declare const verifyRefreshToken: (token: string) => {
    sub: string;
};
//# sourceMappingURL=jwt.d.ts.map