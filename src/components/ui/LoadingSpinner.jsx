import React from 'react';

/**
 * Composant Loading Spinner élégant
 * Différents styles et tailles disponibles
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  type = 'spin',
  text = null,
  overlay = false 
}) => {
  
  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'w-3 h-3';
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary': return 'text-[#4f46e5]';
      case 'success': return 'text-[#00ff88]';
      case 'warning': return 'text-[#f59e0b]';
      case 'error': return 'text-[#ef4444]';
      case 'white': return 'text-white';
      case 'gray': return 'text-gray-400';
      default: return 'text-[#4f46e5]';
    }
  };

  const getSpinnerElement = () => {
    const sizeClasses = getSizeClasses();
    const colorClasses = getColorClasses();

    switch (type) {
      case 'spin':
        return (
          <div className={`${sizeClasses} ${colorClasses} animate-spin`}>
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClasses} ${colorClasses} animate-pulse`}>
            <div className="w-full h-full bg-current rounded-full opacity-75" />
          </div>
        );

      case 'bounce':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${getSizeClasses().replace('w-6 h-6', 'w-2 h-2')} ${colorClasses} bg-current rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 ${colorClasses} bg-current rounded-full animate-pulse`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 ${colorClasses} bg-current rounded-sm animate-pulse`}
                style={{ 
                  height: `${12 + (i % 2) * 8}px`,
                  animationDelay: `${i * 0.1}s` 
                }}
              />
            ))}
          </div>
        );

      default:
        return (
          <div className={`${sizeClasses} ${colorClasses} animate-spin`}>
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        );
    }
  };

  const spinner = (
    <div className="flex flex-col items-center space-y-2">
      {getSpinnerElement()}
      {text && (
        <p className={`text-sm ${getColorClasses()} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

/**
 * Composant Loading Button
 * Bouton avec spinner intégré
 */
export const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false,
  onClick,
  className = '',
  spinnerSize = 'sm',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative flex items-center justify-center space-x-2
        transition-all duration-200
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size={spinnerSize} 
          color="white" 
          type="spin"
        />
      )}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
    </button>
  );
};

/**
 * Composant Loading Card
 * Skeleton loader pour les cartes
 */
export const LoadingCard = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-700 rounded-lg p-6 space-y-4">
        <div className="h-4 bg-gray-600 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-600 rounded" />
          <div className="h-3 bg-gray-600 rounded w-5/6" />
        </div>
        <div className="h-8 bg-gray-600 rounded w-1/2" />
      </div>
    </div>
  );
};

/**
 * Composant Loading Chart
 * Skeleton pour les graphiques
 */
export const LoadingChart = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-700 rounded-lg p-6">
        <div className="h-4 bg-gray-600 rounded w-1/3 mb-4" />
        <div className="flex items-end space-x-2 h-32">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-600 rounded-t"
              style={{ 
                height: `${Math.random() * 80 + 20}%`,
                width: '12%'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

