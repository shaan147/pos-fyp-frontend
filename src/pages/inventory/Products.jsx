import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/productService';
import { useAuth } from '@hooks/useAuth';
import {
  Search,
  Plus,
  Filter,
  Package,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Edit,
  Trash,
  AlertCircle,
} from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';
import Dropdown from '@components/common/Dropdown'; // Import the new Dropdown component

const Products = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    sort: '-createdAt',
  });

  const isAdmin = ['admin', 'manager'].includes(user?.role || '');

  // Load products
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', page, filters],
    queryFn: () =>
      productService.getAllProducts({
        page,
        limit: 10,
        ...filters,
        name: searchTerm ? searchTerm : undefined,
      }),
  });

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filter changes
  };

  // Status badge component
  const StockStatusBadge = ({ status }) => {
    const statusStyles = {
      IN_STOCK:
        'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300 border-success-200 dark:border-success-800',
      LOW_STOCK:
        'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300 border-warning-200 dark:border-warning-800',
      OUT_OF_STOCK:
        'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-300 border-danger-200 dark:border-danger-800',
    };

    const statusText = {
      IN_STOCK: 'In Stock',
      LOW_STOCK: 'Low Stock',
      OUT_OF_STOCK: 'Out of Stock',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'}`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Products</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
            Manage your inventory, prices, and stock levels
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/products/add"
            className="btn btn-primary inline-flex items-center gap-x-2 mt-4 sm:mt-0"
          >
            <Plus size={16} />
            Add Product
          </Link>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary dark:placeholder-gray-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-2/3">
          <div className="relative flex-1">
            <select
              name="category"
              className="input w-full appearance-none pl-10 dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="dairy">Dairy</option>
              <option value="bakery">Bakery</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="meat">Meat</option>
              <option value="seafood">Seafood</option>
              <option value="frozen">Frozen</option>
              <option value="snacks">Snacks</option>
              <option value="beverages">Beverages</option>
              <option value="household">Household</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          <div className="relative flex-1">
            <select
              name="stockStatus"
              className="input w-full appearance-none pl-10 dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
              value={filters.stockStatus}
              onChange={handleFilterChange}
            >
              <option value="">All Stock Status</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Package className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          <div className="relative flex-1">
            <select
              name="sort"
              className="input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
              value={filters.sort}
              onChange={handleFilterChange}
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="-name">Name (Z-A)</option>
              <option value="price">Price (Low to High)</option>
              <option value="-price">Price (High to Low)</option>
              <option value="stockQuantity">Stock (Low to High)</option>
              <option value="-stockQuantity">Stock (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-danger-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">Error loading products</h3>
              <div className="mt-2 text-sm text-danger-700">
                <p>
                  {error.message || 'There was an error loading the products. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-dark-bg">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    SKU / Barcode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                {data?.data.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-dark-text-secondary">
                            {product.description?.substring(0, 30) || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                      <div>{product.productId}</div>
                      <div className="text-xs">{product.barcode || 'No barcode'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-text-primary">
                        ₨{product.price}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-dark-text-secondary">
                        Cost: ₨{product.costPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-text-primary">
                        {product.stockQuantity} {product.unit}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-dark-text-secondary">
                        Min: {product.minStockLevel}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StockStatusBadge status={product.stockStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {isAdmin && (
                          <>
                            <Link
                              to={`/products/${product._id}`}
                              className="p-1.5 rounded text-green-500 hover:text-green-700 hover:bg-green-100 dark:hover:text-green-400 dark:hover:bg-green-900/20"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>

                            <button
                              className="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-dark-bg border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-dark-text-secondary">
                Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * 10, data.count)}</span> of{' '}
                <span className="font-medium">{data.count}</span> products
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!data.pagination.prev}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-sm font-medium text-gray-700 dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!data.pagination.next}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-sm font-medium text-gray-700 dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No products found */}
      {!isLoading && data?.data.length === 0 && (
        <div className="bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-text-primary">
            No products found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-dark-text-secondary">
            {searchTerm || filters.category || filters.stockStatus
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first product.'}
          </p>
          {isAdmin && (
            <div className="mt-6">
              <Link to="/products/add" className="btn btn-primary inline-flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
