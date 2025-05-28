import React from 'react';
import Card from './common/Card';
import Badge from './common/Badge';
import { PopularAsset, MarketType } from '../types';
import { TrendingUp } from 'lucide-react';

interface PopularAssetsProps {
  assets: PopularAsset[];
  market: MarketType;
  onSelectAsset: (symbol: string) => void;
}

const PopularAssets: React.FC<PopularAssetsProps> = ({ assets, market, onSelectAsset }) => {
  const currencySymbol = market === 'US' ? '$' : '₹';

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Popular {market === 'US' ? 'US' : 'Indian'} Assets</h2>
          <TrendingUp className="h-5 w-5 text-teal-500 dark:text-teal-400" />
        </div>
      </div>
      
      <div className="space-y-4">
        {assets.map((asset) => (
          <button
            key={asset.symbol}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-150"
            onClick={() => onSelectAsset(asset.symbol)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-700 dark:text-blue-400 font-medium">{asset.symbol.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{asset.symbol}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{asset.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{currencySymbol}{asset.price.toLocaleString()}</p>
              <Badge value={asset.changePercent} size="sm" />
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default PopularAssets;