import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Define validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');

    try {
      const result = await login(data);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">Sign in to your account to continue</p>
      </div>

      {loginError && (
        <div className="mb-4 p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 rounded-md flex items-center">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{loginError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`input w-full ${errors.email ? 'border-danger-500 focus-visible:ring-danger-500 dark:border-danger-500 dark:focus-visible:ring-danger-500' : ''}`}
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`input w-full pr-10 ${errors.password ? 'border-danger-500 focus-visible:ring-danger-500 dark:border-danger-500 dark:focus-visible:ring-danger-500' : ''}`}
              placeholder="Enter your password"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 dark:border-dark-border text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-dark-text-primary">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-primary w-full py-2 h-11"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Sign in'}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-dark-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;