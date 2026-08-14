import { z } from 'zod';
export declare const verifyUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        userId: z.ZodString;
        status: z.ZodEnum<["APPROVED", "REJECTED"]>;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "APPROVED" | "REJECTED";
        userId: string;
        reason?: string | undefined;
    }, {
        status: "APPROVED" | "REJECTED";
        userId: string;
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status: "APPROVED" | "REJECTED";
        userId: string;
        reason?: string | undefined;
    };
}, {
    body: {
        status: "APPROVED" | "REJECTED";
        userId: string;
        reason?: string | undefined;
    };
}>;
export declare const suspendUserSchema: z.ZodObject<{
    body: z.ZodObject<{
        userId: z.ZodString;
        reason: z.ZodString;
        duration: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        userId: string;
        reason: string;
        duration?: number | undefined;
    }, {
        userId: string;
        reason: string;
        duration?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        userId: string;
        reason: string;
        duration?: number | undefined;
    };
}, {
    body: {
        userId: string;
        reason: string;
        duration?: number | undefined;
    };
}>;
export declare const approveListingSchema: z.ZodObject<{
    body: z.ZodObject<{
        listingId: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        listingId: string;
        reason?: string | undefined;
    }, {
        listingId: string;
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        listingId: string;
        reason?: string | undefined;
    };
}, {
    body: {
        listingId: string;
        reason?: string | undefined;
    };
}>;
export declare const rejectListingSchema: z.ZodObject<{
    body: z.ZodObject<{
        listingId: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        listingId: string;
        reason: string;
    }, {
        listingId: string;
        reason: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        listingId: string;
        reason: string;
    };
}, {
    body: {
        listingId: string;
        reason: string;
    };
}>;
export declare const resolveDisputeSchema: z.ZodObject<{
    body: z.ZodObject<{
        decision: z.ZodEnum<["TENANT_WINS", "LANDLORD_WINS", "SPLIT"]>;
        refundAmount: z.ZodNumber;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        refundAmount: number;
        decision: "TENANT_WINS" | "LANDLORD_WINS" | "SPLIT";
        notes?: string | undefined;
    }, {
        refundAmount: number;
        decision: "TENANT_WINS" | "LANDLORD_WINS" | "SPLIT";
        notes?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        refundAmount: number;
        decision: "TENANT_WINS" | "LANDLORD_WINS" | "SPLIT";
        notes?: string | undefined;
    };
}, {
    body: {
        refundAmount: number;
        decision: "TENANT_WINS" | "LANDLORD_WINS" | "SPLIT";
        notes?: string | undefined;
    };
}>;
export declare const setCommissionSchema: z.ZodObject<{
    body: z.ZodObject<{
        percentage: z.ZodNumber;
        minAmount: z.ZodOptional<z.ZodNumber>;
        maxAmount: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        percentage: number;
        minAmount?: number | undefined;
        maxAmount?: number | undefined;
    }, {
        percentage: number;
        minAmount?: number | undefined;
        maxAmount?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        percentage: number;
        minAmount?: number | undefined;
        maxAmount?: number | undefined;
    };
}, {
    body: {
        percentage: number;
        minAmount?: number | undefined;
        maxAmount?: number | undefined;
    };
}>;
export type VerifyUserInput = z.infer<typeof verifyUserSchema>['body'];
export type SuspendUserInput = z.infer<typeof suspendUserSchema>['body'];
export type ApproveListingInput = z.infer<typeof approveListingSchema>['body'];
export type RejectListingInput = z.infer<typeof rejectListingSchema>['body'];
export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>['body'];
export type SetCommissionInput = z.infer<typeof setCommissionSchema>['body'];
//# sourceMappingURL=admin.validation.d.ts.map