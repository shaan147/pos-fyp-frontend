import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200
                dark:text-dark-text-secondary dark:hover:text-dark-text-primary dark:hover:bg-dark-card dark:focus:ring-offset-dark-bg"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun size={20} className="text-warning-400" />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
};

export default ThemeToggle;