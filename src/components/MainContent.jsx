import React from 'react';
import './MainContent.css';

// Import des composants Oracle V3 + WOW V1
import Dashboard from './Dashboard';
import Analytics from './Analytics'; // WOW V1 intégré ici avec Portfolio/Markets/Screening
import Configuration from './Configuration';

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
      case 'markets':
      case 'screening':
        // Rediriger vers Analytics qui contient ces fonctionnalités
        return (
          <div className="analytics-container">
            <div className="section-header">
              <h1 className="section-title">
                <span className="section-icon">📈</span>
                Analytics - Oracle V3 + WOW V1
                <span className="wow-badge">INTÉGRÉ</span>
              </h1>
              <p className="section-description">
                Portfolio, Markets et Screening sont maintenant intégrés dans Analytics avec WOW V1
              </p>
            </div>
            
            <Analytics 
              user={user}
              isAuthenticated={isAuthenticated}
              defaultSection={activeSection} // Passer la section demandée
            />
          </div>
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

