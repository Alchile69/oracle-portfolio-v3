import React, { useState, useEffect } from 'react';
import * as TWEEN from '@tweenjs/tween.js';

const PortfolioKPICards = ({ portfolioData = {} }) => {
  const [animatedValues, setAnimatedValues] = useState({
    returns: 0,
    volatility: 0,
    sharpe: 0,
    drawdown: 0,
    winRate: 0,
    beta: 0
  });

  // Données de test si pas de données
  const defaultData = {
    returns: 12.5,
    volatility: 15.3,
    sharpe: 1.85,
    value: 10000,
    drawdown: -8.2,
    winRate: 67.5,
    beta: 0.85
  };

  const data = { ...defaultData, ...portfolioData };

  // Animation des nombres au montage
  useEffect(() => {
    const animate = () => {
      TWEEN.update();
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);

    // Animer chaque valeur avec des délais échelonnés
    const tweenReturns = new TWEEN.Tween({ value: 0 })
      .to({ value: data.returns }, 1500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        setAnimatedValues(prev => ({ ...prev, returns: obj.value }));
      })
      .start();

    const tweenVolatility = new TWEEN.Tween({ value: 0 })
      .to({ value: data.volatility }, 1500)
      .delay(200)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        setAnimatedValues(prev => ({ ...prev, volatility: obj.value }));
      })
      .start();

    const tweenSharpe = new TWEEN.Tween({ value: 0 })
      .to({ value: data.sharpe }, 1500)
      .delay(400)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        setAnimatedValues(prev => ({ ...prev, sharpe: obj.value }));
      })
      .start();

    const tweenDrawdown = new TWEEN.Tween({ value: 0 })
      .to({ value: data.drawdown }, 1500)
      .delay(600)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        setAnimatedValues(prev => ({ ...prev, drawdown: obj.value }));
      })
      .start();

    const tweenWinRate = new TWEEN.Tween({ value: 0 })
      .to({ value: data.winRate }, 1500)
      .delay(800)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        setAnimatedValues(prev => ({ ...prev, winRate: obj.value }));
      })
      .start();

    const tweenBeta = new TWEEN.Tween({ value: 0 })
      .to({ value: data.beta }, 1500)
      .delay(1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate((obj) => {
        setAnimatedValues(prev => ({ ...prev, beta: obj.value }));
      })
      .start();

    return () => {
      cancelAnimationFrame(animationId);
      tweenReturns.stop();
      tweenVolatility.stop();
      tweenSharpe.stop();
      tweenDrawdown.stop();
      tweenWinRate.stop();
      tweenBeta.stop();
    };
  }, [data.returns, data.volatility, data.sharpe, data.drawdown, data.winRate, data.beta]);

  const KPICard = ({ title, value, unit, icon, positive, tooltip }) => {
    const isPositive = positive ?? value >= 0;
    const color = isPositive ? '#22c55e' : '#ef4444';
    
    return (
      <div 
        className="kpi-card"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '24px',
          height: '100%',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ 
            color: '#94a3b8', 
            fontSize: '14px', 
            fontWeight: '500',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </h3>
          <div style={{ color, fontSize: '24px' }}>
            {icon}
          </div>
        </div>
        
        <div style={{ 
          color: '#fff',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          <span style={{ color }}>
            {value >= 0 ? '+' : ''}{value.toFixed(2)}{unit}
          </span>
        </div>

        {tooltip && (
          <p style={{ 
            color: '#64748b', 
            fontSize: '12px',
            margin: 0,
            lineHeight: '1.4'
          }}>
            {tooltip}
          </p>
        )}
      </div>
    );
  };

  // Icônes SVG simples
  const TrendingUpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
    </svg>
  );

  const TrendingDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6h-6z"/>
    </svg>
  );

  const ShowChartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z"/>
    </svg>
  );

  return (
    <div style={{ width: '100%', marginBottom: '32px' }}>
      <h2 style={{ 
        color: '#fff', 
        marginBottom: '24px', 
        fontWeight: 'bold',
        fontSize: '24px'
      }}>
        📊 Portfolio Performance KPIs
      </h2>
      
      {/* Grille 3x2 comme dans la capture d'écran */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Première ligne */}
        <KPICard
          title="Total Return"
          value={animatedValues.returns}
          unit="%"
          icon={animatedValues.returns >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
          tooltip="Rendement total depuis le début"
        />
        
        <KPICard
          title="Volatility"
          value={animatedValues.volatility}
          unit="%"
          icon={<ShowChartIcon />}
          positive={animatedValues.volatility < 20}
          tooltip="Écart-type annualisé des rendements"
        />
        
        <KPICard
          title="Sharpe Ratio"
          value={animatedValues.sharpe}
          unit=""
          icon={<ShowChartIcon />}
          positive={animatedValues.sharpe > 1}
          tooltip="Rendement ajusté au risque"
        />

        {/* Deuxième ligne - Nouveaux KPIs */}
        <KPICard
          title="Max Drawdown"
          value={animatedValues.drawdown}
          unit="%"
          icon={<TrendingDownIcon />}
          positive={false}
          tooltip="Perte maximale depuis un pic"
        />
        
        <KPICard
          title="Win Rate"
          value={animatedValues.winRate}
          unit="%"
          icon={<TrendingUpIcon />}
          positive={true}
          tooltip="Pourcentage de trades gagnants"
        />
        
        <KPICard
          title="Beta"
          value={animatedValues.beta}
          unit=""
          icon={<ShowChartIcon />}
          positive={animatedValues.beta < 1}
          tooltip="Corrélation avec le marché"
        />
      </div>
    </div>
  );
};

export default PortfolioKPICards;

