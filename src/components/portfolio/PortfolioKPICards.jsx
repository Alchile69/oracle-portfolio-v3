import React, { useState, useEffect, useMemo } from 'react';
import * as TWEEN from '@tweenjs/tween.js';
import BacktestService from '../../services/backtestService';

const PortfolioKPICards = ({ portfolioData = {} }) => {
  const [animatedValues, setAnimatedValues] = useState({
    returns: 0,
    volatility: 0,
    sharpe: 0,
    drawdown: 0,
    winRate: 0,
    beta: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState('loading');
  const [realData, setRealData] = useState(null);

  // Données de test par défaut
  const defaultData = {
    returns: 12.5,
    volatility: 15.3,
    sharpe: 1.85,
    value: 10000,
    drawdown: -8.2,
    winRate: 67.5,
    beta: 0.85
  };

  // Récupération des données réelles du backend
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Récupération des données backend...');
        const metrics = await BacktestService.getPortfolioMetrics();
        console.log('📊 Données reçues:', metrics);
        
        // Utiliser les données du backend si disponibles
        if (metrics && metrics.source !== 'fallback_frontend') {
          setDataSource(metrics.source || 'backend');
          setRealData({
            returns: metrics.returns || defaultData.returns,
            volatility: metrics.volatility || defaultData.volatility,
            sharpe: metrics.sharpe || defaultData.sharpe,
            drawdown: metrics.drawdown || defaultData.drawdown,
            winRate: metrics.winRate || defaultData.winRate,
            beta: metrics.beta || defaultData.beta
          });
          console.log('✅ Données réelles chargées');
        } else {
          setDataSource('fallback');
          setRealData(defaultData);
          console.log('⚠️ Utilisation des données de fallback');
        }
      } catch (error) {
        console.error('❌ Erreur récupération données backend:', error);
        setDataSource('error');
        setRealData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  // Données finales à utiliser - optimisées avec useMemo
  const data = useMemo(() => {
    return realData ? { ...realData, ...portfolioData } : { ...defaultData, ...portfolioData };
  }, [realData, portfolioData]);

  // Calculs optimisés des couleurs pour les KPI Cards
  const kpiColors = useMemo(() => ({
    returns: data.returns >= 0 ? '#22c55e' : '#ef4444',
    volatility: data.volatility < 20 ? '#22c55e' : data.volatility < 30 ? '#f59e0b' : '#ef4444',
    sharpe: data.sharpe > 1 ? '#22c55e' : data.sharpe > 0.5 ? '#f59e0b' : '#ef4444',
    drawdown: '#ef4444',
    winRate: data.winRate >= 60 ? '#22c55e' : data.winRate >= 50 ? '#f59e0b' : '#ef4444',
    beta: data.beta < 1 ? '#22c55e' : data.beta < 1.2 ? '#f59e0b' : '#ef4444'
  }), [data]);

  // Animation des nombres après chargement des données
  useEffect(() => {
    // Ne pas animer si les données ne sont pas encore chargées
    if (isLoading || !realData) return;

    console.log('🎬 Démarrage des animations avec les données:', data);

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
  }, [isLoading, realData, data.returns, data.volatility, data.sharpe, data.drawdown, data.winRate, data.beta]);

  const KPICard = ({ title, value, unit, icon, color, tooltip }) => {
    return (
      <div 
        className="portfolio-kpi-card tooltip"
        data-tooltip={tooltip}
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '24px',
          height: '100%',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
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
        
        <div className="value" style={{ 
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ 
          color: '#fff', 
          fontWeight: 'bold',
          fontSize: '24px',
          margin: 0
        }}>
          📊 Portfolio Performance KPIs
        </h2>
        <div style={{ 
          fontSize: '12px', 
          color: dataSource === 'yahoo_finance' ? '#22c55e' : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: dataSource === 'yahoo_finance' ? '#22c55e' : '#94a3b8' 
          }}></div>
          {isLoading ? 'Chargement...' : 
           dataSource === 'yahoo_finance' ? 'Données réelles (Yahoo Finance)' :
           dataSource === 'fallback' ? 'Données de test' :
           dataSource === 'error' ? 'Erreur - Données de test' :
           'Données de test'}
        </div>
      </div>
      
      {/* Grille 3x2 comme dans la capture d'écran */}
      <div className="portfolio-kpi-grid" style={{ 
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
          color={kpiColors.returns}
          tooltip="Rendement total depuis le début de la période d'investissement"
        />
        <KPICard
          title="Volatility"
          value={animatedValues.volatility}
          unit="%"
          icon={<ShowChartIcon />}
          color={kpiColors.volatility}
          tooltip="Écart-type annualisé des rendements - mesure du risque"
        />
        <KPICard
          title="Sharpe Ratio"
          value={animatedValues.sharpe}
          unit=""
          icon={<ShowChartIcon />}
          color={kpiColors.sharpe}
          tooltip="Rendement ajusté au risque - plus élevé = meilleur"
        />
        
        {/* Deuxième ligne */}
        <KPICard
          title="Max Drawdown"
          value={animatedValues.drawdown}
          unit="%"
          icon={<TrendingDownIcon />}
          color={kpiColors.drawdown}
          tooltip="Perte maximale depuis un pic - mesure du risque de baisse"
        />
        <KPICard
          title="Win Rate"
          value={animatedValues.winRate}
          unit="%"
          icon={animatedValues.winRate >= 50 ? <TrendingUpIcon /> : <TrendingDownIcon />}
          color={kpiColors.winRate}
          tooltip="Pourcentage de trades gagnants sur la période"
        />
        <KPICard
          title="Beta"
          value={animatedValues.beta}
          unit=""
          icon={<ShowChartIcon />}
          color={kpiColors.beta}
          tooltip="Corrélation avec le marché - 1 = même volatilité que le marché"
        />
      </div>
    </div>
  );
};

export default PortfolioKPICards;

