'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface CreateBookingData {
  propertyId: string;
  moveInDate: string;
  durationMonths: number;
  monthlyRent: number;
  depositAmount: number;
  message?: string;
}

interface CounterOfferData {
  bookingId: string;
  [key: string]: unknown;
}

const getErrorMessage = (error: unknown) =>
  (error as { response?: { data?: { message?: string } } }).response?.data?.message;

export const useBooking = (filters?: Record<string, unknown>) => {
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => api.bookings.getAll(filters),
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: CreateBookingData) => api.bookings.create(data),
    onSuccess: () => {
      toast.success('Booking request sent!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to create booking');
    },
  });

  const acceptBookingMutation = useMutation({
    mutationFn: (bookingId: string) => api.bookings.accept(bookingId),
    onSuccess: () => {
      toast.success('Booking accepted!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to accept booking');
    },
  });

  const declineBookingMutation = useMutation({
    mutationFn: (data: { bookingId: string; reason?: string }) =>
      api.bookings.decline(data.bookingId, data.reason),
    onSuccess: () => {
      toast.success('Booking declined');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to decline booking');
    },
  });

  const counterOfferMutation = useMutation({
    mutationFn: (data: CounterOfferData) => api.bookings.counterOffer(data.bookingId, data),
    onSuccess: () => {
      toast.success('Counter offer sent!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to send counter offer');
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: (data: { bookingId: string; reason?: string }) =>
      api.bookings.cancel(data.bookingId, data.reason),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error) || 'Failed to cancel booking');
    },
  });

  return {
    bookings: bookingsQuery.data?.data?.bookings ?? [],
    isLoading: bookingsQuery.isLoading,
    error: bookingsQuery.error
      ? getErrorMessage(bookingsQuery.error) || 'Failed to load bookings'
      : null,
    createBooking: (data: CreateBookingData) => createBookingMutation.mutateAsync(data),
    acceptBooking: (bookingId: string) => acceptBookingMutation.mutateAsync(bookingId),
    declineBooking: (bookingId: string, reason?: string) =>
      declineBookingMutation.mutateAsync({ bookingId, reason }),
    counterOffer: (data: CounterOfferData) => counterOfferMutation.mutateAsync(data),
    cancelBooking: (data: { bookingId: string; reason?: string }) =>
      cancelBookingMutation.mutateAsync(data),
  };
};

export default useBooking;
