
import { useMemo } from 'react';
import { StockData } from '@/services/api';
import { calculateEnhancedCorrelation } from '@/utils/math';

/**
 * Custom hook for efficient correlation matrix calculations
 * Features memoization and optimized re-computation strategies
 */
export const useCorrelationMatrix = (stocksData: { [ticker: string]: StockData[] }) => {
  const correlationMatrix = useMemo(() => {
    const tickers = Object.keys(stocksData);
    const matrix: { [key: string]: any } = {};
    
    // Performance optimization: calculate only upper triangle and mirror
    for (let i = 0; i < tickers.length; i++) {
      for (let j = i; j < tickers.length; j++) {
        const tickerA = tickers[i];
        const tickerB = tickers[j];
        
        const pricesA = stocksData[tickerA]?.map(d => d.price) || [];
        const pricesB = stocksData[tickerB]?.map(d => d.price) || [];
        
        const correlationData = calculateEnhancedCorrelation(pricesA, pricesB);
        
        // Store both directions for O(1) lookup
        const key1 = `${tickerA}-${tickerB}`;
        const key2 = `${tickerB}-${tickerA}`;
        
        matrix[key1] = correlationData;
        matrix[key2] = correlationData;
      }
    }
    
    return matrix;
  }, [stocksData]);
  
  const getCorrelation = (tickerA: string, tickerB: string) => {
    return correlationMatrix[`${tickerA}-${tickerB}`] || { 
      correlation: 0, 
      significance: 'negligible' as const, 
      reliability: 'low' as const 
    };
  };
  
  return { correlationMatrix, getCorrelation };
};
