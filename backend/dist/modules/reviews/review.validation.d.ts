import { z } from 'zod';
export declare const createReviewSchema: z.ZodObject<{
    body: z.ZodObject<{
        bookingId: z.ZodString;
        rating: z.ZodNumber;
        text: z.ZodOptional<z.ZodString>;
        reviewType: z.ZodEnum<["PROPERTY", "LANDLORD", "TENANT"]>;
    }, "strip", z.ZodTypeAny, {
        bookingId: string;
        reviewType: "PROPERTY" | "LANDLORD" | "TENANT";
        rating: number;
        text?: string | undefined;
    }, {
        bookingId: string;
        reviewType: "PROPERTY" | "LANDLORD" | "TENANT";
        rating: number;
        text?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        bookingId: string;
        reviewType: "PROPERTY" | "LANDLORD" | "TENANT";
        rating: number;
        text?: string | undefined;
    };
}, {
    body: {
        bookingId: string;
        reviewType: "PROPERTY" | "LANDLORD" | "TENANT";
        rating: number;
        text?: string | undefined;
    };
}>;
export declare const moderateReviewSchema: z.ZodObject<{
    body: z.ZodObject<{
        reviewId: z.ZodString;
        status: z.ZodEnum<["PUBLISHED", "REJECTED"]>;
        moderationNotes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "PUBLISHED" | "REJECTED";
        reviewId: string;
        moderationNotes?: string | undefined;
    }, {
        status: "PUBLISHED" | "REJECTED";
        reviewId: string;
        moderationNotes?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        status: "PUBLISHED" | "REJECTED";
        reviewId: string;
        moderationNotes?: string | undefined;
    };
}, {
    body: {
        status: "PUBLISHED" | "REJECTED";
        reviewId: string;
        moderationNotes?: string | undefined;
    };
}>;
export declare const getReviewsSchema: z.ZodObject<{
    query: z.ZodObject<{
        verified: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        limit: z.ZodDefault<z.ZodNumber>;
        offset: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        offset: number;
        verified?: "true" | "false" | undefined;
    }, {
        limit?: number | undefined;
        offset?: number | undefined;
        verified?: "true" | "false" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        offset: number;
        verified?: "true" | "false" | undefined;
    };
}, {
    query: {
        limit?: number | undefined;
        offset?: number | undefined;
        verified?: "true" | "false" | undefined;
    };
}>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type ModerateReviewInput = z.infer<typeof moderateReviewSchema>['body'];
//# sourceMappingURL=review.validation.d.ts.map