import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/user';
import { ApiResponse } from '@/types/api';
import toast from 'react-hot-toast';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data) {
        setAuth(data.data.user, data.data.accessToken);
        toast.success(`Welcome back, ${data.data.user.firstName}!`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to login');
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data) {
        setAuth(data.data.user, data.data.accessToken);
        toast.success(`Welcome to House Rent Ethiopia, ${data.data.user.firstName}!`);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register');
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if API fails, clear local state
      logout();
      queryClient.clear();
    },
  });
};
