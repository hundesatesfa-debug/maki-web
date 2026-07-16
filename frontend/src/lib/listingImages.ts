import { HouseType } from '@/types/listing';

const HOUSE_TYPE_IMAGES: Record<HouseType, string> = {
  APARTMENT: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop',
  VILLA: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=500&fit=crop',
  CONDO: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop',
  STUDIO: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
  HOUSE: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop',
};

export function getListingImage(houseType: HouseType, url?: string | null) {
  return url || HOUSE_TYPE_IMAGES[houseType];
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatHouseType(type: string) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}
