
export interface StockData {
  ticker: string;
  name: string;
  price: number;
  timestamp: string;
}

export interface StockListItem {
  ticker: string;
  name: string;
}

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const fetchStockList = async (): Promise<StockListItem[]> => {
  const cacheKey = 'stock-list';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('http://20.244.56.144/evaluation-service/stocks');
    if (!response.ok) {
      throw new Error('Failed to fetch stock list');
    }
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching stock list:', error);
    // Return mock data if API fails
    const mockData = [
      { ticker: 'AAPL', name: 'Apple Inc.' },
      { ticker: 'GOOGL', name: 'Alphabet Inc.' },
      { ticker: 'MSFT', name: 'Microsoft Corporation' },
      { ticker: 'TSLA', name: 'Tesla Inc.' },
      { ticker: 'AMZN', name: 'Amazon.com Inc.' },
    ];
    setCachedData(cacheKey, mockData);
    return mockData;
  }
};

export const fetchStockData = async (ticker: string, minutes: number = 30): Promise<StockData[]> => {
  const cacheKey = `stock-${ticker}-${minutes}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${ticker}`);
    }
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    // Return mock data if API fails
    const mockData = generateMockStockData(ticker, minutes);
    setCachedData(cacheKey, mockData);
    return mockData;
  }
};

const generateMockStockData = (ticker: string, minutes: number): StockData[] => {
  const data: StockData[] = [];
  const basePrice = Math.random() * 200 + 50; // Random base price between 50-250
  const now = new Date();
  
  for (let i = minutes; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60000);
    const price = basePrice + (Math.random() - 0.5) * 20; // Random fluctuation
    data.push({
      ticker,
      name: `${ticker} Inc.`,
      price: Math.max(0.01, price), // Ensure price is positive
      timestamp: timestamp.toISOString(),
    });
  }
  
  return data;
};
