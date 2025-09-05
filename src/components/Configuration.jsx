import React, { useState } from 'react';
import './Configuration.css';

const Configuration = ({ user, isAuthenticated }) => {
  const [config, setConfig] = useState({
    portfolio: {
      riskTolerance: 'moderate',
      rebalanceFrequency: 'quarterly',
      currency: 'EUR',
      notifications: true
    },
    display: {
      theme: 'dark',
      language: 'fr',
      chartType: 'line',
      showAnimations: true
    },
    trading: {
      transactionFees: 0.1,
      slippage: 0.05,
      dividendReinvestment: true,
      autoRebalance: false
    }
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sauvegarde de la configuration
  const saveConfiguration = async () => {
    setSaving(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici on sauvegarderait dans Firebase
      console.log('Configuration sauvegardée:', config);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  // Mise à jour d'un paramètre
  const updateConfig = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // Reset aux valeurs par défaut
  const resetToDefaults = () => {
    setConfig({
      portfolio: {
        riskTolerance: 'moderate',
        rebalanceFrequency: 'quarterly',
        currency: 'EUR',
        notifications: true
      },
      display: {
        theme: 'dark',
        language: 'fr',
        chartType: 'line',
        showAnimations: true
      },
      trading: {
        transactionFees: 0.1,
        slippage: 0.05,
        dividendReinvestment: true,
        autoRebalance: false
      }
    });
  };

  return (
    <div className="configuration-container">
      {/* Header */}
      <div className="configuration-header">
        <h1>⚙️ Configuration Oracle Portfolio V3</h1>
        <p>Personnalisez votre expérience et vos paramètres de trading</p>
      </div>

      {/* Sections de configuration */}
      <div className="config-sections">
        
        {/* Configuration Portfolio */}
        <div className="config-section">
          <h2>📊 Configuration Portfolio</h2>
          
          <div className="config-group">
            <label>Tolérance au Risque</label>
            <select 
              value={config.portfolio.riskTolerance}
              onChange={(e) => updateConfig('portfolio', 'riskTolerance', e.target.value)}
            >
              <option value="conservative">Conservateur</option>
              <option value="moderate">Modéré</option>
              <option value="aggressive">Agressif</option>
            </select>
          </div>

          <div className="config-group">
            <label>Fréquence de Rééquilibrage</label>
            <select 
              value={config.portfolio.rebalanceFrequency}
              onChange={(e) => updateConfig('portfolio', 'rebalanceFrequency', e.target.value)}
            >
              <option value="monthly">Mensuel</option>
              <option value="quarterly">Trimestriel</option>
              <option value="yearly">Annuel</option>
            </select>
          </div>

          <div className="config-group">
            <label>Devise de Base</label>
            <select 
              value={config.portfolio.currency}
              onChange={(e) => updateConfig('portfolio', 'currency', e.target.value)}
            >
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar US (USD)</option>
              <option value="GBP">Livre Sterling (GBP)</option>
            </select>
          </div>

          <div className="config-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={config.portfolio.notifications}
                onChange={(e) => updateConfig('portfolio', 'notifications', e.target.checked)}
              />
              Notifications activées
            </label>
          </div>
        </div>

        {/* Configuration Affichage */}
        <div className="config-section">
          <h2>🎨 Configuration Affichage</h2>
          
          <div className="config-group">
            <label>Thème</label>
            <select 
              value={config.display.theme}
              onChange={(e) => updateConfig('display', 'theme', e.target.value)}
            >
              <option value="dark">Sombre</option>
              <option value="light">Clair</option>
              <option value="auto">Automatique</option>
            </select>
          </div>

          <div className="config-group">
            <label>Langue</label>
            <select 
              value={config.display.language}
              onChange={(e) => updateConfig('display', 'language', e.target.value)}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="config-group">
            <label>Type de Graphique par Défaut</label>
            <select 
              value={config.display.chartType}
              onChange={(e) => updateConfig('display', 'chartType', e.target.value)}
            >
              <option value="line">Ligne</option>
              <option value="candlestick">Chandelier</option>
              <option value="bar">Barres</option>
            </select>
          </div>

          <div className="config-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={config.display.showAnimations}
                onChange={(e) => updateConfig('display', 'showAnimations', e.target.checked)}
              />
              Animations activées
            </label>
          </div>
        </div>

        {/* Configuration Trading */}
        <div className="config-section">
          <h2>💹 Configuration Trading</h2>
          
          <div className="config-group">
            <label>Frais de Transaction (%)</label>
            <input 
              type="number"
              step="0.01"
              min="0"
              max="5"
              value={config.trading.transactionFees}
              onChange={(e) => updateConfig('trading', 'transactionFees', parseFloat(e.target.value))}
            />
          </div>

          <div className="config-group">
            <label>Slippage (%)</label>
            <input 
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={config.trading.slippage}
              onChange={(e) => updateConfig('trading', 'slippage', parseFloat(e.target.value))}
            />
          </div>

          <div className="config-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={config.trading.dividendReinvestment}
                onChange={(e) => updateConfig('trading', 'dividendReinvestment', e.target.checked)}
              />
              Réinvestissement des dividendes
            </label>
          </div>

          <div className="config-group">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={config.trading.autoRebalance}
                onChange={(e) => updateConfig('trading', 'autoRebalance', e.target.checked)}
              />
              Rééquilibrage automatique
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="config-actions">
        <button 
          className="btn-secondary"
          onClick={resetToDefaults}
        >
          Réinitialiser
        </button>
        
        <button 
          className={`btn-primary ${saving ? 'loading' : ''} ${saved ? 'saved' : ''}`}
          onClick={saveConfiguration}
          disabled={saving}
        >
          {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
        </button>
      </div>

      {/* Informations utilisateur */}
      <div className="config-info">
        <h3>Informations Utilisateur</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">ID Utilisateur:</span>
            <span className="info-value">{user?.uid || 'Anonyme'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Statut:</span>
            <span className="info-value">{isAuthenticated ? 'Connecté' : 'Déconnecté'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Version:</span>
            <span className="info-value">WOW V1 MVP</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;

