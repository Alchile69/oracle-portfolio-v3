import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onNavigate }) => {
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
  };

  // Navigation vers Configuration
  const goToConfiguration = () => {
    onNavigate('configuration');
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
        <h3>📊 Financial Dashboard</h3>
        <p>Vue d'ensemble de votre portefeuille d'investissement</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Valeur Portefeuille */}
        <div className="kpi-card primary">
          <div className="kpi-header">
            <span className="kpi-icon">💰</span>
            <span className="kpi-label">Valeur Portfolio</span>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value">{dashboardData?.portfolioValue?.toLocaleString()}€</span>
          </div>
          <div className="kpi-change positive">
            <span>↗️ +{dashboardData?.dailyChange}%</span>
            <span className="kpi-period">aujourd'hui</span>
          </div>
        </div>

        {/* Performance Hebdo */}
        <div className="kpi-card success">
          <div className="kpi-header">
            <span className="kpi-icon">📈</span>
            <span className="kpi-label">Performance 7J</span>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value">+{dashboardData?.weeklyChange}<span className="kpi-suffix">%</span></span>
          </div>
          <div className="kpi-description">
            Évolution hebdomadaire
          </div>
        </div>

        {/* Performance Mensuelle */}
        <div className="kpi-card info">
          <div className="kpi-header">
            <span className="kpi-icon">📊</span>
            <span className="kpi-label">Performance 30J</span>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value">+{dashboardData?.monthlyChange}<span className="kpi-suffix">%</span></span>
          </div>
          <div className="kpi-description">
            Évolution mensuelle
          </div>
        </div>

        {/* Actifs Totaux */}
        <div className="kpi-card warning">
          <div className="kpi-header">
            <span className="kpi-icon">🏦</span>
            <span className="kpi-label">Actifs Totaux</span>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value">{dashboardData?.quickStats?.totalAssets}</span>
          </div>
          <div className="kpi-description">
            Nombre d'actifs
          </div>
        </div>

        {/* Stratégies */}
        <div className="kpi-card success">
          <div className="kpi-header">
            <span className="kpi-icon">🎯</span>
            <span className="kpi-label">Stratégies</span>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value">{dashboardData?.quickStats?.activeStrategies}</span>
          </div>
          <div className="kpi-description">
            Stratégies actives
          </div>
        </div>

        {/* Dernier rebalance */}
        <div className="kpi-card info">
          <div className="kpi-header">
            <span className="kpi-icon">⚖️</span>
            <span className="kpi-label">Rééquilibrage</span>
          </div>
          <div className="kpi-value-container">
            <span className="kpi-value" style={{fontSize: '16px'}}>{dashboardData?.quickStats?.lastRebalance}</span>
          </div>
          <div className="kpi-description">
            Dernier rééquilibrage
          </div>
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="dashboard-section">
        <h3 className="section-title">⚡ Actions Rapides</h3>
        <div className="action-cards">
          <button className="action-card" onClick={goToAnalytics}>
            <div className="action-icon">🧮</div>
            <div className="action-content">
              <h4>Analytics WOW V1</h4>
              <p>Analyses avancées avec KPIs, graphiques et backtesting</p>
            </div>
          </button>

          <button className="action-card" onClick={goToConfiguration}>
            <div className="action-icon">⚙️</div>
            <div className="action-content">
              <h4>Configuration</h4>
              <p>Paramétrer votre portefeuille et vos préférences</p>
            </div>
          </button>

          <button className="action-card" onClick={() => onNavigate('get-full-access')}>
            <div className="action-icon">🔓</div>
            <div className="action-content">
              <h4>Get Full Access</h4>
              <p>Débloquer toutes les fonctionnalités premium</p>
            </div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="dashboard-section">
        <h3 className="section-title">🔔 Notifications Récentes</h3>
        <div className="notifications-list">
          {dashboardData?.notifications?.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <div className="notification-icon">
                {notification.type === 'info' && 'ℹ️'}
                {notification.type === 'success' && '✅'}
                {notification.type === 'warning' && '⚠️'}
              </div>
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">Il y a {notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

