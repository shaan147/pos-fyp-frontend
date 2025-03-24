import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  AlertCircle, 
  Users, 
  ArrowUpRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@services/orderService';
import { productService } from '@services/productService';
import { useAuth } from '@hooks/useAuth';
import LoadingSpinner from '@components/common/LoadingSpinner';
import SalesChart from './components/SalesChart';
import TopProducts from './components/TopProducts';
import RecentOrders from './components/RecentOrders';

const Dashboard = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('week');
  
  // Analytics data query
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['orderAnalytics', dateRange],
    queryFn: () => {
      const today = new Date();
      let startDate;
      
      if (dateRange === 'week') {
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate = new Date(today);
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (dateRange === 'year') {
        startDate = new Date(today);
        startDate.setFullYear(startDate.getFullYear() - 1);
      }
      
      return orderService.getOrderAnalytics(startDate?.toISOString(), today.toISOString());
    },
  });
  
  // Recent orders query
  const { data: recentOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['recentOrders'],
    queryFn: () => orderService.getAllOrders({ limit: 5, sort: '-createdAt' }),
  });
  
  // Low stock products query
  const { data: lowStockProducts, isLoading: isLoadingLowStock } = useQuery({
    queryKey: ['lowStockProducts'],
    queryFn: () => productService.getLowStockProducts(),
    enabled: ['admin', 'manager'].includes(user?.role || ''),
  });
  
  const StatCard = ({ title, value, icon, description, trend, color }) => (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 border dark:border-dark-border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-dark-text-primary">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-300`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-4">
        {trend && (
          <span className={`inline-flex items-center text-sm mr-2 ${trend > 0 ? 'text-success-600 dark:text-success-300' : 'text-danger-600 dark:text-danger-300'}`}>
            {trend > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {Math.abs(trend)}%
          </span>
        )}
        <p className="text-xs text-gray-500 dark:text-dark-text-muted">{description}</p>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Dashboard</h1>
          <p className="text-gray-500 dark:text-dark-text-secondary mt-1">Welcome back, {user?.name || 'User'}</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input h-9 rounded-md border-gray-300 dark:border-dark-border"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
        </div>
      </div>
      
      {/* Stats Grid */}
      {isLoadingAnalytics ? (
        <div className="h-40 flex items-center justify-center">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales"
            value={`₨${analytics?.data?.revenue?.toFixed(2) || '0.00'}`}
            icon={<DollarSign size={20} />}
            description="Revenue this period"
            trend={7.2}
            color="primary"
          />
          <StatCard
            title="Orders"
            value={analytics?.data?.totalOrders || 0}
            icon={<ShoppingCart size={20} />}
            description="Total orders this period"
            trend={-2.5}
            color="secondary"
          />
          <StatCard
            title="Products"
            value="1,253"
            icon={<Package size={20} />}
            description="Total products in inventory"
            color="success"
          />
          <StatCard
            title="Customers"
            value="842"
            icon={<Users size={20} />}
            description="Total registered customers"
            trend={4.1}
            color="warning"
          />
        </div>
      )}
      
      {/* Low Stock Alert */}
      {['admin', 'manager'].includes(user?.role || '') && (
        <div className="bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-warning-400 dark:text-warning-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-warning-800 dark:text-warning-200">Low Stock Alert</h3>
              <div className="mt-2 text-sm text-warning-700 dark:text-warning-300">
                {isLoadingLowStock ? (
                  <span>Loading low stock items...</span>
                ) : (
                  <p>
                    {lowStockProducts?.count
                      ? `${lowStockProducts.count} products need restocking.`
                      : 'All products are well-stocked.'}
                    {lowStockProducts?.count > 0 && (
                      <Link to="/products/lowstock" className="ml-1 font-medium underline text-warning-800 dark:text-warning-200">
                        View all
                      </Link>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 border dark:border-dark-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">Sales Overview</h2>
            <Link to="/reports" className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center">
              View full report <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
          <SalesChart dateRange={dateRange} />
        </div>
        
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 border dark:border-dark-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">Top Selling Products</h2>
            <Link to="/products" className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center">
              View all <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
          <TopProducts />
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 border dark:border-dark-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">Recent Orders</h2>
          <Link to="/orders" className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center">
            View all <ArrowUpRight size={14} className="ml-1" />
          </Link>
        </div>
        <RecentOrders orders={recentOrders?.data} isLoading={isLoadingOrders} />
      </div>
    </div>
  );
};

export default Dashboard;