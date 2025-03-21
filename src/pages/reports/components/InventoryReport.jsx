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
  Cell
} from 'recharts';
import { 
  Package, 
  AlertCircle, 
  DollarSign, 
  Tag, 
  Truck,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const InventoryReport = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Extract data
  const { products, lowStock } = data;
  const productData = products?.data || [];
  const lowStockData = lowStock?.data || [];
  
  // Filter products based on search and category
  const filteredProducts = productData.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group products by category for chart
  const categoryCounts = productData.reduce((acc, product) => {
    const category = product.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count
  }));
  
  // Calculate total stock value
  const totalStockValue = productData.reduce(
    (sum, product) => sum + (product.costPrice * product.stockQuantity),
    0
  );
  
  // Calculate stock status
  const inStockCount = productData.filter(p => p.stockQuantity > p.minStockLevel).length;
  const lowStockCount = productData.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.minStockLevel).length;
  const outOfStockCount = productData.filter(p => p.stockQuantity === 0).length;
  
  const stockStatusData = [
    { name: 'In Stock', value: inStockCount },
    { name: 'Low Stock', value: lowStockCount },
    { name: 'Out of Stock', value: outOfStockCount }
  ];
  
  // Prepare top products by value for bar chart instead of TreeMap
  const topProductsValueData = productData
    .map(product => ({
      name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
      value: product.costPrice * product.stockQuantity,
      category: product.category
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  
  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const STATUS_COLORS = {
    'In Stock': '#10B981',
    'Low Stock': '#F59E0B',
    'Out of Stock': '#EF4444'
  };
  
  // Categories for filter
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
  
  // Format currency
  const formatCurrency = (value) => {
    return `₨${value?.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10 w-full"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <select
              className="input w-full"
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
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
              <Package size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold">{productData.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-success-100 text-success-600 mr-3">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Stock Value</p>
              <p className="text-2xl font-semibold">{formatCurrency(totalStockValue)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-warning-100 text-warning-600 mr-3">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-semibold">{lowStockData.length}</p>
              {lowStockData.length > 0 && (
                <Link 
                  to="/products/lowstock" 
                  className="text-xs text-primary-600 hover:underline"
                >
                  View items
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Categories Chart */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Product Categories</h3>
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

        {/* Stock Status Chart */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stockStatusData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name]} />
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

      {/* Top Products by Value - Using BarChart instead of TreeMap */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products by Inventory Value</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProductsValueData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), "Value"]}
                labelFormatter={(value) => `Product: ${value}`}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Inventory Value" 
                fill="#8884d8" 
                background={{ fill: '#eee' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">Showing top 10 products by inventory value</p>
      </div>

      {/* Low Stock Items */}
      {lowStockData.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Low Stock Items</h3>
            <Link
              to="/products/lowstock"
              className="text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lowStockData.slice(0, 5).map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <Link 
                            to={`/products/${product._id}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600"
                          >
                            {product.name}
                          </Link>
                          <div className="text-xs text-gray-500">{product.productId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-danger-600 font-medium">
                        {product.stockQuantity} {product.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {product.minStockLevel} {product.unit}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{product.supplierName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.costPrice * product.stockQuantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryReport;