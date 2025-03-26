import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
} from 'recharts';
import { 
  Truck, 
  Mail, 
  Clock, 
  Search,
  Tag,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SuppliersReport = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Extract supplier data
  const suppliers = data?.data || [];
  
  // Filter suppliers based on search and category
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = searchTerm === '' || 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || 
      supplier.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });
  
  // Group suppliers by category
  const categoryData = React.useMemo(() => {
    const categoryCounts = {};
    
    suppliers.forEach(supplier => {
      supplier.categories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count
    }));
  }, [suppliers]);
  
  // Group suppliers by payment terms
  const paymentTermsData = React.useMemo(() => {
    const paymentCounts = {};
    
    suppliers.forEach(supplier => {
      const term = supplier.paymentTerms;
      paymentCounts[term] = (paymentCounts[term] || 0) + 1;
    });
    
    return Object.entries(paymentCounts).map(([term, count]) => ({
      name: formatPaymentTerm(term),
      value: count
    }));
  }, [suppliers]);
  
  // Calculate lead time statistics
  const leadTimeData = React.useMemo(() => {
    const leadTimes = suppliers.map(supplier => ({
      name: supplier.name,
      leadTime: supplier.leadTime || 0
    }));
    
    return leadTimes.sort((a, b) => b.leadTime - a.leadTime).slice(0, 10);
  }, [suppliers]);
  
  // Get top suppliers by product count
  const topSuppliersByProductCount = React.useMemo(() => {
    // In a real app, this would be calculated from actual relations
    // Here we'll simulate this with random data
    return suppliers
      .slice(0, 10)
      .map(supplier => ({
        name: supplier.name,
        products: Math.floor(Math.random() * 30) + 1 // Random number 1-30
      }))
      .sort((a, b) => b.products - a.products);
  }, [suppliers]);
  
  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
  
  // Format payment term for display
  function formatPaymentTerm(term) {
    const terms = {
      'advance': 'Advance Payment',
      'cod': 'Cash on Delivery',
      'net15': 'Net 15 Days',
      'net30': 'Net 30 Days',
      'net60': 'Net 60 Days'
    };
    return terms[term] || term;
  }
  
  // Category options for filter
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'meat', label: 'Meat' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'frozen', label: 'Frozen' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'household', label: 'Household' },
    { value: 'personal', label: 'Personal' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="input pl-10 w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <select
              className="input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-3">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Suppliers</p>
              <p className="text-2xl font-semibold dark:text-dark-text-primary">{suppliers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 mr-3">
              <Filter size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories Covered</p>
              <p className="text-2xl font-semibold dark:text-dark-text-primary">{categoryData.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400 mr-3">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Lead Time</p>
              <p className="text-2xl font-semibold dark:text-dark-text-primary">
                {suppliers.length > 0 
                  ? (suppliers.reduce((sum, s) => sum + (s.leadTime || 0), 0) / suppliers.length).toFixed(1) 
                  : 0} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Categories Chart */}
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Supplier Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [value, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Terms Distribution */}
        <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Payment Terms Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentTermsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentTermsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [value, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lead Time Chart */}
      <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Top 10 Suppliers by Lead Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={leadTimeData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip labelFormatter={(value) => `Supplier: ${value}`} />
              <Legend />
              <Bar dataKey="leadTime" name="Lead Time (Days)" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Suppliers by Product Count */}
      <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-4">Top Suppliers by Product Count</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topSuppliersByProductCount}
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip labelFormatter={(value) => `Supplier: ${value}`} />
              <Legend />
              <Bar dataKey="products" name="Number of Products" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">Supplier List</h3>
          <Link
            to="/suppliers"
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categories</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Terms</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSuppliers.slice(0, 5).map((supplier) => (
                <tr key={supplier._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center">
                        <Truck className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-3">
                        <Link 
                          to={`/suppliers/${supplier._id}`}
                          className="text-sm font-medium text-gray-900 dark:text-dark-text-primary hover:text-primary-600 dark:hover:text-primary-400"
                        >
                          {supplier.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-text-primary">{supplier.contactPerson}</div>
                    <div className="text-xs text-gray-500 dark:text-dark-text-secondary flex items-center">
                      <Mail className="h-3 w-3 mr-1" /> {supplier.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {supplier.leadTime} days
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {supplier.categories.slice(0, 2).map((category, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {category}
                        </span>
                      ))}
                      {supplier.categories.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          +{supplier.categories.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                    {formatPaymentTerm(supplier.paymentTerms)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuppliersReport;