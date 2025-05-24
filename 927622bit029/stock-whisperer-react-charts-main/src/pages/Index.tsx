
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Stock Market Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time stock data visualization with interactive charts and correlation analysis. 
            Monitor stock prices and discover relationships between different securities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/stocks"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-blue-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Stock Charts</h2>
            </div>
            <p className="text-gray-600 mb-6">
              View real-time stock price charts with interactive tooltips, average price lines, 
              and customizable time frames.
            </p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
              View Charts
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            to="/heatmap"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-green-300"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Correlation Heatmap</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Analyze correlations between different stocks with an interactive heatmap. 
              Click cells to see detailed statistics.
            </p>
            <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
              View Heatmap
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">Real-time</div>
              <div className="text-gray-600">Live stock data updates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">Interactive</div>
              <div className="text-gray-600">Click and hover for details</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Analytics</div>
              <div className="text-gray-600">Advanced correlation analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
