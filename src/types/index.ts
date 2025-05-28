export interface MarketData {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  changePercent: number;
  predictedPrice: number;
  predictedChangePercent: number;
  confidenceLevel: number;
  marketCap: string;
  volume: string;
  currency: string;
}

export interface ChartData {
  date: string;
  price: number;
}

export interface HistoricalData {
  historical: ChartData[];
  predicted: ChartData[];
}

export type MarketType = 'US' | 'India';

export interface PopularAsset {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}