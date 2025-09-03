import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './CountryHeatmap.css';

const CountryHeatmap = ({ data, user }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [viewMode, setViewMode] = useState('allocation'); // 'allocation' ou 'value'

  // Données des pays avec coordonnées pour la visualisation
  const countryPositions = {
    'USA': { x: 20, y: 35, width: 25, height: 15 },
    'Canada': { x: 15, y: 25, width: 20, height: 8 },
    'UK': { x: 48, y: 28, width: 4, height: 6 },
    'Germany': { x: 52, y: 32, width: 5, height: 6 },
    'France': { x: 50, y: 35, width: 4, height: 6 },
    'Japan': { x: 85, y: 40, width: 8, height: 6 },
    'China': { x: 75, y: 38, width: 12, height: 10 },
    'Australia': { x: 82, y: 70, width: 10, height: 8 },
    'Brazil': { x: 30, y: 65, width: 8, height: 12 },
    'India': { x: 70, y: 45, width: 8, height: 8 },
    'Europe': { x: 50, y: 35, width: 15, height: 12 },
    'Asia': { x: 75, y: 42, width: 20, height: 15 }
  };

  // Chargement des données
  useEffect(() => {
    const loadHeatmapData = async () => {
      setLoading(true);
      try {
        let portfolioData = data;
        
        if (!portfolioData && user) {
          portfolioData = await firebaseService.getPortfolioData(user.uid);
        }
        
        if (!portfolioData) {
          portfolioData = firebaseService.getDemoData();
        }
        
        // Utiliser les données de pays ou créer des données simulées
        let countryData = portfolioData.countries || [
          { country: 'USA', allocation: 65, value: 81250 },
          { country: 'Europe', allocation: 20, value: 25000 },
          { country: 'Asia', allocation: 10, value: 12500 },
          { country: 'Canada', allocation: 3, value: 3750 },
          { country: 'Australia', allocation: 2, value: 2500 }
        ];
        
        // Enrichir avec des données supplémentaires
        countryData = countryData.map(country => ({
          ...country,
          companies: getCompaniesForCountry(country.country),
          risk: calculateRiskLevel(country.allocation),
          growth: (Math.random() - 0.3) * 20 // Simulation de croissance
        }));
        
        setHeatmapData(countryData);
        
        if (user) {
          await firebaseService.logActivity(user.uid, 'Viewed Country Heatmap');
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement de la heatmap:', error);
        setHeatmapData([]);
      } finally {
        setLoading(false);
      }
    };

    loadHeatmapData();
  }, [data, user]);

  // Fonction pour obtenir les entreprises d'un pays (simulation)
  const getCompaniesForCountry = (country) => {
    const companies = {
      'USA': ['Apple', 'Microsoft', 'Google', 'Tesla', 'Amazon'],
      'Europe': ['ASML', 'SAP', 'Nestlé', 'LVMH'],
      'Asia': ['TSMC', 'Samsung', 'Alibaba', 'Tencent'],
      'Canada': ['Shopify', 'Royal Bank of Canada'],
      'Australia': ['BHP', 'Commonwealth Bank']
    };
    return companies[country] || [];
  };

  // Calcul du niveau de risque
  const calculateRiskLevel = (allocation) => {
    if (allocation > 50) return 'high';
    if (allocation > 20) return 'medium';
    return 'low';
  };

  // Obtenir la couleur selon l'allocation
  const getCountryColor = (country) => {
    const maxAllocation = Math.max(...heatmapData.map(c => c.allocation));
    const intensity = country.allocation / maxAllocation;
    
    if (viewMode === 'allocation') {
      const red = Math.floor(255 * intensity);
      const green = Math.floor(255 * (1 - intensity * 0.7));
      const blue = Math.floor(255 * (1 - intensity));
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      // Mode valeur - utiliser une palette différente
      const blue = Math.floor(255 * intensity);
      const green = Math.floor(255 * (1 - intensity * 0.5));
      const red = Math.floor(255 * (1 - intensity));
      return `rgb(${red}, ${green}, ${blue})`;
    }
  };

  // Gestion du clic sur un pays
  const handleCountryClick = (country) => {
    setSelectedCountry(selectedCountry?.country === country.country ? null : country);
  };

  if (loading) {
    return (
      <div className="heatmap-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de la répartition géographique...</p>
      </div>
    );
  }

  return (
    <div className="country-heatmap-container">
      {/* Header */}
      <div className="heatmap-header">
        <h3>🌍 Country Heatmap</h3>
        <p>Visualisation géographique interactive avec zoom et tooltips détaillés</p>
        
        {/* Contrôles */}
        <div className="heatmap-controls">
          <div className="view-mode-toggle">
            <button
              className={viewMode === 'allocation' ? 'active' : ''}
              onClick={() => setViewMode('allocation')}
            >
              📊 Allocation
            </button>
            <button
              className={viewMode === 'value' ? 'active' : ''}
              onClick={() => setViewMode('value')}
            >
              💰 Valeur
            </button>
          </div>
        </div>
      </div>

      {/* Carte mondiale stylisée */}
      <div className="world-map-container">
        <svg className="world-map" viewBox="0 0 100 80">
          {/* Fond de la carte */}
          <rect width="100" height="80" fill="#1a1a2e" />
          
          {/* Pays avec données */}
          {heatmapData.map((country) => {
            const position = countryPositions[country.country];
            if (!position) return null;
            
            return (
              <g key={country.country}>
                {/* Rectangle représentant le pays */}
                <rect
                  x={position.x}
                  y={position.y}
                  width={position.width}
                  height={position.height}
                  fill={getCountryColor(country)}
                  stroke="#ffffff"
                  strokeWidth="0.2"
                  className={`country-rect ${selectedCountry?.country === country.country ? 'selected' : ''}`}
                  onClick={() => handleCountryClick(country)}
                  style={{ cursor: 'pointer' }}
                />
                
                {/* Label du pays */}
                <text
                  x={position.x + position.width / 2}
                  y={position.y + position.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize="2"
                  fontWeight="bold"
                  className="country-label"
                >
                  {country.country}
                </text>
                
                {/* Pourcentage */}
                <text
                  x={position.x + position.width / 2}
                  y={position.y + position.height / 2 + 2.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize="1.5"
                  className="country-percentage"
                >
                  {country.allocation}%
                </text>
              </g>
            );
          })}
          
          {/* Légende */}
          <g className="legend">
            <text x="2" y="75" fill="#ffffff" fontSize="2" fontWeight="bold">
              Intensité {viewMode === 'allocation' ? 'Allocation' : 'Valeur'}
            </text>
            <rect x="2" y="76" width="20" height="2" fill="url(#gradient)" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4ECDC4" />
                <stop offset="50%" stopColor="#FFE66D" />
                <stop offset="100%" stopColor="#FF6B6B" />
              </linearGradient>
            </defs>
            <text x="2" y="79.5" fill="#ffffff" fontSize="1.5">Faible</text>
            <text x="18" y="79.5" fill="#ffffff" fontSize="1.5">Élevée</text>
          </g>
        </svg>
      </div>

      {/* Détails du pays sélectionné */}
      {selectedCountry && (
        <div className="country-details">
          <div className="details-header">
            <h4>🏴 {selectedCountry.country}</h4>
            <button 
              className="close-details"
              onClick={() => setSelectedCountry(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="details-content">
            <div className="detail-row">
              <span className="detail-label">Allocation:</span>
              <span className="detail-value">{selectedCountry.allocation}%</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Valeur:</span>
              <span className="detail-value">{selectedCountry.value?.toLocaleString()}€</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Niveau de risque:</span>
              <span className={`detail-value risk-${selectedCountry.risk}`}>
                {selectedCountry.risk === 'high' ? 'Élevé' : 
                 selectedCountry.risk === 'medium' ? 'Modéré' : 'Faible'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Croissance:</span>
              <span className={`detail-value ${selectedCountry.growth >= 0 ? 'positive' : 'negative'}`}>
                {selectedCountry.growth >= 0 ? '+' : ''}{selectedCountry.growth?.toFixed(1)}%
              </span>
            </div>
            
            {selectedCountry.companies && selectedCountry.companies.length > 0 && (
              <div className="companies-section">
                <span className="detail-label">Principales entreprises:</span>
                <div className="companies-list">
                  {selectedCountry.companies.map((company, index) => (
                    <span key={index} className="company-tag">{company}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Liste des pays */}
      <div className="countries-list">
        <h4>📋 Répartition par Pays</h4>
        <div className="countries-grid">
          {heatmapData
            .sort((a, b) => b.allocation - a.allocation)
            .map((country, index) => (
              <div 
                key={country.country}
                className={`country-item ${selectedCountry?.country === country.country ? 'selected' : ''}`}
                onClick={() => handleCountryClick(country)}
              >
                <div className="country-rank">#{index + 1}</div>
                <div className="country-info">
                  <div className="country-name">{country.country}</div>
                  <div className="country-stats">
                    <span className="allocation">{country.allocation}%</span>
                    <span className="value">{country.value?.toLocaleString()}€</span>
                  </div>
                </div>
                <div 
                  className="country-color-indicator"
                  style={{ backgroundColor: getCountryColor(country) }}
                ></div>
              </div>
            ))}
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="heatmap-stats">
        <div className="stat-item">
          <span className="stat-label">Pays représentés:</span>
          <span className="stat-value">{heatmapData.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Concentration max:</span>
          <span className="stat-value">
            {Math.max(...heatmapData.map(c => c.allocation))}% ({heatmapData.find(c => c.allocation === Math.max(...heatmapData.map(c => c.allocation)))?.country})
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Diversification:</span>
          <span className="stat-value">
            {heatmapData.length > 4 ? 'Élevée' : heatmapData.length > 2 ? 'Modérée' : 'Faible'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountryHeatmap;

