import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink } from 'lucide-react';

const OrderItems = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-dark-text-secondary">
        <p>No items in this order</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Unit Price</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Subtotal</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text-primary">
                <div className="flex items-center">
                  <div className="h-9 w-9 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                      {item.product ? (
                        <Link to={`/products/${item.product}`} className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center">
                          {item.name}
                          <ExternalLink size={14} className="ml-1 text-gray-400 dark:text-gray-500" />
                        </Link>
                      ) : (
                        item.name
                      )}
                    </div>
                    {item.productId && (
                      <div className="text-xs text-gray-500 dark:text-dark-text-secondary">{item.productId}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text-primary">
                ₨{item.price.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary text-center">
                {item.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary text-right">
                ₨{item.subtotal.toLocaleString()}
              </td>
            </tr>
          ))}
          
          {/* Summary rows */}
          <tr className="bg-gray-50 dark:bg-gray-800">
            <td colSpan="3" className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-dark-text-secondary text-right">
              Subtotal
            </td>
            <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-dark-text-primary text-right">
              ₨{items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderItems;