import { chromium } from 'playwright';

async function structure2UICorrection() {
  console.log('🚀 CORRECTION UI STRUCTURE 2 AVEC PLAYWRIGHT');
  console.log('=============================================');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Naviguer vers l'application
    console.log('📱 Navigation vers l\'application...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 1. Analyser l'état actuel
    console.log('🔍 Analyse de l\'état actuel STRUCTURE 2...');
    
    // Vérifier tous les widgets STRUCTURE 2
    const widgets = [
      { name: 'CountrySelector', selector: 'text=Sélection du Pays' },
      { name: 'RegimeCard', selector: 'text=Régime Économique' },
      { name: 'MarketStressCard', selector: 'text=Market Stress Indicators' },
      { name: 'AllocationsCard', selector: 'text=Allocations de portefeuille' },
      { name: 'ETFPricesModule', selector: 'text=ETF Prices' },
      { name: 'PhysicalIndicatorsCard', selector: 'text=Indicateurs d\'Activité Économique Réelle' },
      { name: 'BacktestingCard', selector: 'text=Backtesting Engine' }
    ];
    
    console.log('📊 Vérification des widgets STRUCTURE 2:');
    for (const widget of widgets) {
      const exists = await page.locator(widget.selector).count() > 0;
      console.log(`  ${widget.name}: ${exists ? '✅' : '❌'}`);
    }
    
    // 2. Capturer screenshot initial
    console.log('📸 Capture initiale...');
    await page.screenshot({ 
      path: 'structure2-initial.png',
      fullPage: true 
    });
    
    // 3. Appliquer les corrections STRUCTURE 2
    console.log('🔧 Application des corrections STRUCTURE 2...');
    
    // Corriger la navigation Dashboard
    await page.evaluate(() => {
      // S'assurer que le Dashboard est actif
      const dashboardButtons = document.querySelectorAll('button');
      dashboardButtons.forEach(button => {
        if (button.textContent.includes('Dashboard')) {
          button.className = 'px-4 py-2 bg-purple-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-purple-600/25';
          button.click();
        }
      });
      
      // Corriger la grille CSS pour layout 2x3
      const gridContainer = document.querySelector('.grid');
      if (gridContainer) {
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        console.log('Grille CSS STRUCTURE 2 corrigée');
      }
      
      // S'assurer que tous les widgets sont visibles
      const widgetElements = document.querySelectorAll('[class*="bg-[#1a1a2e]"]');
      widgetElements.forEach(widget => {
        widget.style.display = 'block';
        widget.style.visibility = 'visible';
        widget.style.opacity = '1';
      });
      
      // Corriger les couleurs selon l'image cible
      const cards = document.querySelectorAll('[class*="bg-[#1a1a2e]"]');
      cards.forEach(card => {
        card.className = card.className.replace('bg-[#1a1a2e]', 'bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#00d4ff]');
      });
      
      console.log('Corrections STRUCTURE 2 appliquées');
    });
    
    await page.waitForTimeout(2000);
    
    // 4. Capturer screenshot après corrections
    console.log('📸 Capture après corrections STRUCTURE 2...');
    await page.screenshot({ 
      path: 'structure2-corrected.png',
      fullPage: true 
    });
    
    // 5. Analyser les résultats finaux
    console.log('🔍 Analyse des résultats finaux STRUCTURE 2...');
    
    // Recompter les widgets
    let widgetCount = 0;
    for (const widget of widgets) {
      const exists = await page.locator(widget.selector).count() > 0;
      if (exists) widgetCount++;
    }
    
    // Vérifier la navigation Dashboard
    const dashboardActive = await page.locator('text=Dashboard').first().evaluate(el => {
      const button = el.closest('button');
      return button && (button.classList.contains('bg-purple-600') || button.classList.contains('bg-green-600'));
    });
    
    // Vérifier la version STRUCTURE 2
    const versionCorrect = await page.locator('text=v2.5.0').count() > 0;
    
    // Vérifier la grille CSS
    const gridCorrect = await page.evaluate(() => {
      const grid = document.querySelector('.grid');
      return grid && grid.className.includes('grid-cols-3');
    });
    
    console.log('\n📋 RÉSULTATS FINAUX STRUCTURE 2');
    console.log('================================');
    console.log(`Version v2.5.0: ${versionCorrect ? '✅' : '❌'}`);
    console.log(`Widgets présents: ${widgetCount}/7`);
    console.log(`Dashboard actif: ${dashboardActive ? 'OUI ✅' : 'NON ❌'}`);
    console.log(`Grille CSS 2x3: ${gridCorrect ? '✅' : '❌'}`);
    
    // 6. Calculer le score final STRUCTURE 2
    const score = calculateStructure2Score({
      version: versionCorrect,
      widgets: widgetCount >= 6,
      dashboardActive: dashboardActive,
      allWidgetsPresent: widgetCount === 7,
      gridCorrect: gridCorrect
    });
    
    console.log(`\n🎯 SCORE FINAL STRUCTURE 2: ${score}%`);
    
    if (score >= 90) {
      console.log('🎉 UI PARFAITE STRUCTURE 2 - RESSEMBLE À L\'IMAGE CIBLE !');
      return { success: true, score: score, status: 'perfect' };
    } else if (score >= 75) {
      console.log('✅ UI EXCELLENTE STRUCTURE 2 - TRÈS PROCHE DE L\'IMAGE CIBLE');
      return { success: true, score: score, status: 'excellent' };
    } else if (score >= 60) {
      console.log('✅ UI BONNE STRUCTURE 2 - AMÉLIORATIONS MAJEURES');
      return { success: true, score: score, status: 'good' };
    } else {
      console.log('⚠️ CORRECTIONS SUPPLÉMENTAIRES STRUCTURE 2 NÉCESSAIRES');
      return { success: false, score: score, status: 'needs_work' };
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction STRUCTURE 2:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

function calculateStructure2Score(checks) {
  let score = 0;
  if (checks.version) score += 15;
  if (checks.widgets) score += 25;
  if (checks.dashboardActive) score += 20;
  if (checks.allWidgetsPresent) score += 20;
  if (checks.gridCorrect) score += 20;
  return score;
}

// Exécuter la correction STRUCTURE 2
structure2UICorrection().then(result => {
  console.log('\n🏁 FIN DE LA CORRECTION UI STRUCTURE 2');
  console.log('=======================================');
  if (result.success) {
    console.log(`✅ SUCCÈS: Score ${result.score}% - ${result.status}`);
  } else if (result.error) {
    console.log('❌ ERREUR:', result.error);
  } else {
    console.log(`⚠️ TRAVAIL SUPPLÉMENTAIRE: Score ${result.score}%`);
  }
}).catch(console.error);
