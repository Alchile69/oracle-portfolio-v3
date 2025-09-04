import React, { useState, useEffect } from 'react';
import './Analytics.css';

// Import des composants WOW V1
import PortfolioKPICards from './portfolio/PortfolioKPICards';
import AssetAllocationPieChart from './portfolio/AssetAllocationPieChart';
import ScreeningTable from './portfolio/ScreeningTable';
import CountryHeatmap from './portfolio/CountryHeatmap';
import BacktestingModule from './portfolio/BacktestingModule';

const Analytics = ({ user, isAuthenticated, defaultSection = 'overview' }) => {
  // Mapping des sections Oracle V3 vers Analytics WOW V1
  const sectionMapping = {
    'portfolio': 'overview',
    'markets': 'allocation', 
    'screening': 'screening'
  };

  // Initialiser activeSection avec le mapping
  const initialSection = sectionMapping[defaultSection] || defaultSection;
  const [activeSection, setActiveSection] = useState(initialSection);
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  // Sections disponibles dans Analytics
  const analyticsSections = [
    {
      id: 'overview',
      label: 'Portfolio',
      icon: '💼',
      description: 'KPIs et métriques principales'
    },
    {
      id: 'allocation',
      label: 'Markets',
      icon: '📊',
      description: 'Répartition des actifs et marchés'
    },
    {
      id: 'screening',
      label: 'Screening',
      icon: '🔍',
      description: 'Filtrage et analyse des actifs'
    },
    {
      id: 'geography',
      label: 'Géographie',
      icon: '🌍',
      description: 'Répartition géographique'
    },
    {
      id: 'backtesting',
      label: 'Backtesting',
      icon: '⏮️',
      description: 'Tests de performance historique',
      badge: 'NEW'
    }
  ];

  // Chargement des données du portefeuille
  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        // Simulation de chargement des données
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données simulées pour le développement
        setPortfolioData({
          totalValue: 125000,
          totalReturn: 8.5,
          volatility: 12.3,
          sharpeRatio: 0.69,
          maxDrawdown: -15.2,
          winRate: 62.5,
          beta: 0.95,
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolioData();
  }, [isAuthenticated]);

  // Rendu du contenu selon la section active
  const renderSectionContent = () => {
    console.log('🎯 Rendu section:', activeSection);
    
    if (loading) {
      return (
        <div className="loading-section">
          <div className="loading-spinner"></div>
          <p>Chargement des données analytiques...</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return (
          <div className="analytics-section">
            <div className="section-header">
              <h2>📈 Vue d'ensemble - KPIs Portfolio</h2>
              <p>Métriques principales de performance du portefeuille</p>
            </div>
            <PortfolioKPICards 
              data={portfolioData}
              user={user}
            />
          </div>
        );

      case 'allocation':
        return (
          <div className="analytics-section">
            <div className="section-header">
              <h2>🥧 Allocation des Actifs</h2>
              <p>Répartition et diversification du portefeuille</p>
            </div>
            <AssetAllocationPieChart 
              data={portfolioData}
              user={user}
            />
          </div>
        );

      case 'screening':
        return (
          <div className="analytics-section">
            <div className="section-header">
              <h2>🔍 Screening des Actifs</h2>
              <p>Filtrage et analyse détaillée des positions</p>
            </div>
            <ScreeningTable 
              data={portfolioData}
              user={user}
            />
          </div>
        );

      case 'geography':
        return (
          <div className="analytics-section">
            <div className="section-header">
              <h2>🌍 Répartition Géographique</h2>
              <p>Exposition par pays et régions</p>
            </div>
            <CountryHeatmap 
              data={portfolioData}
              user={user}
            />
          </div>
        );

      case 'backtesting':
        return (
          <div className="analytics-section">
            <div className="section-header">
              <h2>⏮️ Module Backtesting</h2>
              <p>Tests de performance sur données historiques</p>
              <span className="new-feature-badge">NOUVEAU</span>
            </div>
            <BacktestingModule 
              data={portfolioData}
              user={user}
            />
          </div>
        );

      default:
        return (
          <div className="analytics-section">
            <p>Section non trouvée</p>
          </div>
        );
    }
  };

  return (
    <div className="analytics-container">
      {/* Header Analytics */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>🧮 Analytics - WOW V1 MVP</h1>
          <p>Analyses avancées et visualisations de votre portefeuille</p>
          {portfolioData && (
            <div className="portfolio-summary">
              <span className="portfolio-value">
                Valeur: {portfolioData.totalValue?.toLocaleString()}€
              </span>
              <span className="portfolio-return">
                Rendement: {portfolioData.totalReturn}%
              </span>
              <span className="last-update">
                Mis à jour: {portfolioData.lastUpdated?.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation des sections */}
      <div className="analytics-nav">
        <div className="nav-sections">
          {analyticsSections.map((section) => (
            <button
              key={section.id}
              className={`section-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => {
                console.log('🔄 Changement section:', section.id, 'depuis:', activeSection);
                setActiveSection(section.id);
              }}
              title={section.description}
            >
              <span className="section-icon">{section.icon}</span>
              <span className="section-label">{section.label}</span>
              {section.badge && (
                <span className="section-badge">{section.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu de la section active */}
      <div className="analytics-content">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default Analytics;

