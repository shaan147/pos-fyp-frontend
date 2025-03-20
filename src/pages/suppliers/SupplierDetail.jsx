import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierService } from '@services/supplierService';
import { productService } from '@services/productService';
import {
  ArrowLeft,
  Edit,
  Trash,
  AlertCircle,
  Check,
  Mail,
  Phone,
  MapPin,
  Clock,
  Package,
  FileText,
  Send,
} from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';
import SupplierForm from './components/SupplierForm';
import SupplierProducts from './components/SupplierProducts';
import NotifySupplierForm from './components/NotifySupplierForm';

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch supplier details
  const {
    data: supplier,
    isLoading: isLoadingSupplier,
    error: supplierError,
  } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => supplierService.getSupplierById(id),
    enabled: !!id,
  });

  // Fetch supplier products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['supplierProducts', id],
    queryFn: () => supplierService.getProductsBySupplier(id),
    enabled: !!id,
  });

  // Update supplier mutation
  const updateSupplierMutation = useMutation({
    mutationFn: (supplierData) => supplierService.updateSupplier(id, supplierData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier', id] });
      setIsEditing(false);
      setSuccessMessage('Supplier updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  // Delete supplier mutation
  const deleteSupplierMutation = useMutation({
    mutationFn: () => supplierService.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      navigate('/suppliers');
    },
  });

  // Notify supplier mutation
  const notifySupplierMutation = useMutation({
    mutationFn: (data) => supplierService.notifySupplier(id, data),
    onSuccess: () => {
      setIsNotifying(false);
      setSuccessMessage('Notification sent successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  const handleFormSubmit = (data) => {
    updateSupplierMutation.mutate(data);
  };

  const handleNotificationSubmit = (data) => {
    notifySupplierMutation.mutate(data);
  };

  const handleDeleteConfirmation = () => {
    if (
      window.confirm('Are you sure you want to delete this supplier? This action cannot be undone.')
    ) {
      deleteSupplierMutation.mutate();
    }
  };

  // Loading state
  if (isLoadingSupplier) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (supplierError) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-danger-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Error loading supplier</h3>
            <div className="mt-2 text-sm text-danger-700">
              <p>
                {supplierError.message ||
                  'There was an error loading the supplier. Please try again.'}
              </p>
              <button
                onClick={() => navigate('/suppliers')}
                className="mt-2 text-danger-600 font-medium hover:text-danger-500"
              >
                Back to suppliers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Supplier data loaded
  const supplierData = supplier?.data;
  if (!supplierData) return null;

  // Format categories for display
  const formatCategories = (categories) => {
    return categories
      .map((category) => category.charAt(0).toUpperCase() + category.slice(1))
      .join(', ');
  };

  // Format payment terms for display
  const formatPaymentTerms = (term) => {
    const terms = {
      advance: 'Advance Payment',
      cod: 'Cash on Delivery',
      net15: 'Net 15 Days',
      net30: 'Net 30 Days',
      net60: 'Net 60 Days',
    };
    return terms[term] || term;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/suppliers')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{supplierData.name}</h1>
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
                disabled={deleteSupplierMutation.isPending}
              >
                {deleteSupplierMutation.isPending ? (
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
            <button onClick={() => setIsEditing(false)} className="btn btn-default px-4 py-2">
              Cancel
            </button>
          )}
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

      {/* Error messages */}
      {(updateSupplierMutation.isError || notifySupplierMutation.isError) && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">An error occurred</h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>
                  {updateSupplierMutation.error?.message ||
                    notifySupplierMutation.error?.message ||
                    'An unexpected error occurred'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Status Badge */}
      <div className="flex flex-wrap gap-2">
        <span className={`badge ${supplierData.isActive ? 'badge-success' : 'badge-danger'}`}>
          {supplierData.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {isEditing ? (
        <SupplierForm
          initialData={supplierData}
          onSubmit={handleFormSubmit}
          isSubmitting={updateSupplierMutation.isPending}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supplier Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              {/* Contact Information */}
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                    <p className="mt-1 font-medium">{supplierData.contactPerson}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <div className="mt-1 flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-1" />
                      <a
                        href={`mailto:${supplierData.email}`}
                        className="text-primary-600 hover:underline"
                      >
                        {supplierData.email}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <div className="mt-1 flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-1" />
                      <a
                        href={`tel:${supplierData.phone}`}
                        className="text-primary-600 hover:underline"
                      >
                        {supplierData.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tax ID / NTN</h3>
                    <p className="mt-1">{supplierData.taxId || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {(supplierData.address?.street ||
                supplierData.address?.city ||
                supplierData.address?.state ||
                supplierData.address?.postalCode ||
                supplierData.address?.country) && (
                <div className="border-t p-6">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Address</h2>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      {supplierData.address?.street && <p>{supplierData.address?.street}</p>}
                      {(supplierData.address?.city || supplierData.address?.state) && (
                        <p>
                          {supplierData.address?.city}
                          {supplierData.address?.city && supplierData.address?.state && ', '}
                          {supplierData.address?.state}
                          {supplierData.address?.postalCode &&
                            ` ${supplierData.address?.postalCode}`}
                        </p>
                      )}
                      {supplierData.address?.country && <p>{supplierData.address?.country}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Business Information */}
              <div className="border-t p-6">
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                  Business Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                    <p className="mt-1">{formatCategories(supplierData.categories)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Payment Terms</h3>
                    <p className="mt-1">{formatPaymentTerms(supplierData.paymentTerms)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Lead Time</h3>
                    <p className="mt-1">
                      {supplierData.leadTime} day{supplierData.leadTime !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Minimum Order Quantity</h3>
                    <p className="mt-1">
                      {supplierData.minimumOrderQuantity} unit
                      {supplierData.minimumOrderQuantity !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Products</h2>
              </div>

              <SupplierProducts products={products?.data || []} isLoading={isLoadingProducts} />
            </div>
          </div>

          {/* Actions and Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setIsNotifying(true)}
                  className="btn btn-outline w-full flex items-center justify-center"
                >
                  <Send className="h-4 w-4 mr-2" /> Send Notification
                </button>

                <button
                  onClick={() => window.open(`mailto:${supplierData.email}`)}
                  className="btn btn-outline w-full flex items-center justify-center"
                >
                  <Mail className="h-4 w-4 mr-2" /> Send Email
                </button>

                <button
                  onClick={() => window.open(`tel:${supplierData.phone}`)}
                  className="btn btn-outline w-full flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-2" /> Call Supplier
                </button>
              </div>
            </div>

            {/* Supplier Statistics */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Statistics</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Products</p>
                    <p className="font-medium">{products ? products.count : 'Loading...'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-success-100 text-success-600 mr-3">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lead Time</p>
                    <p className="font-medium">{supplierData.leadTime} days</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-warning-100 text-warning-600 mr-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {new Date(supplierData.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Form Modal */}
      {isNotifying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Send Notification</h2>

            <NotifySupplierForm
              supplier={supplierData}
              onSubmit={handleNotificationSubmit}
              onCancel={() => setIsNotifying(false)}
              isSubmitting={notifySupplierMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDetail;
