# 🚀 Guide de Déploiement Railway - Phase 5 Backtesting

## 📋 Prérequis

- **Compte Railway** : Accès au projet oracle-backend-wow-v1-production
- **Repository Git** : Branche WOW_V1 
- **Backend existant** : FastAPI déjà configuré

## 🔧 Étapes de Déploiement

### 1. Préparation des Fichiers

```bash
# Structure backend pour Railway
backend/
├── main.py                 # ✅ Application FastAPI
├── routers/               # ✅ Endpoints backtesting
├── models/                # ✅ Modèles Pydantic
├── services/              # ✅ Services de données
├── requirements.txt       # ✅ Dépendances
├── railway.json          # 🆕 Configuration Railway
└── Procfile              # 🆕 Commande de démarrage
```

### 2. Variables d'Environnement Railway

```bash
# APIs Financières (déjà configurées)
FMP_API_KEY=d853e9baf4d3b05e22df89d16fef4631
ALPHA_VANTAGE_API_KEY=W0TKFSHUKOR9TXN3
YAHOO_API_KEY=648b1a216amshf8a96de07812e45p14c7a6jsn4d44e897881f
FRED_API_KEY=26bbc1665befd935b8d8c55ae6e08ba8

# Configuration FastAPI
PORT=8000
ENVIRONMENT=production
```

### 3. Commandes de Déploiement

```bash
# 1. Commit des nouveaux fichiers
git add backend/
git commit -m "Phase 5: Add Backtesting Integration"

# 2. Push vers la branche WOW_V1
git push origin WOW_V1

# 3. Railway détecte automatiquement les changements
# et redéploie le service
```

### 4. Vérification Post-Déploiement

```bash
# Test des endpoints
curl https://oracle-backend-wow-v1-production.up.railway.app/
curl https://oracle-backend-wow-v1-production.up.railway.app/docs
curl "https://oracle-backend-wow-v1-production.up.railway.app/api/backtest/validate?symbols=AAPL&start_date=2020-01-01&end_date=2024-12-31"
```

## 📊 Endpoints Disponibles

### Backtesting
- `GET /api/backtest/validate` - Validation des données
- `POST /api/backtest/quick-run` - Backtesting rapide
- `POST /api/backtest/full-run` - Backtesting complet
- `GET /api/backtest/status/{job_id}` - Statut du job

### Documentation
- `GET /docs` - Documentation Swagger
- `GET /redoc` - Documentation ReDoc

## 🔍 Monitoring

### Logs Railway
```bash
# Vérifier les logs de déploiement
railway logs --follow

# Vérifier les métriques
railway status
```

### Health Checks
- **Endpoint** : `/`
- **Timeout** : 100s
- **Restart Policy** : ON_FAILURE (max 10 retries)

## 🐛 Troubleshooting

### Erreurs Communes

1. **Port Binding Error**
   ```
   Solution: Vérifier que l'app écoute sur 0.0.0.0:$PORT
   ```

2. **Import Errors**
   ```
   Solution: Vérifier requirements.txt et structure des modules
   ```

3. **API Keys Missing**
   ```
   Solution: Configurer les variables d'environnement Railway
   ```

### Debug Commands
```bash
# Tester localement avant déploiement
uvicorn main:app --host 0.0.0.0 --port 8000

# Vérifier les dépendances
pip install -r requirements.txt

# Tester les endpoints
python -m pytest tests/ (si tests disponibles)
```

## 🎯 Post-Déploiement

### 1. Mise à Jour Frontend
```javascript
// Changer l'URL dans BacktestingModule.jsx
const API_BASE_URL = 'https://oracle-backend-wow-v1-production.up.railway.app';
```

### 2. Tests de Production
- Tester tous les endpoints backtesting
- Vérifier les performances avec vraies données
- Valider l'intégration frontend-backend

### 3. Monitoring Continu
- Surveiller les logs Railway
- Vérifier les métriques de performance
- Monitorer l'utilisation des APIs externes

---

**Déploiement estimé : 30-60 minutes**  
**Statut : Prêt pour déploiement**

