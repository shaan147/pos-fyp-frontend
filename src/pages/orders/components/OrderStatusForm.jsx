import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Clock, CreditCard } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Define validation schema
const statusSchema = z.object({
  orderStatus: z.string().min(1, 'Order status is required'),
  paymentStatus: z.string().min(1, 'Payment status is required'),
});

const OrderStatusForm = ({ order, onSubmit, onCancel, isSubmitting }) => {
  // Order status options
  const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Order Status */}
        <div>
          <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Order Status <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="orderStatus"
              className={`input pl-10 w-full ${errors.orderStatus ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
              {...register('orderStatus')}
            >
              {orderStatusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          {errors.orderStatus && (
            <p className="mt-1 text-sm text-danger-600">{errors.orderStatus.message}</p>
          )}
        </div>

        {/* Payment Status */}
        <div>
          <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Status <span className="text-danger-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="paymentStatus"
              className={`input pl-10 w-full ${errors.paymentStatus ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
              {...register('paymentStatus')}
            >
              {paymentStatusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          {errors.paymentStatus && (
            <p className="mt-1 text-sm text-danger-600">{errors.paymentStatus.message}</p>
          )}
        </div>

        {/* Status Change Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Status Change Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="input w-full"
            placeholder="Optional notes about the status change"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200">
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
              <><LoadingSpinner size="small" /> <span className="ml-2">Updating...</span></>
            ) : (
              <><Save className="h-4 w-4 mr-2" /> Update Status</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default OrderStatusForm;