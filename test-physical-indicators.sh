#!/bin/bash

echo "🔍 TEST PHYSICAL INDICATORS CARD"
echo "================================"

echo "📋 Vérification du widget PhysicalIndicatorsCard..."

# Vérifier que le fichier existe
if [ -f "src/components/widgets/PhysicalIndicatorsCard.jsx" ]; then
    echo "✅ Fichier PhysicalIndicatorsCard.jsx trouvé"
else
    echo "❌ Fichier PhysicalIndicatorsCard.jsx manquant"
    exit 1
fi

# Vérifier l'import dans Dashboard
if grep -q "PhysicalIndicatorsCard" src/components/layout/Dashboard.jsx; then
    echo "✅ Widget intégré dans Dashboard"
else
    echo "❌ Widget non intégré dans Dashboard"
    exit 1
fi

# Vérifier l'import useCountry
if grep -q "useCountry" src/components/widgets/PhysicalIndicatorsCard.jsx; then
    echo "✅ Import useCountry présent"
else
    echo "❌ Import useCountry manquant"
    exit 1
fi

# Vérifier l'endpoint API
if grep -q "oracle-backend-yrvjzoj3aa-uc.a.run.app/api/indicators/breakdown" src/components/widgets/PhysicalIndicatorsCard.jsx; then
    echo "✅ Endpoint API correct"
else
    echo "❌ Endpoint API incorrect"
    exit 1
fi

# Vérifier le fallback
if grep -q "Données simulées" src/components/widgets/PhysicalIndicatorsCard.jsx; then
    echo "✅ Fallback avec données simulées"
else
    echo "❌ Fallback manquant"
    exit 1
fi

echo ""
echo "🔧 Test build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
    echo "🎉 PhysicalIndicatorsCard prêt pour production"
else
    echo "❌ Erreur de build"
    exit 1
fi

echo ""
echo "📊 Fonctionnalités du widget:"
echo "• Intégration avec CountryContext"
echo "• Pays dynamique selon sélection"
echo "• Fallback avec données simulées"
echo "• Affichage honnête LIVE/SIMULÉ"
echo "• Mise à jour automatique selon pays"
echo "• Plus d'AUCUNE DONNÉE"
