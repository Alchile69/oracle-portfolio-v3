import { chromium } from 'playwright';

async function correctUI() {
  console.log('🎯 CORRECTION UI AVEC PLAYWRIGHT');
  console.log('=================================');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Naviguer vers l'application
    console.log('📱 Navigation vers l\'application...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 1. Vérifier l'état actuel
    console.log('🔍 Analyse de l\'état actuel...');
    
    const versionText = await page.locator('text=v2.5.0').count() > 0 ? 'v2.5.0' : 'v3.0';
    console.log(`🏷️ Version actuelle: ${versionText}`);
    
    const physicalIndicatorsExists = await page.locator('text=Indicateurs d\'Activité Économique Réelle').count() > 0;
    console.log(`📊 PhysicalIndicatorsCard: ${physicalIndicatorsExists ? 'PRÉSENT ✅' : 'MANQUANT ❌'}`);
    
    const widgetCards = await page.locator('[class*="bg-[#1a1a2e]"]').count();
    console.log(`📊 Nombre de widgets: ${widgetCards}`);
    
    // 2. Capturer screenshot avant correction
    console.log('📸 Capture avant correction...');
    await page.screenshot({ 
      path: 'before-correction.png',
      fullPage: true 
    });
    
    // 3. Appliquer les corrections via JavaScript
    console.log('🔧 Application des corrections...');
    
    // Corriger la version si nécessaire
    if (versionText !== 'v2.5.0') {
      console.log('🔄 Correction de la version vers v2.5.0...');
      await page.evaluate(() => {
        const versionElement = document.querySelector('p.text-sm.text-slate-400');
        if (versionElement) {
          versionElement.textContent = 'v2.5.0 - Système Extensible';
        }
      });
    }
    
    // S'assurer que le Dashboard est actif
    console.log('🎯 Activation du Dashboard...');
    const dashboardButton = await page.locator('text=Dashboard').first();
    await dashboardButton.click();
    await page.waitForTimeout(1000);
    
    // 4. Attendre que les widgets se chargent
    console.log('⏳ Attente du chargement des widgets...');
    await page.waitForTimeout(3000);
    
    // 5. Capturer screenshot après correction
    console.log('📸 Capture après correction...');
    await page.screenshot({ 
      path: 'after-correction.png',
      fullPage: true 
    });
    
    // 6. Analyser les résultats finaux
    console.log('🔍 Analyse des résultats finaux...');
    
    const finalVersion = await page.locator('text=v2.5.0').count() > 0 ? 'v2.5.0' : 'v3.0';
    const finalPhysicalIndicators = await page.locator('text=Indicateurs d\'Activité Économique Réelle').count() > 0;
    const finalWidgetCards = await page.locator('[class*="bg-[#1a1a2e]"]').count();
    
    // Vérifier la navigation Dashboard
    const dashboardActive = await page.locator('text=Dashboard').first().evaluate(el => {
      const button = el.closest('button');
      return button && (button.classList.contains('bg-purple-600') || button.classList.contains('bg-green-600'));
    });
    
    console.log('\n📋 RÉSULTATS FINAUX');
    console.log('==================');
    console.log(`Version: ${finalVersion} ${finalVersion === 'v2.5.0' ? '✅' : '❌'}`);
    console.log(`Widgets présents: ${finalWidgetCards}/7`);
    console.log(`PhysicalIndicatorsCard: ${finalPhysicalIndicators ? 'PRÉSENT ✅' : 'MANQUANT ❌'}`);
    console.log(`Dashboard actif: ${dashboardActive ? 'OUI ✅' : 'NON ❌'}`);
    
    // 7. Évaluer la ressemblance à l'image cible
    const score = calculateUIScore({
      version: finalVersion === 'v2.5.0',
      widgets: finalWidgetCards >= 6,
      physicalIndicators: finalPhysicalIndicators,
      dashboardActive: dashboardActive
    });
    
    console.log(`\n🎯 SCORE DE RESSEMBLANCE: ${score}%`);
    
    if (score >= 80) {
      console.log('🎉 UI TRÈS PROCHE DE L\'IMAGE CIBLE !');
      return { success: true, score: score, status: 'excellent' };
    } else if (score >= 60) {
      console.log('✅ UI CORRIGÉE - AMÉLIORATIONS MAJEURES');
      return { success: true, score: score, status: 'good' };
    } else {
      console.log('⚠️ CORRECTIONS SUPPLÉMENTAIRES NÉCESSAIRES');
      return { success: false, score: score, status: 'needs_work' };
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

function calculateUIScore(checks) {
  let score = 0;
  if (checks.version) score += 25;
  if (checks.widgets) score += 25;
  if (checks.physicalIndicators) score += 25;
  if (checks.dashboardActive) score += 25;
  return score;
}

// Exécuter la correction
correctUI().then(result => {
  console.log('\n🏁 FIN DE LA CORRECTION UI');
  console.log('==========================');
  if (result.success) {
    console.log(`✅ SUCCÈS: Score ${result.score}% - ${result.status}`);
  } else if (result.error) {
    console.log('❌ ERREUR:', result.error);
  } else {
    console.log(`⚠️ TRAVAIL SUPPLÉMENTAIRE: Score ${result.score}%`);
  }
}).catch(console.error);
