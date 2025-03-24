import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

const Dropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState('bottom'); // 'bottom' or 'top'
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Determine the position of the dropdown when opening
  const toggleDropdown = () => {
    if (!isOpen) {
      // Check if there's enough space below before opening
      if (triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        const spaceBelow = screenHeight - triggerRect.bottom;
        
        // If there's less than 250px below (typical dropdown height), position it above
        if (spaceBelow < 250) {
          setPosition('top');
        } else {
          setPosition('bottom');
        }
      }
    }
    
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger button */}
      <div ref={triggerRef}>
        {trigger ? (
          <div onClick={toggleDropdown}>{trigger}</div>
        ) : (
          <button 
            onClick={toggleDropdown}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 w-56 bg-white dark:bg-dark-card rounded-md shadow-lg z-50`}
          style={{
            maxHeight: '250px',
            overflowY: 'auto'
          }}
        >
          <div className="p-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;