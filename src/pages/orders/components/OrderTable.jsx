import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  ExternalLink, 
  MoreHorizontal,
  ChevronRight,
  Edit,
  Printer,
  FileText,
  XCircle,
  CheckCircle,
  User
} from 'lucide-react';
import dayjs from 'dayjs';

// Table row actions dropdown component
const ActionsDropdown = ({ orderId }) => {
  return (
    <div className="relative inline-block text-left dropdown">
      <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        <MoreHorizontal className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </button>
      <div className="dropdown-menu absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-md shadow-lg z-10 hidden">
        <div className="p-1">
          <Link
            to={`/orders/${orderId}`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <ChevronRight className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            View Details
          </Link>
          <Link
            to={`/orders/${orderId}/edit`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <Edit className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Edit Order
          </Link>
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <Printer className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Print Receipt
          </button>
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-danger-700 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-md"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

// Status badges component
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

const PaymentMethodBadge = ({ method }) => {
  const methodStyles = {
    cash: 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300',
    card: 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    mobile_wallet: 'bg-secondary-50 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300',
    bank_transfer: 'bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
  };

  const methodLabels = {
    cash: 'Cash',
    card: 'Card',
    mobile_wallet: 'Mobile Wallet',
    bank_transfer: 'Bank Transfer',
  };

  return (
    <span className={`text-xs ${methodStyles[method] || 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
      {methodLabels[method] || method}
    </span>
  );
};

const OrderTable = ({ orders }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                        <Link to={`/orders/${order._id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                          {order.orderId}
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.customerId ? (
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <User size={16} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                          {order.customerId.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-dark-text-secondary">
                          {order.customerId.email}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-dark-text-secondary">Guest Customer</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                  {dayjs(order.createdAt).format('MMM D, YYYY')}
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {dayjs(order.createdAt).format('h:mm A')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                  ₨{order.totalPrice.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.orderStatus} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <PaymentStatusBadge status={order.paymentStatus} />
                    <div>
                      <PaymentMethodBadge method={order.paymentMethod} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <ActionsDropdown orderId={order._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;