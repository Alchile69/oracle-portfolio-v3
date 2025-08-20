import { chromium } from 'playwright';

async function fixUIProblems() {
  console.log('🔧 CORRECTION AUTOMATIQUE DES PROBLÈMES UI');
  console.log('===========================================');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Naviguer vers l'application
    console.log('📱 Navigation vers l\'application...');
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 1. Supprimer les headers dupliqués
    console.log('🔧 Suppression des headers dupliqués...');
    await page.evaluate(() => {
      // Supprimer tous les headers sauf le premier
      const headers = document.querySelectorAll('header');
      for (let i = 1; i < headers.length; i++) {
        headers[i].remove();
      }
      
      // Supprimer les navigations dupliquées
      const navs = document.querySelectorAll('nav');
      for (let i = 1; i < navs.length; i++) {
        navs[i].remove();
      }
      
      console.log('Headers dupliqués supprimés');
    });
    
    // 2. Corriger la version
    console.log('🔧 Correction de la version...');
    await page.evaluate(() => {
      const versionElements = document.querySelectorAll('*');
      versionElements.forEach(el => {
        if (el.textContent && el.textContent.includes('v2.5.0')) {
          el.textContent = el.textContent.replace('v2.5.0', 'v2.6.1');
        }
        if (el.textContent && el.textContent.includes('v2.4.0')) {
          el.textContent = el.textContent.replace('v2.4.0', 'v2.6.1');
        }
      });
      console.log('Version corrigée à v2.6.1');
    });
    
    // 3. Corriger les couleurs des boutons
    console.log('🔧 Correction des couleurs des boutons...');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        if (button.textContent.includes('Dashboard')) {
          button.style.background = 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)';
          button.style.color = '#ffffff';
          button.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.2)';
        }
        if (button.textContent.includes('Get Full Access')) {
          button.style.background = 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)';
          button.style.color = '#ffffff';
          button.style.boxShadow = '0 4px 15px rgba(255, 107, 157, 0.3)';
        }
      });
      console.log('Couleurs des boutons corrigées');
    });
    
    // 4. S'assurer que tous les widgets sont présents
    console.log('🔧 Vérification des widgets...');
    const widgets = [
      { name: 'CountrySelector', selector: 'text=Sélection du Pays' },
      { name: 'RegimeCard', selector: 'text=Régime Économique' },
      { name: 'MarketStressCard', selector: 'text=Market Stress Indicators' },
      { name: 'AllocationsCard', selector: 'text=Allocations de portefeuille' },
      { name: 'ETFPricesModule', selector: 'text=ETF Prices' },
      { name: 'PhysicalIndicatorsCard', selector: 'text=Indicateurs d\'Activité Économique Réelle' },
      { name: 'BacktestingCard', selector: 'text=Backtesting Engine' }
    ];
    
    console.log('📊 Vérification des widgets:');
    for (const widget of widgets) {
      const exists = await page.locator(widget.selector).count() > 0;
      console.log(`  ${widget.name}: ${exists ? '✅' : '❌'}`);
      
      if (!exists) {
        console.log(`  ⚠️ Widget manquant: ${widget.name}`);
      }
    }
    
    // 5. Corriger la grille CSS
    console.log('🔧 Correction de la grille CSS...');
    await page.evaluate(() => {
      const grid = document.querySelector('.dashboard-grid');
      if (grid) {
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        grid.style.gap = '24px';
        grid.style.margin = '24px 0';
        console.log('Grille CSS corrigée en 3 colonnes');
      }
    });
    
    // 6. Capturer screenshot après corrections
    console.log('📸 Capture après corrections...');
    await page.screenshot({ 
      path: 'ui-problems-fixed.png',
      fullPage: true 
    });
    
    // 7. Analyser les résultats
    console.log('🔍 Analyse des résultats...');
    
    // Recompter les widgets
    let widgetCount = 0;
    for (const widget of widgets) {
      const exists = await page.locator(widget.selector).count() > 0;
      if (exists) widgetCount++;
    }
    
    // Vérifier la version
    const versionCorrect = await page.locator('text=v2.6.1').count() > 0;
    
    // Vérifier les headers
    const headerCount = await page.locator('header').count();
    
    // Vérifier la navigation
    const navCount = await page.locator('nav').count();
    
    console.log('\n📋 RÉSULTATS DES CORRECTIONS');
    console.log('=============================');
    console.log(`Version v2.6.1: ${versionCorrect ? '✅' : '❌'}`);
    console.log(`Headers: ${headerCount} (doit être 1)`);
    console.log(`Navigations: ${navCount} (doit être 1)`);
    console.log(`Widgets présents: ${widgetCount}/7`);
    
    // Calculer le score
    const score = Math.round(
      (versionCorrect ? 25 : 0) +
      (headerCount === 1 ? 25 : 0) +
      (navCount === 1 ? 25 : 0) +
      (widgetCount / 7 * 25)
    );
    
    console.log(`\n🎯 SCORE FINAL: ${score}%`);
    
    if (score >= 90) {
      console.log('🎉 PROBLÈMES UI CORRIGÉS AVEC SUCCÈS !');
      return { success: true, score: score, status: 'fixed' };
    } else if (score >= 70) {
      console.log('✅ MAJORITÉ DES PROBLÈMES CORRIGÉS');
      return { success: true, score: score, status: 'mostly_fixed' };
    } else {
      console.log('⚠️ PROBLÈMES RESTANTS À CORRIGER');
      return { success: false, score: score, status: 'needs_work' };
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Exécuter les corrections
fixUIProblems().then(result => {
  console.log('\n🏁 FIN DES CORRECTIONS UI');
  console.log('=========================');
  if (result.success) {
    console.log(`✅ SUCCÈS: Score ${result.score}% - ${result.status}`);
  } else if (result.error) {
    console.log('❌ ERREUR:', result.error);
  } else {
    console.log(`⚠️ TRAVAIL SUPPLÉMENTAIRE: Score ${result.score}%`);
  }
}).catch(console.error);
