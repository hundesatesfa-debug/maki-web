'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

/**
 * useReviews Hook
 * Manages review submission and fetching
 */
export const useReviews = () => {
  const queryClient = useQueryClient();

  // Submit review
  const submitReviewMutation = useMutation({
    mutationFn: (data: {
      bookingId: string;
      rating: number;
      text?: string;
      reviewType: string;
    }) => api.reviews.submit(data),
    onSuccess: (response: any) => {
      const message =
        response.data.data.status === 'PENDING_MODERATION'
          ? 'Review submitted and is pending moderation'
          : 'Review published successfully!';
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });

  // Get property reviews
  const getPropertyReviewsQuery = (propertyId: string, filters?: any) =>
    useQuery({
      queryKey: ['reviews', 'property', propertyId, filters],
      queryFn: () => api.reviews.getPropertyReviews(propertyId, filters),
    });

  // Get user reviews
  const getUserReviewsQuery = (userId: string, filters?: any) =>
    useQuery({
      queryKey: ['reviews', 'user', userId, filters],
      queryFn: () => api.reviews.getUserReviews(userId, filters),
    });

  // Get moderation queue (admin)
  const getModerationQueueQuery = (filters?: any) =>
    useQuery({
      queryKey: ['reviews', 'moderation-queue', filters],
      queryFn: () => api.reviews.getModerationQueue(filters),
    });

  // Moderate review (admin)
  const moderateReviewMutation = useMutation({
    mutationFn: (data: {
      reviewId: string;
      status: 'PUBLISHED' | 'REJECTED';
      moderationNotes?: string;
    }) => api.reviews.moderate(data.reviewId, data),
    onSuccess: () => {
      toast.success('Review moderated');
      queryClient.invalidateQueries({ queryKey: ['reviews', 'moderation-queue'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to moderate review');
    },
  });

  return {
    submitReviewMutation,
    getPropertyReviewsQuery,
    getUserReviewsQuery,
    getModerationQueueQuery,
    moderateReviewMutation,
  };
};

export default useReviews;
