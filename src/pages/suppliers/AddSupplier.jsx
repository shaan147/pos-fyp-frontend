import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supplierService } from '@services/supplierService';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';
import SupplierForm from './components/SupplierForm';

const AddSupplier = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  
  // Create supplier mutation
  const createSupplierMutation = useMutation({
    mutationFn: (supplierData) => supplierService.createSupplier(supplierData),
    onSuccess: () => {
      setSuccessMessage('Supplier created successfully!');
      
      // Clear success message after 3 seconds and navigate to suppliers list
      setTimeout(() => {
        navigate('/suppliers');
      }, 2000);
    },
  });

  const handleSubmit = (data) => {
    createSupplierMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate('/suppliers');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Supplier</h1>
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
      {createSupplierMutation.isError && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">Error creating supplier</h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>{createSupplierMutation.error?.message || 'An unexpected error occurred'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <SupplierForm 
        onSubmit={handleSubmit}
        isSubmitting={createSupplierMutation.isPending}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddSupplier;