import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Mock data - in a real app, this would come from the API
const generateMockData = (dateRange) => {
  const data = [];
  const today = new Date();
  let daysToShow = 7;
  let format = 'day';
  
  if (dateRange === 'month') {
    daysToShow = 30;
  } else if (dateRange === 'year') {
    daysToShow = 12;
    format = 'month';
  }
  
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(today);
    
    if (format === 'day') {
      date.setDate(date.getDate() - i);
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
      const dayOfMonth = date.getDate();
      const label = `${dayName} ${dayOfMonth}`;
      
      data.push({
        name: label,
        sales: Math.floor(Math.random() * 10000) + 5000,
        orders: Math.floor(Math.random() * 50) + 20,
      });
    } else if (format === 'month') {
      date.setMonth(date.getMonth() - i);
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
      
      data.push({
        name: monthName,
        sales: Math.floor(Math.random() * 100000) + 50000,
        orders: Math.floor(Math.random() * 500) + 200,
      });
    }
  }
  
  return data;
};

const SalesChart = ({ dateRange }) => {
  const data = useMemo(() => generateMockData(dateRange), [dateRange]);
  
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'sales') {
                return [`₨${value.toLocaleString()}`, 'Sales'];
              }
              return [value, 'Orders'];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            stroke="#0ea5e9"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Sales"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="orders" 
            stroke="#8b5cf6"
            strokeWidth={2}
            name="Orders" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;