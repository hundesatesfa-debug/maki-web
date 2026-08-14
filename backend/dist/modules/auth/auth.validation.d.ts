import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["OWNER", "RENTER"]>>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        role: "OWNER" | "RENTER";
        password: string;
        firstName: string;
        lastName: string;
        phone?: string | undefined;
    }, {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: "OWNER" | "RENTER" | undefined;
        phone?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        role: "OWNER" | "RENTER";
        password: string;
        firstName: string;
        lastName: string;
        phone?: string | undefined;
    };
}, {
    body: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: "OWNER" | "RENTER" | undefined;
        phone?: string | undefined;
    };
}>;
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
    };
}, {
    body: {
        email: string;
    };
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        password: string;
        token: string;
    }, {
        password: string;
        token: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        password: string;
        token: string;
    };
}, {
    body: {
        password: string;
        token: string;
    };
}>;
export declare const refreshSchema: z.ZodObject<{
    cookies: z.ZodOptional<z.ZodObject<{
        refreshToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        refreshToken?: string | undefined;
    }, {
        refreshToken?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    cookies?: {
        refreshToken?: string | undefined;
    } | undefined;
}, {
    cookies?: {
        refreshToken?: string | undefined;
    } | undefined;
}>;
//# sourceMappingURL=auth.validation.d.ts.map