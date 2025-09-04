import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeSection, onSectionChange, isAuthenticated }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Vue d\'ensemble du portefeuille'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: '💼',
      description: 'Gestion du portefeuille'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      description: 'Analyses avancées avec WOW V1',
      badge: 'WOW V1',
      isNew: true
    },
    {
      id: 'markets',
      label: 'Marchés',
      icon: '📊',
      description: 'Données de marché en temps réel'
    },
    {
      id: 'screening',
      label: 'Screening',
      icon: '🔍',
      description: 'Filtrage et sélection d\'actifs'
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: '⚙️',
      description: 'Paramètres et configuration'
    }
  ];

  const handleItemClick = (itemId) => {
    onSectionChange(itemId);
  };

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-section">
          <h1 className="app-title">Oracle Portfolio</h1>
          <span className="version-badge">V3</span>
        </div>
        <div className="wow-badge">
          <span className="wow-text">WOW V1 MVP</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${activeSection === item.id ? 'active' : ''} ${item.isNew ? 'new-feature' : ''}`}
                onClick={() => handleItemClick(item.id)}
                title={item.description}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
                {item.isNew && (
                  <span className="new-indicator">NEW</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Status Section */}
      <div className="sidebar-status">
        <div className={`status-indicator ${isAuthenticated ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {isAuthenticated ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>
        
        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-label">Portfolio</span>
            <span className="stat-value">€125,430</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">P&L Jour</span>
            <span className="stat-value positive">+2.3%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <p className="copyright">&copy; 2025 Oracle Portfolio V3</p>
        <p className="version">Version 1.0.0 - WOW V1 MVP</p>
      </div>
    </aside>
  );
};

export default Sidebar;

