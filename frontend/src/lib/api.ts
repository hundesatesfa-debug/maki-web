import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * MAKI API Client
 * Comprehensive API integration for all Phase 2 features
 */

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ============================================
  // AUTHENTICATION
  // ============================================

  auth = {
    register: (data: any) => this.client.post('/auth/register', data),
    login: (data: any) => this.client.post('/auth/login', data),
    logout: () => this.client.post('/auth/logout'),
    refresh: () => this.client.post('/auth/refresh'),
    forgotPassword: (email: string) =>
      this.client.post('/auth/forgot-password', { email }),
    resetPassword: (data: any) => this.client.post('/auth/reset-password', data),
  };

  // ============================================
  // LISTINGS
  // ============================================

  listings = {
    getAll: (params?: any) => this.client.get('/listings', { params }),
    getById: (id: string) => this.client.get(`/listings/${id}`),
    getMyListings: () => this.client.get('/listings/me/listings'),
    create: (data: FormData) =>
      this.client.post('/listings', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    update: (id: string, data: FormData) =>
      this.client.put(`/listings/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id: string) => this.client.delete(`/listings/${id}`),
    deleteImage: (listingId: string, imageId: string) =>
      this.client.delete(`/listings/${listingId}/images/${imageId}`),
  };

  // ============================================
  // BOOKINGS
  // ============================================

  bookings = {
    create: (data: any) => this.client.post('/bookings', data),
    getAll: (params?: any) => this.client.get('/bookings', { params }),
    getById: (id: string) => this.client.get(`/bookings/${id}`),
    accept: (id: string) => this.client.put(`/bookings/${id}/accept`, { bookingId: id }),
    decline: (id: string, reason?: string) =>
      this.client.put(`/bookings/${id}/decline`, { bookingId: id, reason }),
    counterOffer: (id: string, data: any) =>
      this.client.put(`/bookings/${id}/counter-offer`, { bookingId: id, ...data }),
    cancel: (id: string, reason?: string) =>
      this.client.put(`/bookings/${id}/cancel`, { bookingId: id, reason }),
  };

  // ============================================
  // PAYMENTS
  // ============================================

  payments = {
    initiate: (data: any) => this.client.post('/payments/initiate', data),
    confirm: (data: any) => this.client.post('/payments/confirm', data),
    getById: (id: string) => this.client.get(`/payments/${id}`),
    listAll: (params?: any) => this.client.get('/payments', { params }),
    refund: (id: string, data: any) =>
      this.client.post(`/payments/${id}/refund`, data),
    downloadInvoice: (invoiceId: string) =>
      this.client.get(`/payments/invoices/${invoiceId}/download`),
  };

  // ============================================
  // REVIEWS
  // ============================================

  reviews = {
    submit: (data: any) => this.client.post('/reviews', data),
    getPropertyReviews: (propertyId: string, params?: any) =>
      this.client.get(`/reviews/property/${propertyId}`, { params }),
    getUserReviews: (userId: string, params?: any) =>
      this.client.get(`/reviews/user/${userId}`, { params }),
    moderate: (id: string, data: any) =>
      this.client.put(`/reviews/${id}/moderate`, data),
    getModerationQueue: (params?: any) =>
      this.client.get('/reviews/admin/moderation-queue', { params }),
  };

  // ============================================
  // NOTIFICATIONS
  // ============================================

  notifications = {
    getAll: (params?: any) => this.client.get('/notifications', { params }),
    getUnreadCount: () => this.client.get('/notifications/unread-count'),
    markAsRead: (id: string) => this.client.put(`/notifications/${id}/read`),
    markAllAsRead: () => this.client.put('/notifications/mark-all-as-read'),
    delete: (id: string) => this.client.delete(`/notifications/${id}`),
    getPreferences: () => this.client.get('/notifications/preferences'),
    updatePreferences: (channel: string, enabled: boolean) =>
      this.client.put('/notifications/preferences', { channel, enabled }),
  };

  // ============================================
  // ADMIN
  // ============================================

  admin = {
    getDashboard: () => this.client.get('/admin/dashboard'),
    listUsers: (params?: any) => this.client.get('/admin/users', { params }),
    verifyUser: (data: any) => this.client.put('/admin/users/verify', data),
    suspendUser: (userId: string, data: any) =>
      this.client.put(`/admin/users/${userId}/suspend`, data),
    approveListing: (data: any) =>
      this.client.put('/admin/listings/approve', data),
    rejectListing: (data: any) =>
      this.client.put('/admin/listings/reject', data),
    listDisputes: (params?: any) =>
      this.client.get('/admin/disputes', { params }),
    resolveDispute: (disputeId: string, data: any) =>
      this.client.put(`/admin/disputes/${disputeId}/resolve`, data),
    getAdminLogs: (params?: any) =>
      this.client.get('/admin/logs', { params }),
    getTransactionLogs: (params?: any) =>
      this.client.get('/admin/transaction-logs', { params }),
  };

  // ============================================
  // MESSAGES
  // ============================================

  messages = {
    getConversations: () => this.client.get('/messages/conversations'),
    getMessages: (conversationId: string, params?: any) =>
      this.client.get(`/messages/conversations/${conversationId}/messages`, { params }),
    sendMessage: (conversationId: string, data: any) =>
      this.client.post(`/messages/conversations/${conversationId}/messages`, data),
    markAsRead: (messageId: string) =>
      this.client.put(`/messages/${messageId}/read`),
  };
}

export const api = new APIClient();
export default api;
