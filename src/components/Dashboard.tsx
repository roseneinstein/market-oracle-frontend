import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import SearchBar from './SearchBar';
import PriceDisplay from './PriceDisplay'; // We will modify/re-integrate this later
import PredictionSection from './PredictionSection';
import PriceChart from './PriceChart';
import PopularAssets from './PopularAssets';
import Toggle from './common/Toggle';
import { MarketType } from '../types';
// import { getMarketData, getChartData, getPopularAssets } from '../services/mockData'; // Temporarily removed mockData imports
import { Sun, Moon, ChevronDown } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [market, setMarket] = useState<MarketType>('US');
  const [symbol, setSymbol] = useState('AAPL');
  // const [marketData, setMarketData] = useState(getMarketData('AAPL', 'US')); // Removed static marketData
  // const [historicalData, setHistoricalData] = useState(getChartData('AAPL')); // Removed static historicalData
  // const [popularAssets, setPopularAssets] = useState(getPopularAssets('US')); // Removed static popularAssets
  const [isDarkMode, setIsDarkMode] = useState(false);

  // New state for fetching real AAPL price
  const [aaplPrice, setAaplPrice] = useState<number | null>(null);
  const [loadingAapl, setLoadingAapl] = useState(true);
  const [errorAapl, setErrorAapl] = useState<string | null>(null);

  // Define your backend API URL once
  const backendApiUrl = 'https://market-oracle-backend.onrender.com'; 

  // New useEffect to fetch real AAPL price
  useEffect(() => {
    const fetchAaplPrice = async () => {
      try {
        setLoadingAapl(true); // Set loading true at the start of fetch
        setErrorAapl(null);   // Clear previous errors

        const response = await fetch(`${backendApiUrl}/api/stock/aapl`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.price) {
          setAaplPrice(data.price);
        } else {
          setErrorAapl(data.error || "Failed to get price data from backend.");
        }
      } catch (e: any) {
        console.error("Error fetching AAPL price:", e);
        setErrorAapl(`Could not fetch AAPL price: ${e.message}`);
      } finally {
        setLoadingAapl(false); // Set loading false at the end
      }
    };

    fetchAaplPrice();
  }, []); // Empty dependency array means this effect runs only once after the initial render


  // Original useEffects (modified to remove mock data updates for now)
  useEffect(() => {
    // This useEffect used to update mock data; we'll re-implement with real data later
    // const data = getMarketData(symbol, market);
    // setMarketData(data);
    // setHistoricalData(getChartData(symbol));
    // setPopularAssets(getPopularAssets(market));
  }, [symbol, market]); // Keep dependencies for now, but functionality is commented out

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
            {/* PriceDisplay component is now below and gets the real AAPL price */}
            {/* We will update PriceDisplay to use dynamic data later */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Apple Inc. (AAPL)</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">NASDAQ</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Tech
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                {loadingAapl ? (
                  <p className="text-2xl text-gray-500 dark:text-gray-400">Loading AAPL price...</p>
                ) : errorAapl ? (
                  <p className="text-2xl text-red-500 dark:text-red-400">{errorAapl}</p>
                ) : (
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">${aaplPrice?.toFixed(2)} <span className="text-lg font-medium text-green-500">+1.91%</span></p>
                )}
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">1M</button>
                  <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">3M</button>
                  <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">1Y</button>
                  <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">All</button>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>Open: $188.00 | High: $190.50 | Low: $187.50 | Volume: 75.3M</p>
              </div>
            </div>

            {/* PriceChart and other components are below, still using mock data for now */}
            <PriceChart 
              // historicalData={historicalData} // This will be dynamic later
              // marketData={marketData} // This will be dynamic later
            />
          </div>
          <div className="space-y-6">
            <PredictionSection data={{ /* This will be dynamic later */ price: aaplPrice || 0, change: 0, changePercent: 0 }} />
            <PopularAssets 
              // assets={popularAssets} // This will be dynamic later
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
