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
  Package
} from 'lucide-react';

// Table row actions dropdown component
const ActionsDropdown = ({ supplierId }) => {
  return (
    <div className="relative inline-block text-left dropdown">
      <button className="p-1 rounded-full hover:bg-gray-100">
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </button>
      <div className="dropdown-menu absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 hidden">
        <div className="p-1">
          <Link
            to={`/suppliers/${supplierId}`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight className="mr-2 h-4 w-4" />
            View Details
          </Link>
          <Link
            to={`/suppliers/${supplierId}/edit`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <Link
            to={`/suppliers/${supplierId}/products`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Package className="mr-2 h-4 w-4" />
            View Products
          </Link>
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-danger-700 hover:bg-danger-50 rounded-md"
          >
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
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
      <Tag className="mr-1 h-3 w-3" />
      {category}
    </span>
  );
};

const SupplierTable = ({ suppliers }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-primary-100 rounded-md flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {supplier.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {supplier.supplierId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {supplier.contactPerson}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {supplier.phone}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
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
                  <span className="capitalize">{supplier.paymentTerms || 'N/A'}</span>
                  {supplier.leadTime && (
                    <div className="text-xs text-gray-500">
                      Lead time: {supplier.leadTime} day{supplier.leadTime !== 1 ? 's' : ''}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/suppliers/${supplier._id}`}
                      className="text-primary-600 hover:text-primary-900"
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