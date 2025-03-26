import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { Save, AlertCircle, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Define validation schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SecuritySettings = () => {
  const { updatePassword } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      setSuccessMessage('Password updated successfully!');

      // Reset form
      reset();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  const onSubmit = async (data) => {
    updatePasswordMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-6">Security Settings</h2>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-success-400 dark:text-success-300" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-success-800 dark:text-success-200">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {updatePasswordMutation.isError && (
        <div className="mb-6 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400 dark:text-danger-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">Error updating password</h3>
              <div className="mt-2 text-sm text-danger-700 dark:text-danger-300">
                <p>{updatePasswordMutation.error?.message || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheck className="h-5 w-5 text-primary-400 dark:text-primary-300" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-primary-800 dark:text-primary-200">Password Security</h3>
            <div className="mt-2 text-sm text-primary-700 dark:text-primary-300">
              <p>
                Your password should be at least 6 characters long and contain at least one
                uppercase letter, one lowercase letter, one number, and one special character.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
            >
              Current Password <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                className={`input w-full pr-10 dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary ${
                  errors.currentPassword ? 'border-danger-500 focus-visible:ring-danger-500' : ''
                }`}
                placeholder="Enter your current password"
                {...register('currentPassword')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
              New Password <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                className={`input w-full pr-10 dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary ${
                  errors.newPassword ? 'border-danger-500 focus-visible:ring-danger-500' : ''
                }`}
                placeholder="Enter your new password"
                {...register('newPassword')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
            >
              Confirm New Password <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`input w-full pr-10 dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary ${
                  errors.confirmPassword ? 'border-danger-500 focus-visible:ring-danger-500' : ''
                }`}
                placeholder="Confirm your new password"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 flex items-center"
            disabled={updatePasswordMutation.isPending}
          >
            {updatePasswordMutation.isPending ? (
              <>
                <LoadingSpinner size="small" /> <span className="ml-2">Updating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
