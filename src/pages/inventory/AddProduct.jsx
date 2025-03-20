import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { productService } from '@services/productService';
import { supplierService } from '@services/supplierService';
import { ArrowLeft, Save, Truck, Package, AlertCircle, Check } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Define validation schema
const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  price: z.coerce.number().positive('Price must be positive'),
  costPrice: z.coerce.number().positive('Cost price must be positive'),
  stockQuantity: z.coerce.number().nonnegative('Stock quantity cannot be negative'),
  unit: z.string().min(1, 'Please select a unit'),
  minStockLevel: z.coerce.number().nonnegative('Minimum stock level cannot be negative'),
  supplier: z.string().min(1, 'Please select a supplier'),
  isActive: z.boolean().default(true),
});

const AddProduct = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      barcode: '',
      category: '',
      price: '',
      costPrice: '',
      stockQuantity: 0,
      unit: 'piece',
      minStockLevel: 10,
      supplier: '',
      isActive: true,
    },
  });

  // Fetch suppliers
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getAllSuppliers({ limit: 100 }),
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (productData) => productService.createProduct(productData),
    onSuccess: () => {
      setSuccessMessage('Product created successfully!');
      reset();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  const onSubmit = async (data) => {
    // Ensure numbers are properly converted
    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      costPrice: parseFloat(data.costPrice),
      stockQuantity: parseInt(data.stockQuantity),
      minStockLevel: parseInt(data.minStockLevel),
    };

    createProductMutation.mutate(formattedData);
  };

  const handleCancel = () => {
    navigate('/products');
  };

  const categories = [
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

  const units = [
    { value: 'piece', label: 'Piece' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'l', label: 'Liter (l)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'pack', label: 'Pack' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={handleCancel} className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
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
      {createProductMutation.isError && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">Error creating product</h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>{createProductMutation.error?.message || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-danger-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className={`input w-full ${errors.name ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                  placeholder="Enter product name"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
                )}
              </div>

              {/* Barcode */}
              <div>
                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
                  Barcode
                </label>
                <input
                  id="barcode"
                  type="text"
                  className={`input w-full ${errors.barcode ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                  placeholder="Enter barcode (optional)"
                  {...register('barcode')}
                />
                {errors.barcode && (
                  <p className="mt-1 text-sm text-danger-600">{errors.barcode.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-danger-500">*</span>
                </label>
                <select
                  id="category"
                  className={`input w-full ${errors.category ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                  {...register('category')}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-danger-600">{errors.category.message}</p>
                )}
              </div>

              {/* Unit */}
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Unit <span className="text-danger-500">*</span>
                </label>
                <select
                  id="unit"
                  className={`input w-full ${errors.unit ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                  {...register('unit')}
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-danger-600">{errors.unit.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={`input w-full ${errors.description ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                  placeholder="Enter product description (optional)"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Pricing</h2>

            <div className="space-y-4">
              {/* Selling Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price <span className="text-danger-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₨</span>
                  </div>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    className={`input pl-8 w-full ${errors.price ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="0.00"
                    {...register('price')}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-danger-600">{errors.price.message}</p>
                )}
              </div>

              {/* Cost Price */}
              <div>
                <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Cost Price <span className="text-danger-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₨</span>
                  </div>
                  <input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    className={`input pl-8 w-full ${errors.costPrice ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="0.00"
                    {...register('costPrice')}
                  />
                </div>
                {errors.costPrice && (
                  <p className="mt-1 text-sm text-danger-600">{errors.costPrice.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Inventory</h2>

            <div className="space-y-4">
              {/* Stock Quantity */}
              <div>
                <label
                  htmlFor="stockQuantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stock Quantity <span className="text-danger-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    id="stockQuantity"
                    type="number"
                    className={`input w-full ${errors.stockQuantity ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="0"
                    {...register('stockQuantity')}
                  />
                </div>
                {errors.stockQuantity && (
                  <p className="mt-1 text-sm text-danger-600">{errors.stockQuantity.message}</p>
                )}
              </div>

              {/* Min Stock Level */}
              <div>
                <label
                  htmlFor="minStockLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Minimum Stock Level <span className="text-danger-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    id="minStockLevel"
                    type="number"
                    className={`input w-full ${errors.minStockLevel ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="0"
                    {...register('minStockLevel')}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  System will alert you when stock falls below this level
                </p>
                {errors.minStockLevel && (
                  <p className="mt-1 text-sm text-danger-600">{errors.minStockLevel.message}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...register('isActive')}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Product is active and available for sale
                </label>
              </div>
            </div>
          </div>

          {/* Supplier */}
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
              Supplier Information
            </h2>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                {isLoadingSuppliers ? (
                  <div className="input w-full flex items-center">
                    <LoadingSpinner size="small" />
                    <span className="ml-2 text-gray-500">Loading suppliers...</span>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Truck className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="supplier"
                      className={`input pl-10 w-full ${errors.supplier ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                      {...register('supplier')}
                    >
                      <option value="">Select supplier</option>
                      {suppliersData?.data.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              {errors.supplier && (
                <p className="mt-1 text-sm text-danger-600">{errors.supplier.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
          <button type="button" onClick={handleCancel} className="btn btn-default px-4 py-2">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4 py-2 flex items-center"
            disabled={isSubmitting || createProductMutation.isPending}
          >
            {isSubmitting || createProductMutation.isPending ? (
              <>
                <LoadingSpinner size="small" /> <span className="ml-2">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
