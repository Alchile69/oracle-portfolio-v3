import React, { useState, useEffect, useRef } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './AssetAllocationPieChart.css';

// Couleurs pour les segments (constante en dehors du composant)
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];
  
  const AssetAllocationPieChart = ({ data, user }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  const canvasRef = useRef(null);

  // Chargement des données
  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      try {
        let portfolioData = data;
        
        if (!portfolioData && user) {
          portfolioData = await firebaseService.getPortfolioData(user.uid);
        }
        
        if (!portfolioData) {
          portfolioData = firebaseService.getDemoData();
        }
        
        setChartData(portfolioData);
        
        if (user) {
          await firebaseService.logActivity(user.uid, 'Viewed Asset Allocation Chart');
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement du graphique:', error);
        setChartData(firebaseService.getDemoData());
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [data, user]);

  // Dessiner le graphique en secteurs
  useEffect(() => {
    if (!chartData?.assets || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculer les angles
    let currentAngle = -Math.PI / 2; // Commencer en haut
    const total = chartData.assets.reduce((sum, asset) => sum + asset.allocation, 0);

    chartData.assets.forEach((asset, index) => {
      const sliceAngle = (asset.allocation / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      // Dessiner le segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      
      // Appliquer la couleur
      ctx.fillStyle = selectedSegment === index ? lightenColor(color, 20) : color;
      ctx.fill();
      
      // Bordure
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Étiquette
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${asset.allocation}%`, labelX, labelY);
      
      currentAngle += sliceAngle;
    });

    // Cercle central pour l'effet donut
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    
    // Texte central
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Portfolio', centerX, centerY - 10);
    ctx.font = '12px Arial';
    ctx.fillText(`${chartData.portfolioValue?.toLocaleString()}€`, centerX, centerY + 10);

  }, [chartData, selectedSegment]);

  // Fonction pour éclaircir une couleur
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF);
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  // Gestion du clic sur le canvas
  const handleCanvasClick = (event) => {
    if (!chartData?.assets) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Vérifier si le clic est dans le cercle
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    if (distance > radius || distance < radius * 0.4) {
      setSelectedSegment(null);
      return;
    }
    
    // Calculer l'angle du clic
    const angle = Math.atan2(y - centerY, x - centerX);
    const normalizedAngle = (angle + Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
    
    // Trouver le segment correspondant
    let currentAngle = 0;
    const total = chartData.assets.reduce((sum, asset) => sum + asset.allocation, 0);
    
    for (let i = 0; i < chartData.assets.length; i++) {
      const sliceAngle = (chartData.assets[i].allocation / total) * 2 * Math.PI;
      if (normalizedAngle >= currentAngle && normalizedAngle <= currentAngle + sliceAngle) {
        setSelectedSegment(selectedSegment === i ? null : i);
        break;
      }
      currentAngle += sliceAngle;
    }
  };

  if (loading) {
    return (
      <div className="pie-chart-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de l'allocation des actifs...</p>
      </div>
    );
  }

  return (
    <div className="pie-chart-container">
      {/* Header */}
      <div className="pie-chart-header">
        <h3>🥧 Asset Allocation Pie Chart</h3>
        <p>Répartition interactive des actifs avec tooltips détaillés</p>
        <div className="chart-controls">
          <button 
            className={`legend-toggle ${showLegend ? 'active' : ''}`}
            onClick={() => setShowLegend(!showLegend)}
            title="Afficher/Masquer la légende"
          >
            📋
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pie-chart-content">
        {/* Canvas du graphique */}
        <div className="chart-canvas-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onClick={handleCanvasClick}
            className="pie-chart-canvas"
          />
          
          {/* Tooltip pour le segment sélectionné */}
          {selectedSegment !== null && chartData?.assets[selectedSegment] && (
            <div className="chart-tooltip">
              <div className="tooltip-header">
                <span 
                  className="tooltip-color" 
                  style={{ backgroundColor: colors[selectedSegment % colors.length] }}
                ></span>
                <strong>{chartData.assets[selectedSegment].name}</strong>
              </div>
              <div className="tooltip-content">
                <div className="tooltip-row">
                  <span>Symbole:</span>
                  <span>{chartData.assets[selectedSegment].symbol}</span>
                </div>
                <div className="tooltip-row">
                  <span>Allocation:</span>
                  <span>{chartData.assets[selectedSegment].allocation}%</span>
                </div>
                <div className="tooltip-row">
                  <span>Valeur:</span>
                  <span>{chartData.assets[selectedSegment].value?.toLocaleString()}€</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Légende interactive */}
        {showLegend && (
          <div className="chart-legend">
            <h4>Légende Interactive</h4>
            <div className="legend-items">
              {chartData?.assets?.map((asset, index) => (
                <div 
                  key={asset.symbol}
                  className={`legend-item ${selectedSegment === index ? 'selected' : ''}`}
                  onClick={() => setSelectedSegment(selectedSegment === index ? null : index)}
                >
                  <span 
                    className="legend-color"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></span>
                  <div className="legend-content">
                    <div className="legend-name">{asset.symbol}</div>
                    <div className="legend-details">
                      {asset.allocation}% • {asset.value?.toLocaleString()}€
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Nombre d'actifs:</span>
          <span className="stat-value">{chartData?.assets?.length || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Valeur totale:</span>
          <span className="stat-value">{chartData?.portfolioValue?.toLocaleString()}€</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Diversification:</span>
          <span className="stat-value">
            {chartData?.assets?.length > 5 ? 'Élevée' : chartData?.assets?.length > 3 ? 'Modérée' : 'Faible'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationPieChart;

