import React, { useState } from 'react';
import PortfolioKPICards from './components/portfolio/PortfolioKPICards';
import AssetAllocationPieChart from './components/portfolio/AssetAllocationPieChart';
import ScreeningTable from './components/screening/ScreeningTable';
import './App.css';

function AppNew() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="p-6 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🚀</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">WOW V1 MVP</h1>
              <p className="text-sm text-slate-400">Portfolio Management avec Données Réelles</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'dashboard' 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/25' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentView === 'analytics' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              📈 Analytics
            </button>
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
                  WOW V1 - Portfolio Management Dashboard
                </h2>
                <p className="dashboard-subtitle">
                  Vue d'ensemble complète de votre portefeuille d'investissement avec données réelles
                </p>
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
                    <ScreeningTable 
                      compact={true} 
                      maxRows={5}
                      title="Top 5 Assets Screening"
                    />
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
                  Portfolio Analytics
                </h2>
                <p className="analytics-subtitle">
                  Analyse en temps réel de votre portefeuille d'investissement
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
                  <ScreeningTable 
                    compact={false} 
                    maxRows={10}
                    title="Assets Screening Complet"
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
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">W</span>
          </div>
          <span>© 2025 WOW V1 MVP - Portfolio Management avec Données Réelles</span>
        </div>
      </footer>
    </div>
  );
}

export default AppNew;

