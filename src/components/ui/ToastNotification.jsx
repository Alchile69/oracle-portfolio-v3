import React, { useState, useEffect } from 'react';

/**
 * Composant Toast Notification amélioré
 * Affiche des notifications élégantes avec animations
 */
const ToastNotification = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 100);

    // Auto-fermeture
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-[#00ff88] bg-opacity-20',
          border: 'border-[#00ff88]',
          text: 'text-[#00ff88]',
          icon: '✅'
        };
      case 'error':
        return {
          bg: 'bg-[#ef4444] bg-opacity-20',
          border: 'border-[#ef4444]',
          text: 'text-[#ef4444]',
          icon: '❌'
        };
      case 'warning':
        return {
          bg: 'bg-[#f59e0b] bg-opacity-20',
          border: 'border-[#f59e0b]',
          text: 'text-[#f59e0b]',
          icon: '⚠️'
        };
      case 'info':
      default:
        return {
          bg: 'bg-[#4f46e5] bg-opacity-20',
          border: 'border-[#4f46e5]',
          text: 'text-[#4f46e5]',
          icon: 'ℹ️'
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
      default:
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
    }
  };

  const styles = getTypeStyles();

  if (!isVisible && !isLeaving) return null;

  return (
    <div
      className={`
        fixed z-50 ${getPositionStyles()}
        ${styles.bg} ${styles.border} ${styles.text}
        border rounded-lg p-4 shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isVisible && !isLeaving 
          ? 'opacity-100 transform translate-y-0 scale-100' 
          : 'opacity-0 transform translate-y-2 scale-95'
        }
        max-w-sm w-full sm:w-auto
      `}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg flex-shrink-0">{styles.icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className={`
            ${styles.text} hover:opacity-70 transition-opacity
            text-lg leading-none flex-shrink-0
          `}
        >
          ×
        </button>
      </div>

      {/* Barre de progression */}
      <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
        <div
          className={`h-1 rounded-full ${styles.border.replace('border-', 'bg-')} transition-all ease-linear`}
          style={{
            width: isLeaving ? '0%' : '100%',
            transition: `width ${duration}ms linear`
          }}
        />
      </div>
    </div>
  );
};

/**
 * Hook pour gérer les toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    // Auto-suppression
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration + 500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration)
  };
};

/**
 * Conteneur pour afficher tous les toasts
 */
export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 80}px)`,
            transition: 'transform 300ms ease-out'
          }}
          className="pointer-events-auto"
        >
          <ToastNotification
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;

