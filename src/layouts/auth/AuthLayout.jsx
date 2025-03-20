import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Brand/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 flex-col justify-center items-center text-white p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <ShoppingCart size={64} />
          </div>
          <h1 className="text-4xl font-bold mb-6">POS & Inventory System</h1>
          <p className="text-lg mb-8">
            Streamline your business operations with our comprehensive Point of Sale and Inventory Management solution.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="mr-4 bg-white bg-opacity-20 p-2 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span>Real-time inventory tracking</span>
            </div>
            <div className="flex items-center">
              <div className="mr-4 bg-white bg-opacity-20 p-2 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span>Automated supplier notifications</span>
            </div>
            <div className="flex items-center">
              <div className="mr-4 bg-white bg-opacity-20 p-2 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span>Image recognition for self-checkout</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;