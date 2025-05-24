
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { StockData } from '@/services/api';
import { calculateAverage, formatPrice, formatTime } from '@/utils/math';

interface StockChartProps {
  data: StockData[];
  ticker: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, ticker }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const prices = data.map(item => item.price);
  const averagePrice = calculateAverage(prices);

  const chartData = data.map(item => ({
    ...item,
    time: formatTime(item.timestamp),
    formattedPrice: formatPrice(item.price),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{ticker}</p>
          <p className="text-sm text-gray-600">Time: {label}</p>
          <p className="text-sm">
            <span className="text-blue-600 font-medium">Price: {data.formattedPrice}</span>
          </p>
          <p className="text-sm text-gray-600">
            Average: {formatPrice(averagePrice)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        {ticker} Stock Price Chart
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#666"
            fontSize={12}
            tick={{ fill: '#666' }}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tick={{ fill: '#666' }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={averagePrice} 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            strokeWidth={2}
            label="Average"
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
