import React from 'react';
import './MainContent.css';

// Import des composants Oracle V3 + WOW V1
import Dashboard from './Dashboard';
import Analytics from './Analytics'; // WOW V1 intégré ici
import Configuration from './Configuration';
import GetFullAccess from './GetFullAccess';

// Composants Oracle V3 originaux à créer
import Portfolio from './Portfolio';
import Markets from './Markets';
import Screening from './Screening';

const MainContent = ({ activeSection, user, isAuthenticated, onNavigate }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            onNavigate={onNavigate}
          />
        );
        
      case 'portfolio':
        return (
          <Portfolio 
            user={user}
            isAuthenticated={isAuthenticated}
          />
        );
        
      case 'analytics':
        return (
          <div className="analytics-container">
            <div className="section-header">
              <h1 className="section-title">
                <span className="section-icon">📈</span>
                Analytics - WOW V1 MVP
                <span className="wow-badge">NOUVEAU</span>
              </h1>
              <p className="section-description">
                Analyses avancées avec backtesting, screening intelligent et visualisations interactives
              </p>
            </div>
            
            <Analytics 
              user={user}
              isAuthenticated={isAuthenticated}
            />
          </div>
        );
        
      case 'markets':
        return (
          <Markets 
            user={user}
            isAuthenticated={isAuthenticated}
          />
        );
        
      case 'screening':
        return (
          <Screening 
            user={user}
            isAuthenticated={isAuthenticated}
          />
        );
        
      case 'configuration':
        return (
          <Configuration 
            user={user}
            isAuthenticated={isAuthenticated}
          />
        );
        
      default:
        return (
          <Dashboard 
            user={user}
            onNavigate={onNavigate}
          />
        );
    }
  };

  return (
    <main className="main-content">
      <div className="content-wrapper">
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;

