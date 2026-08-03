'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

/**
 * useBooking Hook
 * Manages booking requests, confirmations, and status updates
 */
export const useBooking = () => {
  const queryClient = useQueryClient();

  // Create booking
  const createBookingMutation = useMutation({
    mutationFn: (data: {
      propertyId: string;
      moveInDate: string;
      durationMonths: number;
      monthlyRent: number;
      depositAmount: number;
      message?: string;
    }) => api.bookings.create(data),
    onSuccess: (response: any) => {
      toast.success('Booking request sent!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    },
  });

  // Accept booking
  const acceptBookingMutation = useMutation({
    mutationFn: (bookingId: string) => api.bookings.accept(bookingId),
    onSuccess: () => {
      toast.success('Booking accepted!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to accept booking');
    },
  });

  // Decline booking
  const declineBookingMutation = useMutation({
    mutationFn: (data: { bookingId: string; reason?: string }) =>
      api.bookings.decline(data.bookingId, data.reason),
    onSuccess: () => {
      toast.success('Booking declined');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to decline booking');
    },
  });

  // Counter offer
  const counterOfferMutation = useMutation({
    mutationFn: (data: { bookingId: string; [key: string]: any }) =>
      api.bookings.counterOffer(data.bookingId, data),
    onSuccess: () => {
      toast.success('Counter offer sent!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send counter offer');
    },
  });

  // Cancel booking
  const cancelBookingMutation = useMutation({
    mutationFn: (data: { bookingId: string; reason?: string }) =>
      api.bookings.cancel(data.bookingId, data.reason),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  // Get booking details
  const getBookingQuery = (bookingId: string) =>
    useQuery({
      queryKey: ['booking', bookingId],
      queryFn: () => api.bookings.getById(bookingId),
    });

  // List user bookings
  const listBookingsQuery = (filters?: any) =>
    useQuery({
      queryKey: ['bookings', filters],
      queryFn: () => api.bookings.getAll(filters),
    });

  return {
    createBookingMutation,
    acceptBookingMutation,
    declineBookingMutation,
    counterOfferMutation,
    cancelBookingMutation,
    getBookingQuery,
    listBookingsQuery,
  };
};

export default useBooking;
