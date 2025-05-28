import React from 'react';
import Card from './common/Card';
import Badge from './common/Badge';
import { MarketData } from '../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PriceDisplayProps {
  data: MarketData;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ data }) => {
  const {
    symbol,
    name,
    currentPrice,
    changePercent,
    marketCap,
    volume,
    currency
  } = data;

  const isPositive = changePercent > 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol}</h2>
            <Badge value={changePercent} />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{name}</p>
        </div>
        <div className="flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full px-3 py-1">
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Live Price</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
            {currency}{currentPrice.toLocaleString()}
          </span>
          <div className="ml-4">
            {isPositive ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="font-medium">+{changePercent.toFixed(2)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <TrendingDown className="h-5 w-5 mr-1" />
                <span className="font-medium">{changePercent.toFixed(2)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{currency}{marketCap}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Volume (24h)</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{volume}</p>
        </div>
      </div>
    </Card>
  );
};

export default PriceDisplay;