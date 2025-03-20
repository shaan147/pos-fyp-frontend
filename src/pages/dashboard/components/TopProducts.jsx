import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data - in a real app, this would come from the API
const data = [
  {
    name: 'Head & Shoulders',
    sales: 4200,
  },
  {
    name: 'Lux Soap',
    sales: 3800,
  },
  {
    name: 'Nestle Milk',
    sales: 2900,
  },
  {
    name: 'Pepsi 1.5L',
    sales: 2800,
  },
  {
    name: 'Tapal Tea',
    sales: 2400,
  },
];

const TopProducts = () => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={100} />
          <Tooltip 
            formatter={(value) => [`₨${value.toLocaleString()}`, 'Sales']}
          />
          <Bar 
            dataKey="sales" 
            fill="#0ea5e9"
            radius={[0, 4, 4, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProducts;