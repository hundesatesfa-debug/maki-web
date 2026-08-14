"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const apiError_1 = require("../../utils/apiError");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ownerSelect = {
    id: true,
    firstName: true,
    lastName: true,
    profilePicture: true,
    phone: true,
};
exports.ListingService = {
    async getAll(query) {
        const where = { status: 'AVAILABLE' };
        if (query.city)
            where.city = { contains: query.city };
        if (query.houseType)
            where.houseType = query.houseType;
        if (query.bedrooms)
            where.bedrooms = { gte: query.bedrooms };
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            where.price = {
                ...(query.minPrice !== undefined && { gte: query.minPrice }),
                ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
            };
        }
        return database_1.default.listing.findMany({
            where,
            include: {
                owner: { select: ownerSelect },
                images: { orderBy: { order: 'asc' } },
            },
            orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }],
        });
    },
    async getById(id) {
        const listing = await database_1.default.listing.findUnique({
            where: { id },
            include: {
                owner: { select: ownerSelect },
                images: { orderBy: { order: 'asc' } },
            },
        });
        if (!listing) {
            throw apiError_1.ApiError.notFound('Listing not found');
        }
        return listing;
    },
    async create(ownerId, data, files) {
        const listing = await database_1.default.listing.create({
            data: {
                ownerId,
                title: data.title,
                description: data.description,
                price: data.price,
                address: data.address,
                city: data.city,
                latitude: data.latitude ?? 0,
                longitude: data.longitude ?? 0,
                bedrooms: data.bedrooms ?? 1,
                bathrooms: data.bathrooms ?? 1,
                houseType: data.houseType,
                amenities: data.amenities ? JSON.stringify(data.amenities) : '[]',
            },
            include: {
                owner: { select: ownerSelect },
                images: true,
            },
        });
        // Save images if provided
        if (files && files.length > 0) {
            const images = await Promise.all(files.map((file, index) => database_1.default.listingImage.create({
                data: {
                    listingId: listing.id,
                    url: `/uploads/${file.filename}`,
                    publicId: file.filename,
                    order: index,
                },
            })));
            return {
                ...listing,
                images,
            };
        }
        return listing;
    },
    async getByOwnerId(ownerId) {
        return database_1.default.listing.findMany({
            where: { ownerId },
            include: {
                owner: { select: ownerSelect },
                images: { orderBy: { order: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    async updateListing(id, ownerId, data, files) {
        // Check if listing belongs to owner
        const listing = await database_1.default.listing.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!listing) {
            throw apiError_1.ApiError.notFound('Listing not found');
        }
        if (listing.ownerId !== ownerId) {
            throw apiError_1.ApiError.forbidden('You do not have permission to update this listing');
        }
        // Update listing
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.price !== undefined)
            updateData.price = data.price;
        if (data.address !== undefined)
            updateData.address = data.address;
        if (data.city !== undefined)
            updateData.city = data.city;
        if (data.latitude !== undefined)
            updateData.latitude = data.latitude;
        if (data.longitude !== undefined)
            updateData.longitude = data.longitude;
        if (data.bedrooms !== undefined)
            updateData.bedrooms = data.bedrooms;
        if (data.bathrooms !== undefined)
            updateData.bathrooms = data.bathrooms;
        if (data.houseType !== undefined)
            updateData.houseType = data.houseType;
        if (data.amenities !== undefined)
            updateData.amenities = JSON.stringify(data.amenities);
        const updated = await database_1.default.listing.update({
            where: { id },
            data: updateData,
            include: {
                owner: { select: ownerSelect },
                images: { orderBy: { order: 'asc' } },
            },
        });
        // Add new images if provided
        if (files && files.length > 0) {
            const newImages = await Promise.all(files.map((file, index) => database_1.default.listingImage.create({
                data: {
                    listingId: id,
                    url: `/uploads/${file.filename}`,
                    publicId: file.filename,
                    order: (listing.images?.length || 0) + index,
                },
            })));
            updated.images = [...(updated.images || []), ...newImages];
        }
        return updated;
    },
    async deleteListing(id, ownerId) {
        // Check if listing belongs to owner
        const listing = await database_1.default.listing.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!listing) {
            throw apiError_1.ApiError.notFound('Listing not found');
        }
        if (listing.ownerId !== ownerId) {
            throw apiError_1.ApiError.forbidden('You do not have permission to delete this listing');
        }
        // Delete associated image files from disk
        if (listing.images && listing.images.length > 0) {
            listing.images.forEach(image => {
                const filePath = path_1.default.join(__dirname, `../../../uploads/${image.publicId}`);
                if (fs_1.default.existsSync(filePath)) {
                    try {
                        fs_1.default.unlinkSync(filePath);
                    }
                    catch (err) {
                        console.error(`Failed to delete file: ${filePath}`, err);
                    }
                }
            });
        }
        // Delete from database (cascade will handle images)
        return database_1.default.listing.delete({
            where: { id },
        });
    },
    async deleteImage(imageId, listingId, ownerId) {
        // Verify ownership
        const listing = await database_1.default.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) {
            throw apiError_1.ApiError.notFound('Listing not found');
        }
        if (listing.ownerId !== ownerId) {
            throw apiError_1.ApiError.forbidden('You do not have permission to modify this listing');
        }
        const image = await database_1.default.listingImage.findUnique({
            where: { id: imageId },
        });
        if (!image) {
            throw apiError_1.ApiError.notFound('Image not found');
        }
        // Delete file from disk
        const filePath = path_1.default.join(__dirname, `../../../uploads/${image.publicId}`);
        if (fs_1.default.existsSync(filePath)) {
            try {
                fs_1.default.unlinkSync(filePath);
            }
            catch (err) {
                console.error(`Failed to delete file: ${filePath}`, err);
            }
        }
        // Delete from database
        return database_1.default.listingImage.delete({
            where: { id: imageId },
        });
    },
};
//# sourceMappingURL=listing.service.js.map