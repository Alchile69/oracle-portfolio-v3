import React, { useState } from 'react';
import './GetFullAccess.css';

const GetFullAccess = ({ user, onNavigate }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [loading, setLoading] = useState(false);

  // Plans disponibles
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'mois',
      features: [
        'Dashboard complet',
        'Analytics de base',
        'Jusqu\'à 5 actifs',
        'Rapports mensuels',
        'Support email'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 79,
      period: 'mois',
      features: [
        'Toutes les fonctionnalités Basic',
        'Analytics avancées WOW V1',
        'Backtesting illimité',
        'Jusqu\'à 50 actifs',
        'Rapports en temps réel',
        'Support prioritaire',
        'API access'
      ],
      popular: true,
      badge: 'RECOMMANDÉ'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'mois',
      features: [
        'Toutes les fonctionnalités Pro',
        'Portefeuilles illimités',
        'Analytics personnalisées',
        'Intégrations avancées',
        'Support dédié 24/7',
        'Formation personnalisée',
        'SLA garanti'
      ],
      popular: false
    }
  ];

  // Fonctionnalités actuellement disponibles (version gratuite)
  const currentFeatures = [
    { name: 'Dashboard Oracle Portfolio V3', available: true },
    { name: 'KPI Cards (6 métriques)', available: true },
    { name: 'Asset Allocation Pie Chart', available: true },
    { name: 'Screening Table', available: true },
    { name: 'Country Heatmap', available: true },
    { name: 'Module Backtesting', available: false, premium: true },
    { name: 'Analytics avancées', available: false, premium: true },
    { name: 'Rapports personnalisés', available: false, premium: true },
    { name: 'API Access', available: false, premium: true },
    { name: 'Support prioritaire', available: false, premium: true }
  ];

  // Gestion de l'upgrade
  const handleUpgrade = async (planId) => {
    setLoading(true);
    try {
      // Simulation du processus d'upgrade
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log(`Upgrade vers le plan ${planId} pour l'utilisateur ${user?.uid}`);
      
      // Ici on redirigerait vers le processus de paiement
      alert(`Redirection vers le paiement pour le plan ${plans.find(p => p.id === planId)?.name}`);
      
    } catch (error) {
      console.error('Erreur lors de l\'upgrade:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation vers Analytics pour voir les fonctionnalités
  const goToAnalytics = () => {
    onNavigate('analytics');
  };

  return (
    <div className="get-full-access-container">
      {/* Header */}
      <div className="access-header">
        <h1>🔓 Get Full Access</h1>
        <p>Débloquez tout le potentiel d'Oracle Portfolio V3 avec WOW V1</p>
        <div className="current-status">
          <span className="status-badge free">Version Gratuite</span>
          <span className="user-id">Utilisateur: {user?.uid ? user.uid.substring(0, 8) + '...' : 'Anonyme'}</span>
        </div>
      </div>

      {/* Fonctionnalités actuelles */}
      <div className="current-features-section">
        <h2>🎯 Fonctionnalités Actuelles</h2>
        <div className="features-grid">
          {currentFeatures.map((feature, index) => (
            <div key={index} className={`feature-item ${feature.available ? 'available' : 'locked'}`}>
              <div className="feature-icon">
                {feature.available ? '✅' : '🔒'}
              </div>
              <div className="feature-content">
                <span className="feature-name">{feature.name}</span>
                {feature.premium && (
                  <span className="premium-badge">PREMIUM</span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="features-actions">
          <button className="btn-secondary" onClick={goToAnalytics}>
            Voir les Fonctionnalités Disponibles
          </button>
        </div>
      </div>

      {/* Plans tarifaires */}
      <div className="pricing-section">
        <h2>💎 Plans Tarifaires</h2>
        <p>Choisissez le plan qui correspond à vos besoins</p>
        
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}>
              {plan.badge && (
                <div className="plan-badge">{plan.badge}</div>
              )}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}€</span>
                  <span className="period">/{plan.period}</span>
                </div>
              </div>

              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="plan-feature">
                    <span className="feature-check">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`plan-button ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {selectedPlan === plan.id ? 'Sélectionné' : 'Sélectionner'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action d'upgrade */}
      <div className="upgrade-section">
        <div className="upgrade-summary">
          <h3>Plan Sélectionné: {plans.find(p => p.id === selectedPlan)?.name}</h3>
          <div className="upgrade-price">
            <span className="price">{plans.find(p => p.id === selectedPlan)?.price}€</span>
            <span className="period">/mois</span>
          </div>
        </div>

        <button 
          className={`upgrade-button ${loading ? 'loading' : ''}`}
          onClick={() => handleUpgrade(selectedPlan)}
          disabled={loading}
        >
          {loading ? 'Traitement...' : `Upgrader vers ${plans.find(p => p.id === selectedPlan)?.name}`}
        </button>

        <div className="upgrade-benefits">
          <h4>🚀 Avantages de l'upgrade:</h4>
          <ul>
            <li>Accès immédiat à toutes les fonctionnalités premium</li>
            <li>Module Backtesting complet avec données historiques</li>
            <li>Analytics avancées et rapports personnalisés</li>
            <li>Support prioritaire et mises à jour exclusives</li>
            <li>Garantie satisfait ou remboursé 30 jours</li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h3>❓ Questions Fréquentes</h3>
        <div className="faq-items">
          <div className="faq-item">
            <h4>Puis-je changer de plan à tout moment ?</h4>
            <p>Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.</p>
          </div>
          <div className="faq-item">
            <h4>Y a-t-il une période d'essai gratuite ?</h4>
            <p>Tous les plans premium incluent une garantie satisfait ou remboursé de 30 jours.</p>
          </div>
          <div className="faq-item">
            <h4>Mes données sont-elles sécurisées ?</h4>
            <p>Absolument. Nous utilisons un chiffrement de niveau bancaire et respectons les normes RGPD.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetFullAccess;

