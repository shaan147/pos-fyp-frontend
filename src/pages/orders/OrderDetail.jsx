import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@services/orderService';
import { 
  ArrowLeft, 
  Printer, 
  XCircle, 
  CheckCircle, 
  AlertCircle, 
  Check,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText
} from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';
import OrderItems from './components/OrderItems';
import OrderStatusForm from './components/OrderStatusForm';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch order details
  const {
    data: order,
    isLoading: isLoadingOrder,
    error: orderError,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: (statusData) => orderService.updateOrderStatus(id, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      setIsUpdatingStatus(false);
      setSuccessMessage('Order status updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: () => orderService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      setSuccessMessage('Order cancelled successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });

  const handleStatusUpdate = (statusData) => {
    updateOrderStatusMutation.mutate(statusData);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      cancelOrderMutation.mutate();
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Loading state
  if (isLoadingOrder) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (orderError) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-danger-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Error loading order</h3>
            <div className="mt-2 text-sm text-danger-700">
              <p>{orderError.message || 'There was an error loading the order. Please try again.'}</p>
              <button 
                onClick={() => navigate('/orders')}
                className="mt-2 text-danger-600 font-medium hover:text-danger-500"
              >
                Back to orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order data loaded
  const orderData = order?.data;
  if (!orderData) return null;

  // Format order status for display
  const getOrderStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-warning-100 text-warning-800 border-warning-200',
      processing: 'bg-primary-100 text-primary-800 border-primary-200',
      completed: 'bg-success-100 text-success-800 border-success-200',
      cancelled: 'bg-danger-100 text-danger-800 border-danger-200',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status === 'pending' && <Clock className="mr-1 h-4 w-4" />}
        {status === 'processing' && <Clock className="mr-1 h-4 w-4" />}
        {status === 'completed' && <CheckCircle className="mr-1 h-4 w-4" />}
        {status === 'cancelled' && <XCircle className="mr-1 h-4 w-4" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format payment status for display
  const getPaymentStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-warning-100 text-warning-800 border-warning-200',
      paid: 'bg-success-100 text-success-800 border-success-200',
      failed: 'bg-danger-100 text-danger-800 border-danger-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status === 'pending' && <Clock className="mr-1 h-4 w-4" />}
        {status === 'paid' && <CheckCircle className="mr-1 h-4 w-4" />}
        {status === 'failed' && <XCircle className="mr-1 h-4 w-4" />}
        {status === 'refunded' && <XCircle className="mr-1 h-4 w-4" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format payment method for display
  const formatPaymentMethod = (method) => {
    const methods = {
      cash: 'Cash',
      card: 'Card Payment',
      mobile_wallet: 'Mobile Wallet',
      bank_transfer: 'Bank Transfer',
    };
    return methods[method] || method;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/orders')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{orderData.orderId}</h1>
            <p className="text-sm text-gray-500">
              {dayjs(orderData.createdAt).format('MMM D, YYYY [at] h:mm A')} ({dayjs(orderData.createdAt).fromNow()})
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {orderData.orderStatus !== 'cancelled' && orderData.orderStatus !== 'completed' && (
            <>
              <button
                onClick={() => setIsUpdatingStatus(true)}
                className="btn btn-outline px-4 py-2 flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" /> Update Status
              </button>
              <button
                onClick={handleCancelOrder}
                className="btn btn-danger px-4 py-2 flex items-center"
                disabled={cancelOrderMutation.isPending}
              >
                {cancelOrderMutation.isPending ? (
                  <><LoadingSpinner size="small" /> <span className="ml-2">Cancelling...</span></>
                ) : (
                  <><XCircle className="h-4 w-4 mr-2" /> Cancel Order</>
                )}
              </button>
            </>
          )}
          <button
            onClick={handlePrintReceipt}
            className="btn btn-outline px-4 py-2 flex items-center"
          >
            <Printer className="h-4 w-4 mr-2" /> Print Receipt
          </button>
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
      {(updateOrderStatusMutation.isError || cancelOrderMutation.isError) && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">An error occurred</h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>
                  {updateOrderStatusMutation.error?.message || 
                   cancelOrderMutation.error?.message || 
                   'An unexpected error occurred'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Badges */}
      <div className="flex flex-wrap gap-2">
        {getOrderStatusBadge(orderData.orderStatus)}
        {getPaymentStatusBadge(orderData.paymentStatus)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Order Items</h2>
              <OrderItems items={orderData.items} />
            </div>
          </div>

          {/* Customer Information */}
          {orderData.customerId && (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Customer Information</h2>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-gray-900">{orderData.customerId.name}</h3>
                  
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Mail size={16} className="mr-1 flex-shrink-0" />
                      <span>{orderData.customerId.email}</span>
                    </div>
                    
                    {orderData.customerId.phone && (
                      <div className="flex items-center">
                        <Phone size={16} className="mr-1 flex-shrink-0" />
                        <span>{orderData.customerId.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₨{orderData.subtotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (17%)</span>
                <span className="font-medium">₨{orderData.tax.toLocaleString()}</span>
              </div>
              
              {orderData.discount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>Discount</span>
                  <span className="font-medium">- ₨{orderData.discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="border-t pt-4 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold">₨{orderData.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Payment Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-700">Payment Method:</span>
                <span>{formatPaymentMethod(orderData.paymentMethod)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-700">Payment Status:</span>
                <span>{orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}</span>
              </div>
              
              {orderData.transactionId && (
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Transaction ID:</span>
                  <span className="font-mono text-sm">{orderData.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Additional Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-700">Order Date:</span>
                <span>{dayjs(orderData.createdAt).format('MMM D, YYYY')}</span>
              </div>
              
              {orderData.cashierId && (
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Cashier:</span>
                  <span>{orderData.cashierId.name}</span>
                </div>
              )}
              
              {orderData.notes && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Notes:</span>
                  <p className="mt-1 text-gray-600 border-l-2 border-gray-200 pl-3">{orderData.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Update Modal */}
      {isUpdatingStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
            
            <OrderStatusForm 
              order={orderData}
              onSubmit={handleStatusUpdate}
              onCancel={() => setIsUpdatingStatus(false)}
              isSubmitting={updateOrderStatusMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;