/**
 * WOW V1 - Backtest Module Component
 * Interactive backtesting interface with animated charts
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BacktestService } from '../../services/backtestService';
import * as TWEEN from '@tweenjs/tween.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BacktestModule = () => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [backtestResult, setBacktestResult] = useState(null);
  const [error, setError] = useState(null);
  const [strategies, setStrategies] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    initialCapital: 10000,
    strategy: 'TopFiveStrategy',
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    rebalanceFrequency: 'monthly',
    assets: [
      { symbol: 'AAPL', weight: 0.2, name: 'Apple Inc.' },
      { symbol: 'GOOGL', weight: 0.2, name: 'Alphabet Inc.' },
      { symbol: 'MSFT', weight: 0.2, name: 'Microsoft Corp.' },
      { symbol: 'AMZN', weight: 0.2, name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', weight: 0.2, name: 'Tesla Inc.' }
    ]
  });

  // Animation refs
  const chartRef = useRef(null);
  const animationRef = useRef(null);

  // Load strategies on component mount
  useEffect(() => {
    loadStrategies();
  }, []);

  // Animation loop for Tween.js
  useEffect(() => {
    const animate = () => {
      TWEEN.update();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const loadStrategies = async () => {
    try {
      const strategiesData = await BacktestService.getStrategies();
      setStrategies(strategiesData.strategies || []);
    } catch (err) {
      console.error('Failed to load strategies:', err);
      setStrategies([{ name: 'TopFiveStrategy', description: 'Top 5 Strategy' }]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssetChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.map((asset, i) => 
        i === index ? { ...asset, [field]: value } : asset
      )
    }));
  };

  const runBacktest = async () => {
    setIsLoading(true);
    setError(null);
    setBacktestResult(null);

    try {
      // Validate total weights
      const totalWeight = formData.assets.reduce((sum, asset) => sum + asset.weight, 0);
      if (Math.abs(totalWeight - 1.0) > 0.01) {
        throw new Error(`Asset weights must sum to 1.0, got ${totalWeight.toFixed(2)}`);
      }

      const result = await BacktestService.runBacktest(formData);
      
      if (result.success) {
        setBacktestResult(result.data);
        animateChart();
      } else {
        setError(result.error || 'Backtest failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const animateChart = () => {
    if (!chartRef.current) return;

    // Animate chart appearance
    const chart = chartRef.current;
    const originalData = chart.data.datasets[0].data;
    
    // Start with empty data
    chart.data.datasets[0].data = new Array(originalData.length).fill(0);
    chart.update('none');

    // Animate data points
    originalData.forEach((value, index) => {
      setTimeout(() => {
        new TWEEN.Tween({ value: 0 })
          .to({ value }, 50)
          .onUpdate((obj) => {
            chart.data.datasets[0].data[index] = obj.value;
            chart.update('none');
          })
          .start();
      }, index * 20);
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Chart configuration
  const chartData = backtestResult ? {
    labels: backtestResult.equity_curve.dates.map(date => 
      new Date(date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Portfolio Value',
        data: backtestResult.equity_curve.values,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Backtest Results - Portfolio Performance',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = formatCurrency(context.parsed.y);
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Portfolio Value ($)'
        },
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="backtest-module bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📊 Backtesting Module
        </h2>
        <p className="text-gray-600">
          Test your investment strategies with historical data
        </p>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Basic Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial Capital
            </label>
            <input
              type="number"
              value={formData.initialCapital}
              onChange={(e) => handleInputChange('initialCapital', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1000"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strategy
            </label>
            <select
              value={formData.strategy}
              onChange={(e) => handleInputChange('strategy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {strategies.map(strategy => (
                <option key={strategy.name} value={strategy.name}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Asset Allocation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Asset Allocation
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {formData.assets.map((asset, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <input
                  type="text"
                  value={asset.symbol}
                  onChange={(e) => handleAssetChange(index, 'symbol', e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Symbol"
                />
                <input
                  type="number"
                  value={asset.weight}
                  onChange={(e) => handleAssetChange(index, 'weight', Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  max="1"
                  step="0.01"
                />
                <span className="text-sm text-gray-500">
                  {(asset.weight * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Run Backtest Button */}
      <div className="mb-6">
        <button
          onClick={runBacktest}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Running Backtest...
            </div>
          ) : (
            '🚀 Run Backtest'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">❌</span>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Results Display */}
      {backtestResult && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium">Total Return</div>
              <div className="text-2xl font-bold text-green-800">
                {formatPercentage(backtestResult.summary.total_return_pct)}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Sharpe Ratio</div>
              <div className="text-2xl font-bold text-blue-800">
                {backtestResult.summary.sharpe_ratio.toFixed(2)}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-red-600 font-medium">Max Drawdown</div>
              <div className="text-2xl font-bold text-red-800">
                {formatPercentage(backtestResult.summary.max_drawdown_pct)}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Final Value</div>
              <div className="text-2xl font-bold text-purple-800">
                {formatCurrency(backtestResult.summary.final_value)}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div style={{ height: '400px' }}>
              <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestModule;

