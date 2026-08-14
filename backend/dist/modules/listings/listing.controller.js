"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.deleteListing = exports.updateListing = exports.getMyListings = exports.createListing = exports.getById = exports.getAll = void 0;
const listing_service_1 = require("./listing.service");
const apiResponse_1 = require("../../utils/apiResponse");
const getAll = async (req, res, next) => {
    try {
        const { city, houseType, minPrice, maxPrice, bedrooms } = req.query;
        const listings = await listing_service_1.ListingService.getAll({
            city: city,
            houseType: houseType,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            bedrooms: bedrooms ? Number(bedrooms) : undefined,
        });
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Listings retrieved successfully', { listings });
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getById = async (req, res, next) => {
    try {
        const listing = await listing_service_1.ListingService.getById(req.params.id);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Listing retrieved successfully', { listing });
    }
    catch (error) {
        next(error);
    }
};
exports.getById = getById;
const createListing = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return (0, apiResponse_1.sendResponse)(res, 401, false, 'Not authenticated');
        }
        // Get files from multer
        const files = req.files;
        // Validate required fields
        const { title, description, price, address, city, bedrooms, bathrooms, houseType, latitude, longitude } = req.body;
        if (!title || !description || !price || !address || !city || !bedrooms || !bathrooms || !houseType) {
            return (0, apiResponse_1.sendResponse)(res, 400, false, 'Missing required fields');
        }
        const listing = await listing_service_1.ListingService.create(userId, {
            title,
            description,
            price: Number(price),
            address,
            city,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            houseType,
            latitude: Number(latitude) || 9.0320,
            longitude: Number(longitude) || 38.7469,
        }, files);
        (0, apiResponse_1.sendResponse)(res, 201, true, 'Listing created successfully', { listing });
    }
    catch (error) {
        next(error);
    }
};
exports.createListing = createListing;
const getMyListings = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return (0, apiResponse_1.sendResponse)(res, 401, false, 'Not authenticated');
        }
        const listings = await listing_service_1.ListingService.getByOwnerId(userId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'My listings retrieved successfully', { listings });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyListings = getMyListings;
const updateListing = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return (0, apiResponse_1.sendResponse)(res, 401, false, 'Not authenticated');
        }
        const { id } = req.params;
        const files = req.files;
        const listing = await listing_service_1.ListingService.updateListing(id, userId, req.body, files);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Listing updated successfully', { listing });
    }
    catch (error) {
        next(error);
    }
};
exports.updateListing = updateListing;
const deleteListing = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return (0, apiResponse_1.sendResponse)(res, 401, false, 'Not authenticated');
        }
        const { id } = req.params;
        await listing_service_1.ListingService.deleteListing(id, userId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Listing deleted successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.deleteListing = deleteListing;
const deleteImage = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return (0, apiResponse_1.sendResponse)(res, 401, false, 'Not authenticated');
        }
        const { listingId, imageId } = req.params;
        await listing_service_1.ListingService.deleteImage(imageId, listingId, userId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Image deleted successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.deleteImage = deleteImage;
//# sourceMappingURL=listing.controller.js.map