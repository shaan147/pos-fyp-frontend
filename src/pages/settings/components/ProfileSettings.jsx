import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@hooks/useAuth';
import { Save, User, AlertCircle, Check } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Define validation schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[+\d\s-()]*$/, 'Please enter a valid phone number')
    .optional()
    .nullable(),
});

const ProfileSettings = ({ user }) => {
  const { updateProfile } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  const onSubmit = async (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-success-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-success-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {updateProfileMutation.isError && (
        <div className="mb-6 bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">Error updating profile</h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>{updateProfileMutation.error?.message || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Profile picture */}
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              {user?.name ? (
                <span className="text-3xl font-semibold text-primary-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={32} className="text-primary-600" />
              )}
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500 mb-2">
                This will be displayed on your profile and throughout the app.
              </p>
              <button type="button" className="btn btn-outline text-sm py-1">
                Change
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-danger-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`input w-full ${errors.name ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
              placeholder="Enter your name"
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-danger-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`input w-full ${errors.email ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
              placeholder="Enter your email"
              {...register('email')}
            />
            {errors.email && <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              className={`input w-full ${errors.phone ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
              placeholder="Enter your phone number"
              {...register('phone')}
            />
            {errors.phone && <p className="mt-1 text-sm text-danger-600">{errors.phone.message}</p>}
          </div>

          {/* User Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="input w-full bg-gray-50 flex items-center">
              <span className="capitalize">{user?.role || 'User'}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your role determines what actions you can perform in the system.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 flex items-center"
            disabled={updateProfileMutation.isPending || !isDirty}
          >
            {updateProfileMutation.isPending ? (
              <>
                <LoadingSpinner size="small" /> <span className="ml-2">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
