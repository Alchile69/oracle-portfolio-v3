import React, { useState } from 'react';
import Dashboard from './components/layout/Dashboard';
import PortfolioKPICards from './components/portfolio/PortfolioKPICards';
import AssetAllocationPieChart from './components/portfolio/AssetAllocationPieChart';
import CountryRiskHeatmap from './components/heatmap/CountryRiskHeatmap';
import { CountryProvider } from './contexts/CountryContext';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'secteurs':
        return (
          <div style={{ padding: '20px' }}>
            <h2>🏭 Secteurs</h2>
            <p>Module de secteurs en développement...</p>
          </div>
        );
      case 'essentiels':
        return (
          <div style={{ padding: '20px' }}>
            <h2>⚡ Essentiels</h2>
            <p>Module des essentiels en développement...</p>
          </div>
        );
      case 'configuration':
        return (
          <div style={{ padding: '20px' }}>
            <h2>⚙️ Configuration</h2>
            <p>Module de configuration en développement...</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="analytics-container" style={{ 
            padding: '20px', 
            maxWidth: '1400px', 
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
          }}>
            {/* Portfolio KPI Cards */}
            <PortfolioKPICards />
            
            {/* Section principale avec Asset Allocation et Country Risk Heatmap */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
              gap: '30px'
            }}>
              {/* Asset Allocation Pie Chart */}
              <div>
                <AssetAllocationPieChart />
              </div>
              
              {/* Country Risk Heatmap */}
              <div>
                <CountryRiskHeatmap />
              </div>
            </div>
            
            {/* Placeholder pour le futur Backtesting Module */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>
                🔄 Backtesting Module
              </h3>
              <p style={{ color: '#94a3b8', margin: 0 }}>
                Module de backtesting en développement - Phase 5
              </p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App" style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#ffffff'
    }}>
      {/* Header */}
      <header style={{ 
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '20px 0'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔮 Oracle Portfolio
          </h1>
          <p style={{ 
            margin: 0,
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            v3.0.0 - Système Extensible
          </p>
          <p style={{ 
            margin: '5px 0 0 0',
            color: '#64748b',
            fontSize: '12px'
          }}>
            Plateforme d'analyse financière avec plugins dynamiques
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ 
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '15px 0'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'secteurs', label: '🏭 Secteurs', icon: '🏭' },
            { id: 'essentiels', label: '⚡ Essentiels', icon: '⚡' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' },
            { id: 'configuration', label: '⚙️ Configuration', icon: '⚙️' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                background: currentView === item.id 
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                  : 'rgba(51, 65, 85, 0.5)',
                color: '#ffffff',
                border: currentView === item.id 
                  ? '1px solid #3b82f6' 
                  : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: currentView === item.id ? 'bold' : 'normal',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                if (currentView !== item.id) {
                  e.target.style.background = 'rgba(51, 65, 85, 0.8)';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== item.id) {
                  e.target.style.background = 'rgba(51, 65, 85, 0.5)';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                }
              }}
            >
              {item.label}
            </button>
          ))}
          
          <button
            style={{
              background: 'linear-gradient(135deg, #ec4899, #be185d)',
              color: '#ffffff',
              border: '1px solid #ec4899',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            Get Full Access
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <footer style={{ 
        background: 'rgba(15, 23, 42, 0.9)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '20px 0',
        textAlign: 'center'
      }}>
        <p style={{ 
          margin: 0,
          color: '#64748b',
          fontSize: '12px'
        }}>
          © 2025 Scalable Group. Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}

export default App;

