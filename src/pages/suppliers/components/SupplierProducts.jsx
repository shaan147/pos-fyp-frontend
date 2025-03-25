import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

const SupplierProducts = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 dark:bg-dark-card">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-dark-text-secondary">
        <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No products from this supplier</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                    <Package className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{product.name}</div>
                    <div className="text-xs text-gray-500 dark:text-dark-text-secondary">{product.productId}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="capitalize dark:text-dark-text-primary">{product.category}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm dark:text-dark-text-primary">₨{product.price}</div>
                <div className="text-xs text-gray-500 dark:text-dark-text-secondary">Cost: ₨{product.costPrice}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm dark:text-dark-text-primary">{product.stockQuantity} {product.unit}</div>
                <div className="text-xs text-gray-500 dark:text-dark-text-secondary">Min: {product.minStockLevel}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/products/${product._id}`}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                >
                  <ExternalLink size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierProducts;