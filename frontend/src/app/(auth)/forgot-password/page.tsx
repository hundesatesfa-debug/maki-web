'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/axios';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home } from 'lucide-react';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password', data);
      setIsSuccess(true);
      toast.success('Reset link sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-10 text-center lg:text-left">
        <Link href={ROUTES.HOME} className="flex items-center justify-center lg:justify-start gap-2 text-primary font-bold text-2xl mb-8">
          <Home className="w-8 h-8" />
          <span>House Rent Ethiopia</span>
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8">
        {isSuccess ? (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <h3 className="text-sm font-medium text-green-800">Check your email</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>We've sent a password reset link to your email address. Please check your inbox and spam folder.</p>
            </div>
            <div className="mt-6">
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline" className="w-full">Return to login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending link...' : 'Send reset link'}
              </Button>
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" className="w-full" type="button">
                  Back to login
                </Button>
              </Link>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
