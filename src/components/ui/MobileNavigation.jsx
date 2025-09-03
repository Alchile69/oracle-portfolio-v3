import React, { useState, useEffect } from 'react';
import './MobileNavigation.css';

const MobileNavigation = ({ currentView, onViewChange, isAuthenticated, onConfigurationClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fermer le menu lors du changement de vue
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentView]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', primary: true },
    { id: 'analytics', label: 'Analytics', icon: '📈', primary: true },
    { id: 'sectors', label: 'Secteurs', icon: '🏢', primary: false },
    { id: 'essentials', label: 'Essentiels', icon: '🚀', primary: false },
    { id: 'configuration', label: 'Config', icon: '⚙️', primary: false, requiresAuth: true }
  ];

  const handleNavClick = (itemId) => {
    if (itemId === 'configuration') {
      onConfigurationClick();
    } else {
      onViewChange(itemId);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!isMobile) {
    // Navigation desktop classique
    return (
      <nav className="desktop-nav">
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`nav-button ${currentView === item.id ? 'active' : ''} ${item.primary ? 'primary' : ''}`}
            disabled={item.requiresAuth && !isAuthenticated}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        <button className="nav-button premium">
          <span className="nav-icon">⭐</span>
          <span className="nav-label">Premium</span>
        </button>
      </nav>
    );
  }

  return (
    <>
      {/* Navigation mobile */}
      <nav className="mobile-nav">
        {/* Navigation principale (toujours visible) */}
        <div className="mobile-nav-primary">
          {navigationItems.filter(item => item.primary).map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`mobile-nav-button ${currentView === item.id ? 'active' : ''}`}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          ))}
          
          {/* Bouton menu hamburger */}
          <button
            onClick={toggleMenu}
            className={`mobile-nav-button menu-toggle ${isMenuOpen ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{isMenuOpen ? '✕' : '☰'}</span>
            <span className="mobile-nav-label">Menu</span>
          </button>
        </div>

        {/* Menu déroulant */}
        {isMenuOpen && (
          <div className="mobile-nav-dropdown">
            <div className="mobile-nav-overlay" onClick={() => setIsMenuOpen(false)} />
            <div className="mobile-nav-menu">
              {navigationItems.filter(item => !item.primary).map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-menu-item ${currentView === item.id ? 'active' : ''}`}
                  disabled={item.requiresAuth && !isAuthenticated}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                  {item.requiresAuth && !isAuthenticated && (
                    <span className="auth-required">🔒</span>
                  )}
                </button>
              ))}
              <div className="mobile-nav-divider" />
              <button className="mobile-nav-menu-item premium">
                <span className="mobile-nav-icon">⭐</span>
                <span className="mobile-nav-label">Get Premium</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default MobileNavigation;

