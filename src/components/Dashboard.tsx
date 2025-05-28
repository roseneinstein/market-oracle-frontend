import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import PriceDisplay from './PriceDisplay';
import PredictionSection from './PredictionSection';
import PriceChart from './PriceChart';
import PopularAssets from './PopularAssets';
import Toggle from './common/Toggle';
import { MarketType } from '../types';
// Remove mock data imports as we will fetch real data
// import { getMarketData, getChartData, getPopularAssets } from '../services/mockData';
import { Sun, Moon, ChevronDown } from 'lucide-react';

interface MarketData {
  symbol: string;
  currentPrice: number | null;
  priceChange: number | null;
  percentageChange: number | null;
  marketCap: number | null;
  volume: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  source?: string;
}

interface HistoricalDataPoint {
    date: string;
    price: number;
}

interface PopularAsset {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercentage: number;
}


const Dashboard: React.FC = () => {
  const [market, setMarket] = useState<MarketType>('US');
  const [symbol, setSymbol] = useState('AAPL'); // Default to AAPL

  // States to hold real fetched data for the current symbol
  const [marketData, setMarketData] = useState<MarketData>({
    symbol: 'AAPL', currentPrice: null, priceChange: null, percentageChange: null,
    marketCap: null, volume: null, open: null, high: null, low: null
  });
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [popularAssets, setPopularAssets] = useState<PopularAsset[]>([]); // Will still use mock for now

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define your backend API URL once
  const backendApiUrl = 'https://market-oracle-backend.onrender.com';

  // useEffect to fetch current market data for the selected symbol
  useEffect(() => {
    const fetchCurrentMarketData = async () => {
      if (!symbol) return; // Don't fetch if no symbol is set

      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching market data for ${symbol} from backend...`);
        const response = await fetch(`<span class="math-inline">\{backendApiUrl\}/api/stock/</span>{symbol}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: { symbol: string, price: number, source: string } = await response.json();

        // For now, we only get 'price'. Populate other fields with dummy/null
        // In a real app, your backend /api/stock/<symbol> would return ALL this data
        setMarketData({
          symbol: data.symbol,
          currentPrice: data.price,
          priceChange: null, // No change data from current backend API
          percentageChange: null, // No percentage change from current backend API
          marketCap: 1000000000000, // Dummy
          volume: 100000000, // Dummy
          open: null, // Dummy
          high: null, // Dummy
          low: null, // Dummy
          source: data.source
        });
        console.log(`Successfully fetched ${symbol} price: ${data.price}`);
      } catch (e: any) {
        console.error(`Error fetching market data for ${symbol}:`, e);
        setError(`Could not fetch data for ${symbol}: ${e.message}`);
        // Reset marketData to prevent showing old data or crashing components
        setMarketData({
          symbol: symbol, currentPrice: null, priceChange: null, percentageChange: null,
          marketCap: null, volume: null, open: null, high: null, low: null
        });
      } finally {
        setLoading(false);
      }
    };

    // Fetch historical data (still using mock for now)
    const fetchHistoricalData = async () => {
        // For now, historical data is still from mockData. 
        // In a real app, this would be another backend API call.
        // setHistoricalData(getChartData(symbol));
        // Simulating a delay for historical data fetch as well
        await new Promise(resolve => setTimeout(resolve, 200)); 
        setHistoricalData([{date: "2023-01-01", price: 100}, {date: "2023-01-02", price: 105}, {date: "2023-01-03", price: 102}]);
    };

    // Fetch popular assets (still using mock for now)
    const fetchPopularAssets = async () => {
        // setPopularAssets(getPopularAssets(market));
        await new Promise(resolve => setTimeout(resolve, 200)); 
        if (market === 'US') {
            setPopularAssets([
                { symbol: 'GOOG', name: 'Alphabet Inc', price: 150.00, change: 1.5, changePercentage: 1.0 },
                { symbol: 'MSFT', name: 'Microsoft Corp', price: 420.00, change: -2.0, changePercentage: -0.5 },
            ]);
        } else {
            setPopularAssets([
                { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2900.00, change: 30.0, changePercentage: 1.05 },
                { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 3800.00, change: -15.0, changePercentage: -0.4 },
            ]);
        }
    };


    fetchCurrentMarketData();
    fetchHistoricalData();
    fetchPopularAssets();

  }, [symbol, market, backendApiUrl]); // Rerun when symbol or market changes

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSearch = (newSymbol: string) => {
    setSymbol(newSymbol.toUpperCase()); // Update symbol state, which triggers useEffect for fetching
  };

  const handleMarketChange = (selectedMarket: string) => {
    setMarket(selectedMarket as MarketType);
    // Reset to a default symbol for the selected market
    // This will also trigger the useEffect to fetch data for the new default symbol
    setSymbol(selectedMarket === 'US' ? 'AAPL' : 'RELIANCE.NS'); // Changed to RELIANCE.NS for India
  };

  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
                historicalData={historicalData} // Still mock data for now
                marketData={marketData}
              />
            </div>
            <div className="space-y-6">
              <PredictionSection data={marketData} />
              <PopularAssets
                assets={popularAssets} // Still mock data for now
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
