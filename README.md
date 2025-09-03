# Oracle Portfolio V3 - WOW V1 MVP

## 🚀 Phase 5 - Backtesting Integration COMPLETED

### 📊 Fonctionnalités Principales

**Navigation Oracle Portfolio V3 :**
- 📊 Dashboard
- 🧮 Analytics (avec WOW V1 intégré)
- ⚙️ Configuration
- 🔓 Get Full Access

**WOW V1 MVP - Modules :**
- ✅ **Portfolio KPI Cards** : 6 métriques avec animations
- ✅ **Asset Allocation Pie Chart** : Visualisation interactive
- ✅ **Screening Table** : Filtrage avancé des actifs
- ✅ **Country Heatmap** : Visualisation géographique
- ✅ **Backtesting Module** : **NOUVEAU - Phase 5**

### 🎯 Backtesting Engine (Phase 5)

**Stratégies Supportées :**
- SMA Crossover (20/50)
- RSI Strategy
- Bollinger Bands
- Buy & Hold

**Métriques Calculées :**
- Total Return, Rendement Annualisé
- Volatilité, Sharpe Ratio, Sortino Ratio
- Max Drawdown, VaR, CVaR
- Win Rate, Profit Factor

**APIs de Données :**
- Financial Modeling Prep (FMP)
- Alpha Vantage
- Yahoo Finance
- FRED

### 🏆 Résultats Validés

**Test AAPL 2020-2024 :**
- **Total Return**: 59.66% (réaliste)
- **Sharpe Ratio**: 0.57
- **Max Drawdown**: -26.33%
- **Temps d'exécution**: 0.19 secondes

### 🛠️ Architecture Technique

**Frontend :**
- React + Vite
- Design Glassmorphism
- Responsive (Desktop/Mobile)

**Backend :**
- FastAPI + Python
- Backtesting Library
- Async Processing

**Déploiement :**
- Frontend: Vercel
- Backend: Railway (prévu)

### 🚀 Installation & Démarrage

**Frontend :**
```bash
npm install
npm start
# → http://localhost:3000
```

**Backend :**
```bash
cd backend
pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

### 📋 État Actuel

**✅ Fonctionnel :**
- Backtesting bout en bout
- Calculs financiers réalistes
- Interface utilisateur complète
- APIs de données intégrées

**⚠️ En cours :**
- Configuration Firebase (persistance)
- Déploiement Railway
- Tests de charge

### 🔧 Configuration

**Variables d'environnement :**
```bash
# Firebase (optionnel - fallback mémoire)
GOOGLE_APPLICATION_CREDENTIALS=firebase-credentials.json

# APIs (hardcodées)
FMP_API_KEY=d853e9baf4d3b05e22df89d16fef4631
ALPHA_VANTAGE_KEY=W0TKFSHUKOR9TXN3
```

### 📈 Roadmap

**Phase 6 (Prochaine) :**
- Configuration Firebase production
- Déploiement Railway complet
- Tests utilisateurs
- Optimisations performance

---

**Développé par l'équipe Manus**  
*Version stable - Phase 5 Backtesting Integration*

