import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/responsive.css';
import './styles/glassmorphism.css';

// Import des composants Oracle V3 originaux
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

// Import des services
import { firebaseService } from './services/firebaseService';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
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
        // Continuer même en cas d'erreur Firebase
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Gestion de la navigation Oracle V3
  const handleSectionChange = (section) => {
    setActiveSection(section);
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
    <div className="App oracle-v3-layout">
      {/* Sidebar Oracle V3 */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isAuthenticated={isAuthenticated}
      />
      
      {/* Contenu principal Oracle V3 */}
      <MainContent 
        activeSection={activeSection}
        user={user}
        isAuthenticated={isAuthenticated}
        onNavigate={handleSectionChange}
      />
    </div>
  );
}

export default App;

