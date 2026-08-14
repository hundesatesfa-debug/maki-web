"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCommissionSchema = exports.resolveDisputeSchema = exports.rejectListingSchema = exports.approveListingSchema = exports.suspendUserSchema = exports.verifyUserSchema = void 0;
const zod_1 = require("zod");
exports.verifyUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
        status: zod_1.z.enum(['APPROVED', 'REJECTED']),
        reason: zod_1.z.string().optional(),
    }),
});
exports.suspendUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().uuid(),
        reason: zod_1.z.string(),
        duration: zod_1.z.number().optional(), // Duration in days
    }),
});
exports.approveListingSchema = zod_1.z.object({
    body: zod_1.z.object({
        listingId: zod_1.z.string().uuid(),
        reason: zod_1.z.string().optional(),
    }),
});
exports.rejectListingSchema = zod_1.z.object({
    body: zod_1.z.object({
        listingId: zod_1.z.string().uuid(),
        reason: zod_1.z.string(),
    }),
});
exports.resolveDisputeSchema = zod_1.z.object({
    body: zod_1.z.object({
        decision: zod_1.z.enum(['TENANT_WINS', 'LANDLORD_WINS', 'SPLIT']),
        refundAmount: zod_1.z.number().positive(),
        notes: zod_1.z.string().optional(),
    }),
});
exports.setCommissionSchema = zod_1.z.object({
    body: zod_1.z.object({
        percentage: zod_1.z.number().positive().max(100),
        minAmount: zod_1.z.number().optional(),
        maxAmount: zod_1.z.number().optional(),
    }),
});
//# sourceMappingURL=admin.validation.js.map