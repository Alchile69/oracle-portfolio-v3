#!/bin/bash

echo "🚀 CRÉATION REPOSITORY GITHUB - ORACLE PORTFOLIO V3"
echo "=================================================="

# Configuration
REPO_NAME="oracle-portfolio-v3"
DESCRIPTION="Oracle Portfolio V3.0.0 - Architecture STRUCTURE 2 - Firebase + Vite + Cloud Run"
USERNAME="Alchile69"

echo "📋 Configuration:"
echo "Repository: $REPO_NAME"
echo "Description: $DESCRIPTION"
echo "Username: $USERNAME"

# Créer le repository via GitHub CLI ou curl
echo "🔧 Création du repository GitHub..."

# Méthode 1: GitHub CLI (si installé)
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI détecté"
    gh repo create $REPO_NAME --public --description "$DESCRIPTION" --push
    if [ $? -eq 0 ]; then
        echo "✅ Repository créé avec GitHub CLI"
        exit 0
    fi
fi

# Méthode 2: curl avec token (si disponible)
if [ ! -z "$GITHUB_TOKEN" ]; then
    echo "✅ Token GitHub détecté"
    curl -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/user/repos \
        -d "{\"name\":\"$REPO_NAME\",\"description\":\"$DESCRIPTION\",\"private\":false}"
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository créé avec curl"
        exit 0
    fi
fi

# Méthode 3: Instructions manuelles
echo "⚠️ Création manuelle requise"
echo ""
echo "📋 Étapes manuelles:"
echo "1. Allez sur: https://github.com/new"
echo "2. Repository name: $REPO_NAME"
echo "3. Description: $DESCRIPTION"
echo "4. Public/Private: Public"
echo "5. Cliquez sur 'Create repository'"
echo ""
echo "📤 Après création, exécutez:"
echo "git push -u origin main"
echo "git push origin v3.0.0"
echo ""
echo "✅ STRUCTURE 2 - Architecture optimale confirmée !"
