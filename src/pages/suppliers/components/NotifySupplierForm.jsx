import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Define validation schema
const notifySchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

const NotifySupplierForm = ({ supplier, onSubmit, onCancel, isSubmitting }) => {
  // Low stock template
  const lowStockTemplate = {
    subject: 'Low Stock Notification',
    message: `Dear ${supplier.contactPerson},\n\nWe're running low on some of the products you supply. Please arrange a delivery at your earliest convenience.\n\nBest regards,\nInventory Management Team`
  };

  // Regular order template
  const orderTemplate = {
    subject: 'New Order Request',
    message: `Dear ${supplier.contactPerson},\n\nWe would like to place a new order for the following items:\n- [Product List]\n\nPlease confirm availability and delivery timeline.\n\nBest regards,\nProcurement Team`
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(notifySchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  // Apply template
  const applyTemplate = (template) => {
    setValue('subject', template.subject);
    setValue('message', template.message);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject <span className="text-danger-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            className={`input w-full ${errors.subject ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
            placeholder="Enter notification subject"
            {...register('subject')}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-danger-600">{errors.subject.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            className={`input w-full ${errors.message ? 'border-danger-500 focus-visible:ring-danger-500' : ''}`}
            placeholder="Enter notification message"
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-danger-600">{errors.message.message}</p>
          )}
        </div>

        {/* Templates */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Apply Template:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyTemplate(lowStockTemplate)}
              className="btn btn-sm btn-outline"
            >
              Low Stock
            </button>
            <button
              type="button"
              onClick={() => applyTemplate(orderTemplate)}
              className="btn btn-sm btn-outline"
            >
              New Order
            </button>
          </div>
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
              <><LoadingSpinner size="small" /> <span className="ml-2">Sending...</span></>
            ) : (
              <><Send className="h-4 w-4 mr-2" /> Send Notification</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NotifySupplierForm;