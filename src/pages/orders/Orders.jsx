import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@services/orderService';
import { 
  Plus, 
  Search, 
  Filter, 
  ClipboardList,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Components
import OrderTable from './components/OrderTable';
import OrderFilters from './components/OrderFilters';
import LoadingSpinner from '@components/common/LoadingSpinner';
import EmptyState from './components/EmptyState';
import OrderStats from './components/OrderStats';

const Orders = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    orderStatus: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
    sort: '-createdAt'
  });

  // Fetch orders
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['orders', page, filters],
    queryFn: () => orderService.getAllOrders({
      page,
      limit: 10,
      ...filters,
      orderId: searchTerm ? searchTerm : undefined,
    }),
  });

  // Get order analytics for stats
  const { data: analytics } = useQuery({
    queryKey: ['orderAnalytics'],
    queryFn: () => orderService.getOrderAnalytics(),
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

  // Handle date filter change
  const handleDateFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filter changes
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-danger-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-danger-800">Error loading orders</h3>
            <div className="mt-2 text-sm text-danger-700">
              <p>{error.message || 'There was an error loading the orders. Please try again.'}</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage orders and track sales
          </p>
        </div>
        <Link
          to="/pos"
          className="btn btn-primary inline-flex items-center gap-x-2 mt-4 sm:mt-0"
        >
          <Plus size={16} />
          New Order
        </Link>
      </div>

      {/* Order Statistics */}
      {analytics && <OrderStats analytics={analytics} />}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full"
              placeholder="Search by order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
        
        <OrderFilters 
          filters={filters} 
          onChange={handleFilterChange}
          onDateChange={handleDateFilterChange}
        />
      </div>

      {/* Orders Table */}
      {data?.data.length > 0 ? (
        <>
          <OrderTable orders={data.data} />
          
          {/* Pagination */}
          {data?.pagination && (
            <div className="px-6 py-4 bg-white rounded-lg border flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{((page - 1) * 10) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * 10, data.count)}
                </span>{' '}
                of <span className="font-medium">{data.count}</span> orders
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!data.pagination.prev}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!data.pagination.next}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          title="No orders found" 
          description={searchTerm || filters.orderStatus || filters.paymentStatus ? 
            "Try adjusting your search or filter criteria." : 
            "No orders have been placed yet."
          }
        />
      )}
    </div>
  );
};

export default Orders;