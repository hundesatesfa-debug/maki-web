'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

/**
 * usePayment Hook
 * Manages payment flow and state
 */
export const usePayment = () => {
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Initiate payment
  const initiatePaymentMutation = useMutation({
    mutationFn: (data: {
      bookingId: string;
      amount: number;
      currency: string;
      paymentGateway: string;
      paymentType?: string;
    }) => api.payments.initiate(data),
    onSuccess: (response: any) => {
      const paymentResult = response.data.data.paymentResult;
      setClientSecret(paymentResult.metadata?.clientSecret);

      if (paymentResult.redirectUrl) {
        // Redirect to payment gateway
        window.location.href = paymentResult.redirectUrl;
      }

      toast.success('Payment initiated. Redirecting...');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to initiate payment'
      );
    },
  });

  // Confirm payment
  const confirmPaymentMutation = useMutation({
    mutationFn: (data: { transactionId: string; bookingId: string }) =>
      api.payments.confirm(data),
    onSuccess: () => {
      toast.success('Payment confirmed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to confirm payment');
    },
  });

  // Get payment status
  const getPaymentQuery = (paymentId: string) =>
    useQuery({
      queryKey: ['payment', paymentId],
      queryFn: () => api.payments.getById(paymentId),
      refetchInterval: 3000, // Poll every 3 seconds
    });

  // List user payments
  const listPaymentsQuery = (filters?: any) =>
    useQuery({
      queryKey: ['payments', filters],
      queryFn: () => api.payments.listAll(filters),
    });

  // Download invoice
  const downloadInvoiceMutation = useMutation({
    mutationFn: (invoiceId: string) => api.payments.downloadInvoice(invoiceId),
    onSuccess: (response: any) => {
      toast.success('Invoice downloaded');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to download invoice');
    },
  });

  return {
    selectedGateway,
    setSelectedGateway,
    clientSecret,
    initiatePaymentMutation,
    confirmPaymentMutation,
    getPaymentQuery,
    listPaymentsQuery,
    downloadInvoiceMutation,
  };
};

export default usePayment;
