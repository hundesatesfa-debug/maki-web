export const APP_CONFIG = {
  name: 'House Rent Ethiopia',
  description: 'Find your perfect home in Ethiopia',
  url: 'https://houserentethiopia.com',
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  images: {
    maxFiles: 10,
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
  premium: {
    durationDays: 30,
  },
  currency: {
    code: 'ETB',
    symbol: 'Br',
    locale: 'en-ET',
  },
  houseTypes: [
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'CONDO', label: 'Condo' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'HOUSE', label: 'House' },
  ],
  cities: [
    'Addis Ababa',
    'Hawassa',
    'Bahir Dar',
    'Dire Dawa',
    'Adama',
    'Mekelle',
    'Gondar',
    'Jimma',
    'Harar',
    'Dessie',
  ],
} as const;
