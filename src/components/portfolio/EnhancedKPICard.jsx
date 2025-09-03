import React, { useState, useEffect, useRef } from 'react';
import * as TWEEN from '@tweenjs/tween.js';
import './EnhancedKPICard.css';

const EnhancedKPICard = ({ 
  title, 
  value, 
  unit = '', 
  icon, 
  color = '#4f46e5',
  trend = null,
  tooltip = null,
  isLoading = false,
  animationDelay = 0
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const previousValue = useRef(value);

  // Animation d'entrée avec Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
            animateValue();
          }, animationDelay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [animationDelay]);

  // Animation de la valeur
  const animateValue = () => {
    const startValue = previousValue.current || 0;
    const endValue = value || 0;
    
    const tween = new TWEEN.Tween({ value: startValue })
      .to({ value: endValue }, 1200)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate((obj) => {
        setAnimatedValue(obj.value);
      })
      .start();

    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
    };
    animate();

    previousValue.current = endValue;
  };

  // Re-animer quand la valeur change
  useEffect(() => {
    if (isVisible && value !== previousValue.current) {
      animateValue();
    }
  }, [value, isVisible]);

  // Déterminer la couleur basée sur la tendance
  const getColorFromTrend = () => {
    if (trend === 'up') return '#00ff88';
    if (trend === 'down') return '#ef4444';
    return color;
  };

  const cardColor = getColorFromTrend();

  // Formatage de la valeur
  const formatValue = (val) => {
    if (isLoading) return '---';
    if (Math.abs(val) >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toFixed(2);
  };

  return (
    <div 
      ref={cardRef}
      className={`enhanced-kpi-card ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--card-color': cardColor,
        '--card-color-rgb': cardColor === '#00ff88' ? '0, 255, 136' : 
                           cardColor === '#ef4444' ? '239, 68, 68' : '79, 70, 229'
      }}
    >
      {/* Effet de brillance animé */}
      <div className="card-shine" />
      
      {/* Particules flottantes */}
      <div className="card-particles">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="card-content">
        {/* Header avec icône */}
        <div className="card-header">
          <div className="card-icon">
            {isLoading ? (
              <div className="loading-icon">
                <div className="spinner" />
              </div>
            ) : (
              icon
            )}
          </div>
          <h3 className="card-title">{title}</h3>
        </div>

        {/* Valeur principale */}
        <div className="card-value-container">
          <div className="card-value">
            {isLoading ? (
              <div className="loading-skeleton" />
            ) : (
              <>
                <span className="value-number">
                  {formatValue(animatedValue)}
                </span>
                {unit && <span className="value-unit">{unit}</span>}
              </>
            )}
          </div>
          
          {/* Indicateur de tendance */}
          {trend && !isLoading && (
            <div className={`trend-indicator trend-${trend}`}>
              <div className="trend-arrow">
                {trend === 'up' ? '↗' : '↘'}
              </div>
            </div>
          )}
        </div>

        {/* Tooltip/Description */}
        {tooltip && (
          <div className="card-tooltip">
            {tooltip}
          </div>
        )}

        {/* Barre de progression animée */}
        <div className="card-progress">
          <div 
            className="progress-bar"
            style={{
              width: isVisible ? '100%' : '0%',
              transitionDelay: `${animationDelay + 500}ms`
            }}
          />
        </div>
      </div>

      {/* Effet de pulsation pour les valeurs importantes */}
      {Math.abs(value) > 10 && trend === 'up' && (
        <div className="pulse-ring" />
      )}
    </div>
  );
};

export default EnhancedKPICard;

