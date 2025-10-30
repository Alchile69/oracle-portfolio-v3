import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './BacktestingModule.css';

// URL du backend depuis variable d'environnement
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://oracle-backend-wow-v1-production.up.railway.app';

const BacktestingModule = ({ data, user }) => {
  const [activeTab, setActiveTab] = useState('configuration');
  const [backtestConfig, setBacktestConfig] = useState({
    startDate: '2020-01-01',
    endDate: '2024-12-31',
    initialAmount: 100000,
    rebalanceFrequency: 'quarterly',
    transactionFees: 0.1,
    slippage: 0.05,
    dividendReinvestment: true,
    benchmark: 'SPY'
  });
  const [backtestResults, setBacktestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backtestHistory, setBacktestHistory] = useState([]);

  // Onglets du module backtesting
  const tabs = [
    { id: 'configuration', label: 'Configuration', icon: '⚙️' },
    { id: 'results', label: 'Résultats', icon: '📊' },
    { id: 'comparison', label: 'Comparaison', icon: '📈' },
    { id: 'history', label: 'Historique', icon: '📋' }
  ];

  // Chargement de l'historique des backtests
  useEffect(() => {
    const loadBacktestHistory = async () => {
      if (!user) return;
      
      try {
        const history = await firebaseService.getBacktestHistory(user.uid, 5);
        setBacktestHistory(history);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      }
    };

    loadBacktestHistory();
  }, [user]);

  // Fonction pour récupérer les résultats du backtesting via polling
  const pollBacktestResults = async (requestId) => {
    const maxAttempts = 30; // 30 tentatives max (5 minutes)
    const pollInterval = 10000; // 10 secondes entre chaque tentative
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const statusResponse = await fetch(`${BACKEND_URL}/api/backtest/status/${requestId}`);
        
        if (!statusResponse.ok) {
          throw new Error(`Erreur status API: ${statusResponse.status}`);
        }
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed') {
          // Récupérer les résultats complets
          const resultsResponse = await fetch(`${BACKEND_URL}/api/backtest/results/${requestId}`);
          
          if (!resultsResponse.ok) {
            throw new Error(`Erreur results API: ${resultsResponse.status}`);
          }
          
          return await resultsResponse.json();
        } else if (statusData.status === 'failed') {
          throw new Error(`Backtesting failed: ${statusData.error || 'Unknown error'}`);
        }
        
        // Status encore pending, attendre avant la prochaine tentative
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
        
      } catch (error) {
        console.error(`Polling attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) {
          throw error;
        }
      }
    }
    
    throw new Error('Timeout: Backtesting took too long to complete');
  };

  // Lancement du backtesting
  const runBacktest = async () => {
    setLoading(true);
    try {
      // Préparer la requête pour l'API
      const backtestRequest = {
        assets: [
          { symbol: 'AAPL', allocation: 30 },
          { symbol: 'GOOGL', allocation: 25 },
          { symbol: 'MSFT', allocation: 25 },
          { symbol: 'TSLA', allocation: 20 }
        ],
        initial_capital: backtestConfig.initialAmount,
        start_date: backtestConfig.startDate,
        end_date: backtestConfig.endDate,
        strategy_type: 'buy_and_hold',
        rebalance_frequency: backtestConfig.rebalanceFrequency,
        transaction_fees: backtestConfig.transactionFees,
        slippage: backtestConfig.slippage,
        dividend_reinvestment: backtestConfig.dividendReinvestment,
        benchmark: backtestConfig.benchmark,
        sma_short: 10,
        sma_long: 20,
        rsi_period: 14,
        rsi_oversold: 30,
        rsi_overbought: 70
      };

      // Appel API pour lancer le backtesting
      const response = await fetch(`${BACKEND_URL}/api/backtest/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backtestRequest)
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const results = await response.json();
      let finalResults = null;
      
      // Vérifier si c'est un job asynchrone
      if (results.request_id && results.status === 'pending') {
        // Polling pour récupérer les résultats
        const backtestResults = await pollBacktestResults(results.request_id);
        
        // Traiter les résultats finaux
        finalResults = {
          totalReturn: backtestResults.metrics.total_return,
          annualizedReturn: backtestResults.metrics.annualized_return,
          volatility: backtestResults.metrics.volatility,
          sharpeRatio: backtestResults.metrics.sharpe_ratio,
          maxDrawdown: backtestResults.metrics.max_drawdown,
          winRate: backtestResults.metrics.win_rate,
          totalTrades: backtestResults.metrics.total_trades,
          finalValue: backtestResults.final_portfolio_value,
          equityCurve: backtestResults.equity_curve.map(point => ({
            date: point.date,
            value: point.value,
            drawdown: point.drawdown
          })),
          monthlyReturns: backtestResults.monthly_returns,
          benchmarkComparison: backtestResults.benchmark_comparison,
          executionTime: backtestResults.execution_time_seconds,
          warnings: backtestResults.warnings || []
        };

        setBacktestResults(finalResults);
      } else {
        // Résultats immédiats (si disponibles)
        finalResults = results;
        setBacktestResults(results);
      }
      
      // Sauvegarder dans l'historique
      if (user) {
        await firebaseService.saveBacktestResult(user.uid, {
          config: backtestConfig,
          results: finalResults,
          timestamp: new Date().toISOString()
        });
      }
      
      setActiveTab('results');
      
    } catch (error) {
      console.error('Erreur lors du backtesting:', error);
      alert(`Erreur lors du backtesting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Mise à jour de la configuration
  const updateConfig = (key, value) => {
    setBacktestConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'configuration':
        return (
          <div className="backtest-configuration">
            <h3>⚙️ Configuration du Backtesting</h3>
            
            <div className="config-grid">
              <div className="config-group">
                <label>Date de début</label>
                <input 
                  type="date"
                  value={backtestConfig.startDate}
                  onChange={(e) => updateConfig('startDate', e.target.value)}
                />
              </div>
              
              <div className="config-group">
                <label>Date de fin</label>
                <input 
                  type="date"
                  value={backtestConfig.endDate}
                  onChange={(e) => updateConfig('endDate', e.target.value)}
                />
              </div>
              
              <div className="config-group">
                <label>Montant initial (€)</label>
                <input 
                  type="number"
                  value={backtestConfig.initialAmount}
                  onChange={(e) => updateConfig('initialAmount', parseInt(e.target.value))}
                />
              </div>
              
              <div className="config-group">
                <label>Fréquence de rééquilibrage</label>
                <select 
                  value={backtestConfig.rebalanceFrequency}
                  onChange={(e) => updateConfig('rebalanceFrequency', e.target.value)}
                >
                  <option value="monthly">Mensuel</option>
                  <option value="quarterly">Trimestriel</option>
                  <option value="yearly">Annuel</option>
                </select>
              </div>
              
              <div className="config-group">
                <label>Frais de transaction (%)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={backtestConfig.transactionFees}
                  onChange={(e) => updateConfig('transactionFees', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="config-group">
                <label>Slippage (%)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={backtestConfig.slippage}
                  onChange={(e) => updateConfig('slippage', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="config-group">
                <label>Benchmark</label>
                <select 
                  value={backtestConfig.benchmark}
                  onChange={(e) => updateConfig('benchmark', e.target.value)}
                >
                  <option value="SPY">S&P 500 (SPY)</option>
                  <option value="QQQ">NASDAQ (QQQ)</option>
                  <option value="VTI">Total Stock Market (VTI)</option>
                  <option value="MSCI">MSCI World</option>
                </select>
              </div>
              
              <div className="config-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={backtestConfig.dividendReinvestment}
                    onChange={(e) => updateConfig('dividendReinvestment', e.target.checked)}
                  />
                  Réinvestissement des dividendes
                </label>
              </div>
            </div>
            
            <div className="config-actions">
              <button 
                className={`run-backtest-btn ${loading ? 'loading' : ''}`}
                onClick={runBacktest}
                disabled={loading}
              >
                {loading ? '⏳ Backtesting en cours...' : '🚀 Lancer le Backtesting'}
              </button>
            </div>
          </div>
        );

      case 'results':
        if (!backtestResults) {
          return (
            <div className="no-results">
              <h3>📊 Résultats du Backtesting</h3>
              <p>Aucun résultat disponible. Lancez un backtesting depuis l'onglet Configuration.</p>
            </div>
          );
        }
        
        return (
          <div className="backtest-results">
            <h3>📊 Résultats du Backtesting</h3>
            
            {/* Métriques principales */}
            <div className="results-metrics">
              <div className="metric-card">
                <div className="metric-label">Rendement Total</div>
                <div className="metric-value positive">{backtestResults.totalReturn}%</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Rendement Annualisé</div>
                <div className="metric-value positive">{backtestResults.annualizedReturn}%</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Volatilité</div>
                <div className="metric-value">{backtestResults.volatility}%</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Sharpe Ratio</div>
                <div className="metric-value">{backtestResults.sharpeRatio}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Max Drawdown</div>
                <div className="metric-value negative">{backtestResults.maxDrawdown}%</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Win Rate</div>
                <div className="metric-value">{backtestResults.winRate}%</div>
              </div>
            </div>
            
            {/* Graphique de performance (simulé) */}
            <div className="performance-chart">
              <h4>Courbe de Performance</h4>
              <div className="chart-placeholder">
                <p>📈 Graphique de l'évolution de la valeur du portefeuille</p>
                <p>Valeur finale: {backtestResults.equityCurve[backtestResults.equityCurve.length - 1]?.value?.toLocaleString()}€</p>
              </div>
            </div>
            
            {/* Comparaison avec benchmark */}
            <div className="benchmark-comparison">
              <h4>Comparaison avec Benchmark ({backtestConfig.benchmark})</h4>
              <div className="comparison-table">
                <div className="comparison-row">
                  <span>Métrique</span>
                  <span>Portfolio</span>
                  <span>Benchmark</span>
                  <span>Différence</span>
                </div>
                <div className="comparison-row">
                  <span>Rendement Total</span>
                  <span>{backtestResults.totalReturn}%</span>
                  <span>{backtestResults.benchmarkComparison?.total_return || 'N/A'}%</span>
                  <span className="positive">+{backtestResults.benchmarkComparison ? (backtestResults.totalReturn - backtestResults.benchmarkComparison.total_return).toFixed(1) : 'N/A'}%</span>
                </div>
                <div className="comparison-row">
                  <span>Volatilité</span>
                  <span>{backtestResults.volatility}%</span>
                  <span>{backtestResults.benchmarkComparison?.volatility || 'N/A'}%</span>
                  <span className="negative">+{backtestResults.benchmarkComparison ? (backtestResults.volatility - backtestResults.benchmarkComparison.volatility).toFixed(1) : 'N/A'}%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="backtest-comparison">
            <h3>📈 Comparaison Multi-Stratégies</h3>
            <p>Fonctionnalité en développement - Comparaison de jusqu'à 3 backtests simultanés</p>
            <div className="feature-preview">
              <div className="preview-item">✅ Tableau comparatif des métriques</div>
              <div className="preview-item">✅ Graphique superposé des performances</div>
              <div className="preview-item">✅ Analyse de robustesse</div>
              <div className="preview-item">🔄 Tests de sensibilité aux paramètres</div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="backtest-history">
            <h3>📋 Historique des Backtests</h3>
            {backtestHistory.length === 0 ? (
              <p>Aucun backtest dans l'historique.</p>
            ) : (
              <div className="history-list">
                {backtestHistory.map((backtest, index) => (
                  <div key={backtest.id} className="history-item">
                    <div className="history-header">
                      <span className="history-date">
                        {new Date(backtest.createdAt.seconds * 1000).toLocaleString()}
                      </span>
                      <span className="history-return positive">
                        {backtest.performance?.totalReturn}%
                      </span>
                    </div>
                    <div className="history-details">
                      <span>Période: {backtest.config?.startDate} - {backtest.config?.endDate}</span>
                      <span>Sharpe: {backtest.performance?.sharpeRatio}</span>
                      <span>Max DD: {backtest.performance?.maxDrawdown}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <div>Onglet non trouvé</div>;
    }
  };

  return (
    <div className="backtesting-module">
      {/* Header */}
      <div className="backtesting-header">
        <h2>⏮️ Module Backtesting - Phase 5</h2>
        <p>Tests de performance sur données historiques avec Backtesting.py + Railway</p>
        <span className="new-badge">NOUVEAU</span>
      </div>

      {/* Navigation des onglets */}
      <div className="backtesting-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="backtesting-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BacktestingModule;

