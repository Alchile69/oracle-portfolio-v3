#!/bin/bash

echo "🔍 VÉRIFICATION DES IMPORTS CARD"
echo "================================"

# Vérifier les imports incorrects
echo "❌ Imports incorrects (ui/Card):"
grep -r "from.*ui/Card" src/ || echo "✅ Aucun import incorrect trouvé"

echo ""
echo "✅ Imports corrects (ui/card):"
grep -r "from.*ui/card" src/ | wc -l | xargs echo "Nombre d'imports corrects:"

echo ""
echo "📋 Fichiers avec imports Card:"
find src/ -name "*.jsx" -exec grep -l "ui/card" {} \;

echo ""
echo "🔧 Test build local..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
    echo "🚀 Prêt pour déploiement Vercel"
else
    echo "❌ Erreur de build"
    exit 1
fi
