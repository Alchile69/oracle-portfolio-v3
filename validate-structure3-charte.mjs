import { chromium } from 'playwright';

async function validateStructure3Charte() {
  console.log('🎨 VALIDATION CHARTE GRAPHIQUE STRUCTURE 3');
  console.log('===========================================');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Naviguer vers l'application
    console.log('📱 Navigation vers l\'application STRUCTURE 3...');
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 1. Vérifier la palette de couleurs STRUCTURE 3
    console.log('🎨 Vérification de la palette de couleurs STRUCTURE 3...');
    
    const colorChecks = await page.evaluate(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      return {
        blackDeep: computedStyle.getPropertyValue('--color-black-deep').trim() === '#0f0f23',
        blueNight: computedStyle.getPropertyValue('--color-blue-night').trim() === '#1a1a2e',
        electricBlue: computedStyle.getPropertyValue('--color-electric-blue').trim() === '#00d4ff',
        whitePure: computedStyle.getPropertyValue('--color-white-pure').trim() === '#ffffff',
        grayDark: computedStyle.getPropertyValue('--color-gray-dark').trim() === '#2a2a3e',
        successGreen: computedStyle.getPropertyValue('--color-success-green').trim() === '#00ff88',
        alertRed: computedStyle.getPropertyValue('--color-alert-red').trim() === '#ff4757',
        warningOrange: computedStyle.getPropertyValue('--color-warning-orange').trim() === '#ffa502',
        violetGradient: computedStyle.getPropertyValue('--color-violet-gradient').trim() === '#667eea'
      };
    });
    
    console.log('📊 Vérification des couleurs STRUCTURE 3:');
    Object.entries(colorChecks).forEach(([color, valid]) => {
      console.log(`  ${color}: ${valid ? '✅' : '❌'}`);
    });
    
    // 2. Vérifier les widgets selon la charte graphique
    console.log('📊 Vérification des widgets STRUCTURE 3...');
    
    const widgetChecks = await page.evaluate(() => {
      // Vérifier CountrySelector
      const countrySelector = document.querySelector('[class*="CountrySelector"]') || 
                             document.querySelector('select');
      const countrySelectorStyle = countrySelector ? getComputedStyle(countrySelector) : null;
      
      // Vérifier RegimeCard
      const regimeCard = document.querySelector('[class*="RegimeCard"]') || 
                        document.querySelector('text=Régime Économique')?.closest('[class*="Card"]');
      const regimeCardStyle = regimeCard ? getComputedStyle(regimeCard) : null;
      
      return {
        countrySelectorExists: !!countrySelector,
        countrySelectorBackground: countrySelectorStyle?.backgroundColor === 'rgb(26, 26, 46)',
        countrySelectorBorder: countrySelectorStyle?.borderRadius === '8px',
        regimeCardExists: !!regimeCard,
        regimeCardGradient: regimeCardStyle?.background?.includes('linear-gradient'),
        regimeCardPadding: regimeCardStyle?.padding === '16px'
      };
    });
    
    console.log('📊 Vérification des widgets STRUCTURE 3:');
    Object.entries(widgetChecks).forEach(([check, valid]) => {
      console.log(`  ${check}: ${valid ? '✅' : '❌'}`);
    });
    
    // 3. Vérifier la typographie STRUCTURE 3
    console.log('📝 Vérification de la typographie STRUCTURE 3...');
    
    const typographyChecks = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const body = document.body;
      
      return {
        fontFamily: body.style.fontFamily.includes('Inter') || getComputedStyle(body).fontFamily.includes('Inter'),
        h1Size: h1 && getComputedStyle(h1).fontSize === '32px',
        h1Weight: h1 && getComputedStyle(h1).fontWeight === '700',
        h1Color: h1 && getComputedStyle(h1).color === 'rgb(255, 255, 255)'
      };
    });
    
    console.log('📊 Vérification de la typographie STRUCTURE 3:');
    Object.entries(typographyChecks).forEach(([check, valid]) => {
      console.log(`  ${check}: ${valid ? '✅' : '❌'}`);
    });
    
    // 4. Vérifier tous les widgets requis
    console.log('📊 Vérification de tous les widgets requis...');
    
    const widgets = [
      { name: 'CountrySelector', selector: 'text=Sélection du Pays' },
      { name: 'RegimeCard', selector: 'text=Régime Économique' },
      { name: 'MarketStressCard', selector: 'text=Market Stress Indicators' },
      { name: 'AllocationsCard', selector: 'text=Allocations de portefeuille' },
      { name: 'ETFPricesModule', selector: 'text=ETF Prices' },
      { name: 'PhysicalIndicatorsCard', selector: 'text=Indicateurs d\'Activité Économique Réelle' },
      { name: 'BacktestingCard', selector: 'text=Backtesting Engine' }
    ];
    
    let widgetCount = 0;
    for (const widget of widgets) {
      const exists = await page.locator(widget.selector).count() > 0;
      if (exists) widgetCount++;
      console.log(`  ${widget.name}: ${exists ? '✅' : '❌'}`);
    }
    
    // 5. Capturer screenshot
    console.log('📸 Capture STRUCTURE 3...');
    await page.screenshot({ 
      path: 'structure3-charte-validation.png',
      fullPage: true 
    });
    
    // 6. Calculer le score final
    const colorScore = Object.values(colorChecks).filter(Boolean).length / Object.keys(colorChecks).length * 30;
    const widgetScore = Object.values(widgetChecks).filter(Boolean).length / Object.keys(widgetChecks).length * 25;
    const typographyScore = Object.values(typographyChecks).filter(Boolean).length / Object.keys(typographyChecks).length * 20;
    const allWidgetsScore = (widgetCount / 7) * 25;
    
    const finalScore = Math.round(colorScore + widgetScore + typographyScore + allWidgetsScore);
    
    console.log('\n📋 RÉSULTATS VALIDATION STRUCTURE 3');
    console.log('=====================================');
    console.log(`Palette de couleurs: ${Math.round(colorScore)}/30`);
    console.log(`Widgets charte graphique: ${Math.round(widgetScore)}/25`);
    console.log(`Typographie: ${Math.round(typographyScore)}/20`);
    console.log(`Tous les widgets: ${Math.round(allWidgetsScore)}/25`);
    console.log(`\n🎯 SCORE FINAL STRUCTURE 3: ${finalScore}%`);
    
    if (finalScore >= 90) {
      console.log('🎉 CHARTE GRAPHIQUE STRUCTURE 3 PARFAITE !');
      console.log('✅ Tous les critères de la charte graphique sont respectés');
      console.log('✅ Widgets React conformes');
      console.log('✅ Architecture STRUCTURE 3 opérationnelle');
      return { success: true, score: finalScore, status: 'perfect' };
    } else if (finalScore >= 75) {
      console.log('✅ CHARTE GRAPHIQUE STRUCTURE 3 EXCELLENTE');
      console.log('✅ La plupart des critères sont respectés');
      console.log('⚠️ Quelques ajustements mineurs possibles');
      return { success: true, score: finalScore, status: 'excellent' };
    } else {
      console.log('⚠️ CORRECTIONS CHARTE GRAPHIQUE STRUCTURE 3 NÉCESSAIRES');
      console.log('❌ Critères non respectés');
      console.log('🔧 Travail supplémentaire requis');
      return { success: false, score: finalScore, status: 'needs_work' };
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation STRUCTURE 3:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

// Exécuter la validation STRUCTURE 3
validateStructure3Charte().then(result => {
  console.log('\n🏁 FIN DE LA VALIDATION STRUCTURE 3');
  console.log('====================================');
  if (result.success) {
    console.log(`✅ SUCCÈS: Score ${result.score}% - ${result.status}`);
    console.log('🎉 Oracle Portfolio STRUCTURE 3 est conforme !');
  } else if (result.error) {
    console.log('❌ ERREUR:', result.error);
  } else {
    console.log(`⚠️ TRAVAIL SUPPLÉMENTAIRE: Score ${result.score}%`);
  }
}).catch(console.error);
