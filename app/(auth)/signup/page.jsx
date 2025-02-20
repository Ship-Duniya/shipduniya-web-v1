'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const allFieldsFilled =
    watch('name') &&
    watch('email') &&
    watch('password') &&
    watch('confirmPassword') &&
    watch('mobile') &&
    isChecked;

  const onSubmit = async (data) => {
    const body = {...data, 'terms':isChecked}
    console.log({ body });
    try {
      const response = await axiosInstance.post('/users/register', body);

      if (response.status === 201) {
        alert('User registered successfully');
      }

      console.log('User registered successfully:', response.data);
      router.push('/login');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const downloadTerms = () =>{

  }

  return (
    <div className="loginBackground min-h-screen w-full flex items-center justify-center p-4 relative">
      <Card className="relative z-10 w-full max-w-md bg-white shadow-lg  p-6 rounded-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Ship className="h-6 w-6" />
            <CardTitle
              className="text-2xl font-bold cursor-pointer"
              onClick={() => router.push('/')}
            >
              Ship Duniya
            </CardTitle>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Create an account and start shipping smarter
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                placeholder="Choose a username"
                {...register('name', {
                  required: 'Username is required',
                  minLength: {
                    value: 4,
                    message: 'Username must be at least 4 characters',
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                {...register('mobile', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Invalid mobile number',
                  },
                })}
              />
              {errors.mobile && (
                <p className="text-sm text-red-500">{errors.mobile.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
                <Button
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  variant="ghost"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="w-4 h-4 cursor-pointer"
              />
              <Label htmlFor="terms" className="text-sm">
                I accept the{' '}
                <span onClick={downloadTerms} className="text-blue-800">
                  terms and conditions
                </span>
              </Label>
            </div>

            <Button  className="h-8 bg-primary text-white" type="submit" disabled={!allFieldsFilled}>
              Sign up
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-800 text-semibold">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
