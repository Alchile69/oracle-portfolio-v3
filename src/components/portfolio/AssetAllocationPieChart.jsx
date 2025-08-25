import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import * as TWEEN from '@tweenjs/tween.js';
import { FirebaseService } from '../../services/firebaseService';
import { useToast } from '../ui/ToastNotification';
import { LoadingButton } from '../ui/LoadingSpinner';
import { useDebouncedCallback } from '../../hooks/useDebounce';

// Enregistrement des composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const AssetAllocationPieChart = () => {
  // États principaux
  const [allocations, setAllocations] = useState({
    stocks: 60,
    bonds: 25,
    commodities: 10,
    cash: 5
  });

  // États UI améliorés
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour les animations
  const [animatedAllocations, setAnimatedAllocations] = useState(allocations);
  
  // Hooks
  const toast = useToast();
  const chartRef = useRef(null);

  // Configuration des couleurs et labels
  const assetConfig = {
    stocks: { 
      label: 'Actions', 
      color: '#00ff88', 
      hoverColor: '#00cc6a',
      icon: '📈'
    },
    bonds: { 
      label: 'Obligations', 
      color: '#4f46e5', 
      hoverColor: '#3730a3',
      icon: '🏛️'
    },
    commodities: { 
      label: 'Matières Premières', 
      color: '#f59e0b', 
      hoverColor: '#d97706',
      icon: '🥇'
    },
    cash: { 
      label: 'Liquidités', 
      color: '#6b7280', 
      hoverColor: '#4b5563',
      icon: '💰'
    }
  };

  // Animation des changements d'allocation
  useEffect(() => {
    const animate = () => {
      const tween = new TWEEN.Tween(animatedAllocations)
        .to(allocations, 800)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate((values) => {
          setAnimatedAllocations({ ...values });
        })
        .start();

      const animateLoop = () => {
        requestAnimationFrame(animateLoop);
        TWEEN.update();
      };
      animateLoop();
    };

    animate();
  }, [allocations]);

  // Configuration du graphique Chart.js
  const chartData = {
    labels: Object.keys(assetConfig).map(key => assetConfig[key].label),
    datasets: [
      {
        data: Object.values(animatedAllocations),
        backgroundColor: Object.keys(assetConfig).map(key => assetConfig[key].color),
        hoverBackgroundColor: Object.keys(assetConfig).map(key => assetConfig[key].hoverColor),
        borderWidth: 3,
        borderColor: '#1a1a2e',
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // On utilise notre propre légende
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#ffffff',
        bodyColor: '#cccccc',
        borderColor: '#00ff88',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutCubic'
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const assetKey = Object.keys(assetConfig)[index];
        handleAssetClick(assetKey);
      }
    }
  };

  // Gestion du clic sur un secteur
  const handleAssetClick = (assetKey) => {
    console.log(`🎯 Asset sélectionné: ${assetKey}`);
    // Animation de sélection
    const element = document.querySelector(`[data-asset="${assetKey}"]`);
    if (element) {
      element.style.transform = 'scale(1.05)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 200);
    }
  };

  // ===== FONCTIONS FIREBASE =====
  
  // Chargement initial des allocations depuis Firestore
  useEffect(() => {
    const loadAllocations = async () => {
      try {
        setIsLoading(true);
        
        // Test de connexion Firebase
        const connected = await FirebaseService.testConnection();
        setIsFirebaseConnected(connected);
        
        if (connected) {
          // Récupérer les allocations sauvegardées
          const savedData = await FirebaseService.getPortfolioAllocations();
          
          if (savedData && savedData.allocations) {
            console.log('📥 Allocations chargées depuis Firestore');
            setAllocations(savedData.allocations);
            
            // Conversion correcte du timestamp Firestore
            if (savedData.metadata?.lastUpdated) {
              const timestamp = savedData.metadata.lastUpdated;
              const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
              setLastSaved(date);
            }
          } else {
            console.log('📭 Aucune allocation sauvegardée, utilisation des valeurs par défaut');
          }
        } else {
          console.log('⚠️ Firebase non connecté, utilisation des valeurs par défaut');
        }
      } catch (error) {
        console.error('❌ Erreur chargement allocations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllocations();
  }, []);

  // Sauvegarde des allocations dans Firebase
  const savePortfolio = async () => {
    try {
      setIsSaving(true);
      
      const success = await FirebaseService.savePortfolioAllocations(allocations);
      
      if (success) {
        setLastSaved(new Date());
        
        // Toast de succès
        toast.success('Portfolio sauvegardé avec succès !', 2000);
        
        // Animation visuelle de confirmation - CORRIGÉE pour LoadingButton
        setTimeout(() => {
          const button = document.querySelector('[data-save-button="true"]');
          if (button) {
            // Animation plus visible avec LoadingButton
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 0 20px #00ff88';
            button.style.backgroundColor = '#00ff88';
            button.style.borderColor = '#00ff88';
            
            // Ajouter un effet de pulsation
            button.style.animation = 'pulse 0.6s ease-in-out';
            
            setTimeout(() => {
              button.style.transform = 'scale(1)';
              button.style.boxShadow = '';
              button.style.backgroundColor = '';
              button.style.borderColor = '';
              button.style.animation = '';
            }, 600);
          }
        }, 100); // Délai pour que le spinner disparaisse
        
        console.log('💾 Allocations sauvegardées avec succès');
      } else {
        toast.error('Échec de la sauvegarde du portfolio', 3000);
        console.error('❌ Échec de la sauvegarde');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', 3000);
      console.error('❌ Erreur sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Réinitialisation aux valeurs par défaut
  const resetToDefaults = async () => {
    try {
      const defaultAllocations = {
        stocks: 60,
        bonds: 25,
        commodities: 10,
        cash: 5
      };
      
      setAllocations(defaultAllocations);
      
      if (isFirebaseConnected) {
        await FirebaseService.resetToDefaults();
        console.log('🔄 Allocations réinitialisées');
      }
    } catch (error) {
      console.error('❌ Erreur réinitialisation:', error);
    }
  };

  // ===== FIN FONCTIONS FIREBASE =====

  // Gestion du drag & drop pour modifier les allocations avec debounce
  const debouncedSliderChange = useDebouncedCallback((assetKey, newValue) => {
    const oldValue = allocations[assetKey];
    const difference = newValue - oldValue;
    
    // Redistribuer la différence sur les autres assets
    const otherAssets = Object.keys(allocations).filter(key => key !== assetKey);
    const totalOthers = otherAssets.reduce((sum, key) => sum + allocations[key], 0);
    
    if (totalOthers > 0) {
      const newAllocations = { ...allocations };
      newAllocations[assetKey] = newValue;
      
      // Redistribuer proportionnellement
      otherAssets.forEach(key => {
        const proportion = allocations[key] / totalOthers;
        newAllocations[key] = Math.max(0, allocations[key] - (difference * proportion));
      });
      
      // Normaliser pour que la somme soit 100%
      const total = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
      Object.keys(newAllocations).forEach(key => {
        newAllocations[key] = (newAllocations[key] / total) * 100;
      });
      
      setAllocations(newAllocations);
    }
  }, 150); // Debounce de 150ms pour une réactivité optimale

  const handleSliderChange = (assetKey, newValue) => {
    debouncedSliderChange(assetKey, newValue);
  };

  // Réinitialiser les allocations
  const resetAllocations = () => {
    const defaultAllocations = {
      stocks: 60,
      bonds: 25,
      commodities: 10,
      cash: 5
    };
    setAllocations(defaultAllocations);
  };

  // Presets d'allocation
  const applyPreset = (presetName) => {
    const presets = {
      conservative: { stocks: 30, bonds: 50, commodities: 5, cash: 15 },
      balanced: { stocks: 60, bonds: 25, commodities: 10, cash: 5 },
      aggressive: { stocks: 80, bonds: 10, commodities: 8, cash: 2 },
      growth: { stocks: 70, bonds: 15, commodities: 12, cash: 3 }
    };
    
    if (presets[presetName]) {
      setAllocations(presets[presetName]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl p-6 shadow-2xl border border-[#2a2a4e] hover:shadow-3xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-full animate-pulse"></div>
          <h3 className="text-xl font-bold text-white">Asset Allocation</h3>
          <span className="text-sm text-[#cccccc] bg-[#2a2a4e] px-2 py-1 rounded-full">
            Interactive
          </span>
        </div>
        
        {/* Boutons de preset */}
        <div className="flex space-x-2">
          <button
            onClick={() => applyPreset('conservative')}
            className="px-3 py-1 text-xs bg-[#4f46e5] text-white rounded-lg hover:bg-[#3730a3] transition-colors"
            title="Conservative (30/50/5/15)"
          >
            Conservative
          </button>
          <button
            onClick={() => applyPreset('balanced')}
            className="px-3 py-1 text-xs bg-[#00ff88] text-black rounded-lg hover:bg-[#00cc6a] transition-colors"
            title="Balanced (60/25/10/5)"
          >
            Balanced
          </button>
          <button
            onClick={() => applyPreset('aggressive')}
            className="px-3 py-1 text-xs bg-[#f59e0b] text-white rounded-lg hover:bg-[#d97706] transition-colors"
            title="Aggressive (80/10/8/2)"
          >
            Aggressive
          </button>
          <button
            onClick={resetToDefaults}
            className="px-3 py-1 text-xs bg-[#6b7280] text-white rounded-lg hover:bg-[#4b5563] transition-colors"
            title="Reset to default"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique Pie Chart */}
        <div className="relative">
          <div className="h-64 relative">
            <Pie ref={chartRef} data={chartData} options={chartOptions} />
          </div>
          
          {/* Indicateur central */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-[#1a1a2e] rounded-full p-4 border-2 border-[#00ff88] shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-[#cccccc]">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contrôles interactifs */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white mb-4">Adjust Allocations</h4>
          
          {Object.entries(assetConfig).map(([key, config]) => (
            <div key={key} className="space-y-2" data-asset={key}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-white font-medium">{config.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-bold text-lg">
                    {animatedAllocations[key].toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Slider personnalisé */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={allocations[key]}
                  onChange={(e) => handleSliderChange(key, parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#2a2a4e] rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, ${config.color} 0%, ${config.color} ${allocations[key]}%, #2a2a4e ${allocations[key]}%, #2a2a4e 100%)`
                  }}
                />
                <div 
                  className="absolute top-0 h-2 rounded-lg pointer-events-none"
                  style={{
                    width: `${allocations[key]}%`,
                    backgroundColor: config.color,
                    boxShadow: `0 0 10px ${config.color}40`
                  }}
                />
              </div>
            </div>
          ))}
          
          {/* Boutons Firebase */}
          <div className="mt-6 space-y-3">
            {/* Bouton Save Portfolio avec LoadingButton */}
            <LoadingButton
              onClick={savePortfolio}
              loading={isSaving}
              disabled={!isFirebaseConnected}
              data-save-button="true"
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                isFirebaseConnected
                  ? 'bg-[#00ff88] text-black hover:bg-[#00cc6a] hover:shadow-lg'
                  : 'bg-[#6b7280] text-[#cccccc] cursor-not-allowed'
              }`}
            >
              <span>💾</span>
              <span>Save Portfolio</span>
            </LoadingButton>

            {/* Informations de connexion */}
            <div className="flex items-center justify-between text-xs text-[#cccccc]">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isFirebaseConnected ? 'bg-[#00ff88]' : 'bg-[#ef4444]'
                }`}></div>
                <span>
                  {isFirebaseConnected ? 'Firebase Connected' : 'Firebase Disconnected'}
                </span>
              </div>
              {lastSaved && (
                <span>
                  Last saved: {
                    lastSaved.toDate ? 
                      lastSaved.toDate().toLocaleTimeString() : 
                      (lastSaved instanceof Date ? 
                        lastSaved.toLocaleTimeString() : 
                        'Unknown'
                      )
                  }
                </span>
              )}
            </div>

            {/* Bouton Reset */}
            <button
              onClick={resetToDefaults}
              className="w-full py-2 px-4 bg-[#6b7280] text-white rounded-lg hover:bg-[#4b5563] transition-colors text-sm"
            >
              🔄 Reset to Defaults
            </button>
          </div>

          {/* Résumé */}
          <div className="mt-6 p-4 bg-[#0f0f23] rounded-lg border border-[#2a2a4e]">
            <div className="text-sm text-[#cccccc] mb-2">Portfolio Summary</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#cccccc]">Risk Level:</span>
                <span className="text-white font-bold ml-2">
                  {allocations.stocks > 70 ? 'High' : allocations.stocks > 50 ? 'Medium' : 'Low'}
                </span>
              </div>
              <div>
                <span className="text-[#cccccc]">Diversification:</span>
                <span className="text-white font-bold ml-2">
                  {Object.values(allocations).filter(v => v > 5).length}/4 Assets
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS pour les sliders */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #00ff88;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
        
        .slider:hover::-webkit-slider-thumb {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
        }
      `}</style>
    </div>
  );
};

export default AssetAllocationPieChart;

