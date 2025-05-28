import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import PriceDisplay from './PriceDisplay';
import PredictionSection from './PredictionSection';
import PriceChart from './PriceChart';
import PopularAssets from './PopularAssets';
import Toggle from './common/Toggle';
import { MarketType } from '../types';
// Re-import mock data for now to ensure components don't crash
import { getMarketData, getChartData, getPopularAssets } from '../services/mockData'; 
import { Sun, Moon, ChevronDown } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [market, setMarket] = useState<MarketType>('US');
  const [symbol, setSymbol] = useState('AAPL');
  // Re-initialize with mock data to prevent crashes
  const [marketData, setMarketData] = useState(getMarketData('AAPL', 'US'));
  const [historicalData, setHistoricalData] = useState(getChartData('AAPL'));
  const [popularAssets, setPopularAssets] = useState(getPopularAssets('US'));
  const [isDarkMode, setIsDarkMode] = useState(false);

  // New state for fetching real AAPL price
  const [aaplPrice, setAaplPrice] = useState<number | null>(null);
  const [loadingAapl, setLoadingAapl] = useState(true);
  const [errorAapl, setErrorAapl] = useState<string | null>(null);

  // Define your backend API URL once
  const backendApiUrl = 'https://market-oracle-backend.onrender.com';

  // useEffect to fetch real AAPL price
  useEffect(() => {
    const fetchAaplPrice = async () => {
      try {
        setLoadingAapl(true);
        setErrorAapl(null);

        const response = await fetch(`${backendApiUrl}/api/stock/aapl`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.price) {
          setAaplPrice(data.price);
          // Update the marketData state's price with the real AAPL price
          // This is a temporary measure to keep other components from crashing
          setMarketData(prevData => ({ ...prevData, currentPrice: data.price }));

        } else {
          setErrorAapl(data.error || "Failed to get price data from backend.");
        }
      } catch (e: any) {
        console.error("Error fetching AAPL price:", e);
        setErrorAapl(`Could not fetch AAPL price: ${e.message}`);
      } finally {
        setLoadingAapl(false);
      }
    };

    fetchAaplPrice();
  }, []); // This effect runs only once on component mount

  // Original useEffect to update data when market or symbol changes (still using mock data for now)
  useEffect(() => {
    const data = getMarketData(symbol, market);
    setMarketData(data);
    setHistoricalData(getChartData(symbol));
    setPopularAssets(getPopularAssets(market));
  }, [symbol, market]);

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSearch = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  const handleMarketChange = (selectedMarket: string) => {
    setMarket(selectedMarket as MarketType);
    // Reset to a default symbol for the selected market
    setSymbol(selectedMarket === 'US' ? 'AAPL' : 'RELIANCE');
  };

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

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* PriceDisplay component - now conditionally renders or uses current marketData */}
            {/* We are passing the existing marketData, which now has real AAPL price updated by the new useEffect */}
            <PriceDisplay data={marketData} /> 

            {/* PriceChart and other components - using the mock data state for now */}
            <PriceChart 
              historicalData={historicalData}
              marketData={marketData}
            />
          </div>
          <div className="space-y-6">
            {/* Pass marketData to PredictionSection */}
            <PredictionSection data={marketData} />
            <PopularAssets 
              assets={popularAssets} 
              market={market}
              onSelectAsset={handleSearch}
            />
          </div>
        </div>

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
