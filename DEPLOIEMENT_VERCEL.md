# Déploiement Vercel - Oracle Portfolio V3 WOW V1

## 🚀 Guide de Déploiement

### 1. Prérequis
- Compte Vercel
- Repository GitHub avec le code
- Branch WOW_V1 à jour

### 2. Configuration Vercel

**Étapes de déploiement :**

1. **Connecter le repository :**
   - Aller sur [vercel.com](https://vercel.com)
   - Import Git Repository
   - Sélectionner le repository Oracle Portfolio V3

2. **Configuration du projet :**
   ```
   Project Name: oracle-portfolio-v3-wow-v1
   Framework Preset: Create React App
   Root Directory: ./
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

3. **Variables d'environnement :**
   ```
   REACT_APP_API_URL = https://oracle-backend-wow-v1-production.up.railway.app
   ```

4. **Branch de déploiement :**
   ```
   Production Branch: WOW_V1
   ```

### 3. Fichiers de Configuration

**vercel.json :**
```json
{
  "name": "oracle-portfolio-v3-wow-v1",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 4. Fonctionnalités Déployées

**✅ Navigation Oracle Portfolio V3 :**
- Dashboard
- Analytics (avec WOW V1)
- Configuration
- Get Full Access

**✅ WOW V1 MVP :**
- Portfolio KPI Cards
- Asset Allocation Pie Chart
- Screening Table
- Country Heatmap
- **Backtesting Module (Phase 5)**

### 5. Backend

**URL Backend :**
```
https://oracle-backend-wow-v1-production.up.railway.app
```

**Endpoints disponibles :**
- `/api/backtest/run` - Lancer un backtest
- `/api/backtest/status/{id}` - Statut du backtest
- `/api/backtest/results/{id}` - Résultats du backtest
- `/docs` - Documentation API

### 6. Tests Post-Déploiement

**Vérifications :**
1. ✅ Navigation fonctionne
2. ✅ WOW V1 s'affiche dans Analytics
3. ✅ Module Backtesting accessible
4. ✅ Design glassmorphism rendu
5. ✅ Responsive mobile/desktop

**Test Backtesting :**
1. Aller sur Analytics → Backtesting NEW
2. Configurer un backtest simple
3. Vérifier la connexion au backend
4. Tester les résultats

### 7. URLs de Production

**Frontend Vercel :**
```
https://oracle-portfolio-v3-wow-v1.vercel.app
```

**Backend Railway :**
```
https://oracle-backend-wow-v1-production.up.railway.app
```

### 8. Monitoring

**Métriques à surveiller :**
- Temps de chargement
- Erreurs JavaScript
- Connexions API backend
- Performance mobile

### 9. Prochaines Étapes

**Phase 6 :**
- Configuration Firebase production
- Optimisations performance
- Tests utilisateurs
- Monitoring avancé

---

**Version stable - Phase 5 Backtesting Integration**  
*Déploiement prêt pour démonstrations et tests utilisateurs*

