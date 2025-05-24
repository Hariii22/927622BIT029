
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';
import { fetchStockList, fetchStockData } from '@/services/api';
import StockChart from '@/components/StockChart';

const StockPage = () => {
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [timeFrame, setTimeFrame] = useState<number>(30);

  const { data: stockList, isLoading: stockListLoading } = useQuery({
    queryKey: ['stockList'],
    queryFn: fetchStockList,
  });

  const { data: stockData, isLoading: stockDataLoading, refetch } = useQuery({
    queryKey: ['stockData', selectedTicker, timeFrame],
    queryFn: () => fetchStockData(selectedTicker, timeFrame),
    enabled: !!selectedTicker,
  });

  const timeFrameOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <div className="text-gray-400">|</div>
              <h1 className="text-2xl font-bold text-gray-900">Stock Charts</h1>
            </div>
            <Link
              to="/heatmap"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              View Heatmap
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Stock
              </label>
              <select
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={stockListLoading}
              >
                <option value="">Select a stock...</option>
                {stockList?.map((stock) => (
                  <option key={stock.ticker} value={stock.ticker}>
                    {stock.ticker} - {stock.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Frame
              </label>
              <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timeFrameOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => refetch()}
                disabled={!selectedTicker || stockDataLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${stockDataLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {stockListLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Loading stock list...</span>
            </div>
          </div>
        )}

        {/* Chart */}
        {selectedTicker && (
          <div className="mb-8">
            {stockDataLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-center h-96">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                  <span className="text-gray-600">Loading stock data for {selectedTicker}...</span>
                </div>
              </div>
            ) : stockData ? (
              <StockChart data={stockData} ticker={selectedTicker} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center text-gray-500">
                  No data available for {selectedTicker}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!selectedTicker && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How to use Stock Charts
            </h3>
            <ul className="text-blue-800 space-y-1">
              <li>• Select a stock from the dropdown menu</li>
              <li>• Choose your preferred time frame</li>
              <li>• View the interactive chart with price history</li>
              <li>• Hover over data points to see detailed information</li>
              <li>• The red dashed line shows the average price</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPage;
