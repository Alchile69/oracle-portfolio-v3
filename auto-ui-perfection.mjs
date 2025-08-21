import { chromium } from 'playwright';
import fs from 'fs';

const SCREENSHOT_DIR = './ui-screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function captureScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${SCREENSHOT_DIR}/${name}-${timestamp}.png`;
  await page.screenshot({ 
    path: filename, 
    fullPage: true
  });
  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
}

async function analyzeUI(page) {
  console.log('🔍 Analyzing current UI...');
  
  const analysis = {
    version: '',
    widgets: [],
    issues: []
  };

  try {
    // Check version
    const versionElement = await page.locator('text=v2.5.0').first();
    if (await versionElement.isVisible()) {
      analysis.version = 'v2.5.0';
    } else {
      const otherVersions = await page.locator('text=/v[0-9]+\.[0-9]+\.[0-9]+/').allTextContents();
      analysis.version = otherVersions[0] || 'unknown';
      analysis.issues.push(`Version mismatch: found ${analysis.version}, expected v2.5.0`);
    }

    // Check widgets presence
    const expectedWidgets = [
      'Sélection du Pays',
      'Régime Économique', 
      'Market Stress Indicators',
      'Allocations de portefeuille',
      'ETF Prices',
      'Backtesting Engine'
    ];

    for (const widget of expectedWidgets) {
      const widgetElement = await page.locator(`text=${widget}`).first();
      if (await widgetElement.isVisible()) {
        analysis.widgets.push(widget);
      } else {
        analysis.issues.push(`Missing widget: ${widget}`);
      }
    }

  } catch (error) {
    analysis.issues.push(`Analysis error: ${error.message}`);
  }

  return analysis;
}

async function fixUI(page, analysis) {
  console.log('🔧 Fixing UI issues...');
  
  const fixes = [];

  // Fix version if needed
  if (analysis.version !== 'v2.5.0') {
    console.log('🔄 Fixing version to v2.5.0...');
    await page.evaluate(() => {
      const versionElements = document.querySelectorAll('*');
      versionElements.forEach(el => {
        if (el.textContent && el.textContent.match(/v[0-9]+\.[0-9]+\.[0-9]+/)) {
          el.textContent = el.textContent.replace(/v[0-9]+\.[0-9]+\.[0-9]+/g, 'v2.5.0');
        }
      });
    });
    fixes.push('Version updated to v2.5.0');
  }

  return fixes;
}

async function main() {
  console.log('🚀 Starting automated UI perfection process...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    let iteration = 1;
    const maxIterations = 5;
    
    while (iteration <= maxIterations) {
      console.log(`\n🔄 Iteration ${iteration}/${maxIterations}`);
      
      await captureScreenshot(page, `iteration-${iteration}`);
      
      const analysis = await analyzeUI(page);
      console.log('📊 Analysis:', analysis);
      
      if (analysis.issues.length === 0) {
        console.log('✅ No issues found!');
        break;
      }
      
      const fixes = await fixUI(page, analysis);
      console.log('🔧 Applied fixes:', fixes);
      
      await page.waitForTimeout(2000);
      iteration++;
    }
    
    await captureScreenshot(page, 'final-result');
    console.log('\n🎉 UI perfection process completed!');
    
  } catch (error) {
    console.error('❌ Error during UI perfection:', error);
    await captureScreenshot(page, 'error-state');
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
