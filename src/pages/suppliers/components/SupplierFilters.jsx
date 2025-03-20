import React from 'react';
import { Filter, Tag } from 'lucide-react';

const SupplierFilters = ({ filters, onChange }) => {
  // Category options for filtering
  const categories = [
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
    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-2/3">
      {/* Category filter */}
      <div className="relative flex-1">
        <select
          name="category"
          className="input w-full appearance-none pl-10"
          value={filters.category}
          onChange={onChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Tag className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Sort filter */}
      <div className="relative flex-1">
        <select
          name="sort"
          className="input w-full"
          value={filters.sort}
          onChange={onChange}
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="name">Name (A-Z)</option>
          <option value="-name">Name (Z-A)</option>
          <option value="leadTime">Lead Time (Low to High)</option>
          <option value="-leadTime">Lead Time (High to Low)</option>
        </select>
      </div>
    </div>
  );
};

export default SupplierFilters;