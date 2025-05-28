import React from 'react';
import Card from './common/Card';
import Badge from './common/Badge';
import { MarketData } from '../types'; // Import MarketData from the updated types/index.ts
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PriceDisplayProps {
  data: MarketData;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ data }) => {
  const {
    symbol,
    name, // Now potentially null/undefined
    currentPrice, // Now potentially null
    priceChange, // Now potentially null/undefined
    percentageChange, // Now potentially null/undefined
    marketCap, // Now potentially null/undefined
    volume, // Now potentially null/undefined
    currency, // Now potentially null/undefined
    source, // Now potentially null/undefined
    open, // Now potentially null/undefined
    high, // Now potentially null/undefined
    low, // Now potentially null/undefined
  } = data;

  // Helper function to format numbers safely, returning 'N/A' if null/undefined
  const formatNumber = (value: number | null | undefined, decimals: number = 2) => {
    if (typeof value === 'number') {
      return value.toFixed(decimals);
    }
    return 'N/A';
  };

  // Helper function to format large numbers (Market Cap, Volume) safely
  const formatLargeNumber = (value: number | null | undefined) => {
    if (typeof value === 'number') {
      if (value >= 1_000_000_000_000) {
        return (value / 1_000_000_000_000).toFixed(2) + 'T';
      }
      if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(2) + 'B';
      }
      if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(2) + 'M';
      }
      return value.toLocaleString();
    }
    return 'N/A';
  };

  // Safely get percentage change for conditional rendering and display
  const displayPercentageChange = percentageChange !== null && percentageChange !== undefined ? percentageChange : 0;
  const isPositive = displayPercentageChange >= 0;
  const changeColorClass = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const arrowIcon = isPositive ? (
    <TrendingUp className="h-5 w-5 mr-1" />
  ) : (
    <TrendingDown className="h-5 w-5 mr-1" />
  );

  // Safely display currency and price
  const displayCurrency = currency || '$'; // Default to '$' if currency is null/undefined
  const displayCurrentPrice = currentPrice !== null ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';

  // Early return if symbol is not available (fundamental data missing)
  if (!symbol) {
    return (
      <Card className="p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">No stock symbol available for display.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h2>
            {/* Badge needs a number or string; provide a default if percentageChange is null/undefined */}
            <Badge value={percentageChange !== null && percentageChange !== undefined ? percentageChange : 'N/A'} />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {name || 'Company Name N/A'}
            {source && <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">({source})</span>}
          </p>
        </div>
        <div className="flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full px-3 py-1">
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Live Price</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
            {displayCurrency}{displayCurrentPrice}
          </span>
          <div className="ml-4">
            <div className={`flex items-center ${changeColorClass}`}>
              {arrowIcon}
              <span className="font-medium">
                {formatNumber(displayPercentageChange, 2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Using formatLargeNumber and formatNumber for all potentially null values */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {displayCurrency}{formatLargeNumber(marketCap)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Volume (24h)</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatLargeNumber(volume)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(open)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">High</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(high)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Low</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatNumber(low)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Change</p>
          <p className={`text-lg font-semibold ${changeColorClass}`}>
            {formatNumber(priceChange, 2, priceChange !== null && priceChange > 0 ? '+' : '')}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PriceDisplay;
