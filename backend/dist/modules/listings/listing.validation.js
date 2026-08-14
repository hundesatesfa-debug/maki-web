"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListingSchema = void 0;
const zod_1 = require("zod");
exports.createListingSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5, 'Title must be at least 5 characters').max(100),
        description: zod_1.z.string().min(20, 'Description must be at least 20 characters'),
        price: zod_1.z.number().positive('Price must be positive'),
        address: zod_1.z.string().min(5, 'Address is required'),
        city: zod_1.z.string().min(2, 'City is required'),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional(),
        bedrooms: zod_1.z.number().int().positive().optional(),
        bathrooms: zod_1.z.number().positive().optional(),
        area: zod_1.z.number().positive().optional(),
        amenities: zod_1.z.array(zod_1.z.string()).optional(),
        houseType: zod_1.z.enum(['APARTMENT', 'VILLA', 'CONDO', 'STUDIO', 'HOUSE']),
    })
});
//# sourceMappingURL=listing.validation.js.map