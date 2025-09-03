import React, { useState } from 'react';
import ScreeningTable from './components/screening/ScreeningTable';

function AppMinimal() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px'
    }}>
      {/* Header */}
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #00ff88 0%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 10px 0'
        }}>
          🚀 WOW V1 MVP - Dashboard Unifié
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
          Portfolio Management avec Données Réelles
        </p>
      </header>

      {/* Dashboard Content */}
      <main>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            color: '#00ff88', 
            fontSize: '20px', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔍 Screening Table avec Données Réelles
          </h2>
          
          <ScreeningTable 
            compact={true} 
            maxRows={5}
            title="Top 5 Assets - Données Temps Réel"
          />
        </div>

        <div style={{ 
          background: 'rgba(79, 70, 229, 0.1)',
          border: '1px solid rgba(79, 70, 229, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#4f46e5', marginBottom: '12px' }}>
            ✅ Status MVP
          </h3>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
            Dashboard unifié fonctionnel avec données réelles des APIs FMP, Alpha Vantage et Yahoo Finance
          </p>
        </div>
      </main>
    </div>
  );
}

export default AppMinimal;

