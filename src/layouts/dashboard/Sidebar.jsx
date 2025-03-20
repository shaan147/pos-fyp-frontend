import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  ClipboardList, 
  Users, 
  BarChart, 
  Settings, 
  X, 
  Truck 
} from 'lucide-react';
import classNames from 'classnames';

const navItems = [
  {
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />,
    label: 'Dashboard',
    roles: ['admin', 'manager', 'cashier', 'customer'],
  },
  {
    path: '/pos',
    icon: <ShoppingCart size={20} />,
    label: 'Point of Sale',
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    path: '/products',
    icon: <Package size={20} />,
    label: 'Products',
    roles: ['admin', 'manager', 'cashier'],
  },
  {
    path: '/orders',
    icon: <ClipboardList size={20} />,
    label: 'Orders',
    roles: ['admin', 'manager', 'cashier', 'customer'],
  },
  {
    path: '/suppliers',
    icon: <Truck size={20} />,
    label: 'Suppliers',
    roles: ['admin', 'manager'],
  },
  {
    path: '/customers',
    icon: <Users size={20} />,
    label: 'Customers',
    roles: ['admin', 'manager'],
  },
  {
    path: '/reports',
    icon: <BarChart size={20} />,
    label: 'Reports',
    roles: ['admin', 'manager'],
  },
  {
    path: '/settings',
    icon: <Settings size={20} />,
    label: 'Settings',
    roles: ['admin', 'manager', 'cashier', 'customer'],
  },
];

const Sidebar = ({ open, setOpen, user }) => {
  const location = useLocation();
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || 'customer')
  );

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar container */}
      <div
        className={classNames(
          'fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-white p-4 transition duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0',
          {
            'translate-x-0': open,
            '-translate-x-full': !open,
          }
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-semibold text-gray-900">POS System</span>
          </div>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-600"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* User info */}
        <div className="mt-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Guest'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-1">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                classNames(
                  'flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors',
                  {
                    'bg-primary-50 text-primary-700': isActive || location.pathname.startsWith(item.path),
                    'text-gray-700 hover:bg-gray-100': !(isActive || location.pathname.startsWith(item.path)),
                  }
                )
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* App version */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-gray-500">Version 1.0.0</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;