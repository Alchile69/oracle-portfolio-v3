import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/responsive.css';
import './styles/glassmorphism.css';

// Import des composants principaux
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Configuration from './components/Configuration';
import GetFullAccess from './components/GetFullAccess';

// Import des services
import { firebaseService } from './services/firebaseService';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Initialisation Firebase et authentification
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Authentification anonyme Firebase
        const authResult = await firebaseService.signInAnonymously();
        setUser(authResult.user);
        setIsAuthenticated(true);
        console.log('✅ Authentification Firebase réussie');
      } catch (error) {
        console.error('❌ Erreur authentification Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Gestion de la navigation
  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Initialisation d'Oracle Portfolio V3...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Header avec navigation principale */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="app-title">Oracle Portfolio V3</h1>
              <span className="version-badge">WOW V1 MVP</span>
            </div>
            
            {/* Navigation principale */}
            <Navigation 
              currentView={currentView} 
              onNavigate={handleNavigation}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </header>

        {/* Contenu principal */}
        <main className="main-content">
          <Routes>
            {/* Route par défaut vers Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 📊 Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  user={user}
                  onNavigate={handleNavigation}
                />
              } 
            />
            
            {/* 🧮 Analytics (avec WOW V1 dedans) */}
            <Route 
              path="/analytics" 
              element={
                <Analytics 
                  user={user}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
            
            {/* ⚙️ Configuration */}
            <Route 
              path="/configuration" 
              element={
                <Configuration 
                  user={user}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
            
            {/* Get Full Access */}
            <Route 
              path="/get-full-access" 
              element={
                <GetFullAccess 
                  user={user}
                />
              } 
            />
            
            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p>&copy; 2025 Oracle Portfolio V3 - WOW V1 MVP</p>
            <div className="footer-links">
              <span>Utilisateur: {user?.uid ? 'Connecté' : 'Anonyme'}</span>
              <span>Version: 1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

