import prisma from '../../config/database';
import { ApiError } from '../../utils/apiError';
import { CreateListingInput } from './listing.validation';
import fs from 'fs';
import path from 'path';

const ownerSelect = {
  id: true,
  firstName: true,
  lastName: true,
  profilePicture: true,
  phone: true,
} as const;

export const ListingService = {
  async getAll(query: {
    city?: string;
    houseType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
  }) {
    const where: Record<string, unknown> = { status: 'AVAILABLE' };

    if (query.city) where.city = { contains: query.city };
    if (query.houseType) where.houseType = query.houseType;
    if (query.bedrooms) where.bedrooms = { gte: query.bedrooms };
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        ...(query.minPrice !== undefined && { gte: query.minPrice }),
        ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
      };
    }

    return prisma.listing.findMany({
      where,
      include: {
        owner: { select: ownerSelect },
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async getById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        owner: { select: ownerSelect },
        images: { orderBy: { order: 'asc' } },
      },
    });

    if (!listing) {
      throw ApiError.notFound('Listing not found');
    }

    return listing;
  },

  async create(ownerId: string, data: CreateListingInput, files?: Express.Multer.File[]) {
    const listing = await prisma.listing.create({
      data: {
        ownerId,
        ...data,
      },
      include: {
        owner: { select: ownerSelect },
        images: true,
      },
    });

    // Save images if provided
    if (files && files.length > 0) {
      const images = await Promise.all(
        files.map((file, index) =>
          prisma.listingImage.create({
            data: {
              listingId: listing.id,
              url: `/uploads/${file.filename}`,
              publicId: file.filename,
              order: index,
            },
          })
        )
      );

      return {
        ...listing,
        images,
      };
    }

    return listing;
  },

  async getByOwnerId(ownerId: string) {
    return prisma.listing.findMany({
      where: { ownerId },
      include: {
        owner: { select: ownerSelect },
        images: { orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateListing(id: string, ownerId: string, data: Partial<CreateListingInput>, files?: Express.Multer.File[]) {
    // Check if listing belongs to owner
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!listing) {
      throw ApiError.notFound('Listing not found');
    }

    if (listing.ownerId !== ownerId) {
      throw ApiError.forbidden('You do not have permission to update this listing');
    }

    // Update listing
    const updated = await prisma.listing.update({
      where: { id },
      data,
      include: {
        owner: { select: ownerSelect },
        images: { orderBy: { order: 'asc' } },
      },
    });

    // Add new images if provided
    if (files && files.length > 0) {
      const newImages = await Promise.all(
        files.map((file, index) =>
          prisma.listingImage.create({
            data: {
              listingId: id,
              url: `/uploads/${file.filename}`,
              publicId: file.filename,
              order: (listing.images?.length || 0) + index,
            },
          })
        )
      );

      updated.images = [...(updated.images || []), ...newImages];
    }

    return updated;
  },

  async deleteListing(id: string, ownerId: string) {
    // Check if listing belongs to owner
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!listing) {
      throw ApiError.notFound('Listing not found');
    }

    if (listing.ownerId !== ownerId) {
      throw ApiError.forbidden('You do not have permission to delete this listing');
    }

    // Delete associated image files from disk
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach(image => {
        const filePath = path.join(__dirname, `../../uploads/${image.publicId}`);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
          }
        }
      });
    }

    // Delete from database (cascade will handle images)
    return prisma.listing.delete({
      where: { id },
    });
  },

  async deleteImage(imageId: string, listingId: string, ownerId: string) {
    // Verify ownership
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw ApiError.notFound('Listing not found');
    }

    if (listing.ownerId !== ownerId) {
      throw ApiError.forbidden('You do not have permission to modify this listing');
    }

    const image = await prisma.listingImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw ApiError.notFound('Image not found');
    }

    // Delete file from disk
    const filePath = path.join(__dirname, `../../uploads/${image.publicId}`);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    }

    // Delete from database
    return prisma.listingImage.delete({
      where: { id: imageId },
    });
  },
};
