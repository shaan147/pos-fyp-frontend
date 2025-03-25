import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

const RecentOrders = ({ orders, isLoading }) => {
  // Status badge component
  const OrderStatusBadge = ({ status }) => {
    const statusStyles = {
      pending: 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 border-warning-200 dark:border-warning-800',
      processing: 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border-primary-200 dark:border-primary-800',
      completed: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 border-success-200 dark:border-success-800',
      cancelled: 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-300 border-danger-200 dark:border-danger-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge component
  const PaymentStatusBadge = ({ status }) => {
    const statusStyles = {
      pending: 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 border-warning-200 dark:border-warning-800',
      paid: 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 border-success-200 dark:border-success-800',
      failed: 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-300 border-danger-200 dark:border-danger-800',
      refunded: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 dark:bg-dark-card">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-dark-text-secondary">
        <ShoppingCart size={32} className="mb-2 opacity-50" />
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Payment</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                {order.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                {order.customerId?.name || 'Guest User'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text-primary">
                ₨{order.totalPrice.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatusBadge status={order.orderStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <PaymentStatusBadge status={order.paymentStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link to={`/orders/${order._id}`} className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                  <span className="flex items-center justify-end">
                    View <ChevronRight size={16} />
                  </span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;