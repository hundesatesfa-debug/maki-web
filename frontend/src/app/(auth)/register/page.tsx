'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home } from 'lucide-react';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain upper, lower, number, and special character'
    ),
  confirmPassword: z.string(),
  role: z.enum(['OWNER', 'RENTER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'RENTER',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const { confirmPassword, ...submitData } = data;
      await registerMutation.mutateAsync(submitData);
      router.push(ROUTES.HOME);
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  return (
    <>
      <div className="mb-8 text-center lg:text-left">
        <Link href={ROUTES.HOME} className="flex items-center justify-center lg:justify-start gap-2 text-primary font-bold text-2xl mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold text-xl shadow-lg">
            M
          </div>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-black tracking-tight">MAKI</span>
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="font-medium text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>

      <Tabs defaultValue="RENTER" className="w-full mb-6" onValueChange={(v) => setValue('role', v as 'RENTER' | 'OWNER')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="RENTER">I'm a Renter</TabsTrigger>
          <TabsTrigger value="OWNER">I'm an Owner</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+251..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating account...' : `Sign up as ${role === 'OWNER' ? 'Owner' : 'Renter'}`}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
