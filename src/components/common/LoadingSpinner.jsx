import React from 'react';
import classNames from 'classnames';

const LoadingSpinner = ({ size = 'medium', className }) => {
  const spinnerClasses = classNames(
    'animate-spin rounded-full border-t-transparent border-solid',
    {
      'h-4 w-4 border-2': size === 'small',
      'h-8 w-8 border-2': size === 'medium',
      'h-12 w-12 border-4': size === 'large',
    },
    'border-primary-600',
    className
  );

  return (
    <div className="flex items-center justify-center">
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;