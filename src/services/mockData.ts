import { HistoricalData, MarketData, PopularAsset } from '../types';

export const getMarketData = (symbol: string, market: 'US' | 'India'): MarketData => {
  // This would be fetched from an API in a real application
  const mockData: Record<string, MarketData> = {
    'AAPL': {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      currentPrice: 189.84,
      previousClose: 186.29,
      changePercent: 1.91,
      predictedPrice: 195.54,
      predictedChangePercent: 3.00,
      confidenceLevel: 87,
      marketCap: '2.97T',
      volume: '52.61M',
      currency: '$'
    },
    'MSFT': {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      currentPrice: 417.49,
      previousClose: 414.17,
      changePercent: 0.80,
      predictedPrice: 424.75,
      predictedChangePercent: 1.74,
      confidenceLevel: 92,
      marketCap: '3.10T',
      volume: '18.26M',
      currency: '$'
    },
    'RELIANCE': {
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      currentPrice: 2962.20,
      previousClose: 2948.75,
      changePercent: 0.46,
      predictedPrice: 3020.54,
      predictedChangePercent: 1.97,
      confidenceLevel: 85,
      marketCap: '20.04L Cr',
      volume: '4.28M',
      currency: '₹'
    },
    'TATAMOTORS': {
      symbol: 'TATAMOTORS',
      name: 'Tata Motors Ltd',
      currentPrice: 992.65,
      previousClose: 978.10,
      changePercent: 1.49,
      predictedPrice: 1021.40,
      predictedChangePercent: 2.90,
      confidenceLevel: 78,
      marketCap: '3.81L Cr',
      volume: '7.89M',
      currency: '₹'
    },
    'BTC': {
      symbol: 'BTC',
      name: 'Bitcoin',
      currentPrice: 69422.65,
      previousClose: 67891.35,
      changePercent: 2.26,
      predictedPrice: 71505.72,
      predictedChangePercent: 3.00,
      confidenceLevel: 75,
      marketCap: '1.36T',
      volume: '38.40B',
      currency: '$'
    },
    'ETH': {
      symbol: 'ETH',
      name: 'Ethereum',
      currentPrice: 3812.53,
      previousClose: 3765.18,
      changePercent: 1.26,
      predictedPrice: 3927.65,
      predictedChangePercent: 3.02,
      confidenceLevel: 80,
      marketCap: '458.21B',
      volume: '15.67B',
      currency: '$'
    }
  };

  // If symbol not found, return AAPL or RELIANCE based on market
  return mockData[symbol] || mockData[market === 'US' ? 'AAPL' : 'RELIANCE'];
};

export const getChartData = (symbol: string): HistoricalData => {
  // Generate 30 days of historical data and 7 days of predicted data
  const today = new Date();
  const historical: { date: string; price: number }[] = [];
  const predicted: { date: string; price: number }[] = [];
  
  // Base price varies by symbol
  let basePrice = 0;
  switch(symbol) {
    case 'AAPL': basePrice = 180; break;
    case 'MSFT': basePrice = 410; break;
    case 'RELIANCE': basePrice = 2900; break;
    case 'TATAMOTORS': basePrice = 970; break;
    case 'BTC': basePrice = 65000; break;
    case 'ETH': basePrice = 3700; break;
    default: basePrice = 100;
  }
  
  // Generate historical data (30 days back)
  for (let i = 30; i >= 1; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create some volatility
    const volatility = (Math.random() - 0.5) * 0.08; // -4% to +4%
    const dailyChange = basePrice * volatility;
    basePrice += dailyChange;
    
    historical.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(basePrice.toFixed(2))
    });
  }
  
  // Use the last historical price as starting point for predictions
  let lastPrice = historical[historical.length - 1].price;
  
  // Generate prediction data (7 days forward)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Create some volatility with an upward bias for predictions
    const volatility = (Math.random() * 0.06) - 0.01; // -1% to +5%
    const dailyChange = lastPrice * volatility;
    lastPrice += dailyChange;
    
    predicted.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(lastPrice.toFixed(2))
    });
  }
  
  return { historical, predicted };
};

export const getPopularAssets = (market: 'US' | 'India'): PopularAsset[] => {
  if (market === 'US') {
    return [
      { symbol: 'AAPL', name: 'Apple', price: 189.84, changePercent: 1.91 },
      { symbol: 'MSFT', name: 'Microsoft', price: 417.49, changePercent: 0.80 },
      { symbol: 'GOOGL', name: 'Alphabet', price: 175.98, changePercent: -0.24 },
      { symbol: 'AMZN', name: 'Amazon', price: 182.41, changePercent: 1.15 },
      { symbol: 'TSLA', name: 'Tesla', price: 248.14, changePercent: 2.37 },
      { symbol: 'BTC', name: 'Bitcoin', price: 69422.65, changePercent: 2.26 },
      { symbol: 'ETH', name: 'Ethereum', price: 3812.53, changePercent: 1.26 },
      { symbol: 'SOL', name: 'Solana', price: 142.26, changePercent: 3.74 }
    ];
  } else {
    return [
      { symbol: 'RELIANCE', name: 'Reliance', price: 2962.20, changePercent: 0.46 },
      { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 992.65, changePercent: 1.49 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1587.75, changePercent: -0.15 },
      { symbol: 'INFY', name: 'Infosys', price: 1475.30, changePercent: 0.68 },
      { symbol: 'TCS', name: 'TCS', price: 3892.45, changePercent: 1.23 },
      { symbol: 'WBTC', name: 'Bitcoin', price: 5731265.75, changePercent: 2.26 },
      { symbol: 'WETH', name: 'Ethereum', price: 314535.26, changePercent: 1.26 },
      { symbol: 'WSOL', name: 'Solana', price: 11748.15, changePercent: 3.74 }
    ];
  }
};

export const searchSymbols = (query: string, market: 'US' | 'India'): { symbol: string; name: string }[] => {
  const usSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'BRK.A', name: 'Berkshire Hathaway Inc.' },
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'XRP', name: 'Ripple' }
  ];
  
  const indiaSymbols = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.' },
    { symbol: 'INFY', name: 'Infosys Ltd.' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports and Special Economic Zone Ltd.' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
    { symbol: 'WETH', name: 'Wrapped Ethereum' },
    { symbol: 'WSOL', name: 'Wrapped Solana' },
    { symbol: 'WXRP', name: 'Wrapped Ripple' }
  ];
  
  const symbols = market === 'US' ? usSymbols : indiaSymbols;
  
  if (!query) return symbols.slice(0, 5);
  
  return symbols
    .filter(item => 
      item.symbol.toLowerCase().includes(query.toLowerCase()) || 
      item.name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);
};