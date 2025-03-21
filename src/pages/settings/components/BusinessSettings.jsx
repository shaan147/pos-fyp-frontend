import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, AlertCircle, Check, Building, Phone, Mail, MapPin } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Define validation schema
const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  taxId: z.string().optional().nullable(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[+\d\s-()]*$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  receiptFooter: z.string().optional().nullable(),
});

// Mock business settings data
const mockBusinessData = {
  name: 'My Retail Store',
  taxId: 'TAX-12345678',
  phone: '+92 300 1234567',
  email: 'info@myretailstore.com',
  address: {
    street: '123 Main Street',
    city: 'Karachi',
    state: 'Sindh',
    postalCode: '75000',
    country: 'Pakistan',
  },
  receiptFooter: 'Thank you for shopping with us!',
};

const BusinessSettings = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: mockBusinessData,
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Business data updated:', data);
      
      setSuccessMessage('Business settings updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to update business settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Business Information</h2>
      
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
      {error && (
        <div className="mb-6 bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">Error</h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Business Logo */}
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-lg bg-primary-100 flex items-center justify-center overflow-hidden">
              <Building size={32} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900">Business Logo</h3>
              <p className="text-sm text-gray-500 mb-2">
                This will be displayed on receipts and the POS interface.
              </p>
              <button
                type="button"
                className="btn btn-outline text-sm py-1"
              >
                Upload Logo
              </button>
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-danger-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`input w-full ${errors.name ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
              placeholder="Enter business name"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
            )}
          </div>

          {/* Tax ID */}
          <div>
            <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
              Tax ID / NTN
            </label>
            <input
              id="taxId"
              type="text"
              className={`input w-full ${errors.taxId ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
              placeholder="Enter tax ID or NTN"
              {...register('taxId')}
            />
            {errors.taxId && (
              <p className="mt-1 text-sm text-danger-600">{errors.taxId.message}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="text"
                  className={`input pl-10 w-full ${errors.phone ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                  placeholder="Enter phone number"
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-danger-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`input pl-10 w-full ${errors.email ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                  placeholder="Enter email address"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-danger-500">*</span>
            </label>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`input pl-10 w-full ${errors.address?.street ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                  placeholder="Street address"
                  {...register('address.street')}
                />
                {errors.address?.street && (
                  <p className="mt-1 text-sm text-danger-600">{errors.address.street.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    className={`input w-full ${errors.address?.city ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="City"
                    {...register('address.city')}
                  />
                  {errors.address?.city && (
                    <p className="mt-1 text-sm text-danger-600">{errors.address.city.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    className={`input w-full ${errors.address?.state ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="State/Province"
                    {...register('address.state')}
                  />
                  {errors.address?.state && (
                    <p className="mt-1 text-sm text-danger-600">{errors.address.state.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    className={`input w-full ${errors.address?.postalCode ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="Postal code"
                    {...register('address.postalCode')}
                  />
                  {errors.address?.postalCode && (
                    <p className="mt-1 text-sm text-danger-600">{errors.address.postalCode.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    className={`input w-full ${errors.address?.country ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="Country"
                    {...register('address.country')}
                  />
                  {errors.address?.country && (
                    <p className="mt-1 text-sm text-danger-600">{errors.address.country.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Footer */}
          <div>
            <label htmlFor="receiptFooter" className="block text-sm font-medium text-gray-700 mb-1">
              Receipt Footer Message
            </label>
            <textarea
              id="receiptFooter"
              rows={3}
              className={`input w-full ${errors.receiptFooter ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
              placeholder="Enter message to display at the bottom of receipts"
              {...register('receiptFooter')}
            />
            {errors.receiptFooter && (
              <p className="mt-1 text-sm text-danger-600">{errors.receiptFooter.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This message will appear at the bottom of all receipts
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 flex items-center"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? (
              <><LoadingSpinner size="small" /> <span className="ml-2">Saving...</span></>
            ) : (
              <><Save className="h-4 w-4 mr-2" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessSettings;