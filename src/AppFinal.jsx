import React, { useState } from 'react';
import PortfolioKPICards from './components/portfolio/PortfolioKPICards';
import AssetAllocationPieChart from './components/portfolio/AssetAllocationPieChart';
import ScreeningTableFixed from './components/screening/ScreeningTableFixed';
import './App.css';

function AppFinal() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="p-6 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🚀</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">WOW V1 MVP</h1>
              <p className="text-sm text-slate-400">Portfolio Management avec Données Réelles</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'dashboard' 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📊 Dashboard Unifié
            </button>
            <button 
              onClick={() => setCurrentView('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'analytics' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📈 Analytics Complet
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">APIs Actives</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu Principal */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && (
            <div className="dashboard-unified">
              <div className="dashboard-header">
                <h2 className="dashboard-title">
                  <span className="dashboard-icon">🚀</span>
                  WOW V1 - Dashboard Unifié MVP
                </h2>
                <p className="dashboard-subtitle">
                  Vue d'ensemble complète de votre portefeuille avec données financières en temps réel
                </p>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">FMP API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">Alpha Vantage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">Yahoo Finance</span>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-content">
                {/* Section KPI Cards */}
                <div className="dashboard-section kpi-section">
                  <PortfolioKPICards />
                </div>
                
                {/* Section Asset Allocation et Screening */}
                <div className="dashboard-grid">
                  <div className="dashboard-section allocation-section">
                    <AssetAllocationPieChart />
                  </div>
                  
                  <div className="dashboard-section screening-section">
                    <ScreeningTableFixed 
                      compact={true} 
                      maxRows={5}
                      title="Top 5 Assets - Données Temps Réel"
                    />
                  </div>
                </div>

                {/* Section Status MVP */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-green-600/10 border border-green-600/30 rounded-xl p-6">
                    <h3 className="text-green-400 font-bold text-lg mb-3">✅ Composants Intégrés</h3>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Portfolio KPI Cards</li>
                      <li>• Asset Allocation Pie</li>
                      <li>• Screening Table</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
                    <h3 className="text-blue-400 font-bold text-lg mb-3">🔧 APIs Configurées</h3>
                    <ul className="text-slate-300 space-y-2">
                      <li>• FMP: Prix & Métriques</li>
                      <li>• Alpha Vantage: Quotes</li>
                      <li>• Yahoo: Fallback</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl p-6">
                    <h3 className="text-purple-400 font-bold text-lg mb-3">🚀 Fonctionnalités</h3>
                    <ul className="text-slate-300 space-y-2">
                      <li>• Rate Limiting</li>
                      <li>• Cache Intelligent</li>
                      <li>• Scoring Algorithmique</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'analytics' && (
            <div className="analytics-container">
              <div className="analytics-header">
                <h2 className="analytics-title">
                  <span className="analytics-icon">📈</span>
                  Portfolio Analytics Complet
                </h2>
                <p className="analytics-subtitle">
                  Analyse détaillée avec tous les composants et données en temps réel
                </p>
              </div>
              
              <div className="analytics-content">
                <div className="analytics-section kpi-section">
                  <PortfolioKPICards />
                </div>
                
                <div className="analytics-section allocation-section">
                  <AssetAllocationPieChart />
                </div>
                
                <div className="analytics-section screening-section">
                  <ScreeningTableFixed 
                    compact={false} 
                    maxRows={10}
                    title="Screening Complet - Top 10 Assets"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 p-6 text-center text-slate-500 text-sm border-t border-slate-700">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">W</span>
          </div>
          <span>© 2025 WOW V1 MVP - Portfolio Management Platform avec Données Réelles</span>
        </div>
        <div className="mt-2 text-xs text-slate-600">
          APIs: FMP • Alpha Vantage • Yahoo Finance • FRED | Rate Limiting • Cache Intelligent • Scoring Algorithmique
        </div>
      </footer>
    </div>
  );
}

export default AppFinal;

