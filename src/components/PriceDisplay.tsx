import React from 'react';
import Card from './common/Card';
import Badge from './common/Badge'; // Keeping Badge, but it might display 'N/A' for changePercent
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface MarketData {
  symbol: string;
  currentPrice: number | null;
  priceChange: number | null;        // Added in Dashboard, but still null from backend
  percentageChange: number | null;   // Added in Dashboard, but still null from backend
  marketCap: number | null;          // Added in Dashboard, but still null from backend
  volume: number | null;             // Added in Dashboard, but still null from backend
  open: number | null;
  high: number | null;
  low: number | null;
  source?: string;                   // This is now from backend
  // 'name' and 'currency' are not in MarketData interface from Dashboard, 
  // so we won't destructure them from 'data' here.
}

interface PriceDisplayProps {
  data: MarketData;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ data }) => {
  const {
    symbol,
    currentPrice,
    // These properties are not provided by your backend's /api/stock/<symbol> endpoint
    // and are null/undefined in Dashboard's marketData state.
    // They are also not in your MarketData interface at this moment.
    // So, we will not destructure them directly from 'data'.
    // Instead, we'll use placeholder values or safe checks.
    // name,
    // changePercent,
    // marketCap,
    // volume,
    // currency
    
    // Using the properties that are defined in MarketData from Dashboard
    priceChange,
    percentageChange,
    marketCap,
    volume,
    source, // Using 'source' from the backend response
  } = data;

  // Helper to safely format numbers, returning 'N/A' for null/undefined
  const formatValue = (value: number | null, decimals: number = 2, prefix: string = '') => {
    if (typeof value === 'number') {
      return prefix + value.toFixed(decimals);
    }
    return 'N/A';
  };

  // Helper to format large numbers (Market Cap, Volume)
  const formatLargeNumber = (value: number | null) => {
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

  // Safe checks for values that might be null from backend
  const displayCurrentPrice = currentPrice !== null ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';
  const displayPercentageChange = percentageChange !== null ? percentageChange : 0; // Use 0 for calculations if null
  const displayPriceChange = priceChange !== null ? priceChange : 0; // Use 0 for calculations if null

  // Determine if change is positive for styling
  const isPositive = displayPercentageChange >= 0;
  const changeColorClass = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const arrowIcon = isPositive ? (
    <TrendingUp className="h-5 w-5 mr-1" />
  ) : (
    <TrendingDown className="h-5 w-5 mr-1" />
  );

  // Early return if essential 'symbol' is missing (though Dashboard handles loading/error now)
  if (!symbol) {
    return (
      <Card className="p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">No stock data available for display.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h2>
            {/* Badge needs a valid number, showing N/A if percentageChange is null */}
            <Badge value={percentageChange !== null ? percentageChange : 'N/A'} /> 
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {/* Display source if available, otherwise a generic description */}
            {source ? `Data from ${source}` : 'Market Data'} 
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
            ${displayCurrentPrice} {/* Assuming USD as default currency */}
          </span>
          <div className="ml-4">
            <div className={`flex items-center ${changeColorClass}`}>
              {arrowIcon}
              {/* Ensure toFixed is called only on numbers */}
              <span className="font-medium">
                {formatValue(displayPercentageChange, 2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
          {/* Using dummy large number for now, as backend doesn't provide */}
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${formatLargeNumber(marketCap || 1_000_000_000_000)} 
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Volume (24h)</p>
          {/* Using dummy large number for now, as backend doesn't provide */}
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatLargeNumber(volume || 100_000_000)}
          </p>
        </div>
        {/* Additional fields like Open, High, Low, Change (absolute) that Dashboard.tsx defines
            but backend doesn't provide will be N/A */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatValue(data.open)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">High</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatValue(data.high)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Low</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatValue(data.low)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">Change</p>
            <p className={`text-lg font-semibold ${changeColorClass}`}>
                {formatValue(displayPriceChange, 2, displayPriceChange >= 0 ? '+' : '')}
            </p>
        </div>
      </div>
    </Card>
  );
};

export default PriceDisplay;
