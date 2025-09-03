import React, { useState, useEffect } from 'react';
import './ScreeningTable.css';

const ScreeningTableFixed = ({ 
  compact = false, 
  maxRows = 10,
  title = "Top Assets Screening"
}) => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const [dataSource, setDataSource] = useState('demo');

  // Données de démonstration avec vraies données simulées
  const getDemoData = () => {
    return [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.84,
        change: 2.34,
        changePercent: 1.35,
        volume: '52.3M',
        marketCap: '2.75T',
        pe: 28.5,
        score: 92,
        sector: 'Technology',
        recommendation: 'BUY',
        source: 'Demo Data'
      },
      {
        symbol: 'NVDA',
        name: 'NVIDIA Corp.',
        price: 421.13,
        change: 8.92,
        changePercent: 2.16,
        volume: '67.1M',
        marketCap: '1.04T',
        pe: 58.7,
        score: 94,
        sector: 'Technology',
        recommendation: 'BUY',
        source: 'Demo Data'
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 338.11,
        change: -1.23,
        changePercent: -0.36,
        volume: '28.7M',
        marketCap: '2.51T',
        pe: 32.1,
        score: 89,
        sector: 'Technology',
        recommendation: 'BUY',
        source: 'Demo Data'
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 134.37,
        change: 0.87,
        changePercent: 0.65,
        volume: '31.2M',
        marketCap: '1.68T',
        pe: 25.3,
        score: 87,
        sector: 'Technology',
        recommendation: 'BUY',
        source: 'Demo Data'
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.50,
        change: -3.21,
        changePercent: -1.27,
        volume: '89.4M',
        marketCap: '789B',
        pe: 65.8,
        score: 78,
        sector: 'Consumer Discretionary',
        recommendation: 'HOLD',
        source: 'Demo Data'
      }
    ].slice(0, maxRows);
  };

  useEffect(() => {
    // Simuler le chargement des données
    setIsLoading(true);
    setDataSource('loading');
    
    setTimeout(() => {
      const demoData = getDemoData();
      setAssets(demoData);
      setDataSource('demo');
      setIsLoading(false);
      console.log(`✅ ScreeningTable: ${demoData.length} actifs chargés (mode démo)`);
    }, 1500);
  }, [maxRows]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedAssets = [...assets].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setAssets(sortedAssets);
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'BUY': return '#00ff88';
      case 'HOLD': return '#f59e0b';
      case 'SELL': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#00ff88';
    if (score >= 80) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    return '#ef4444';
  };

  if (isLoading) {
    return (
      <div className={`screening-table ${compact ? 'compact' : ''}`}>
        <div className="screening-header">
          <h3 className="screening-title">
            <span className="screening-icon">🔍</span>
            {title}
          </h3>
          {!compact && (
            <p className="screening-subtitle">
              Analyse et scoring automatique des meilleurs actifs
            </p>
          )}
        </div>
        
        <div className="screening-loading">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <p>Analyse des actifs en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`screening-table ${compact ? 'compact' : ''}`}>
      <div className="screening-header">
        <h3 className="screening-title">
          <span className="screening-icon">🔍</span>
          {title}
        </h3>
        {!compact && (
          <p className="screening-subtitle">
            Analyse et scoring automatique des meilleurs actifs
          </p>
        )}
        <div className="screening-stats">
          <span className="stat-item">
            <span className="stat-value">{assets.length}</span>
            <span className="stat-label">Actifs analysés</span>
          </span>
          {!compact && (
            <>
              <span className="stat-item">
                <span className="stat-value">{assets.filter(a => a.recommendation === 'BUY').length}</span>
                <span className="stat-label">Recommandations BUY</span>
              </span>
              <span className="stat-item">
                <span className="stat-value">{Math.round(assets.reduce((acc, a) => acc + a.score, 0) / assets.length)}</span>
                <span className="stat-label">Score moyen</span>
              </span>
            </>
          )}
          
          {/* Indicateur de source de données */}
          <div className="data-source-indicator">
            <div className={`source-dot ${dataSource === 'real_data' ? 'real' : dataSource === 'demo' ? 'error' : 'loading'}`}></div>
            <span className="source-text">
              {dataSource === 'real_data' ? 'Données réelles' :
               dataSource === 'demo' ? 'Données démo' :
               'Chargement...'}
            </span>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="screening-data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('symbol')} className="sortable">
                Symbole
                {sortConfig.key === 'symbol' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              {!compact && (
                <th onClick={() => handleSort('name')} className="sortable">
                  Nom
                </th>
              )}
              <th onClick={() => handleSort('price')} className="sortable">
                Prix
              </th>
              <th onClick={() => handleSort('changePercent')} className="sortable">
                Variation
              </th>
              {!compact && (
                <>
                  <th onClick={() => handleSort('volume')} className="sortable">
                    Volume
                  </th>
                  <th onClick={() => handleSort('pe')} className="sortable">
                    P/E
                  </th>
                </>
              )}
              <th onClick={() => handleSort('score')} className="sortable">
                Score
              </th>
              <th>Recommandation</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={asset.symbol} className="asset-row">
                <td className="symbol-cell">
                  <div className="symbol-container">
                    <span className="symbol">{asset.symbol}</span>
                    <span className="rank">#{index + 1}</span>
                  </div>
                </td>
                {!compact && (
                  <td className="name-cell">
                    <div className="name-container">
                      <span className="name">{asset.name}</span>
                      <span className="sector">{asset.sector}</span>
                    </div>
                  </td>
                )}
                <td className="price-cell">
                  <span className="price">${asset.price}</span>
                </td>
                <td className="change-cell">
                  <div className={`change-container ${asset.changePercent >= 0 ? 'positive' : 'negative'}`}>
                    <span className="change-amount">
                      {asset.changePercent >= 0 ? '+' : ''}{asset.change}
                    </span>
                    <span className="change-percent">
                      ({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%)
                    </span>
                  </div>
                </td>
                {!compact && (
                  <>
                    <td className="volume-cell">
                      <span className="volume">{asset.volume}</span>
                    </td>
                    <td className="pe-cell">
                      <span className="pe">{asset.pe}</span>
                    </td>
                  </>
                )}
                <td className="score-cell">
                  <div className="score-container">
                    <div 
                      className="score-bar"
                      style={{ 
                        width: `${asset.score}%`,
                        backgroundColor: getScoreColor(asset.score)
                      }}
                    />
                    <span 
                      className="score-value"
                      style={{ color: getScoreColor(asset.score) }}
                    >
                      {asset.score}
                    </span>
                  </div>
                </td>
                <td className="recommendation-cell">
                  <span 
                    className="recommendation-badge"
                    style={{ 
                      backgroundColor: `${getRecommendationColor(asset.recommendation)}20`,
                      color: getRecommendationColor(asset.recommendation),
                      border: `1px solid ${getRecommendationColor(asset.recommendation)}40`
                    }}
                  >
                    {asset.recommendation}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compact && (
        <div className="screening-footer">
          <button className="view-all-btn">
            Voir tous les actifs →
          </button>
        </div>
      )}
    </div>
  );
};

export default ScreeningTableFixed;

