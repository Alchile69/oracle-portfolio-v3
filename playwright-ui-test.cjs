const { chromium } = require('playwright');

async function testUI() {
  console.log('🎯 TEST UI AVEC PLAYWRIGHT');
  console.log('==========================');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Naviguer vers l'application
    console.log('📱 Navigation vers l\'application...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Attendre que les widgets se chargent
    console.log('⏳ Attente du chargement des widgets...');
    await page.waitForTimeout(5000);
    
    // Vérifier les éléments clés
    console.log('🔍 Vérification des éléments UI...');
    
    // 1. Vérifier la version v3.0
    const versionExists = await page.locator('text=v3.0').count() > 0;
    console.log(`🏷️ Version v3.0: ${versionExists ? '✅' : '❌'}`);
    
    // 2. Vérifier le widget PhysicalIndicatorsCard
    const physicalIndicatorsExists = await page.locator('text=Indicateurs d\'Activité Économique Réelle').count() > 0;
    console.log(`📊 PhysicalIndicatorsCard: ${physicalIndicatorsExists ? '✅' : '❌'}`);
    
    // 3. Vérifier les autres widgets
    const countrySelectorExists = await page.locator('text=Sélection du Pays').count() > 0;
    console.log(`🌍 CountrySelector: ${countrySelectorExists ? '✅' : '❌'}`);
    
    const regimeCardExists = await page.locator('text=Régime Économique').count() > 0;
    console.log(`📈 RegimeCard: ${regimeCardExists ? '✅' : '❌'}`);
    
    const marketStressExists = await page.locator('text=Market Stress Indicators').count() > 0;
    console.log(`⚠️ MarketStressCard: ${marketStressExists ? '✅' : '❌'}`);
    
    const allocationsExists = await page.locator('text=Allocations de portefeuille').count() > 0;
    console.log(`🥧 AllocationsCard: ${allocationsExists ? '✅' : '❌'}`);
    
    const etfPricesExists = await page.locator('text=ETF Prices').count() > 0;
    console.log(`📊 ETFPricesModule: ${etfPricesExists ? '✅' : '❌'}`);
    
    const backtestingExists = await page.locator('text=Backtesting Engine').count() > 0;
    console.log(`🔧 BacktestingCard: ${backtestingExists ? '✅' : '❌'}`);
    
    // 4. Capturer un screenshot
    console.log('📸 Capture du screenshot...');
    await page.screenshot({ 
      path: 'oracle-portfolio-v3-ui.png',
      fullPage: true 
    });
    
    // 5. Compter le nombre total de widgets
    const widgetCards = await page.locator('[class*="bg-[#1a1a2e]"]').count();
    console.log(`📊 Nombre total de widgets: ${widgetCards}`);
    
    // 6. Vérifier la navigation Dashboard
    const dashboardActive = await page.locator('text=Dashboard').first().evaluate(el => {
      const button = el.closest('button');
      return button && (button.classList.contains('bg-green-600') || button.classList.contains('bg-purple-500'));
    });
    console.log(`🧭 Dashboard actif: ${dashboardActive ? '✅' : '❌'}`);
    
    // Résumé
    console.log('\n📋 RÉSUMÉ DE L\'ANALYSE UI');
    console.log('==========================');
    console.log(`Version: ${versionExists ? 'v3.0 ✅' : 'v2.5.0 ❌'}`);
    console.log(`Widgets présents: ${widgetCards}/7`);
    console.log(`PhysicalIndicatorsCard: ${physicalIndicatorsExists ? 'PRÉSENT ✅' : 'MANQUANT ❌'}`);
    console.log(`Dashboard actif: ${dashboardActive ? 'OUI ✅' : 'NON ❌'}`);
    
    if (versionExists && physicalIndicatorsExists && widgetCards >= 6 && dashboardActive) {
      console.log('\n🎉 UI PARFAITE - RESSEMBLE À L\'IMAGE CIBLE !');
      return { success: true, status: 'perfect' };
    } else {
      console.log('\n⚠️ UI À AMÉLIORER - CORRECTIONS NÉCESSAIRES');
      return { success: false, status: 'needs_improvement' };
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Exécuter le test
testUI().then(result => {
  console.log('\n🏁 FIN DU TEST UI');
  console.log('================');
  if (result.success) {
    console.log('✅ SUCCÈS: UI conforme à l\'image cible');
  } else if (result.error) {
    console.log('❌ ERREUR:', result.error);
  } else {
    console.log('⚠️ AMÉLIORATIONS NÉCESSAIRES');
  }
}).catch(console.error);
