import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';

const ReportDateFilter = ({ dateRange, onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Predefined date ranges
  const predefinedRanges = [
    {
      label: 'Today',
      range: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
      },
    },
    {
      label: 'Yesterday',
      range: {
        startDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      },
    },
    {
      label: 'Last 7 Days',
      range: {
        startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
        endDate: new Date().toISOString().split('T')[0],
      },
    },
    {
      label: 'Last 30 Days',
      range: {
        startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
        endDate: new Date().toISOString().split('T')[0],
      },
    },
    {
      label: 'This Month',
      range: {
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: new Date().toISOString().split('T')[0],
      },
    },
    {
      label: 'Last Month',
      range: {
        startDate: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
      },
    },
  ];

  // Get current range display text
  const getDisplayText = () => {
    // Check if it matches any predefined range
    const predefinedRange = predefinedRanges.find(
      (range) =>
        range.range.startDate === dateRange.startDate && range.range.endDate === dateRange.endDate
    );

    if (predefinedRange) {
      return predefinedRange.label;
    }

    // Otherwise, format the custom date range
    return `${dayjs(dateRange.startDate).format('MMM D, YYYY')} - ${dayjs(dateRange.endDate).format(
      'MMM D, YYYY'
    )}`;
  };

  // Apply predefined range
  const applyPredefinedRange = (range) => {
    onDateRangeChange(range);
    setIsOpen(false);
  };

  // Handle custom date change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    onDateRangeChange({
      ...dateRange,
      [name]: value,
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <button
            type="button"
            className="btn btn-outline flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Calendar size={16} />
            <span>{getDisplayText()}</span>
            <ChevronDown size={16} />
          </button>

          {isOpen && (
            <div className="absolute mt-2 right-0 z-10 w-72 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">Predefined Ranges</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedRanges.map((range) => (
                      <button
                        key={range.label}
                        type="button"
                        className="btn btn-sm btn-outline py-1 text-left"
                        onClick={() => applyPredefinedRange(range.range)}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">Custom Range</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        className="input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
                        value={dateRange.startDate}
                        onChange={handleDateChange}
                        max={dateRange.endDate}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        className="input w-full dark:bg-dark-card dark:border-gray-700 dark:text-dark-text-primary"
                        value={dateRange.endDate}
                        onChange={handleDateChange}
                        min={dateRange.startDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-end">
          <div className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Showing data for {dayjs(dateRange.startDate).format('MMM D, YYYY')} - {dayjs(dateRange.endDate).format('MMM D, YYYY')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDateFilter;