import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './PortfolioKPICards.css';

const PortfolioKPICards = ({ data, user }) => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // KPIs à afficher
  const kpiDefinitions = [
    {
      id: 'totalReturn',
      label: 'Total Return',
      icon: '📈',
      suffix: '%',
      description: 'Rendement total du portefeuille',
      color: 'success',
      format: (value) => value?.toFixed(2)
    },
    {
      id: 'volatility',
      label: 'Volatility',
      icon: '📊',
      suffix: '%',
      description: 'Mesure du risque/variabilité',
      color: 'warning',
      format: (value) => value?.toFixed(2)
    },
    {
      id: 'sharpeRatio',
      label: 'Sharpe Ratio',
      icon: '⚖️',
      suffix: '',
      description: 'Ratio rendement/risque ajusté',
      color: 'info',
      format: (value) => value?.toFixed(3)
    },
    {
      id: 'maxDrawdown',
      label: 'Max Drawdown',
      icon: '📉',
      suffix: '%',
      description: 'Perte maximale depuis un pic',
      color: 'danger',
      format: (value) => value?.toFixed(2)
    },
    {
      id: 'winRate',
      label: 'Win Rate',
      icon: '🎯',
      suffix: '%',
      description: 'Pourcentage de trades gagnants',
      color: 'success',
      format: (value) => value?.toFixed(1)
    },
    {
      id: 'beta',
      label: 'Beta',
      icon: '📐',
      suffix: '',
      description: 'Corrélation avec le marché',
      color: 'primary',
      format: (value) => value?.toFixed(3)
    }
  ];

  // Chargement des données KPI
  useEffect(() => {
    const loadKPIData = async () => {
      setLoading(true);
      try {
        let portfolioData = data;
        
        // Si pas de données passées en props, récupérer depuis Firebase ou utiliser les données de démo
        if (!portfolioData && user) {
          portfolioData = await firebaseService.getPortfolioData(user.uid);
        }
        
        // Utiliser les données de démo si aucune donnée n'est disponible
        if (!portfolioData) {
          portfolioData = firebaseService.getDemoData();
        }
        
        setKpiData(portfolioData);
        
        // Enregistrer l'activité
        if (user) {
          await firebaseService.logActivity(user.uid, 'Viewed KPI Cards');
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des KPIs:', error);
        // Utiliser les données de démo en cas d'erreur
        setKpiData(firebaseService.getDemoData());
      } finally {
        setLoading(false);
      }
    };

    loadKPIData();
  }, [data, user]);

  // Animation des particules (effet visuel)
  useEffect(() => {
    if (!animationEnabled) return;

    const createParticle = (container) => {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      
      container.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 5000);
    };

    const interval = setInterval(() => {
      const containers = document.querySelectorAll('.kpi-card');
      containers.forEach(container => {
        if (Math.random() < 0.3) { // 30% de chance de créer une particule
          createParticle(container);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [animationEnabled]);

  // Déterminer la couleur selon la valeur
  const getValueColor = (kpi, value) => {
    if (kpi.id === 'totalReturn' || kpi.id === 'winRate') {
      return value > 0 ? 'positive' : 'negative';
    }
    if (kpi.id === 'maxDrawdown') {
      return value < 0 ? 'negative' : 'positive';
    }
    if (kpi.id === 'sharpeRatio') {
      return value > 1 ? 'positive' : value > 0.5 ? 'neutral' : 'negative';
    }
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="kpi-cards-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des KPIs...</p>
      </div>
    );
  }

  return (
    <div className="kpi-cards-container">
      {/* Header */}
      <div className="kpi-cards-header">
        <h3>📊 Portfolio KPI Cards</h3>
        <p>6 métriques financières clés avec animations GPU</p>
        <div className="kpi-controls">
          <button 
            className={`animation-toggle ${animationEnabled ? 'active' : ''}`}
            onClick={() => setAnimationEnabled(!animationEnabled)}
            title="Activer/Désactiver les animations"
          >
            {animationEnabled ? '✨' : '⏸️'}
          </button>
        </div>
      </div>

      {/* Grid des KPI Cards */}
      <div className="kpi-cards-grid">
        {kpiDefinitions.map((kpi) => {
          const value = kpiData?.[kpi.id];
          const formattedValue = kpi.format(value);
          const valueColor = getValueColor(kpi, value);
          
          return (
            <div 
              key={kpi.id} 
              className={`kpi-card ${kpi.color} ${animationEnabled ? 'animated' : ''}`}
              title={kpi.description}
            >
              {/* Effet de brillance */}
              <div className="shine-effect"></div>
              
              {/* Contenu de la carte */}
              <div className="kpi-header">
                <span className="kpi-icon">{kpi.icon}</span>
                <span className="kpi-label">{kpi.label}</span>
              </div>
              
              <div className="kpi-value-container">
                <span className={`kpi-value ${valueColor}`}>
                  {formattedValue || '---'}
                  <span className="kpi-suffix">{kpi.suffix}</span>
                </span>
              </div>
              
              <div className="kpi-description">
                {kpi.description}
              </div>
              
              {/* Indicateur de tendance */}
              <div className="kpi-trend">
                {value > 0 && (kpi.id === 'totalReturn' || kpi.id === 'winRate') && (
                  <span className="trend-up">↗️</span>
                )}
                {value < 0 && kpi.id === 'maxDrawdown' && (
                  <span className="trend-down">↘️</span>
                )}
              </div>
              
              {/* Particules flottantes (ajoutées dynamiquement) */}
            </div>
          );
        })}
      </div>

      {/* Informations supplémentaires */}
      <div className="kpi-info">
        <div className="info-item">
          <span className="info-label">Dernière mise à jour:</span>
          <span className="info-value">
            {kpiData?.lastUpdated ? new Date(kpiData.lastUpdated).toLocaleString() : 'N/A'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Valeur du portefeuille:</span>
          <span className="info-value">
            {kpiData?.portfolioValue?.toLocaleString()}€
          </span>
        </div>
        <div className="info-item">
          <span className="info-label">Source:</span>
          <span className="info-value">WOW V1 MVP</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioKPICards;

