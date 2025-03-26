import React, { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { User, Lock, ChevronRight } from 'lucide-react';
import ProfileSettings from './components/ProfileSettings';
import SecuritySettings from './components/SecuritySettings';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      name: 'Profile Settings',
      icon: User,
      component: ProfileSettings,
      roles: ['admin', 'manager', 'cashier', 'customer'],
    },
    {
      id: 'security',
      name: 'Security Settings',
      icon: Lock,
      component: SecuritySettings,
      roles: ['admin', 'manager', 'cashier', 'customer'],
    },
  ];

  // Filter tabs based on user role
  const allowedTabs = tabs.filter((tab) => tab.roles.includes(user?.role || 'customer'));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64">
            <nav className="space-y-1">
              {allowedTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                        : 'text-gray-700 dark:text-dark-text-primary hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mr-3 ${
                      activeTab === tab.id
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    {tab.name}
                    <ChevronRight className={`h-4 w-4 ml-auto ${
                      activeTab === tab.id
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {allowedTabs.map((tab) => {
              const Component = tab.component;
              return (
                <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
                  <Component user={user} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
