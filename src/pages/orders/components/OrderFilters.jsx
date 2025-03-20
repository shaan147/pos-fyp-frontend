import React from 'react';
import { Filter, CalendarRange, Clock, CreditCard } from 'lucide-react';

const OrderFilters = ({ filters, onChange, onDateChange }) => {
  // Order status options
  const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Payment status options
  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-2/3">
      {/* Order Status filter */}
      <div className="relative flex-1">
        <select
          name="orderStatus"
          className="input w-full appearance-none pl-10"
          value={filters.orderStatus}
          onChange={onChange}
        >
          <option value="">All Order Status</option>
          {orderStatusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Payment Status filter */}
      <div className="relative flex-1">
        <select
          name="paymentStatus"
          className="input w-full appearance-none pl-10"
          value={filters.paymentStatus}
          onChange={onChange}
        >
          <option value="">All Payment Status</option>
          {paymentStatusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CreditCard className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Date Range Selector - could be improved with a date picker */}
      <div className="relative flex-1">
        <select
          name="dateRange"
          className="input w-full appearance-none pl-10"
          value={
            filters.startDate 
              ? 'custom' 
              : (filters.sort === '-createdAt' ? 'newest' : 'oldest')
          }
          onChange={(e) => {
            const value = e.target.value;
            
            // Reset date filters first
            onDateChange('startDate', '');
            onDateChange('endDate', '');
            
            // Apply predefined date filters
            if (value === 'today') {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              onDateChange('startDate', today.toISOString());
              today.setHours(23, 59, 59, 999);
              onDateChange('endDate', today.toISOString());
            } else if (value === 'week') {
              const today = new Date();
              const weekStart = new Date(today);
              weekStart.setDate(today.getDate() - 7);
              onDateChange('startDate', weekStart.toISOString());
              onDateChange('endDate', today.toISOString());
            } else if (value === 'month') {
              const today = new Date();
              const monthStart = new Date(today);
              monthStart.setMonth(today.getMonth() - 1);
              onDateChange('startDate', monthStart.toISOString());
              onDateChange('endDate', today.toISOString());
            } else if (value === 'newest') {
              onChange({ target: { name: 'sort', value: '-createdAt' } });
            } else if (value === 'oldest') {
              onChange({ target: { name: 'sort', value: 'createdAt' } });
            }
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          {(filters.startDate || filters.endDate) && <option value="custom">Custom Range</option>}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <CalendarRange className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;