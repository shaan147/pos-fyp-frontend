import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@services/orderService';
import { productService } from '@services/productService';
import { supplierService } from '@services/supplierService';
import { 
  BarChart, 
  TrendingUp, 
  Filter, 
  Download,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '@components/common/LoadingSpinner';

// Report components
import SalesReport from './components/SalesReport';
import InventoryReport from './components/InventoryReport';
import SuppliersReport from './components/SuppliersReport';
import ReportDateFilter from './components/ReportDateFilter';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().split('T')[0];
    })(),
    endDate: new Date().toISOString().split('T')[0]
  });

  // Sales report data
  const { 
    data: salesData, 
    isLoading: isLoadingSales 
  } = useQuery({
    queryKey: ['reports-sales', dateRange],
    queryFn: () => orderService.getOrderAnalytics(dateRange.startDate, dateRange.endDate),
  });

  // Inventory report data
  const { 
    data: inventoryData, 
    isLoading: isLoadingInventory 
  } = useQuery({
    queryKey: ['reports-inventory'],
    queryFn: () => productService.getAllProducts({ limit: 100 }),
  });

  // Low stock products data
  const { 
    data: lowStockData, 
    isLoading: isLoadingLowStock 
  } = useQuery({
    queryKey: ['reports-lowstock'],
    queryFn: () => productService.getLowStockProducts(),
  });

  // Suppliers report data
  const { 
    data: suppliersData, 
    isLoading: isLoadingSuppliers 
  } = useQuery({
    queryKey: ['reports-suppliers'],
    queryFn: () => supplierService.getAllSuppliers({ limit: 100 }),
  });

  // Handle date range change
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  // Handle export report
  const handleExportReport = () => {
    // In a real application, this would generate a CSV or PDF file
    alert('Report exported successfully!');
  };

  // Report tabs
  const reportTabs = [
    {
      id: 'sales',
      name: 'Sales Report',
      icon: TrendingUp,
      isLoading: isLoadingSales,
      data: salesData,
      component: SalesReport,
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      icon: BarChart,
      isLoading: isLoadingInventory || isLoadingLowStock,
      data: { products: inventoryData, lowStock: lowStockData },
      component: InventoryReport,
    },
    {
      id: 'suppliers',
      name: 'Suppliers Report',
      icon: Filter,
      isLoading: isLoadingSuppliers,
      data: suppliersData,
      component: SuppliersReport,
    },
  ];

  // Find active report
  const activeReportTab = reportTabs.find(tab => tab.id === activeReport);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze sales, inventory, and supplier performance
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="btn btn-outline inline-flex items-center gap-x-2 mt-4 sm:mt-0"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Report Navigation */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b">
          <nav className="flex -mb-px overflow-x-auto">
            {reportTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeReport === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveReport(tab.id)}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.name}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Date Filter */}
        <div className="p-4 border-b bg-gray-50">
          <ReportDateFilter
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        {/* Report Content */}
        <div className="p-6">
          {activeReportTab.isLoading ? (
            <div className="flex justify-center items-center h-60">
              <LoadingSpinner size="large" />
            </div>
          ) : activeReportTab.data ? (
            <activeReportTab.component data={activeReportTab.data} dateRange={dateRange} />
          ) : (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-danger-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-danger-800">Error loading report data</h3>
                  <div className="mt-2 text-sm text-danger-700">
                    <p>There was an error loading the report data. Please try again.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;