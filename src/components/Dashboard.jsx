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
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Vue d'ensemble de votre portefeuille</p>
      </div>

      {/* Section: Valeur du Portefeuille */}
      <section className="dashboard-section">
        <h2 className="section-title">Valeur du Portefeuille</h2>
        <div className="metric-card-large">
          <div className="metric-main">
            <div className="metric-value-large">
              {dashboardData?.portfolioValue?.toLocaleString()}€
            </div>
            <div className="metric-change positive">
              <span className="change-indicator">↑</span>
              <span className="change-value">+{dashboardData?.dailyChange}%</span>
              <span className="change-period">aujourd'hui</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Performance */}
      <section className="dashboard-section">
        <h2 className="section-title">Performance</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h3 className="metric-label">Performance Hebdomadaire</h3>
            <div className="metric-value">
              +{dashboardData?.weeklyChange}%
            </div>
          </div>

          <div className="metric-card">
            <h3 className="metric-label">Performance Mensuelle</h3>
            <div className="metric-value">
              +{dashboardData?.monthlyChange}%
            </div>
          </div>

          <div className="metric-card">
            <h3 className="metric-label">Actifs Totaux</h3>
            <div className="metric-value">
              {dashboardData?.quickStats?.totalAssets}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Actions Rapides */}
      <section className="dashboard-section">
        <h2 className="section-title">Actions Rapides</h2>
        <div className="action-cards">
          <button className="action-card" onClick={goToAnalytics}>
            <div className="action-content">
              <h3 className="action-title">Analytics WOW V1</h3>
              <p className="action-description">Analyses avancées avec KPIs, graphiques et backtesting</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button className="action-card" onClick={goToConfiguration}>
            <div className="action-content">
              <h3 className="action-title">Configuration</h3>
              <p className="action-description">Paramétrer votre portefeuille et vos préférences</p>
            </div>
            <div className="action-arrow">→</div>
          </button>

          <button className="action-card" onClick={() => onNavigate('get-full-access')}>
            <div className="action-content">
              <h3 className="action-title">Get Full Access</h3>
              <p className="action-description">Débloquer toutes les fonctionnalités premium</p>
            </div>
            <div className="action-arrow">→</div>
          </button>
        </div>
      </section>

      {/* Section: Activité Récente */}
      <section className="dashboard-section">
        <h2 className="section-title">Activité Récente</h2>
        <div className="activity-card">
          <div className="activity-list">
            {dashboardData?.notifications?.map((notification) => (
              <div key={notification.id} className="activity-item">
                <div className="activity-content">
                  <p className="activity-message">{notification.message}</p>
                  <span className="activity-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">Stratégies Actives</span>
              <span className="stat-value">{dashboardData?.quickStats?.activeStrategies}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Dernier Rééquilibrage</span>
              <span className="stat-value">{dashboardData?.quickStats?.lastRebalance}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

