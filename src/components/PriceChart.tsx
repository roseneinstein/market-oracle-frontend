import React, { useEffect, useRef } from 'react';
import Card from './common/Card';
import { HistoricalData, MarketData } from '../types';

interface PriceChartProps {
  historicalData: HistoricalData;
  marketData: MarketData;
}

const PriceChart: React.FC<PriceChartProps> = ({ historicalData, marketData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Combine historical and predicted data for min/max calculations
    const allData = [
      ...historicalData.historical,
      ...historicalData.predicted
    ];
    
    // Find min and max prices for scaling
    const prices = allData.map(d => d.price);
    const minPrice = Math.min(...prices) * 0.98; // Add 2% padding
    const maxPrice = Math.max(...prices) * 1.02;
    const priceRange = maxPrice - minPrice;
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - (padding * 2);
    
    // Calculate point positions
    const historicalPoints = historicalData.historical.map((d, i) => ({
      x: padding + (i * (chartWidth / (allData.length - 1))),
      y: canvas.height - padding - ((d.price - minPrice) / priceRange * chartHeight),
      price: d.price,
      date: d.date
    }));
    
    const predictedStartIndex = historicalData.historical.length - 1;
    const predictedPoints = historicalData.predicted.map((d, i) => ({
      x: padding + ((predictedStartIndex + i) * (chartWidth / (allData.length - 1))),
      y: canvas.height - padding - ((d.price - minPrice) / priceRange * chartHeight),
      price: d.price,
      date: d.date
    }));
    
    // Draw price grid lines and labels
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    
    // Draw horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (i * (chartHeight / gridLines));
      const price = maxPrice - (i * (priceRange / gridLines));
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
      
      ctx.fillText(marketData.currency + price.toFixed(2), padding - 10, y + 4);
    }
    
    // Draw date labels
    ctx.textAlign = 'center';
    const dateIndices = [0, Math.floor(historicalData.historical.length / 2), historicalData.historical.length - 1, allData.length - 1];
    dateIndices.forEach(i => {
      const data = i >= historicalData.historical.length 
        ? historicalData.predicted[i - historicalData.historical.length] 
        : historicalData.historical[i];
      const x = padding + (i * (chartWidth / (allData.length - 1)));
      ctx.fillText(formatDate(data.date), x, canvas.height - padding + 20);
    });
    
    // Draw historical line
    ctx.strokeStyle = '#1E40AF'; // Primary blue
    ctx.lineWidth = 2;
    ctx.beginPath();
    historicalPoints.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
    
    // Draw predicted line (dashed)
    ctx.strokeStyle = '#7C3AED'; // Purple for predictions
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(historicalPoints[historicalPoints.length - 1].x, historicalPoints[historicalPoints.length - 1].y);
    predictedPoints.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw points
    historicalPoints.forEach((point, i) => {
      // Only draw a few key points to avoid clutter
      if (i % 5 === 0 || i === historicalPoints.length - 1) {
        ctx.fillStyle = '#1E40AF';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    predictedPoints.forEach((point) => {
      ctx.fillStyle = '#7C3AED';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Add legend
    const legendY = padding / 2;
    
    // Historical legend
    ctx.fillStyle = '#1E40AF';
    ctx.beginPath();
    ctx.arc(padding, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#1E40AF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding + 10, legendY);
    ctx.lineTo(padding + 40, legendY);
    ctx.stroke();
    
    ctx.fillStyle = '#374151';
    ctx.font = '12px Inter, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Historical', padding + 50, legendY + 4);
    
    // Predicted legend
    const predictedLegendX = padding + 150;
    ctx.fillStyle = '#7C3AED';
    ctx.beginPath();
    ctx.arc(predictedLegendX, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#7C3AED';
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(predictedLegendX + 10, legendY);
    ctx.lineTo(predictedLegendX + 40, legendY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#374151';
    ctx.fillText('Predicted', predictedLegendX + 50, legendY + 4);
    
  }, [historicalData, marketData]);

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Price Chart</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Historical data and prediction</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">1M</button>
          <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full font-medium">3M</button>
          <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full font-medium">1Y</button>
          <button className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full font-medium">All</button>
        </div>
      </div>
      <div className="w-full h-80">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="w-full h-full"
        ></canvas>
      </div>
    </Card>
  );
};

export default PriceChart;