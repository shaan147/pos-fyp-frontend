import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supplierService } from '@services/supplierService';
import { 
  Plus, 
  Search, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Components
import SupplierTable from './components/SupplierTable';
import SupplierFilters from './components/SupplierFilters';
import LoadingSpinner from '@components/common/LoadingSpinner';
import EmptyState from './components/EmptyState';

const Suppliers = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    sort: '-createdAt'
  });

  // Fetch suppliers
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['suppliers', page, filters],
    queryFn: () => supplierService.getAllSuppliers({
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
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filter changes
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60 dark:bg-dark-card">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-danger-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800 dark:text-danger-200">Error loading suppliers</h3>
            <div className="mt-2 text-sm text-danger-700 dark:text-danger-300">
              <p>{error.message || 'There was an error loading the suppliers. Please try again.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Suppliers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
            Manage your suppliers and their contact information
          </p>
        </div>
        <Link
          to="/suppliers/add"
          className="btn btn-primary inline-flex items-center gap-x-2 mt-4 sm:mt-0"
        >
          <Plus size={16} />
          Add Supplier
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary dark:placeholder-gray-500"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        
        <SupplierFilters 
          filters={filters} 
          onChange={handleFilterChange} 
        />
      </div>

      {/* Suppliers Table */}
      {data?.data.length > 0 ? (
        <>
          <SupplierTable suppliers={data.data} />
          
          {/* Pagination */}
          {data?.pagination && (
            <div className="px-6 py-4 bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-dark-text-secondary">
                Showing <span className="font-medium dark:text-dark-text-primary">{((page - 1) * 10) + 1}</span> to{' '}
                <span className="font-medium dark:text-dark-text-primary">
                  {Math.min(page * 10, data.count)}
                </span>{' '}
                of <span className="font-medium dark:text-dark-text-primary">{data.count}</span> suppliers
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
        </>
      ) : (
        <EmptyState 
          title="No suppliers found" 
          description={searchTerm || filters.category ? 
            "Try adjusting your search or filter criteria." : 
            "Get started by adding your first supplier."
          }
        />
      )}
    </div>
  );
};

export default Suppliers;