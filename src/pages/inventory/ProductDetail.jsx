import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@services/productService';
import { supplierService } from '@services/supplierService';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Package,
  Edit,
  Save,
  Trash,
  AlertCircle,
  Check,
  Plus,
  Minus,
  Truck,
  Tag,
  CircleDollarSign,
  Calendar,
  ClipboardCheck,
} from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';
import dayjs from 'dayjs';

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [stockUpdateAmount, setStockUpdateAmount] = useState(1);
  const [isAddingStock, setIsAddingStock] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch product details
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });

  // Fetch supplier details
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getAllSuppliers({ limit: 100 }),
    enabled: !!product,
  });

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
    setValue,
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

  // Set form values when product data is loaded
  React.useEffect(() => {
    if (product) {
      reset({
        name: product.data.name,
        description: product.data.description || '',
        barcode: product.data.barcode || '',
        category: product.data.category,
        price: product.data.price,
        costPrice: product.data.costPrice,
        stockQuantity: product.data.stockQuantity,
        unit: product.data.unit,
        minStockLevel: product.data.minStockLevel,
        supplier: product.data.supplier,
        isActive: product.data.isActive,
      });
    }
  }, [product, reset]);

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: (productData) => productService.updateProduct(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      setIsEditing(false);
      setSuccessMessage('Product updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: ({ quantity, isAddition }) => productService.updateStock(id, quantity, isAddition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      setSuccessMessage('Stock updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: () => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
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

    updateProductMutation.mutate(formattedData);
  };

  const handleStockUpdate = () => {
    if (stockUpdateAmount <= 0) return;

    updateStockMutation.mutate({
      quantity: stockUpdateAmount,
      isAddition: isAddingStock,
    });
  };

  const handleDeleteConfirmation = () => {
    if (
      window.confirm('Are you sure you want to delete this product? This action cannot be undone.')
    ) {
      deleteProductMutation.mutate();
    }
  };

  // Helper function to get supplier name
  const getSupplierName = (supplierId) => {
    if (!suppliersData) return 'Loading...';
    const supplier = suppliersData.data.find((s) => s._id === supplierId);
    return supplier ? supplier.name : 'Unknown supplier';
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

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (productError) {
    return (
      <div className="bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-danger-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Error loading product</h3>
            <div className="mt-2 text-sm text-danger-700">
              <p>
                {productError.message ||
                  'There was an error loading the product. Please try again.'}
              </p>
              <button
                onClick={() => navigate('/products')}
                className="mt-2 text-danger-600 font-medium hover:text-danger-500"
              >
                Back to products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product data loaded
  const productData = product?.data;
  if (!productData) return null;

  // Get category and unit labels
  const getCategoryLabel = (value) => {
    const category = categories.find((c) => c.value === value);
    return category ? category.label : value;
  };

  const getUnitLabel = (value) => {
    const unit = units.find((u) => u.value === value);
    return unit ? unit.label : value;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/products')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{productData.name}</h1>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline px-4 py-2 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </button>
              <button
                onClick={handleDeleteConfirmation}
                className="btn btn-danger px-4 py-2 flex items-center"
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <LoadingSpinner size="small" /> <span className="ml-2">Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  reset(productData);
                }}
                className="btn btn-default px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                className="btn btn-primary px-4 py-2 flex items-center"
                disabled={isSubmitting || updateProductMutation.isPending || !isDirty}
              >
                {isSubmitting || updateProductMutation.isPending ? (
                  <>
                    <LoadingSpinner size="small" /> <span className="ml-2">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-lg p-4">
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
      {(updateProductMutation.isError || updateStockMutation.isError) && (
        <div className="bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">An error occurred</h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>
                  {updateProductMutation.error?.message ||
                    updateStockMutation.error?.message ||
                    'An unexpected error occurred'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Status Badges */}
      <div className="flex flex-wrap gap-2">
        <span className={`badge ${productData.isActive ? 'badge-success dark:bg-success-900/30 dark:text-success-300' : 'badge-danger dark:bg-danger-900/30 dark:text-danger-300'}`}>
          {productData.isActive ? 'Active' : 'Inactive'}
        </span>
        <span
          className={`badge ${
            productData.stockQuantity <= 0
              ? 'badge-danger dark:bg-danger-900/30 dark:text-danger-300'
              : productData.stockQuantity <= productData.minStockLevel
                ? 'badge-warning dark:bg-warning-900/30 dark:text-warning-300'
                : 'badge-success dark:bg-success-900/30 dark:text-success-300'
          }`}
        >
          {productData.stockQuantity <= 0
            ? 'Out of Stock'
            : productData.stockQuantity <= productData.minStockLevel
              ? 'Low Stock'
              : 'In Stock'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Details Section */}
        {isEditing ? (
          <div className="lg:col-span-2 space-y-6">
            <form className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary border-b pb-2">
                  Product Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
                      Product Name <span className="text-danger-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary dark:placeholder-gray-500 ${errors.name ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                      placeholder="Enter product name"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Barcode */}
                  <div>
                    <label
                      htmlFor="barcode"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
                    >
                      Barcode
                    </label>
                    <input
                      id="barcode"
                      type="text"
                      className={`input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary dark:placeholder-gray-500 ${errors.barcode ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                      placeholder="Enter barcode (optional)"
                      {...register('barcode')}
                    />
                    {errors.barcode && (
                      <p className="mt-1 text-sm text-danger-600">{errors.barcode.message}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
                    >
                      Category <span className="text-danger-500">*</span>
                    </label>
                    <select
                      id="category"
                      className={`input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary ${errors.category ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
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
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
                      Unit <span className="text-danger-500">*</span>
                    </label>
                    <select
                      id="unit"
                      className={`input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary ${errors.unit ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
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

                  {/* Selling Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
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
                        className={`input pl-8 w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary dark:placeholder-gray-500 ${errors.price ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
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
                    <label
                      htmlFor="costPrice"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
                    >
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
                        className={`input pl-8 w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary dark:placeholder-gray-500 ${errors.costPrice ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                        placeholder="0.00"
                        {...register('costPrice')}
                      />
                    </div>
                    {errors.costPrice && (
                      <p className="mt-1 text-sm text-danger-600">{errors.costPrice.message}</p>
                    )}
                  </div>

                  {/* Min Stock Level */}
                  <div>
                    <label
                      htmlFor="minStockLevel"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
                    >
                      Minimum Stock Level <span className="text-danger-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <input
                        id="minStockLevel"
                        type="number"
                        className={`input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary dark:placeholder-gray-500 ${errors.minStockLevel ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                        placeholder="0"
                        {...register('minStockLevel')}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-dark-text-secondary">
                      System will alert you when stock falls below this level
                    </p>
                    {errors.minStockLevel && (
                      <p className="mt-1 text-sm text-danger-600">{errors.minStockLevel.message}</p>
                    )}
                  </div>

                  {/* Supplier */}
                  <div>
                    <label
                      htmlFor="supplier"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
                    >
                      Supplier <span className="text-danger-500">*</span>
                    </label>
                    <div className="relative">
                      {isLoadingSuppliers ? (
                        <div className="input w-full flex items-center">
                          <LoadingSpinner size="small" />
                          <span className="ml-2 text-gray-500 dark:text-dark-text-secondary">Loading suppliers...</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Truck className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <select
                            id="supplier"
                            className={`input pl-10 w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary ${errors.supplier ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
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

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className={`input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary ${errors.description ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
                    placeholder="Enter product description (optional)"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-danger-600">{errors.description.message}</p>
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
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-dark-text-primary">
                    Product is active and available for sale
                  </label>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary border-b pb-2 mb-4">
                  Product Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">ID / SKU</h3>
                    <p className="mt-1">{productData.productId}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Barcode</h3>
                    <p className="mt-1">{productData.barcode || 'N/A'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Category</h3>
                    <p className="mt-1 capitalize">{getCategoryLabel(productData.category)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Unit</h3>
                    <p className="mt-1">{getUnitLabel(productData.unit)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Selling Price</h3>
                    <p className="mt-1 font-medium text-gray-900">
                      ₨{productData.price.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Cost Price</h3>
                    <p className="mt-1">₨{productData.costPrice.toFixed(2)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Profit Margin</h3>
                    <p className="mt-1">
                      {(
                        ((productData.price - productData.costPrice) / productData.price) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Supplier</h3>
                    <p className="mt-1">{getSupplierName(productData.supplier)}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Description</h3>
                    <p className="mt-1">{productData.description || 'No description available'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary border-b pb-2 mb-4">
                  Inventory Status
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Current Stock</h3>
                    <p className="mt-1 font-medium text-gray-900">
                      {productData.stockQuantity} {productData.unit}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Minimum Stock Level</h3>
                    <p className="mt-1">
                      {productData.minStockLevel} {productData.unit}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Stock Value</h3>
                    <p className="mt-1">
                      ₨{(productData.stockQuantity * productData.costPrice).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Created At</h3>
                    <p className="mt-1">{dayjs(productData.createdAt).format('MMM D, YYYY')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock Management & Stats Section */}
        <div className="space-y-6">
          {/* Stock Management Card */}
          <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary border-b pb-2 mb-4">
              Stock Management
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                  Current Stock:{' '}
                  <span className="font-semibold">
                    {productData.stockQuantity} {productData.unit}
                  </span>
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="btn btn-default p-2"
                    onClick={() => setStockUpdateAmount(Math.max(1, stockUpdateAmount - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    className="input w-20 text-center"
                    value={stockUpdateAmount}
                    onChange={(e) =>
                      setStockUpdateAmount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min="1"
                  />
                  <button
                    type="button"
                    className="btn btn-default p-2"
                    onClick={() => setStockUpdateAmount(stockUpdateAmount + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <button
                  type="button"
                  className={`btn flex-1 ${isAddingStock ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => setIsAddingStock(true)}
                >
                  <Plus size={16} className="mr-1" /> Add Stock
                </button>
                <button
                  type="button"
                  className={`btn flex-1 ${!isAddingStock ? 'btn-danger' : 'btn-outline'}`}
                  onClick={() => setIsAddingStock(false)}
                >
                  <Minus size={16} className="mr-1" /> Remove Stock
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={handleStockUpdate}
                disabled={updateStockMutation.isPending}
              >
                {updateStockMutation.isPending ? (
                  <>
                    <LoadingSpinner size="small" /> <span className="ml-2">Updating...</span>
                  </>
                ) : (
                  <>
                    {isAddingStock ? 'Add' : 'Remove'} {stockUpdateAmount} {productData.unit}
                  </>
                )}
              </button>
            </div>

            {/* Product Stats Card */}
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary border-b pb-2 mb-4">Statistics</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 mr-3">
                    <CircleDollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Profit per unit</p>
                    <p className="font-medium">
                      ₨{(productData.price - productData.costPrice).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-300 mr-3">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Total stock value</p>
                    <p className="font-medium">
                      ₨{(productData.stockQuantity * productData.costPrice).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-300 mr-3">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Last updated</p>
                    <p className="font-medium">
                      {dayjs(productData.updatedAt).format('MMM D, YYYY')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Information Card */}
            <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">Supplier</h2>
                <Link
                  to={`/suppliers/${productData.supplier}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                >
                  View Supplier
                </Link>
              </div>

              {isLoadingSuppliers ? (
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner size="small" />
                  <span className="ml-2 text-gray-500 dark:text-dark-text-secondary">Loading supplier...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">{getSupplierName(productData.supplier)}</p>
                  {suppliersData?.data.find((s) => s._id === productData.supplier) && (
                    <>
                      <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                        {
                          suppliersData.data.find((s) => s._id === productData.supplier)
                            .contactPerson
                        }
                      </p>
                      <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                        {suppliersData.data.find((s) => s._id === productData.supplier).email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                        {suppliersData.data.find((s) => s._id === productData.supplier).phone}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
