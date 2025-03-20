import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Define validation schema
const supplierSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .regex(/^[+\d\s-()]*$/, 'Please enter a valid phone number'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
  taxId: z.string().optional(),
  paymentTerms: z.string(),
  categories: z.array(z.string()).min(1, 'Please select at least one category'),
  leadTime: z.coerce.number().min(1, 'Lead time must be at least 1 day'),
  minimumOrderQuantity: z.coerce.number().min(1, 'Minimum order quantity must be at least 1'),
  isActive: z.boolean().default(true),
});

const SupplierForm = ({ initialData, onSubmit, isSubmitting, onCancel }) => {
  // Payment terms options
  const paymentTermsOptions = [
    { value: 'advance', label: 'Advance Payment' },
    { value: 'cod', label: 'Cash on Delivery' },
    { value: 'net15', label: 'Net 15 Days' },
    { value: 'net30', label: 'Net 30 Days' },
    { value: 'net60', label: 'Net 60 Days' },
  ];
  
  // Category options
  const categoryOptions = [
    { value: 'dairy', label: 'Dairy' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'meat', label: 'Meat' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'frozen', label: 'Frozen' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'household', label: 'Household' },
    { value: 'personal', label: 'Personal' },
    { value: 'other', label: 'Other' },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: initialData || {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      taxId: '',
      paymentTerms: 'net30',
      categories: [],
      leadTime: 3,
      minimumOrderQuantity: 1,
      isActive: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-6 md:col-span-2">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supplier Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name <span className="text-danger-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                className={`input w-full ${errors.name ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                placeholder="Enter supplier name"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person <span className="text-danger-500">*</span>
              </label>
              <input
                id="contactPerson"
                type="text"
                className={`input w-full ${errors.contactPerson ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                placeholder="Enter contact person name"
                {...register('contactPerson')}
              />
              {errors.contactPerson && (
                <p className="mt-1 text-sm text-danger-600">{errors.contactPerson.message}</p>
              )}
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
                placeholder="Enter email address"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-danger-500">*</span>
              </label>
              <input
                id="phone"
                type="text"
                className={`input w-full ${errors.phone ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                placeholder="Enter phone number"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-danger-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Address Information</h2>
          
          <div className="space-y-4">
            {/* Street */}
            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                id="address.street"
                type="text"
                className="input w-full"
                placeholder="Enter street address"
                {...register('address.street')}
              />
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="address.city"
                  type="text"
                  className="input w-full"
                  placeholder="Enter city"
                  {...register('address.city')}
                />
              </div>
              <div>
                <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  id="address.state"
                  type="text"
                  className="input w-full"
                  placeholder="Enter state/province"
                  {...register('address.state')}
                />
              </div>
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  id="address.postalCode"
                  type="text"
                  className="input w-full"
                  placeholder="Enter postal code"
                  {...register('address.postalCode')}
                />
              </div>
              <div>
                <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="address.country"
                  type="text"
                  className="input w-full"
                  placeholder="Enter country"
                  {...register('address.country')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Business Information</h2>
          
          <div className="space-y-4">
            {/* Tax ID */}
            <div>
              <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
                Tax ID / NTN
              </label>
              <input
                id="taxId"
                type="text"
                className="input w-full"
                placeholder="Enter tax ID/NTN"
                {...register('taxId')}
              />
            </div>

            {/* Payment Terms */}
            <div>
              <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms <span className="text-danger-500">*</span>
              </label>
              <select
                id="paymentTerms"
                className={`input w-full ${errors.paymentTerms ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                {...register('paymentTerms')}
              >
                {paymentTermsOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.paymentTerms && (
                <p className="mt-1 text-sm text-danger-600">{errors.paymentTerms.message}</p>
              )}
            </div>

            {/* Lead Time */}
            <div>
              <label htmlFor="leadTime" className="block text-sm font-medium text-gray-700 mb-1">
                Lead Time (Days) <span className="text-danger-500">*</span>
              </label>
              <input
                id="leadTime"
                type="number"
                className={`input w-full ${errors.leadTime ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                min="1"
                placeholder="Enter lead time in days"
                {...register('leadTime')}
              />
              {errors.leadTime && (
                <p className="mt-1 text-sm text-danger-600">{errors.leadTime.message}</p>
              )}
            </div>

            {/* Minimum Order Quantity */}
            <div>
              <label htmlFor="minimumOrderQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Quantity <span className="text-danger-500">*</span>
              </label>
              <input
                id="minimumOrderQuantity"
                type="number"
                className={`input w-full ${errors.minimumOrderQuantity ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                min="1"
                placeholder="Enter minimum order quantity"
                {...register('minimumOrderQuantity')}
              />
              {errors.minimumOrderQuantity && (
                <p className="mt-1 text-sm text-danger-600">{errors.minimumOrderQuantity.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Product Categories</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories <span className="text-danger-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">Select all categories that this supplier provides</p>
            
            <Controller
              control={control}
              name="categories"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((category) => (
                    <div key={category.value} className="flex items-center">
                      <input
                        id={`category-${category.value}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        value={category.value}
                        checked={field.value.includes(category.value)}
                        onChange={(e) => {
                          const value = category.value;
                          if (e.target.checked) {
                            field.onChange([...field.value, value]);
                          } else {
                            field.onChange(field.value.filter((val) => val !== value));
                          }
                        }}
                      />
                      <label htmlFor={`category-${category.value}`} className="ml-2 text-sm text-gray-700">
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.categories && (
              <p className="mt-2 text-sm text-danger-600">{errors.categories.message}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center mt-4">
            <input
              id="isActive"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('isActive')}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Supplier is active
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-default px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary px-4 py-2 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><LoadingSpinner size="small" /> <span className="ml-2">Saving...</span></>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Save Supplier</>
          )}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;