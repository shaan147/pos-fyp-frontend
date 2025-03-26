import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 dark:bg-dark-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-dark-text-primary mt-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary mt-2">Sorry, we couldn't find the page you're looking for.</p>
        <div className="mt-8">
          <Link 
            to="/" 
            className="btn btn-primary inline-flex items-center px-6 py-3"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;