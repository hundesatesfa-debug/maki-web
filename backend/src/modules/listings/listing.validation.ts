import { z } from 'zod';

export const createListingSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(100),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.number().positive('Price must be positive'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    bedrooms: z.number().int().positive().optional(),
    bathrooms: z.number().positive().optional(),
    area: z.number().positive().optional(),
    amenities: z.array(z.string()).optional(),
    houseType: z.enum(['APARTMENT', 'VILLA', 'CONDO', 'STUDIO', 'HOUSE']),
  })
});

export type CreateListingInput = z.infer<typeof createListingSchema>['body'];
