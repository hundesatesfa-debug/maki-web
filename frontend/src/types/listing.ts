export type HouseType = 'APARTMENT' | 'VILLA' | 'CONDO' | 'STUDIO' | 'HOUSE';
export type ListingStatus = 'AVAILABLE' | 'RENTED' | 'UNAVAILABLE';

export interface ListingImage {
  id: string;
  url: string;
  publicId: string;
  order: number;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  houseType: HouseType;
  status: ListingStatus;
  isPremium: boolean;
  images: ListingImage[];
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  isFavorited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  houseType: HouseType;
}

export interface ListingFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  houseType?: HouseType;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}
