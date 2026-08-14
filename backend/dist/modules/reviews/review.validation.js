"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReviewsSchema = exports.moderateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        bookingId: zod_1.z.string().uuid(),
        rating: zod_1.z.number().int().min(1).max(5),
        text: zod_1.z.string().max(500).optional(),
        reviewType: zod_1.z.enum(['PROPERTY', 'LANDLORD', 'TENANT']),
    }),
});
exports.moderateReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewId: zod_1.z.string().uuid(),
        status: zod_1.z.enum(['PUBLISHED', 'REJECTED']),
        moderationNotes: zod_1.z.string().optional(),
    }),
});
exports.getReviewsSchema = zod_1.z.object({
    query: zod_1.z.object({
        verified: zod_1.z.enum(['true', 'false']).optional(),
        limit: zod_1.z.coerce.number().default(20),
        offset: zod_1.z.coerce.number().default(0),
    }),
});
//# sourceMappingURL=review.validation.js.map