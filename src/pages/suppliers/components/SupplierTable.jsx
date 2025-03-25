import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Phone,
  Mail,
  ChevronRight,
  Tag,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash,
  Package,
} from 'lucide-react';

// Table row actions dropdown component
const ActionsDropdown = ({ supplierId }) => {
  return (
    <div className="relative inline-block text-left dropdown">
      <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        <MoreHorizontal className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </button>
      <div className="dropdown-menu absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card rounded-md shadow-lg z-10 hidden">
        <div className="p-1">
          <Link
            to={`/suppliers/${supplierId}`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <ChevronRight className="mr-2 h-4 w-4" />
            View Details
          </Link>
          <Link
            to={`/suppliers/${supplierId}/edit`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <Link
            to={`/suppliers/${supplierId}/products`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <Package className="mr-2 h-4 w-4" />
            View Products
          </Link>
          <button className="flex w-full items-center px-4 py-2 text-sm text-danger-700 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 rounded-md">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Category badge component
const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
      <Tag className="mr-1 h-3 w-3" />
      {category}
    </span>
  );
};

const SupplierTable = ({ suppliers }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Categories
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Payment Terms
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                        {supplier.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-dark-text-secondary">
                        {supplier.supplierId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-dark-text-primary">
                    {supplier.contactPerson}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-dark-text-secondary flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {supplier.phone}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-dark-text-secondary flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {supplier.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {supplier.categories.map((category, index) => (
                      <CategoryBadge key={index} category={category} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="capitalize dark:text-dark-text-primary">
                    {supplier.paymentTerms || 'N/A'}
                  </span>
                  {supplier.leadTime && (
                    <div className="text-xs text-gray-500 dark:text-dark-text-secondary">
                      Lead time: {supplier.leadTime} day{supplier.leadTime !== 1 ? 's' : ''}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/suppliers/${supplier._id}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <ActionsDropdown supplierId={supplier._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTable;
