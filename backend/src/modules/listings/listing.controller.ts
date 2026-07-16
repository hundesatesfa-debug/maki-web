import { Request, Response, NextFunction } from 'express';
import { ListingService } from './listing.service';
import { sendResponse } from '../../utils/apiResponse';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, houseType, minPrice, maxPrice, bedrooms } = req.query;

    const listings = await ListingService.getAll({
      city: city as string | undefined,
      houseType: houseType as string | undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
    });

    sendResponse(res, 200, true, 'Listings retrieved successfully', { listings });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await ListingService.getById(req.params.id);
    sendResponse(res, 200, true, 'Listing retrieved successfully', { listing });
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return sendResponse(res, 401, false, 'Not authenticated');
    }

    // Get files from multer
    const files = (req as any).files as Express.Multer.File[] | undefined;

    // Validate required fields
    const { title, description, price, address, city, bedrooms, bathrooms, houseType, latitude, longitude } = req.body;
    
    if (!title || !description || !price || !address || !city || !bedrooms || !bathrooms || !houseType) {
      return sendResponse(res, 400, false, 'Missing required fields');
    }

    const listing = await ListingService.create(
      userId,
      {
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
      },
      files
    );

    sendResponse(res, 201, true, 'Listing created successfully', { listing });
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return sendResponse(res, 401, false, 'Not authenticated');
    }

    const listings = await ListingService.getByOwnerId(userId);
    sendResponse(res, 200, true, 'My listings retrieved successfully', { listings });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return sendResponse(res, 401, false, 'Not authenticated');
    }

    const { id } = req.params;
    const files = (req as any).files as Express.Multer.File[] | undefined;

    const listing = await ListingService.updateListing(id, userId, req.body, files);
    sendResponse(res, 200, true, 'Listing updated successfully', { listing });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return sendResponse(res, 401, false, 'Not authenticated');
    }

    const { id } = req.params;
    await ListingService.deleteListing(id, userId);
    sendResponse(res, 200, true, 'Listing deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return sendResponse(res, 401, false, 'Not authenticated');
    }

    const { listingId, imageId } = req.params;
    await ListingService.deleteImage(imageId, listingId, userId);
    sendResponse(res, 200, true, 'Image deleted successfully');
  } catch (error) {
    next(error);
  }
};
