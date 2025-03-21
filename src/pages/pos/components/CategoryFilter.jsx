import React from 'react';
import { Tag } from 'lucide-react';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  // Category options
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
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === category.value
                ? 'bg-primary-100 text-primary-800 border border-primary-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onSelectCategory(category.value)}
          >
            {category.value === '' ? (
              category.label
            ) : (
              <span className="flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {category.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;