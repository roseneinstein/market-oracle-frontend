import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import PriceDisplay from './PriceDisplay';
import PredictionSection from './PredictionSection';
import PriceChart from './PriceChart';
import PopularAssets from './PopularAssets';
import Toggle from './common/Toggle';
import { MarketData, HistoricalData, ChartData, PopularAsset, MarketType } from '../types'; // Import all necessary types
import { Sun, Moon, ChevronDown } from 'lucide-react';

// IMPORTANT: No local interfaces needed here anymore if imported from types/index.ts
// Remove these local interface definitions to avoid confusion and ensure single source of truth
// interface MarketData { ... }
// interface HistoricalDataPoint { ... }
// interface PopularAsset { ... }


const Dashboard: React.FC = () => {
  const [market, setMarket] = useState<MarketType>('US');
  const [symbol, setSymbol] = useState('AAPL'); // Default to AAPL

  // Initialize marketData with ALL properties from the MarketData interface,
  // setting absent/unknown ones to null or a default.
  const [marketData, setMarketData] = useState<MarketData>({
    symbol: 'AAPL',
    name: null, // Initialize
    currentPrice: null,
    previousClose: null, // Initialize
    priceChange: null,
    percentageChange: null,
    predictedPrice: null, // Initialize
    predictedChangePercent: null, // Initialize
    confidenceLevel: null, // Initialize
    marketCap: null, // Initialize
    volume: null, // Initialize
    currency: null, // Initialize
    open: null,
    high: null,
    low: null,
    source: null,
  });

  // historicalData needs to match the ChartData[] structure
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);

  // popularAssets needs to match the PopularAsset[] structure
  const [popularAssets, setPopularAssets] = useState<PopularAsset[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  const backendApiUrl = 'https://market-oracle-backend.onrender.com';

  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      // --- Fetch Current Market Data ---
      try {
        console.log(`Fetching market data for ${symbol} from backend...`);
        const response = await fetch(`${backendApiUrl}/api/stock/${symbol}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: { symbol: string, price: number, source: string } = await response.json();

        // Update marketData with fetched data and sensible defaults/nulls for missing fields
        setMarketData({
          symbol: data.symbol,
          currentPrice: data.price,
          source: data.source,
          // All other fields that your backend /api/stock/{symbol} does NOT return
          // must be explicitly set to null or a dummy value.
          name: null, // Your backend doesn't return name yet
          previousClose: null,
          priceChange: null,
          percentageChange: null,
          predictedPrice: null,
          predictedChangePercent: null,
          confidenceLevel: null,
          marketCap: null, // Your backend doesn't return marketCap yet
          volume: null, // Your backend doesn't return volume yet
          currency: null, // Your backend doesn't return currency yet (assuming USD for now)
          open: null,
          high: null,
          low: null,
        });
        console.log(`Successfully fetched ${symbol} price: ${data.price}`);
      } catch (e: any) {
        console.error(`Error fetching market data for ${symbol}:`, e);
        setError(`Could not fetch data for ${symbol}: ${e.message}`);
        // Reset marketData to a safe, empty state to prevent crashes
        setMarketData({
          symbol: symbol, // Keep symbol
          name: null, currentPrice: null, previousClose: null, priceChange: null, percentageChange: null,
          predictedPrice: null, predictedChangePercent: null, confidenceLevel: null,
          marketCap: null, volume: null, currency: null,
          open: null, high: null, low: null, source: null,
        });
      }

      // --- Fetch Historical Data (Mock for now) ---
      try {
        // In a real app, this would be another backend API call like /api/historical/<symbol>
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate delay
        setHistoricalData([
          { date: "2023-01-01", price: 100 },
          { date: "2023-01-02", price: 105 },
          { date: "2023-01-03", price: 102 },
          { date: "2023-01-04", price: 108 },
          { date: "2023-01-05", price: 103 },
          { date: "2023-01-06", price: 106 },
          { date: "2023-01-07", price: 109 },
          { date: "2023-01-08", price: 104 },
          { date: "2023-01-09", price: 110 },
          { date: "2023-01-10", price: 107 },
        ]);
      } catch (e: any) {
        console.error(`Error fetching historical data:`, e);
        // Set to empty array on error
        setHistoricalData([]);
      }

      // --- Fetch Popular Assets (Mock for now) ---
      try {
        // In a real app, this would be another backend API call
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate delay
        if (market === 'US') {
          setPopularAssets([
            { symbol: 'GOOG', name: 'Alphabet Inc', price: 150.00, change: 1.5, changePercentage: 1.0 },
            { symbol: 'MSFT', name: 'Microsoft Corp', price: 420.00, change: -2.0, changePercentage: -0.5 },
            { symbol: 'AMZN', name: 'Amazon.com Inc', price: 180.00, change: 3.0, changePercentage: 1.7 },
            { symbol: 'NVDA', name: 'NVIDIA Corp', price: 950.00, change: 10.0, changePercentage: 1.1 },
            { symbol: 'TSLA', name: 'Tesla Inc', price: 170.00, change: -5.0, changePercentage: -2.9 },
          ]);
        } else {
          setPopularAssets([
            { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2900.00, change: 30.0, changePercentage: 1.05 },
            { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 3800.00, change: -15.0, changePercentage: -0.4 },
            { symbol: 'INFY.NS', name: 'Infosys', price: 1500.00, change: 5.0, changePercentage: 0.33 },
            { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1600.00, change: -8.0, changePercentage: -0.5 },
            { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 1100.00, change: 12.0, changePercentage: 1.1 },
          ]);
        }
      } catch (e: any) {
        console.error(`Error fetching popular assets:`, e);
        // Set to empty array on error
        setPopularAssets([]);
      } finally {
        setLoading(false); // Set loading to false only after all fetches (or their mocks) are done
      }
    };

    fetchAllData();
  }, [symbol, market, backendApiUrl]); // Rerun when symbol, market, or backendApiUrl changes


  // useEffect for dark mode
  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearch = (newSymbol: string) => {
    setSymbol(newSymbol.toUpperCase()); // Update symbol state, which triggers useEffect for fetching
  };

  const handleMarketChange = (selectedMarket: string) => {
    setMarket(selectedMarket as MarketType);
    // Reset to a default symbol for the selected market, using .NS for India
    setSymbol(selectedMarket === 'US' ? 'AAPL' : 'RELIANCE.NS');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MarketOracle</span>
              </div>
              <nav className="hidden md:ml-6 md:flex space-x-4">
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">Dashboard</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Watchlist</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Portfolio</a>
                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Alerts</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <div className="relative">
                <button className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  <span className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">U</span>
                  </span>
                  <span className="ml-2 hidden md:block">User</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SearchBar onSearch={handleSearch} market={market} />
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">Market:</div>
            <Toggle
              leftOption="US"
              rightOption="India"
              onChange={handleMarketChange}
              defaultOption={market}
            />
          </div>
        </div>

        {/* Display Loading/Error or Content */}
        {loading ? (
          <div className="text-center py-10 text-gray-600 dark:text-gray-300">Loading stock data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 dark:text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PriceDisplay data={marketData} />
              <PriceChart
                historicalData={historicalData}
                marketData={marketData}
              />
            </div>
            <div className="space-y-6">
              <PredictionSection data={marketData} />
              <PopularAssets
                assets={popularAssets}
                market={market}
                onSelectAsset={handleSearch}
              />
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>All predictions are based on historical data analysis and machine learning models.</p>
          <p>This information should not be considered as financial advice. Invest at your own risk.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
