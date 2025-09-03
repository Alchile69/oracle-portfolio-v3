import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ currentView, onNavigate, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Configuration des éléments de navigation
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      description: 'Vue d\'ensemble du portefeuille'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '🧮',
      path: '/analytics',
      description: 'Analyses avancées avec WOW V1',
      badge: 'WOW V1'
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: '⚙️',
      path: '/configuration',
      description: 'Paramètres et configuration'
    },
    {
      id: 'get-full-access',
      label: 'Get Full Access',
      icon: '🔓',
      path: '/get-full-access',
      description: 'Accès complet aux fonctionnalités',
      highlight: true
    }
  ];

  // Gestion du clic sur un élément de navigation
  const handleNavClick = (item) => {
    onNavigate(item.id);
    navigate(item.path);
  };

  // Vérifier si un élément est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
            onClick={() => handleNavClick(item)}
            title={item.description}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
            {isActive(item.path) && (
              <div className="active-indicator"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Indicateur de statut */}
      <div className="nav-status">
        <div className={`status-indicator ${isAuthenticated ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {isAuthenticated ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

