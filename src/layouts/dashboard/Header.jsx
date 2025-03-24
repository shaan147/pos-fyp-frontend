import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, LogOut, Settings, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import ThemeToggle from '@components/common/ThemeToggle';

const Header = ({ onMenuButtonClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden"
              onClick={onMenuButtonClick}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <div className="ml-4 md:ml-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="search"
                  placeholder="Search..."
                  className="input pl-10 w-full md:w-60 lg:w-80 bg-gray-100 dark:bg-dark-bg border-0 dark:text-dark-text-primary dark:placeholder-dark-text-muted"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                className="relative p-1 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-dark-card"></span>
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-md shadow-lg dark:shadow-dark-dropdown overflow-hidden z-20">
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary p-2">Notifications</h3>
                    <div className="mt-2 max-h-72 overflow-y-auto">
                      {/* Notification items would go here */}
                      <div className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-md">
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">Low stock alert</p>
                        <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
                          Head & Shoulders Shampoo is running low
                        </p>
                        <p className="text-xs text-gray-400 dark:text-dark-text-muted mt-1">5 minutes ago</p>
                      </div>
                      <div className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-md">
                        <p className="text-sm font-medium text-gray-800 dark:text-dark-text-primary">New order received</p>
                        <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Order #12345 has been placed</p>
                        <p className="text-xs text-gray-400 dark:text-dark-text-muted mt-1">20 minutes ago</p>
                      </div>
                    </div>
                    <div className="p-2 text-center border-t dark:border-dark-border">
                      <Link
                        to="/notifications"
                        className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <span className="hidden md:flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{user?.name || 'User'}</span>
                  <ChevronDown size={16} className="ml-1 text-gray-500 dark:text-gray-400" />
                </span>
              </button>

              {/* User dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg dark:shadow-dark-dropdown z-20">
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg"
                    >
                      <Settings size={16} className="mr-2" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-bg"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
