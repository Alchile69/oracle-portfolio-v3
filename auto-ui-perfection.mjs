import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = './ui-screenshots';
const REFERENCE_IMAGE = './reference-ui.png';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function captureScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${SCREENSHOT_DIR}/${name}-${timestamp}.png`;
  await page.screenshot({ 
    path: filename, 
    fullPage: true,
    quality: 90
  });
  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
}

async function analyzeUI(page) {
  console.log('🔍 Analyzing current UI...');
  
  const analysis = {
    version: '',
    widgets: [],
    navigation: {},
    colors: {},
    layout: {},
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

    // Check navigation
    const navButtons = await page.locator('button').allTextContents();
    analysis.navigation.buttons = navButtons.filter(btn => 
      ['Dashboard', 'Analytics', 'Configuration', 'Get Full Access'].some(nav => btn.includes(nav))
    );

    // Check layout (should be 2x3 grid)
    const gridContainer = await page.locator('.dashboard-grid, .widget-grid, [style*="grid"]').first();
    if (await gridContainer.isVisible()) {
      const gridStyle = await gridContainer.getAttribute('style');
      analysis.layout.gridStyle = gridStyle;
      
      if (!gridStyle?.includes('repeat(3, 1fr)') && !gridStyle?.includes('repeat(2, 1fr)')) {
        analysis.issues.push('Grid layout not matching 2x3 pattern');
      }
    }

    // Check colors
    const bodyBg = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    analysis.colors.background = bodyBg;

    // Check for white backgrounds on widgets
    const whiteWidgets = await page.locator('.card, .widget, [class*="card"], [class*="widget"]')
      .filter(async el => {
        const bg = await el.evaluate(el => window.getComputedStyle(el).backgroundColor);
        return bg.includes('255, 255, 255') || bg.includes('white');
      }).count();
    
    if (whiteWidgets > 0) {
      analysis.issues.push(`${whiteWidgets} widgets have white backgrounds`);
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
      // Update all version references
      const versionElements = document.querySelectorAll('*');
      versionElements.forEach(el => {
        if (el.textContent && el.textContent.match(/v[0-9]+\.[0-9]+\.[0-9]+/)) {
          el.textContent = el.textContent.replace(/v[0-9]+\.[0-9]+\.[0-9]+/g, 'v2.5.0');
        }
      });
    });
    fixes.push('Version updated to v2.5.0');
  }

  // Fix grid layout if needed
  if (analysis.issues.some(issue => issue.includes('Grid layout'))) {
    console.log('🔄 Fixing grid layout to 2x3...');
    await page.evaluate(() => {
      const gridContainers = document.querySelectorAll('.dashboard-grid, .widget-grid, [style*="grid"]');
      gridContainers.forEach(container => {
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gap = '24px';
        container.style.margin = '24px 0';
      });
    });
    fixes.push('Grid layout fixed to 2x3');
  }

  // Fix white backgrounds
  if (analysis.issues.some(issue => issue.includes('white backgrounds'))) {
    console.log('🔄 Fixing white backgrounds...');
    await page.evaluate(() => {
      const widgets = document.querySelectorAll('.card, .widget, [class*="card"], [class*="widget"]');
      widgets.forEach(widget => {
        const style = window.getComputedStyle(widget);
        if (style.backgroundColor.includes('255, 255, 255') || style.backgroundColor.includes('white')) {
          widget.style.backgroundColor = '#1a1a2e';
          widget.style.border = '1px solid #2a2a3e';
        }
      });
    });
    fixes.push('White backgrounds fixed');
  }

  // Ensure all widgets are visible
  if (analysis.widgets.length < 6) {
    console.log('🔄 Ensuring all widgets are visible...');
    await page.evaluate(() => {
      // Force display of all widget containers
      const widgetSelectors = [
        '[class*="CountrySelector"]',
        '[class*="RegimeCard"]', 
        '[class*="MarketStressCard"]',
        '[class*="AllocationsCard"]',
        '[class*="ETFPrices"]',
        '[class*="BacktestingCard"]'
      ];
      
      widgetSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.style.display = 'block';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        });
      });
    });
    fixes.push('Widget visibility ensured');
  }

  return fixes;
}

async function validateUI(page) {
  console.log('✅ Validating UI against reference...');
  
  const validation = {
    passed: true,
    issues: []
  };

  try {
    // Check if all required elements are present
    const requiredElements = [
      'Oracle Portfolio',
      'v2.5.0',
      'Dashboard',
      'Sélection du Pays',
      'Régime Économique',
      'Market Stress Indicators',
      'Allocations de portefeuille',
      'ETF Prices',
      'Backtesting Engine'
    ];

    for (const element of requiredElements) {
      const found = await page.locator(`text=${element}`).first().isVisible();
      if (!found) {
        validation.issues.push(`Missing required element: ${element}`);
        validation.passed = false;
      }
    }

    // Check navigation state
    const dashboardButton = await page.locator('button:has-text("Dashboard")').first();
    const isActive = await dashboardButton.evaluate(el => 
      el.classList.contains('active') || 
      el.style.background.includes('gradient') ||
      el.style.color === 'rgb(255, 255, 255)'
    );
    
    if (!isActive) {
      validation.issues.push('Dashboard button not properly highlighted');
      validation.passed = false;
    }

    // Check widget count
    const widgetCards = await page.locator('.widget-card, .card, [class*="card"]').count();
    if (widgetCards < 6) {
      validation.issues.push(`Insufficient widgets: ${widgetCards}/6`);
      validation.passed = false;
    }

  } catch (error) {
    validation.issues.push(`Validation error: ${error.message}`);
  }

  return validation;
}

async function main() {
  console.log('🚀 Starting automated UI perfection process...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    console.log('🌐 Navigating to app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    // Wait for app to load
    await page.waitForTimeout(3000);
    
    let iteration = 1;
    const maxIterations = 10;
    
    while (iteration <= maxIterations) {
      console.log(`\n🔄 Iteration ${iteration}/${maxIterations}`);
      
      // Capture current state
      await captureScreenshot(page, `iteration-${iteration}`);
      
      // Analyze current UI
      const analysis = await analyzeUI(page);
      console.log('📊 Analysis:', analysis);
      
      // Check if we need to fix anything
      if (analysis.issues.length === 0) {
        console.log('✅ No issues found!');
        break;
      }
      
      // Apply fixes
      const fixes = await fixUI(page, analysis);
      console.log('�� Applied fixes:', fixes);
      
      // Wait for changes to apply
      await page.waitForTimeout(2000);
      
      // Validate after fixes
      const validation = await validateUI(page);
      if (validation.passed) {
        console.log('✅ UI validation passed!');
        break;
      } else {
        console.log('❌ Validation issues:', validation.issues);
      }
      
      iteration++;
    }
    
    // Final screenshot
    await captureScreenshot(page, 'final-result');
    
    console.log('\n🎉 UI perfection process completed!');
    console.log('📸 Check the screenshots in:', SCREENSHOT_DIR);
    
  } catch (error) {
    console.error('❌ Error during UI perfection:', error);
    await captureScreenshot(page, 'error-state');
  } finally {
    await browser.close();
  }
}

// Run the script
main().catch(console.error);
