'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axios';

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch, 
  } = useForm();

  const watchPassword = useWatch({ control, name: 'password' });

  const sendOtp = async (email) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axiosInstance.post('/users/send-otp', { email });
      if (response.status === 200) {
        setOtpSent(true);
        setMessage('OTP sent successfully! Check your email.');
      }
    } catch (error) {
      setMessage('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axiosInstance.post('/users/verify-otp', {
        email: data.email,
        otp: data.otp,
      });
      if (response.status === 200) {
        setOtpVerified(true);
        setMessage('OTP verified! You can now reset your password.');
      }
    } catch (error) {
      setMessage('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!otpVerified) {
      setMessage('Please verify OTP before resetting your password.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axiosInstance.post('/users/reset-password', {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        setMessage('Password reset successfully! Redirecting...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error) {
      setMessage('Password reset failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginBackground min-h-screen w-full flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-black-800/90"></div>
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
            Reset your password securely
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email & Send OTP */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex  flex-row gap-2 items-center">
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
                  disabled={otpSent}
                />
                <Button
                  className="h-8 bg-primary text-white"
                  onClick={() => sendOtp(watch('email'))}
                  disabled={otpSent || loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send OTP'}
                </Button>
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* OTP & Verify OTP */}
            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    placeholder="123456"
                    {...register('otp', { required: 'OTP is required' })}
                    disabled={otpVerified}
                  />
                  <Button
                   className="h-8 bg-primary text-white"
                    onClick={handleSubmit(verifyOtp)}
                    disabled={otpVerified || loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify OTP'}
                  </Button>
                </div>
                {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
              </div>
            )}

            {/* New Password */}
            {otpVerified && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Must be at least 8 characters' },
                      })}
                    />
                    <Button
                      className="absolute right-2 top-2 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === watchPassword || 'Passwords do not match',
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </>
            )}

            {/* Submit */}
            {otpVerified && (
              <Button  className="h-8 bg-primary text-white" type="submit" variant="default" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}
              </Button>
            )}
          </form>

          {message && <p className="mt-4 text-center text-sm text-blue-600">{message}</p>}

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              className="text-blue-500 cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
