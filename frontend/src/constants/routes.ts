export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Main
  HOME: '/',
  LISTINGS: '/listings',
  LISTING_DETAIL: (id: string) => `/listings/${id}`,

  // User
  PROFILE: '/profile',
  MY_LISTINGS: '/my-listings',
  CREATE_LISTING: '/my-listings/new',
  EDIT_LISTING: (id: string) => `/my-listings/${id}/edit`,

  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: (id: string) => `/bookings/${id}`,

  // Payments
  PAYMENTS: '/payments',
  CHECKOUT: '/checkout',

  // Messages
  CHAT: '/chat',
  MESSAGES: '/messages',

  // Favorites
  FAVORITES: '/favorites',

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_LISTINGS: '/admin/listings',
  ADMIN_DISPUTES: '/admin/disputes',
  ADMIN_KYC: '/admin/kyc',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_REPORTS: '/admin/reports',
} as const;
