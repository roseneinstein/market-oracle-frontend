import React from 'react';
import Card from './common/Card';
import Badge from './common/Badge';
import { MarketData } from '../types';
import { Sparkles, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface PredictionSectionProps {
  data: MarketData;
}

const PredictionSection: React.FC<PredictionSectionProps> = ({ data }) => {
  const {
    symbol,
    predictedPrice,
    currentPrice,
    predictedChangePercent,
    confidenceLevel,
    currency
  } = data;

  const isPositive = predictedChangePercent > 0;
  const priceDifference = predictedPrice - currentPrice;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Next-Day Prediction</h2>
            <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{symbol} price forecast</p>
        </div>
        <div className="flex items-center space-x-1 bg-purple-50 dark:bg-purple-900/20 rounded-full px-3 py-1">
          <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AI Prediction</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {currency}{predictedPrice.toLocaleString()}
          </span>
          <div className="ml-4">
            {isPositive ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span className="font-medium">+{predictedChangePercent.toFixed(2)}%</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <TrendingDown className="h-5 w-5 mr-1" />
                <span className="font-medium">{predictedChangePercent.toFixed(2)}%</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {isPositive ? 'Predicted to rise by ' : 'Predicted to fall by '}
          <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {currency}{Math.abs(priceDifference).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prediction Confidence</span>
          <Badge value={confidenceLevel} type="confidence" />
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              confidenceLevel >= 80 
                ? 'bg-green-500' 
                : confidenceLevel >= 60 
                  ? 'bg-amber-500' 
                  : 'bg-red-500'
            }`}
            style={{ width: `${confidenceLevel}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Predictions are based on historical patterns, market trends, and AI analysis. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PredictionSection;