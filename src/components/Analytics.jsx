import React, { useState } from 'react';

// Import des composants WOW V1
import PortfolioKPICards from './portfolio/PortfolioKPICards';
import AssetAllocationPieChart from './portfolio/AssetAllocationPieChart';
import ScreeningTable from './portfolio/ScreeningTable';
import CountryHeatmap from './portfolio/CountryHeatmap';
import BacktestingModule from './portfolio/BacktestingModule';

const Analytics = ({ user, isAuthenticated }) => {
  const [activeModule, setActiveModule] = useState('portfolio');

  // Modules Analytics WOW V1
  const modules = [
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'markets', label: 'Markets', icon: '📊' },
    { id: 'screening', label: 'Screening', icon: '🔍' },
    { id: 'geography', label: 'Géographie', icon: '🌍' },
    { id: 'backtesting', label: 'Backtesting', icon: '⚡' }
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'portfolio':
        return (
          <div>
            <h2 className="module-title">Portfolio KPIs</h2>
            <PortfolioKPICards user={user} />
          </div>
        );
      
      case 'markets':
        return (
          <div>
            <h2 className="module-title">Asset Allocation</h2>
            <AssetAllocationPieChart user={user} />
          </div>
        );
      
      case 'screening':
        return (
          <div>
            <h2 className="module-title">Screening (20 actifs)</h2>
            <ScreeningTable user={user} />
          </div>
        );
      
      case 'geography':
        return (
          <div>
            <h2 className="module-title">Country Risk Heatmap</h2>
            <CountryHeatmap user={user} />
          </div>
        );
      
      case 'backtesting':
        return (
          <div>
            <h2 className="module-title">Backtesting Module</h2>
            <BacktestingModule user={user} />
          </div>
        );
      
      default:
        return (
          <div>
            <h2 className="module-title">Portfolio KPIs</h2>
            <PortfolioKPICards user={user} />
          </div>
        );
    }
  };

  return (
    <div>
      <h1>Analytics WOW V1</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '40px' }}>
        Analyses avancées et visualisations de votre portefeuille
      </p>

      {/* Navigation modules */}
      <div className="card">
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {modules.map(module => (
            <button
              key={module.id}
              className={`btn ${activeModule === module.id ? 'btn' : 'btn-secondary'}`}
              onClick={() => setActiveModule(module.id)}
            >
              {module.icon} {module.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu du module actif */}
      <div className="card">
        {renderModuleContent()}
      </div>
    </div>
  );
};

export default Analytics;

