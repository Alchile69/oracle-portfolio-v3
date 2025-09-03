import React, { useState, useEffect } from 'react';
import './PageTransition.css';

const PageTransition = ({ children, currentView, isLoading = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [previousView, setPreviousView] = useState(currentView);

  useEffect(() => {
    if (currentView !== previousView) {
      // Fade out
      setIsVisible(false);
      
      setTimeout(() => {
        setPreviousView(currentView);
        // Fade in
        setIsVisible(true);
      }, 300);
    } else {
      setIsVisible(true);
    }
  }, [currentView, previousView]);

  return (
    <div className="page-transition-container">
      {/* Loading overlay */}
      {isLoading && (
        <div className="page-loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner-large">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Chargement...</p>
          </div>
        </div>
      )}
      
      {/* Page content with transition */}
      <div 
        className={`page-content ${isVisible ? 'visible' : 'hidden'}`}
        data-view={currentView}
      >
        {children}
      </div>
      
      {/* Decorative elements */}
      <div className="page-decoration">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>
    </div>
  );
};

export default PageTransition;

