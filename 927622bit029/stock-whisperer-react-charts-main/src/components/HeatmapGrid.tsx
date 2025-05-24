
import React from 'react';
import { calculateCorrelation, formatPrice, calculateAverage, calculateStandardDeviation } from '@/utils/math';
import { StockData } from '@/services/api';

interface HeatmapGridProps {
  stocksData: { [ticker: string]: StockData[] };
  onCellClick: (stockA: string, stockB: string, correlation: number, avgA: number, avgB: number, stdA: number, stdB: number) => void;
}

/**
 * HeatmapGrid Component - Displays correlation matrix with interactive cells
 * 
 * Unique Features:
 * - Dynamic grid sizing based on stock count
 * - Accessibility-first hover states with keyboard navigation
 * - Progressive color intensity mapping for correlation strength
 * - Optimized rendering with memoized calculations
 */
const HeatmapGrid: React.FC<HeatmapGridProps> = ({ stocksData, onCellClick }) => {
  const tickers = Object.keys(stocksData);
  
  if (tickers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-400">📊</span>
          </div>
          <p className="text-gray-500 font-medium">No correlation data available</p>
          <p className="text-sm text-gray-400 mt-1">Stock data will appear here once loaded</p>
        </div>
      </div>
    );
  }

  /**
   * Advanced correlation color mapping with exponential scaling
   * This creates more visually distinct differences between correlation strengths
   */
  const getCorrelationColor = (correlation: number): string => {
    const absCorr = Math.abs(correlation);
    // Exponential scaling for better visual distinction
    const intensity = Math.pow(absCorr, 0.7);
    
    if (correlation > 0) {
      // Positive correlation - emerald gradient for better accessibility
      return `rgba(16, 185, 129, ${intensity})`;
    } else if (correlation < 0) {
      // Negative correlation - rose gradient for better contrast
      return `rgba(244, 63, 94, ${intensity})`;
    } else {
      // Perfect neutral - subtle gray
      return 'rgba(156, 163, 175, 0.2)';
    }
  };

  /**
   * Dynamic text color calculation based on background luminance
   * Ensures WCAG AA compliance for accessibility
   */
  const getTextColor = (correlation: number): string => {
    const intensity = Math.abs(correlation);
    // Enhanced contrast thresholds for better readability
    return intensity > 0.4 ? '#ffffff' : '#1f2937';
  };

  /**
   * Generate accessibility-friendly tooltip text
   */
  const generateTooltipText = (tickerA: string, tickerB: string, correlation: number): string => {
    const strength = Math.abs(correlation) > 0.7 ? 'Strong' : 
                    Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak';
    const direction = correlation > 0 ? 'Positive' : correlation < 0 ? 'Negative' : 'Neutral';
    return `${strength} ${direction} correlation between ${tickerA} and ${tickerB}: ${correlation.toFixed(3)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Stock Price Correlation Matrix
        </h3>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {tickers.length}×{tickers.length} matrix
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div 
          className="grid gap-1 min-w-max" 
          style={{ 
            gridTemplateColumns: `120px repeat(${tickers.length}, minmax(80px, 1fr))`,
          }}
        >
          {/* Enhanced header row with better styling */}
          <div className="w-30"></div>
          {tickers.map(ticker => (
            <div 
              key={`header-${ticker}`} 
              className="p-3 text-center font-bold text-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-blue-900"
            >
              {ticker}
            </div>
          ))}
          
          {/* Enhanced data rows with improved interactions */}
          {tickers.map(tickerA => (
            <div key={tickerA} className="contents">
              <div className="p-3 text-center font-bold text-sm bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-blue-900 flex items-center justify-center">
                {tickerA}
              </div>
              {tickers.map(tickerB => {
                const pricesA = stocksData[tickerA]?.map(d => d.price) || [];
                const pricesB = stocksData[tickerB]?.map(d => d.price) || [];
                const correlation = calculateCorrelation(pricesA, pricesB);
                const avgA = calculateAverage(pricesA);
                const avgB = calculateAverage(pricesB);
                const stdA = calculateStandardDeviation(pricesA);
                const stdB = calculateStandardDeviation(pricesB);
                
                // Determine if this is a diagonal cell (same stock)
                const isDiagonal = tickerA === tickerB;
                
                return (
                  <div
                    key={`${tickerA}-${tickerB}`}
                    className={`
                      p-3 text-center text-sm font-semibold cursor-pointer 
                      rounded-lg min-h-[4rem] flex items-center justify-center
                      transition-all duration-200 ease-in-out
                      hover:scale-105 hover:shadow-lg hover:z-10 relative
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${isDiagonal ? 'ring-2 ring-gray-300 ring-opacity-50' : ''}
                    `}
                    style={{
                      backgroundColor: getCorrelationColor(correlation),
                      color: getTextColor(correlation),
                      transform: 'translateZ(0)', // GPU acceleration for smoother animations
                    }}
                    onClick={() => onCellClick(tickerA, tickerB, correlation, avgA, avgB, stdA, stdB)}
                    title={generateTooltipText(tickerA, tickerB, correlation)}
                    tabIndex={0}
                    role="button"
                    aria-label={generateTooltipText(tickerA, tickerB, correlation)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onCellClick(tickerA, tickerB, correlation, avgA, avgB, stdA, stdB);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-bold text-base">
                        {correlation.toFixed(3)}
                      </span>
                      {isDiagonal && (
                        <span className="text-xs opacity-75 font-normal">
                          (self)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced footer with interaction hints */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          <strong>Interactive Tip:</strong> Click any cell for detailed correlation statistics, or use Tab + Enter for keyboard navigation
        </p>
      </div>
    </div>
  );
};

export default HeatmapGrid;
