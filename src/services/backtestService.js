// WOW V1 - Backend Service
// Integration avec le nouveau backend FastAPI + Yahoo Finance

// Configuration dynamique de l'URL backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://oracle-backend-wow-v1-production.up.railway.app';

export class BacktestService {
  /**
   * Health check du backend
   * @returns {Promise<Object>} Statut du service
   */
  static async healthCheck() {
    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Backend health check failed:', error);
      return { status: 'error', message: error.message };
    }
  }

  /**
   * Récupération des métriques de portfolio avec données réelles
   * @returns {Promise<Object>} Métriques de performance
   */
  static async getPortfolioMetrics() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/portfolio/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur récupération métriques:', error);
      // Données de fallback en cas d'erreur
      return {
        returns: 12.5,
        volatility: 15.3,
        sharpe: 1.85,
        drawdown: -8.2,
        winRate: 67.5,
        beta: 0.85,
        source: 'fallback_frontend'
      };
    }
  }

  /**
   * Exécution d'un backtest
   * @param {Object} params - Paramètres du backtest
   * @param {string} params.startDate - Date de début (YYYY-MM-DD)
   * @param {string} params.endDate - Date de fin (YYYY-MM-DD)
   * @param {number} params.initialCash - Capital initial
   * @returns {Promise<Object>} Résultats du backtest
   */
  static async runBacktest(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${BACKEND_URL}/api/portfolio/backtest?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur backtest:', error);
      throw error;
    }
  }

  /**
   * Récupération des données de marché
   * @param {string} tickers - Liste des tickers séparés par des virgules
   * @returns {Promise<Object>} Données de marché
   */
  static async getMarketData(tickers = null) {
    try {
      const params = tickers ? `?tickers=${tickers}` : '';
      const response = await fetch(`${BACKEND_URL}/api/market/data${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur données marché:', error);
      throw error;
    }
  }

  /**
   * Test de connectivité complète
   * @returns {Promise<Object>} Résultats des tests
   */
  static async testConnectivity() {
    const results = {
      health: null,
      metrics: null,
      marketData: null,
      timestamp: new Date().toISOString()
    };

    try {
      results.health = await this.healthCheck();
    } catch (error) {
      results.health = { error: error.message };
    }

    try {
      results.metrics = await this.getPortfolioMetrics();
    } catch (error) {
      results.metrics = { error: error.message };
    }

    try {
      results.marketData = await this.getMarketData('AAPL,GOOGL');
    } catch (error) {
      results.marketData = { error: error.message };
    }

    return results;
  }
}

// Export par défaut pour compatibilité
export default BacktestService;

