import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Plus } from 'lucide-react';

const EmptyState = ({ title, description }) => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg border dark:border-gray-700 shadow-sm p-8 text-center">
      <ClipboardList className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-dark-text-primary">{title}</h3>
      <p className="mt-1 text-gray-500 dark:text-dark-text-secondary">{description}</p>
      <div className="mt-6">
        <Link
          to="/pos"
          className="btn btn-primary inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;