export interface MarketData {
  symbol: string;
  // Properties that might be null or undefined if not provided by the current API
  name?: string | null; // Made optional and nullable
  currentPrice: number | null; // Made nullable as backend can return price or null if error
  previousClose?: number | null; // Made optional and nullable
  priceChange?: number | null; // This is what Dashboard.tsx is setting, not changePercent from backend
  percentageChange?: number | null; // This is what Dashboard.tsx is setting, not changePercent from backend
  predictedPrice?: number | null; // Made optional and nullable
  predictedChangePercent?: number | null; // Made optional and nullable
  confidenceLevel?: number | null; // Made optional and nullable
  marketCap?: number | null; // Changed to number and made optional/nullable
  volume?: number | null; // Changed to number and made optional/nullable
  currency?: string | null; // Made optional and nullable
  source?: string | null; // Add source as it's returned by your backend
  open?: number | null; // Defined in Dashboard.tsx's MarketData
  high?: number | null; // Defined in Dashboard.tsx's MarketData
  low?: number | null; // Defined in Dashboard.tsx's MarketData
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
  change: number; // Changed from changePercent for consistency with Dashboard's PopularAsset interface
  changePercentage: number; // Changed from changePercent for consistency with Dashboard's PopularAsset interface
}
