import React, { useState, useEffect, createContext, useContext } from 'react';
import './EnhancedToast.css';

// Context pour les toasts
const ToastContext = createContext();

/**
 * Hook pour utiliser les toasts
 */
export const useEnhancedToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useEnhancedToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Composant Toast individuel avec animations modernes
 */
const EnhancedToast = ({ 
  id,
  message, 
  type = 'info', 
  duration = 4000, 
  onRemove,
  action = null
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animation d'entrée
    const enterTimer = setTimeout(() => setIsVisible(true), 50);

    // Barre de progression
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    // Auto-fermeture
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
      clearInterval(progressInterval);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: '🎉',
          gradient: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
          shadowColor: 'rgba(0, 255, 136, 0.3)',
          progressColor: '#00ff88'
        };
      case 'error':
        return {
          icon: '🚨',
          gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          shadowColor: 'rgba(239, 68, 68, 0.3)',
          progressColor: '#ef4444'
        };
      case 'warning':
        return {
          icon: '⚡',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          shadowColor: 'rgba(245, 158, 11, 0.3)',
          progressColor: '#f59e0b'
        };
      case 'info':
      default:
        return {
          icon: '💡',
          gradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
          shadowColor: 'rgba(79, 70, 229, 0.3)',
          progressColor: '#4f46e5'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div 
      className={`enhanced-toast ${isVisible ? 'visible' : ''} ${isLeaving ? 'leaving' : ''}`}
      style={{
        '--shadow-color': config.shadowColor,
        '--progress-color': config.progressColor
      }}
    >
      <div className="toast-content">
        <div className="toast-icon-container">
          <div 
            className="toast-icon"
            style={{ background: config.gradient }}
          >
            {config.icon}
          </div>
        </div>
        
        <div className="toast-message">
          {message}
        </div>
        
        {action && (
          <div className="toast-action">
            {action}
          </div>
        )}
        
        <button 
          className="toast-close"
          onClick={handleClose}
          aria-label="Fermer la notification"
        >
          ✕
        </button>
      </div>
      
      <div 
        className="toast-progress"
        style={{ 
          width: `${progress}%`,
          backgroundColor: config.progressColor
        }}
      />
    </div>
  );
};

/**
 * Conteneur des toasts
 */
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <EnhancedToast
          key={toast.id}
          {...toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

/**
 * Provider pour les toasts
 */
export const EnhancedToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 4000,
      action: options.action || null
    };

    setToasts(prev => [...prev, toast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Méthodes de convenance
  const success = (message, options) => addToast(message, 'success', options);
  const error = (message, options) => addToast(message, 'error', options);
  const warning = (message, options) => addToast(message, 'warning', options);
  const info = (message, options) => addToast(message, 'info', options);

  const contextValue = {
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export default EnhancedToast;

