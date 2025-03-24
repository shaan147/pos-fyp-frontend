import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@hooks/useAuth';

const DashboardLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark-bg">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} user={user} />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} onMenuButtonClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 dark:bg-dark-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;