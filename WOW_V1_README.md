# WOW V1 - Development Setup ✅

## Quick Start

1. **Environment Setup**
   ```bash
   cp .env.local.template .env.local
   # Edit .env.local with your Firebase credentials
   ```

2. **Development Server**
   ```bash
   npm run wow:dev
   # or
   npx vite --port 5173 --host
   ```

3. **Backend Testing**
   ```bash
   curl https://oracle-backend-railway.up.railway.app/health
   ```

## WOW V1 Specific Features

### New Components Added
- Portfolio KPI Cards with animations
- Interactive Asset Allocation Pie Chart
- Country Risk Heatmap (Leaflet)
- Backtesting Module (Backtesting.py)
- Forecast & Scenario Analysis
- Enhanced Alerts System

### Dependencies Added
- chart.js + react-chartjs-2 (Charts)
- @tweenjs/tween.js (Animations)
- leaflet + react-leaflet (Maps)
- backtesting (Python backend)

## Development Phases

- **Phase 1** (3 days): Setup & Configuration ✅
- **Phase 2** (4 days): Portfolio KPIs + Pie Chart
- **Phase 3** (2 days): Screening Table
- **Phase 4** (3 days): Country Risk Heatmap
- **Phase 5** (4 days): Backtesting Integration
- **Phase 6** (3 days): Forecast & Scenario Tool
- **Phase 7** (2 days): Alerts System
- **Phase 8** (3 days): Testing & Polish

## Architecture

```
Frontend (Vite/React) → Railway Backend (FastAPI + Backtesting.py) → Firebase Firestore
```

## URLs

- **Frontend**: https://oracle-portfolio-v3-7p0jg50o5-alain-poncelas-projects.vercel.app
- **Backend**: https://oracle-backend-railway.up.railway.app
- **Repository**: https://github.com/Alchile69/oracle-portfolio-v3.git

## Phase 1 Setup Status ✅

### Completed Tasks
- ✅ Oracle Portfolio V3 cloned successfully
- ✅ WOW V1 dependencies installed (Chart.js, Tween.js, Leaflet)
- ✅ BacktestService created in src/services/
- ✅ BacktestModule component created in src/components/backtest/
- ✅ Environment configuration files created
- ✅ Development server tested and working
- ✅ Package.json scripts updated for WOW V1

### Files Created
- `.env.local` - Environment variables
- `.env.local.template` - Template for environment setup
- `src/services/backtestService.js` - Backtest API service
- `src/components/backtest/BacktestModule.jsx` - Main backtest component
- `WOW_V1_README.md` - This documentation

### Next Steps (Phase 2)
1. Integrate BacktestModule into main dashboard
2. Implement Portfolio KPI Cards with animations
3. Create Interactive Asset Allocation Pie Chart
4. Setup real-time data synchronization

## Usage Examples

### Using the Backtest Service
```javascript
import { BacktestService } from './services/backtestService';

// Health check
const status = await BacktestService.healthCheck();

// Get available strategies
const strategies = await BacktestService.getStrategies();

// Run a backtest
const result = await BacktestService.runBacktest({
  initialCapital: 10000,
  assets: [
    { symbol: 'AAPL', weight: 0.2, name: 'Apple Inc.' }
  ],
  strategy: 'TopFiveStrategy',
  startDate: '2023-01-01',
  endDate: '2024-01-01'
});
```

### Integrating BacktestModule
```jsx
import BacktestModule from './components/backtest/BacktestModule';

function Dashboard() {
  return (
    <div className="dashboard">
      <BacktestModule />
    </div>
  );
}
```

## Development Commands

```bash
# Start development server
npm run wow:dev

# Build for production
npm run wow:build

# Preview production build
npm run wow:preview

# Run existing Oracle Portfolio tests
npm run auto-ui
```

## Environment Variables Required

```env
# Firebase (required for full functionality)
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend (configured)
VITE_BACKEND_URL=https://oracle-backend-railway.up.railway.app
VITE_BACKTEST_ENDPOINT=/api/backtest
```

## Troubleshooting

### Common Issues

1. **Dependencies not installing**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Server not starting**
   ```bash
   npm run wow:dev
   # Check for port conflicts
   ```

3. **Backend connection issues**
   ```bash
   # Check backend status
   curl https://oracle-backend-railway.up.railway.app/health
   ```

4. **Firebase errors**
   - Verify credentials in `.env.local`
   - Check Firebase project configuration

### Support
- **Documentation**: See `wow_v1_phase1_preparation.md`
- **Issues**: Create GitHub issue on Oracle Portfolio V3 repository
- **Backend Logs**: Check Railway dashboard

---

**Phase 1 Complete! Ready for Phase 2 Development 🚀**

*Total setup time: ~2 hours*  
*Status: All systems operational*  
*Next milestone: Portfolio KPIs + Pie Chart (Phase 2)*




# WOW V1 - Oracle Portfolio v3.0 - POLISH FINAL

Ce projet est la version finale et améliorée de l'application **Oracle Portfolio v3.0**, avec un focus particulier sur le **polish UI/UX**, le **responsive design**, les **optimisations de performance** et des **tests complets** pour créer une expérience utilisateur professionnelle et fluide.

## ✨ Fonctionnalités Clés

*   **Dashboard Interactif** : Visualisez les données de marché en temps réel avec des indicateurs clés de performance (KPIs) et des graphiques interactifs.
*   **Analyse de Portefeuille Avancée** : Obtenez des analyses détaillées de votre portefeuille avec des métriques comme le Total Return, la Volatilité, le Sharpe Ratio, le Max Drawdown, le Win Rate et le Beta.
*   **Allocation d'Actifs Dynamique** : Ajustez l'allocation de votre portefeuille en temps réel avec un Pie Chart interactif et des sliders intuitifs.
*   **Presets de Portefeuille** : Choisissez parmi des profils d'investissement prédéfinis (Conservative, Balanced, Aggressive) pour une configuration rapide.
*   **Sauvegarde Cloud** : Sauvegardez vos allocations de portefeuille en toute sécurité avec l'intégration Firebase.
*   **Responsive Design** : Profitez d'une expérience utilisateur optimale sur tous les appareils (desktop, tablette, mobile).
*   **UI/UX Moderne** : Interface élégante avec des effets de glassmorphism, des animations fluides et des micro-interactions.
*   **Performances Optimisées** : Application ultra-réactive grâce au lazy loading, à la mémoïsation (useMemo) et au debounce des interactions.

## 🚀 Technologies Utilisées

*   **Frontend** : React, Vite, Chart.js, Tween.js
*   **Styling** : CSS Modules, Glassmorphism, Animations CSS avancées
*   **Backend** : Firebase (Firestore, Auth)
*   **Déploiement** : Vercel (Frontend), Railway (Backend)

## 🛠️ Installation et Lancement

1.  **Cloner le repository** :
    ```bash
    git clone <URL_DU_REPO>
    cd oracle-portfolio-v3
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement** :
    Créez un fichier `.env.local` à la racine du projet et ajoutez vos clés Firebase :
    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Lancer le serveur de développement** :
    ```bash
    npm run dev
    ```

L'application sera disponible sur `http://localhost:5173`.

## 📝 Guide d'Utilisation

1.  **Dashboard** : Vue d'ensemble des indicateurs de marché et de votre portefeuille.
2.  **Analytics** : Analyse détaillée des performances de votre portefeuille avec les KPI Cards et le Pie Chart interactif.
3.  **Configuration** : Personnalisez les paramètres de l'application et gérez votre compte.
4.  **Sauvegarde** : Cliquez sur "Save Portfolio" pour sauvegarder vos allocations dans Firebase.
5.  **Presets** : Utilisez les boutons "Conservative", "Balanced", "Aggressive" pour charger des allocations prédéfinies.

## ✅ Tests

Le projet a été testé sur les navigateurs suivants :

*   Chrome
*   Firefox
*   Safari

Des tests ont été effectués pour vérifier la réactivité, les performances et la gestion des erreurs.

## 🌟 Auteur

**Manus** - Votre agent IA pour le développement de projets complexes.


