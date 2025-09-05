import React, { useState, useEffect } from 'react';
import './App.css';
import firebaseService from './services/firebaseService';

// Composants simplifiés
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Oracle MVP - Initialisation...');
        
        // Authentification Firebase
        const authResult = await firebaseService.signInAnonymously();
        
        // Vérification que l'authentification a réussi
        if (authResult && authResult.user) {
          setUser(authResult.user);
          setIsAuthenticated(true);
          console.log('✅ Authentification réussie:', authResult.user.uid);
        } else {
          console.log('❌ Authentification échouée');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Erreur authentification:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard user={user} isAuthenticated={isAuthenticated} />;
      case 'analytics':
        return <Analytics user={user} isAuthenticated={isAuthenticated} />;
      case 'settings':
        return <Settings user={user} isAuthenticated={isAuthenticated} />;
      default:
        return <Dashboard user={user} isAuthenticated={isAuthenticated} />;
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Oracle MVP</h2>
            <p>Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Navigation principale */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-brand">Oracle MVP</div>
          <div className="nav-links">
            <button
              className={`nav-link ${currentSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentSection('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-link ${currentSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setCurrentSection('analytics')}
            >
              Analytics
            </button>
            <button
              className={`nav-link ${currentSection === 'settings' ? 'active' : ''}`}
              onClick={() => setCurrentSection('settings')}
            >
              Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="main-content">
        <div className="container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;

