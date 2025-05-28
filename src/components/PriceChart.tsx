import React, { useEffect, useRef } from 'react';
import Card from './common/Card';
// IMPORT ALL NECESSARY TYPES FROM CENTRALIZED TYPES FILE
import { ChartData, MarketData } from '../types';

// REMOVE these local interface definitions to avoid conflicts
// interface HistoricalDataPoint { ... }
// interface MarketData { ... }

interface PriceChartProps {
    historicalData: ChartData[]; // Now directly using ChartData from types/index.ts
    marketData: MarketData;      // Now directly using MarketData from types/index.ts
}

const PriceChart: React.FC<PriceChartProps> = ({ historicalData, marketData }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Helper function to format dates (moved here from inside useEffect)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // IMPORTANT: Handle case where historicalData is empty or not an array
        if (!Array.isArray(historicalData) || historicalData.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas if no data
            ctx.fillStyle = '#6b7280';
            ctx.font = '16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No historical data available.', canvas.width / 2, canvas.height / 2);
            return; // Exit if no data
        }

        const allDataPoints = historicalData;

        // Find min and max prices for scaling
        const prices = allDataPoints.map(d => d.price);
        // Handle case where prices array might be empty due to filter or if data is all null/undefined
        if (prices.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#6b7280';
            ctx.font = '16px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Could not process price data.', canvas.width / 2, canvas.height / 2);
            return;
        }

        const minPrice = Math.min(...prices) * 0.98; // Add 2% padding
        let maxPrice = Math.max(...prices) * 1.02; // Use 'let' because we might modify it

        // Avoid division by zero if priceRange is 0 (e.g., all prices are the same)
        if (maxPrice - minPrice === 0) {
            // Adjust maxPrice slightly to create a range for rendering
            maxPrice += 1;
        }
        const priceRange = maxPrice - minPrice; // Recalculate after potential adjustment

        // Chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);

        // Calculate point positions for historical data
        const historicalPoints = allDataPoints.map((d, i) => ({
            x: padding + (i * (chartWidth / (allDataPoints.length - 1 || 1))), // Avoid division by zero for single point
            y: canvas.height - padding - ((d.price - minPrice) / (priceRange || 1) * chartHeight), // Avoid division by zero
            price: d.price,
            date: d.date
        }));

        // --- Simplified Prediction Data Handling ---
        const lastHistoricalPoint = historicalPoints[historicalPoints.length - 1];
        const predictedPoints: typeof historicalPoints = [];
        if (lastHistoricalPoint) {
            // Generate 3 dummy prediction points for the future
            for (let i = 1; i <= 3; i++) {
                const dummyPrice = lastHistoricalPoint.price + (i * (maxPrice - minPrice) * 0.02); // Small increment
                const dummyDate = new Date(lastHistoricalPoint.date);
                dummyDate.setDate(dummyDate.getDate() + i); // Next few days
                
                predictedPoints.push({
                    x: lastHistoricalPoint.x + (i * (chartWidth / (historicalPoints.length - 1 || 1)) * 0.5), // Space them out relative to historical points
                    y: canvas.height - padding - ((dummyPrice - minPrice) / (priceRange || 1) * chartHeight),
                    price: dummyPrice,
                    date: dummyDate.toISOString().split('T')[0] // Format date as string
                });
            }
        }
        // Combined data for x-axis scaling
        const combinedPoints = [...historicalPoints, ...predictedPoints];


        // Clear the canvas for drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw price grid lines and labels
        ctx.strokeStyle = '#e5e7eb'; // Light gray for grid
        ctx.lineWidth = 1;
        ctx.fillStyle = '#6b7280'; // Darker gray for text
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

            // Using '$' as a placeholder since currency is not available from backend, or use marketData.currency
            // Use optional chaining and nullish coalescing for marketData.currency
            ctx.fillText(`${marketData?.currency || '$'}${price.toFixed(2)}`, padding - 10, y + 4);
        }

        // Draw date labels
        ctx.textAlign = 'center';
        // Select key indices for date labels
        const dateIndices = [0, Math.floor(allDataPoints.length / 2), allDataPoints.length - 1];
        if (predictedPoints.length > 0) {
            // Add a predicted date if there are prediction points
            dateIndices.push(combinedPoints.length - 1);
        }

        dateIndices.forEach(i => {
            const dataPoint = combinedPoints[i];
            const x = combinedPoints[i].x;
            ctx.fillText(formatDate(dataPoint.date), x, canvas.height - padding + 20);
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

        // Draw predicted line (dashed), only if there are predicted points
        if (predictedPoints.length > 0 && lastHistoricalPoint) {
            ctx.strokeStyle = '#7C3AED'; // Purple for predictions
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(lastHistoricalPoint.x, lastHistoricalPoint.y); // Start from last historical point
            predictedPoints.forEach(point => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
        }

        // Draw points for historical
        historicalPoints.forEach((point, i) => {
            // Adjust point drawing logic slightly for cleaner display
            if (allDataPoints.length <= 5 || i % Math.floor(allDataPoints.length / 3) === 0 || i === allDataPoints.length - 1 || i === 0) {
                ctx.fillStyle = '#1E40AF';
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Draw points for predicted
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

        ctx.fillStyle = '#374151'; // Darker gray for text
        ctx.font = '12px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Historical', padding + 50, legendY + 4);

        // Predicted legend (only if predictions are drawn)
        if (predictedPoints.length > 0) {
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
        }

    }, [historicalData, marketData]); // Re-run effect when data changes

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
