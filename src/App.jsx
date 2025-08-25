/**
 * @file App.jsx
 * @description Composant principal de l'application Oracle Portfolio V3.
 * Gère la navigation, l'authentification, les plugins et l'affichage des vues.
 * @version 3.0.0
 * @date 2025-08-25
 */

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
import { ToastContainer, useToast } from './components/ui/ToastNotification';
import pluginSystem from './utils/PluginSystem';

// Import des styles globaux
import './App.css';
import './styles/responsive.css';
import './styles/glassmorphism.css';
import './styles/animations.css';

/**
 * Composant principal de l'application
 * @returns {JSX.Element}
 */
function App() {
  // ===== ÉTATS =====
  const [currentView, setCurrentView] = useState('dashboard'); // Vue actuelle (dashboard, analytics, etc.)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Statut d'authentification
  const [showLoginModal, setShowLoginModal] = useState(false); // Affichage du modal de connexion
  const [showPluginWizard, setShowPluginWizard] = useState(false); // Affichage de l'assistant de plugins
  const [wizardType, setWizardType] = useState(''); // Type de plugin à créer
  
  // Hook pour les notifications toast
  const toast = useToast();

  // Version de l'application
  const appVersion = "Oracle Portfolio Real-time market data and portfolio analysis";

  // ===== EFFETS =====
  // Initialisation du système de plugins au chargement de l'application
  useEffect(() => {
    const initializePlugins = async () => {
      try {
        console.log('🔌 Initialisation du système de plugins...');
        
        // Ajout de hooks pour observer les événements du système de plugins
        pluginSystem.addHook('after_add', (data) => {
          console.log(`✅ Plugin ${data.type} "${data.plugin.name}" ajouté`);
          toast.success(`Plugin "${data.plugin.name}" ajouté !`);
        });

        pluginSystem.addHook('after_delete', (data) => {
          console.log(`🗑️ Plugin ${data.type} "${data.plugin.name}" supprimé`);
          toast.info(`Plugin "${data.plugin.name}" supprimé.`);
        });

        console.log('🎉 Système de plugins initialisé avec succès');
      } catch (error) {
        console.error("❌ Erreur initialisation plugins:", error);
        toast.error("Erreur lors de l'initialisation des plugins.");
      }
    };

    initializePlugins();
  }, [toast]); // Dépendance à toast pour pouvoir l'utiliser dans les hooks

  // ===== GESTIONNAIRES D'ÉVÉNEMENTS =====
  // Gère le clic sur le bouton de configuration
  const handleConfigurationClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setCurrentView('configuration');
    }
  };

  // Gère la soumission du formulaire de connexion
  const handleLogin = (credentials) => {
    // Logique de connexion simplifiée
    if (credentials.username === 'admin' && credentials.password === 'scalabla2025') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setCurrentView('configuration');
      toast.success('Connexion réussie !');
    } else {
      toast.error('Identifiants incorrects.');
    }
  };

  // Ouvre l'assistant de création de plugins
  const handlePluginWizard = (type) => {
    setWizardType(type);
    setShowPluginWizard(true);
  };

  // Gère la fin de la création d'un plugin
  const handlePluginComplete = (plugin) => {
    console.log('🎉 Plugin créé:', plugin);
    setShowPluginWizard(false);
    setCurrentView('configuration'); // Rafraîchit la vue de configuration
  };

  // ===== RENDU DES VUES =====
  // Affiche la vue correspondante à l'état `currentView`
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
          <div className="analytics-view tab-content active" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <PortfolioKPICards />
            <div style={{ marginTop: '30px' }}>
              <AssetAllocationPieChart />
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  // ===== RENDU PRINCIPAL =====
  return (
    <CountryProvider>
      <div className="App">
        {/* En-tête de l'application */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">🔮</div>
              <div className="title-section">
                <h1>Oracle Portfolio</h1>
                <span className="version">v3.0.0</span>
              </div>
            </div>
            <p className="subtitle">{appVersion}</p>
          </div>
        </header>

        {/* Barre de navigation principale */}
        <nav className="main-nav">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('sectors')}
            className={`nav-tab ${currentView === 'sectors' ? 'active' : ''}`}
          >
            🏢 Secteurs
          </button>
          <button 
            onClick={() => setCurrentView('essentials')}
            className={`nav-tab ${currentView === 'essentials' ? 'active' : ''}`}
          >
            🚀 Essentiels
          </button>
          <button 
            onClick={() => setCurrentView('analytics')}
            className={`nav-tab ${currentView === 'analytics' ? 'active' : ''}`}
          >
            📈 Analytics
          </button>
          <button 
            onClick={handleConfigurationClick}
            className={`nav-tab ${currentView === 'configuration' ? 'active' : ''}`}
          >
            ⚙️ Configuration
          </button>
          <button className="nav-tab premium">
            Get Full Access
          </button>
        </nav>

        {/* Contenu principal de la vue */}
        <main className="main-content">
          {renderCurrentView()}
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

        {/* Pied de page de l'application */}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <span className="footer-logo">💎</span>
              <span>© 2025 Scalabla Group. Tous droits réservés.</span>
            </div>
            <div className="footer-section">
              <span>🔌 Plugins actifs: {(pluginSystem?.getPlugins('indicator') || []).length + (pluginSystem?.getPlugins('formula') || []).length + (pluginSystem?.getPlugins('regime') || []).length}</span>
            </div>
          </div>
        </footer>

        {/* Styles JSX pour le layout principal */}
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

          .nav-tab {
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

          .nav-tab:hover {
            background: #3d3d54;
            transform: translateY(-2px);
          }

          .nav-tab.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .nav-tab.premium {
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

          .analytics-view {
            animation: fadeInUp 0.5s ease-out;
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

            .nav-tab {
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
      
      {/* Conteneur pour les notifications toast */}
      <ToastContainer 
        toasts={toast.toasts} 
        onRemove={toast.removeToast} 
      />
    </CountryProvider>
  );
}

export default App;

