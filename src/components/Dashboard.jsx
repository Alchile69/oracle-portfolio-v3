import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, onNavigate }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chargement des données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Simulation de chargement des données
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setDashboardData({
          portfolioValue: 125000,
          dailyChange: 2.3,
          weeklyChange: 5.7,
          monthlyChange: 8.5,
          notifications: [
            { id: 1, type: 'info', message: 'Nouveau module Backtesting disponible', time: '2h' },
            { id: 2, type: 'success', message: 'Portfolio rééquilibré avec succès', time: '1j' },
            { id: 3, type: 'warning', message: 'Volatilité élevée détectée sur TECH', time: '2j' }
          ],
          quickStats: {
            totalAssets: 12,
            activeStrategies: 3,
            lastRebalance: '2025-09-01'
          }
        });
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Navigation vers Analytics
  const goToAnalytics = () => {
    onNavigate('analytics');
    navigate('/analytics');
  };

  // Navigation vers Configuration
  const goToConfiguration = () => {
    onNavigate('configuration');
    navigate('/configuration');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Dashboard */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📊 Dashboard Oracle Portfolio V3</h1>
          <p>Vue d'ensemble de votre portefeuille d'investissement</p>
          <div className="user-info">
            <span>Utilisateur: {user?.uid ? 'Connecté' : 'Anonyme'}</span>
            <span>Dernière connexion: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="dashboard-metrics">
        <div className="metric-card primary">
          <div className="metric-header">
            <h3>Valeur du Portefeuille</h3>
            <span className="metric-icon">💰</span>
          </div>
          <div className="metric-value">
            {dashboardData?.portfolioValue?.toLocaleString()}€
          </div>
          <div className="metric-change positive">
            +{dashboardData?.dailyChange}% aujourd'hui
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Performance Hebdomadaire</h3>
            <span className="metric-icon">📈</span>
          </div>
          <div className="metric-value">
            +{dashboardData?.weeklyChange}%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Performance Mensuelle</h3>
            <span className="metric-icon">📊</span>
          </div>
          <div className="metric-value">
            +{dashboardData?.monthlyChange}%
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>Actifs Totaux</h3>
            <span className="metric-icon">🏦</span>
          </div>
          <div className="metric-value">
            {dashboardData?.quickStats?.totalAssets}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="dashboard-actions">
        <h2>Actions Rapides</h2>
        <div className="action-cards">
          <button className="action-card featured" onClick={goToAnalytics}>
            <div className="action-icon">🧮</div>
            <div className="action-content">
              <h3>Analytics WOW V1</h3>
              <p>Accéder aux analyses avancées avec KPIs, graphiques et backtesting</p>
              <span className="action-badge">NOUVEAU</span>
            </div>
          </button>

          <button className="action-card" onClick={goToConfiguration}>
            <div className="action-icon">⚙️</div>
            <div className="action-content">
              <h3>Configuration</h3>
              <p>Paramétrer votre portefeuille et vos préférences</p>
            </div>
          </button>

          <button className="action-card" onClick={() => navigate('/get-full-access')}>
            <div className="action-icon">🔓</div>
            <div className="action-content">
              <h3>Get Full Access</h3>
              <p>Débloquer toutes les fonctionnalités premium</p>
            </div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="dashboard-notifications">
        <h2>Notifications Récentes</h2>
        <div className="notifications-list">
          {dashboardData?.notifications?.map((notification) => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">Il y a {notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="dashboard-stats">
        <h2>Statistiques Rapides</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Stratégies Actives</span>
            <span className="stat-value">{dashboardData?.quickStats?.activeStrategies}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Dernier Rééquilibrage</span>
            <span className="stat-value">{dashboardData?.quickStats?.lastRebalance}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Statut</span>
            <span className="stat-value status-active">Actif</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

