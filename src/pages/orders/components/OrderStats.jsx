import React from 'react';
import { ShoppingCart, CircleDollarSign, CreditCard, Users } from 'lucide-react';

const OrderStats = ({ analytics }) => {
  const { totalOrders, revenue, avgOrderValue, ordersByStatus, ordersByPaymentMethod } = analytics.data;

  // Function to get count for specific status
  const getStatusCount = (status) => {
    const statusData = ordersByStatus.find(item => item._id === status);
    return statusData ? statusData.count : 0;
  };

  // Function to get count for specific payment method
  const getPaymentMethodCount = (method) => {
    const methodData = ordersByPaymentMethod.find(item => item._id === method);
    return methodData ? methodData.count : 0;
  };

  // Function to format currency
  const formatCurrency = (value) => {
    return `₨${value.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Orders */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
            <ShoppingCart size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold">{totalOrders}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="text-success-700 bg-success-50 px-2 py-1 rounded-md">
            <span className="font-medium">{getStatusCount('completed')}</span> Completed
          </div>
          <div className="text-warning-700 bg-warning-50 px-2 py-1 rounded-md">
            <span className="font-medium">{getStatusCount('pending')}</span> Pending
          </div>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-success-100 text-success-600 mr-3">
            <CircleDollarSign size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-semibold">{formatCurrency(revenue)}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Average order value: <span className="font-medium">{formatCurrency(avgOrderValue)}</span>
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-warning-100 text-warning-600 mr-3">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Payment Methods</p>
            <p className="text-2xl font-semibold">{ordersByPaymentMethod.length}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="text-primary-700 bg-primary-50 px-2 py-1 rounded-md">
            <span className="font-medium">{getPaymentMethodCount('cash')}</span> Cash
          </div>
          <div className="text-secondary-700 bg-secondary-50 px-2 py-1 rounded-md">
            <span className="font-medium">{getPaymentMethodCount('card')}</span> Card
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-secondary-100 text-secondary-600 mr-3">
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Customer Orders</p>
            <p className="text-2xl font-semibold">{totalOrders}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="text-danger-700 bg-danger-50 px-2 py-1 rounded-md">
            <span className="font-medium">{getStatusCount('cancelled')}</span> Cancelled
          </div>
          <div className="text-info-700 bg-info-50 px-2 py-1 rounded-md">
            <span className="font-medium">{getStatusCount('processing')}</span> Processing
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;