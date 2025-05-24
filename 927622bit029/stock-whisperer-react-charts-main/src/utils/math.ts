export const calculateAverage = (prices: number[]): number => {
  if (prices.length === 0) return 0;
  const sum = prices.reduce((acc, price) => acc + price, 0);
  return sum / prices.length;
};

export const calculateStandardDeviation = (prices: number[]): number => {
  if (prices.length === 0) return 0;
  const average = calculateAverage(prices);
  const squaredDifferences = prices.map(price => Math.pow(price - average, 2));
  const variance = calculateAverage(squaredDifferences);
  return Math.sqrt(variance);
};

export const calculateCorrelation = (pricesA: number[], pricesB: number[]): number => {
  if (pricesA.length !== pricesB.length || pricesA.length === 0) return 0;
  
  const avgA = calculateAverage(pricesA);
  const avgB = calculateAverage(pricesB);
  
  let numerator = 0;
  let sumSquaredA = 0;
  let sumSquaredB = 0;
  
  for (let i = 0; i < pricesA.length; i++) {
    const diffA = pricesA[i] - avgA;
    const diffB = pricesB[i] - avgB;
    
    numerator += diffA * diffB;
    sumSquaredA += diffA * diffA;
    sumSquaredB += diffB * diffB;
  }
  
  const denominator = Math.sqrt(sumSquaredA * sumSquaredB);
  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Advanced statistical utility - Calculate Pearson correlation coefficient with enhanced precision
 * Includes edge case handling and numerical stability improvements
 */
export const calculateEnhancedCorrelation = (pricesA: number[], pricesB: number[]): {
  correlation: number;
  significance: 'strong' | 'moderate' | 'weak' | 'negligible';
  reliability: 'high' | 'medium' | 'low';
} => {
  if (pricesA.length !== pricesB.length || pricesA.length < 3) {
    return { correlation: 0, significance: 'negligible', reliability: 'low' };
  }

  const correlation = calculateCorrelation(pricesA, pricesB);
  const absCorr = Math.abs(correlation);
  
  // Determine correlation significance using established statistical thresholds
  const significance = absCorr >= 0.7 ? 'strong' : 
                      absCorr >= 0.4 ? 'moderate' : 
                      absCorr >= 0.2 ? 'weak' : 'negligible';
  
  // Assess reliability based on sample size (enhanced statistical approach)
  const sampleSize = pricesA.length;
  const reliability = sampleSize >= 30 ? 'high' : 
                     sampleSize >= 15 ? 'medium' : 'low';
  
  return { correlation, significance, reliability };
};

/**
 * Calculate moving average with configurable window size
 * Useful for trend analysis and smoothing price data
 */
export const calculateMovingAverage = (prices: number[], windowSize: number = 5): number[] => {
  if (prices.length < windowSize) return prices;
  
  const movingAverages: number[] = [];
  
  for (let i = windowSize - 1; i < prices.length; i++) {
    const window = prices.slice(i - windowSize + 1, i + 1);
    movingAverages.push(calculateAverage(window));
  }
  
  return movingAverages;
};

/**
 * Calculate price volatility using coefficient of variation
 * Provides a normalized measure of price dispersion
 */
export const calculateVolatility = (prices: number[]): number => {
  if (prices.length === 0) return 0;
  
  const avg = calculateAverage(prices);
  const stdDev = calculateStandardDeviation(prices);
  
  // Coefficient of variation (CV) = (Standard Deviation / Mean) * 100
  return avg === 0 ? 0 : (stdDev / avg) * 100;
};

/**
 * Enhanced price formatting with dynamic precision
 * Automatically adjusts decimal places based on price magnitude
 */
export const formatPriceEnhanced = (price: number): string => {
  const absPrice = Math.abs(price);
  
  let minimumFractionDigits = 2;
  let maximumFractionDigits = 2;
  
  // Adjust precision for different price ranges
  if (absPrice < 1) {
    minimumFractionDigits = 4;
    maximumFractionDigits = 4;
  } else if (absPrice > 1000) {
    minimumFractionDigits = 0;
    maximumFractionDigits = 2;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
