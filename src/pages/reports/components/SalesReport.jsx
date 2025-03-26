import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  CreditCard,
  Package
} from 'lucide-react';
import dayjs from 'dayjs';

const SalesReport = ({ data, dateRange }) => {
  const [chartType, setChartType] = useState('daily'); // daily, weekly, monthly
  
  // Extract relevant data from the API response
  const { revenue, totalOrders, avgOrderValue, ordersByStatus, ordersByPaymentMethod, salesByDate, topProducts } = data.data;
  
  // Process data for charts based on the selected chart type
  const processChartData = () => {
    // Group data by date format based on chart type
    const format = chartType === 'daily' ? 'YYYY-MM-DD' : 
                  chartType === 'weekly' ? 'YYYY-[W]WW' : 'YYYY-MM';
    
    // Create processed data (in a real app, this would transform the salesByDate data)
    // Here we're using it as is, assuming it's already formatted
    return salesByDate || [];
  };
  
  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Format currency
  const formatCurrency = (value) => {
    return `₨${value?.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };
  
  // Payment method formatters
  const paymentMethodNames = {
    cash: 'Cash',
    card: 'Card Payment',
    mobile_wallet: 'Mobile Wallet',
    bank_transfer: 'Bank Transfer',
  };

  // Format status for display
  const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  // Calculate date range difference in days
  const dateDiffInDays = dayjs(dateRange.endDate).diff(dayjs(dateRange.startDate), 'day') + 1;
  
  // Determine appropriate chart type based on date range
  const determineChartType = () => {
    if (dateDiffInDays <= 31) {
      return 'daily';
    } else if (dateDiffInDays <= 90) {
      return 'weekly';
    } else {
      return 'monthly';
    }
  };

  // Process chart data
  const chartData = processChartData();

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-3">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-semibold dark:text-dark-text-primary">{formatCurrency(revenue)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 mr-3">
              <ShoppingCart size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-semibold dark:text-dark-text-primary">{totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400 mr-3">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Order Value</p>
              <p className="text-2xl font-semibold dark:text-dark-text-primary">{formatCurrency(avgOrderValue)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 mr-3">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Most Popular Payment</p>
              <p className="text-2xl font-semibold dark:text-dark-text-primary">
                {ordersByPaymentMethod && ordersByPaymentMethod.length > 0 
                  ? paymentMethodNames[ordersByPaymentMethod[0]._id] || ordersByPaymentMethod[0]._id
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Type Selection */}
      <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">Sales Trend</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('daily')}
              className={`btn btn-sm ${chartType === 'daily' ? 'btn-primary' : 'btn-outline'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setChartType('weekly')}
              className={`btn btn-sm ${chartType === 'weekly' ? 'btn-primary' : 'btn-outline'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartType('monthly')}
              className={`btn btn-sm ${chartType === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Sales Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
              <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'revenue') return [`₨${value.toLocaleString()}`, 'Revenue'];
                  return [value, 'Orders'];
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#0088FE"
                activeDot={{ r: 8 }}
                name="Revenue"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#00C49F"
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Other Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Order Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                  label={({ name, percent }) => `${formatStatus(name)}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ordersByStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, formatStatus(name)]}
                />
                <Legend formatter={(value) => formatStatus(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Method Distribution */}
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Payment Method Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordersByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                  label={({ name, percent }) => 
                    `${paymentMethodNames[name] || name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {ordersByPaymentMethod?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, paymentMethodNames[name] || name]}
                />
                <Legend formatter={(value) => paymentMethodNames[value] || value} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Top Selling Products</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topProducts}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip
                formatter={(value) => [`₨${value.toLocaleString()}`, 'Sales']}
              />
              <Legend />
              <Bar dataKey="sales" name="Sales Amount" fill="#0088FE" />
              <Bar dataKey="quantity" name="Quantity Sold" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;