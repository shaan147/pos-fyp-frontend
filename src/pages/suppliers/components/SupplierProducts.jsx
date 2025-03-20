import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink } from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

const SupplierProducts = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No products from this supplier</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                    <Package className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.productId}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="capitalize">{product.category}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm">₨{product.price}</div>
                <div className="text-xs text-gray-500">Cost: ₨{product.costPrice}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm">{product.stockQuantity} {product.unit}</div>
                <div className="text-xs text-gray-500">Min: {product.minStockLevel}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/products/${product._id}`}
                  className="text-primary-600 hover:text-primary-900"
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