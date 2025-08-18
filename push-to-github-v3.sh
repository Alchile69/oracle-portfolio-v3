#!/bin/bash

echo "🚀 PUSH VERS GITHUB - ORACLE PORTFOLIO V3"
echo "========================================="

# Configuration
REPO_NAME="oracle-portfolio-v3"
GITHUB_URL="https://github.com/Alchile69/$REPO_NAME.git"

echo "📋 Configuration:"
echo "Repository: $REPO_NAME"
echo "URL: $GITHUB_URL"

# Vérifier que le repository existe
echo "🔍 Vérification du repository..."
if curl -s "https://api.github.com/repos/Alchile69/$REPO_NAME" | grep -q "full_name"; then
    echo "✅ Repository GitHub trouvé !"
else
    echo "❌ Repository GitHub non trouvé"
    echo "⚠️ Veuillez d'abord créer le repository sur GitHub:"
    echo "   https://github.com/new"
    echo "   Nom: $REPO_NAME"
    exit 1
fi

# Push vers GitHub
echo "📤 Push vers GitHub..."
echo "🌿 Push branche main..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Branche main poussée avec succès !"
else
    echo "❌ Erreur lors du push de la branche main"
    exit 1
fi

echo "🏷️ Push tag v3.0.0..."
git push origin v3.0.0

if [ $? -eq 0 ]; then
    echo "✅ Tag v3.0.0 poussé avec succès !"
else
    echo "❌ Erreur lors du push du tag"
    exit 1
fi

echo "🎉 PUSH TERMINÉ AVEC SUCCÈS !"
echo "============================="
echo "🌐 Repository GitHub: $GITHUB_URL"
echo "📱 Prêt pour déploiement Vercel !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Allez sur: https://vercel.com/new"
echo "2. Importez: Alchile69/oracle-portfolio-v3"
echo "3. Framework: Vite (détecté automatiquement)"
echo "4. Cliquez sur 'Deploy'"
echo ""
echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
