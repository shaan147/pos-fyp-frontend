import React, { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { 
  Settings as SettingsIcon,
  User,
  Building,
  CreditCard,
  Lock,
  Bell
} from 'lucide-react';

// Components
import ProfileSettings from './components/ProfileSettings';
import BusinessSettings from './components/BusinessSettings';
import PaymentSettings from './components/PaymentSettings';
import SecuritySettings from './components/SecuritySettings';
import NotificationSettings from './components/NotificationSettings';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Settings tabs
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} />, roles: ['admin', 'manager', 'cashier', 'customer'] },
    { id: 'business', label: 'Business', icon: <Building size={18} />, roles: ['admin'] },
    { id: 'payment', label: 'Payment', icon: <CreditCard size={18} />, roles: ['admin'] },
    { id: 'security', label: 'Security', icon: <Lock size={18} />, roles: ['admin', 'manager', 'cashier', 'customer'] },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} />, roles: ['admin', 'manager'] }
  ];

  // Filter tabs based on user role
  const allowedTabs = tabs.filter(tab => tab.roles.includes(user?.role || 'customer'));

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings user={user} />;
      case 'business':
        return <BusinessSettings />;
      case 'payment':
        return <PaymentSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return <ProfileSettings user={user} />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="h-6 w-6 mr-2 text-gray-500" />
          Settings
        </h1>
        <p className="mt-1 text-gray-500">
          Manage your account and application preferences
        </p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="sm:w-60 border-b sm:border-b-0 sm:border-r">
            <nav className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto">
              {allowedTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-3 flex items-center space-x-3 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border-b-2 sm:border-b-0 sm:border-l-2 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;