import React, { useState, useEffect } from 'react';
import { CountryProvider } from './contexts/CountryContext';
import Dashboard from './components/layout/Dashboard';
import LoginModal from './components/auth/LoginModal';
import ExtensibleConfigurationPanel from './components/admin/ExtensibleConfigurationPanel';
import PluginWizard from './components/admin/PluginWizard';
import SectorsModule from './components/sectors/SectorsModule';
import EssentialsModule from './components/essentials/EssentialsModule';
import PortfolioKPICards from './components/portfolio/PortfolioKPICards';
import AssetAllocationPieChart from './components/portfolio/AssetAllocationPieChart';
import ScreeningTable from './components/screening/ScreeningTable';
import MobileNavigation from './components/ui/MobileNavigation';
import PageTransition from './components/ui/PageTransition';
import { ToastContainer, useToast } from './components/ui/ToastNotification';
import pluginSystem from './utils/PluginSystem';
import './App.css';
import './styles/responsive.css';
import './styles/glassmorphism.css';
import './styles/analytics.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPluginWizard, setShowPluginWizard] = useState(false);
  const [wizardType, setWizardType] = useState('');
  
  // Hook pour les toasts
  const toast = useToast();

  // Version mise à jour
  const appVersion = "Oracle Portfolio Real-time market data and portfolio analysis";

  // Initialisation du système de plugins
  useEffect(() => {
    const initializePlugins = async () => {
      try {
        // Chargement des plugins par défaut
        console.log('🔌 Initialisation du système de plugins...');
        
        // Hooks d'exemple
        pluginSystem.addHook('after_add', (data) => {
          console.log(`✅ Plugin ${data.type} "${data.plugin.name}" ajouté`);
          // Ici on pourrait déclencher une mise à jour de l'interface
        });

        pluginSystem.addHook('after_delete', (data) => {
          console.log(`🗑️ Plugin ${data.type} "${data.plugin.name}" supprimé`);
        });

        console.log('🎉 Système de plugins initialisé avec succès');
      } catch (error) {
        console.error('❌ Erreur initialisation plugins:', error);
      }
    };

    initializePlugins();
  }, []);

  const handleConfigurationClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setCurrentView('configuration');
    }
  };

  const handleLogin = (credentials) => {
    // Validation simple des identifiants
    if (credentials.username === 'admin' && credentials.password === 'scalabla2025') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setCurrentView('configuration');
    } else {
      alert('Identifiants incorrects');
    }
  };

  const handlePluginWizard = (type) => {
    setWizardType(type);
    setShowPluginWizard(true);
  };

  const handlePluginComplete = (plugin) => {
    console.log('🎉 Plugin créé:', plugin);
    setShowPluginWizard(false);
    // Rafraîchir l'interface de configuration
    setCurrentView('configuration');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'sectors':
        return <SectorsModule />;
      case 'essentials':
        return <EssentialsModule />;
      case 'configuration':
        return (
          <ExtensibleConfigurationPanel 
            onPluginWizard={handlePluginWizard}
            pluginSystem={pluginSystem}
          />
        );
      case 'analytics':
        return (
          <div className="analytics-container">
            <div className="analytics-header">
              <h2 className="analytics-title">
                <span className="analytics-icon">📈</span>
                Portfolio Analytics
              </h2>
              <p className="analytics-subtitle">
                Analyse en temps réel de votre portefeuille d'investissement
              </p>
            </div>
            
            <div className="analytics-content">
              <div className="analytics-section kpi-section">
                <PortfolioKPICards />
              </div>
              
              <div className="analytics-section allocation-section">
                <AssetAllocationPieChart />
              </div>
            </div>
          </div>
        );
      default:
        // Dashboard unifié WOW V1 MVP
        return (
          <div className="dashboard-unified">
            <div className="dashboard-header">
              <h2 className="dashboard-title">
                <span className="dashboard-icon">🚀</span>
                WOW V1 - Portfolio Management Dashboard
              </h2>
              <p className="dashboard-subtitle">
                Vue d'ensemble complète de votre portefeuille d'investissement
              </p>
            </div>
            
            <div className="dashboard-content">
              {/* Section KPI Cards */}
              <div className="dashboard-section kpi-section">
                <PortfolioKPICards />
              </div>
              
              {/* Section Asset Allocation et Screening */}
              <div className="dashboard-grid">
                <div className="dashboard-section allocation-section">
                  <AssetAllocationPieChart />
                </div>
                
                <div className="dashboard-section screening-section">
                  <ScreeningTable 
                    compact={true} 
                    maxRows={5}
                    title="Top 5 Assets Screening"
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <CountryProvider>
      <div className="App">
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">🔮</div>
              <div className="title-section">
                <h1>Oracle Portfolio</h1>
                <span className="version">v2.6.1</span>
              </div>
            </div>
            <p className="subtitle">Real-time market data and portfolio analysis</p>
          </div>
        </header>

        <MobileNavigation
          currentView={currentView}
          onViewChange={setCurrentView}
          isAuthenticated={isAuthenticated}
          onConfigurationClick={handleConfigurationClick}
        />

        <main className="main-content">
          <PageTransition currentView={currentView}>
            {renderCurrentView()}
          </PageTransition>
        </main>

        {/* Modal de connexion */}
        {showLoginModal && (
          <LoginModal
            onLogin={handleLogin}
            onClose={() => setShowLoginModal(false)}
          />
        )}

        {/* Assistant de création de plugins */}
        {showPluginWizard && (
          <div className="wizard-overlay">
            <PluginWizard
              type={wizardType}
              onComplete={handlePluginComplete}
              onCancel={() => setShowPluginWizard(false)}
            />
          </div>
        )}

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <span className="footer-logo">💎</span>
              <span>© 2025 Scalabla Group. Tous droits réservés.</span>
            </div>
            <div className="footer-section">
              <span>🔌 Plugins actifs</span>
            </div>
          </div>
        </footer>

        <style jsx>{`
          .App {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
            color: white;
            display: flex;
            flex-direction: column;
          }

          .app-header {
            background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
            padding: 20px;
            border-bottom: 1px solid #2d2d44;
          }

          .header-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
          }

          .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
          }

          .logo {
            font-size: 2.5rem;
            filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
          }

          .title-section h1 {
            margin: 0;
            font-size: 2.2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .version {
            font-size: 0.9rem;
            color: #a0a0b0;
            font-weight: normal;
          }

          .subtitle {
            margin: 0;
            color: #a0a0b0;
            font-size: 1.1rem;
          }

          .main-nav {
            background: #1a1a2e;
            padding: 15px 20px;
            display: flex;
            justify-content: center;
            gap: 10px;
            border-bottom: 1px solid #2d2d44;
          }

          .nav-button {
            padding: 12px 24px;
            background: #2d2d44;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .nav-button:hover {
            background: #3d3d54;
            transform: translateY(-2px);
          }

          .nav-button.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .nav-button.premium {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .main-content {
            flex: 1;
            padding: 0;
            max-width: 100%;
            margin: 0 auto;
          }

          .analytics-placeholder {
            padding: 40px;
            text-align: center;
            color: #a0a0b0;
          }

          .analytics-placeholder h2 {
            color: #667eea;
            margin-bottom: 20px;
          }

          .wizard-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
          }

          .app-footer {
            background: #0f0f23;
            padding: 20px;
            border-top: 1px solid #2d2d44;
            margin-top: auto;
          }

          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .footer-section {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #a0a0b0;
            font-size: 0.9rem;
          }

          .footer-logo {
            font-size: 1.2rem;
            filter: drop-shadow(0 0 5px rgba(102, 126, 234, 0.3));
          }

          @media (max-width: 768px) {
            .logo-section {
              flex-direction: column;
              gap: 10px;
            }

            .main-nav {
              flex-wrap: wrap;
              gap: 8px;
            }

            .nav-button {
              padding: 10px 16px;
              font-size: 13px;
            }

            .footer-content {
              flex-direction: column;
              gap: 10px;
              text-align: center;
            }
          }
        `}</style>
      </div>
      
      {/* Toast Container */}
      <ToastContainer 
        toasts={toast.toasts} 
        onRemove={toast.removeToast} 
      />
    </CountryProvider>
  );
}

export default App;

