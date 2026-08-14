import { CreateListingInput } from './listing.validation';
export declare const ListingService: {
    getAll(query: {
        city?: string;
        houseType?: string;
        minPrice?: number;
        maxPrice?: number;
        bedrooms?: number;
    }): Promise<({
        owner: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profilePicture: string | null;
        };
        images: {
            url: string;
            id: string;
            createdAt: Date;
            order: number;
            publicId: string;
            listingId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string | null;
        houseType: string;
        ownerId: string;
        imageUrls: string;
        isPremium: boolean;
        availableFrom: Date | null;
        availableTo: Date | null;
        minStay: number;
        averageRating: number;
        cancellationPolicy: string;
    })[]>;
    getById(id: string): Promise<{
        owner: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profilePicture: string | null;
        };
        images: {
            url: string;
            id: string;
            createdAt: Date;
            order: number;
            publicId: string;
            listingId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string | null;
        houseType: string;
        ownerId: string;
        imageUrls: string;
        isPremium: boolean;
        availableFrom: Date | null;
        availableTo: Date | null;
        minStay: number;
        averageRating: number;
        cancellationPolicy: string;
    }>;
    create(ownerId: string, data: CreateListingInput, files?: Express.Multer.File[]): Promise<{
        owner: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profilePicture: string | null;
        };
        images: {
            url: string;
            id: string;
            createdAt: Date;
            order: number;
            publicId: string;
            listingId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string | null;
        houseType: string;
        ownerId: string;
        imageUrls: string;
        isPremium: boolean;
        availableFrom: Date | null;
        availableTo: Date | null;
        minStay: number;
        averageRating: number;
        cancellationPolicy: string;
    }>;
    getByOwnerId(ownerId: string): Promise<({
        owner: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profilePicture: string | null;
        };
        images: {
            url: string;
            id: string;
            createdAt: Date;
            order: number;
            publicId: string;
            listingId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string | null;
        houseType: string;
        ownerId: string;
        imageUrls: string;
        isPremium: boolean;
        availableFrom: Date | null;
        availableTo: Date | null;
        minStay: number;
        averageRating: number;
        cancellationPolicy: string;
    })[]>;
    updateListing(id: string, ownerId: string, data: Partial<CreateListingInput>, files?: Express.Multer.File[]): Promise<{
        owner: {
            id: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            profilePicture: string | null;
        };
        images: {
            url: string;
            id: string;
            createdAt: Date;
            order: number;
            publicId: string;
            listingId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string | null;
        houseType: string;
        ownerId: string;
        imageUrls: string;
        isPremium: boolean;
        availableFrom: Date | null;
        availableTo: Date | null;
        minStay: number;
        averageRating: number;
        cancellationPolicy: string;
    }>;
    deleteListing(id: string, ownerId: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        price: number;
        address: string;
        city: string;
        latitude: number;
        longitude: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string | null;
        houseType: string;
        ownerId: string;
        imageUrls: string;
        isPremium: boolean;
        availableFrom: Date | null;
        availableTo: Date | null;
        minStay: number;
        averageRating: number;
        cancellationPolicy: string;
    }>;
    deleteImage(imageId: string, listingId: string, ownerId: string): Promise<{
        url: string;
        id: string;
        createdAt: Date;
        order: number;
        publicId: string;
        listingId: string;
    }>;
};
//# sourceMappingURL=listing.service.d.ts.map