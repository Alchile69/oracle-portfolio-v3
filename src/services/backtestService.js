// Service de backtesting pour l'intégration avec Railway backend
const API_BASE_URL = 'https://oracle-backend-wow-v1-production.up.railway.app';

class BacktestService {
  async runBacktest(config) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/backtest/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors du backtesting:', error);
      throw error;
    }
  }

  async getBacktestStatus(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/backtest/status/${requestId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du status:', error);
      throw error;
    }
  }

  async getBacktestResults(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/backtest/results/${requestId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats:', error);
      throw error;
    }
  }

  async getStrategies() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/backtest/strategies`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des stratégies:', error);
      throw error;
    }
  }
}

// Export par défaut pour résoudre l'erreur d'import
const backtestService = new BacktestService();
export default backtestService;

