// WOW V1 - Backtesting Service
// Integration with Railway Backend + Backtesting.py

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://oracle-backend-railway.up.railway.app';

export class BacktestService {
  /**
   * Run a backtest with the given parameters
   * @param {Object} params - Backtest parameters
   * @param {number} params.initialCapital - Starting capital
   * @param {Array} params.assets - Array of asset allocations
   * @param {string} params.strategy - Strategy name
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} Backtest results
   */
  static async runBacktest(params) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/backtest/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Backtest failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Backtest service error:', error);
      throw error;
    }
  }

  /**
   * Get available strategies
   * @returns {Promise<Array>} List of available strategies
   */
  static async getStrategies() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/backtest/strategies`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch strategies:', error);
      return ['TopFiveStrategy']; // Fallback
    }
  }

  /**
   * Health check for backtest service
   * @returns {Promise<Object>} Service status
   */
  static async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/backtest/health`);
      return await response.json();
    } catch (error) {
      console.error('Backtest health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }
}

