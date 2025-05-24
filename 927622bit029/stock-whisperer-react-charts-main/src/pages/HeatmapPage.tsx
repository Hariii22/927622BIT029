
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, Info } from 'lucide-react';
import { fetchStockList, fetchStockData, StockData } from '@/services/api';
import HeatmapGrid from '@/components/HeatmapGrid';
import Legend from '@/components/Legend';
import { formatPrice, calculateAverage, calculateStandardDeviation } from '@/utils/math';

const HeatmapPage = () => {
  const [timeFrame, setTimeFrame] = useState<number>(30);
  const [stocksData, setStocksData] = useState<{ [ticker: string]: StockData[] }>({});
  const [selectedCell, setSelectedCell] = useState<{
    stockA: string;
    stockB: string;
    correlation: number;
    avgA: number;
    avgB: number;
    stdA: number;
    stdB: number;
  } | null>(null);

  const { data: stockList, isLoading: stockListLoading } = useQuery({
    queryKey: ['stockList'],
    queryFn: fetchStockList,
  });

  // Fetch data for multiple stocks
  const stockQueries = useQuery({
    queryKey: ['multipleStocks', timeFrame],
    queryFn: async () => {
      if (!stockList) return {};
      
      const selectedStocks = stockList.slice(0, 5); // Limit to 5 stocks for better performance
      const results: { [ticker: string]: StockData[] } = {};
      
      for (const stock of selectedStocks) {
        try {
          const data = await fetchStockData(stock.ticker, timeFrame);
          results[stock.ticker] = data;
        } catch (error) {
          console.error(`Failed to fetch data for ${stock.ticker}:`, error);
        }
      }
      
      return results;
    },
    enabled: !!stockList,
  });

  useEffect(() => {
    if (stockQueries.data) {
      setStocksData(stockQueries.data);
    }
  }, [stockQueries.data]);

  const timeFrameOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
  ];

  const handleCellClick = (stockA: string, stockB: string, correlation: number, avgA: number, avgB: number, stdA: number, stdB: number) => {
    setSelectedCell({ stockA, stockB, correlation, avgA, avgB, stdA, stdB });
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Correlation Heatmap</h1>
            </div>
            <Link
              to="/stocks"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Charts
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-xs">
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

            <button
              onClick={() => stockQueries.refetch()}
              disabled={stockQueries.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${stockQueries.isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {(stockListLoading || stockQueries.isLoading) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">
                {stockListLoading ? 'Loading stock list...' : 'Loading correlation data...'}
              </span>
            </div>
          </div>
        )}

        {/* Selected Cell Info */}
        {selectedCell && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Correlation Details: {selectedCell.stockA} vs {selectedCell.stockB}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Correlation Coefficient</div>
                    <div className={`text-lg font-bold ${selectedCell.correlation > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedCell.correlation.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">{selectedCell.stockA} Statistics</div>
                    <div className="text-gray-600">
                      Avg: {formatPrice(selectedCell.avgA)}<br />
                      Std Dev: {formatPrice(selectedCell.stdA)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">{selectedCell.stockB} Statistics</div>
                    <div className="text-gray-600">
                      Avg: {formatPrice(selectedCell.avgB)}<br />
                      Std Dev: {formatPrice(selectedCell.stdB)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap and Legend */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <HeatmapGrid stocksData={stocksData} onCellClick={handleCellClick} />
          </div>
          <div>
            <Legend />
          </div>
        </div>

        {/* Instructions */}
        {Object.keys(stocksData).length === 0 && !stockQueries.isLoading && (
          <div className="bg-green-50 rounded-lg border border-green-200 p-6 mt-8">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              How to use the Correlation Heatmap
            </h3>
            <ul className="text-green-800 space-y-1">
              <li>• Select a time frame to analyze correlations</li>
              <li>• Green cells indicate positive correlation (stocks move together)</li>
              <li>• Red cells indicate negative correlation (stocks move oppositely)</li>
              <li>• Click on any cell to see detailed statistics</li>
              <li>• Values closer to 1 or -1 indicate stronger correlations</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatmapPage;
