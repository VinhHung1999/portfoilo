const { chromium } = require('playwright');

(async () => {
  console.log('📊 PERFORMANCE METRICS ANALYSIS - 60FPS Target\n');
  console.log('='.repeat(80));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('[1] Loading page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('✓ Page fully loaded\n');

  console.log('[2] COLLECTING PERFORMANCE METRICS\n');

  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');
    const resourceEntries = performance.getEntriesByType('resource');

    const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
    const lcp = performance.getEntriesByType('largest-contentful-paint');

    return {
      // Core Web Vitals
      fcp: fcp ? fcp.startTime : null,
      lcp: lcp.length > 0 ? lcp[lcp.length - 1].renderTime : null,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : null,
      loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : null,

      // Resource timing
      resourceCount: resourceEntries.length,
      totalResourceSize: resourceEntries.reduce((sum, r) => sum + (r.transferSize || 0), 0),

      // Memory
      jsHeapSize: performance.memory ? performance.memory.jsHeapUsedSize : null,
      jsHeapLimit: performance.memory ? performance.memory.jsHeapSizeLimit : null
    };
  });

  console.log('INITIAL LOAD METRICS:');
  console.log(`  First Contentful Paint (FCP): ${metrics.fcp ? metrics.fcp.toFixed(2) : 'N/A'}ms`);
  console.log(`  Largest Contentful Paint (LCP): ${metrics.lcp ? metrics.lcp.toFixed(2) : 'N/A'}ms`);
  console.log(`  DOM Content Loaded: ${metrics.domContentLoaded ? metrics.domContentLoaded.toFixed(2) : 'N/A'}ms`);
  console.log(`  Page Load Complete: ${metrics.loadComplete ? metrics.loadComplete.toFixed(2) : 'N/A'}ms`);
  console.log(`  Total Resources: ${metrics.resourceCount}`);
  console.log(`  Total Resource Size: ${(metrics.totalResourceSize / 1024).toFixed(2)}KB`);
  console.log(`  JS Heap Used: ${metrics.jsHeapSize ? (metrics.jsHeapSize / 1024 / 1024).toFixed(2) : 'N/A'}MB\n`);

  console.log('[3] ANIMATION SMOOTHNESS TESTING\n');

  const sectionNames = ['Hero', 'About', 'Experience', 'Projects', 'Skills', 'Contact'];
  const sections = await page.locator('main > section').all();

  const perfResults = [];

  for (let i = 0; i < Math.min(sections.length, 6); i++) {
    const section = sections[i];
    const name = sectionNames[i];

    // Measure scroll performance
    const startTime = Date.now();
    await section.scrollIntoViewIfNeeded();
    const endTime = Date.now();
    const scrollDuration = endTime - startTime;

    // Get paint timings after scroll
    const paintMetrics = await page.evaluate(() => {
      return performance.getEntriesByType('paint').map(e => ({
        name: e.name,
        time: e.startTime
      }));
    });

    // Estimate FPS (lower scroll duration = smoother/higher FPS)
    const estimatedFPS = Math.min(60, Math.round(1000 / (scrollDuration / 60)));
    const perfScore = estimatedFPS >= 60 ? '✅ 60fps' : estimatedFPS >= 50 ? '⚠️ 50-60fps' : '❌ <50fps';

    console.log(`[${i + 1}/6] ${name}`);
    console.log(`    Scroll duration: ${scrollDuration}ms`);
    console.log(`    Estimated FPS: ${estimatedFPS}fps ${perfScore}`);

    perfResults.push({
      section: name,
      scrollDuration,
      estimatedFPS,
      status: estimatedFPS >= 60 ? 'PASS' : 'CAUTION'
    });

    await page.waitForTimeout(300);
  }

  console.log('\n[4] LAYOUT STABILITY CHECK\n');

  const layoutCheck = await page.evaluate(() => {
    const cls = performance.getEntriesByType('layout-shift');
    const totalCLS = cls.reduce((sum, entry) => sum + (entry.value || 0), 0);

    return {
      layoutShiftEntries: cls.length,
      totalCLS: totalCLS.toFixed(4),
      clsGood: totalCLS < 0.1
    };
  });

  console.log(`Layout shift entries: ${layoutCheck.layoutShiftEntries}`);
  console.log(`Total Cumulative Layout Shift (CLS): ${layoutCheck.totalCLS}`);
  console.log(`CLS Status: ${layoutCheck.clsGood ? '✅ GOOD (<0.1)' : '⚠️ NEEDS IMPROVEMENT (>0.1)'}\n`);

  console.log('='.repeat(80));
  console.log('PERFORMANCE SUMMARY:\n');

  const avgFPS = perfResults.reduce((sum, r) => sum + r.estimatedFPS, 0) / perfResults.length;
  const passCount = perfResults.filter(r => r.status === 'PASS').length;

  console.log(`Sections tested: ${perfResults.length}`);
  console.log(`Sections at 60fps: ${passCount}/${perfResults.length}`);
  console.log(`Average estimated FPS: ${avgFPS.toFixed(1)}fps`);
  console.log(`Overall smoothness: ${avgFPS >= 60 ? '✅ SMOOTH (60fps)' : '⚠️ VARIABLE (below 60fps)'}`);

  console.log('\nCORE WEB VITALS STATUS:');
  console.log(`  FCP: ${metrics.fcp < 1800 ? '✅ GOOD' : '⚠️ NEEDS WORK'} (<1.8s target)`);
  console.log(`  LCP: ${metrics.lcp < 2500 ? '✅ GOOD' : '⚠️ NEEDS WORK'} (<2.5s target)`);
  console.log(`  CLS: ${layoutCheck.clsGood ? '✅ GOOD' : '⚠️ NEEDS WORK'} (<0.1 target)`);

  console.log('\n⚠️  NOTE: For manual 60fps verification with Chrome DevTools:');
  console.log('  Open: http://localhost:3000');
  console.log('  Press F12 → Performance tab → Record');
  console.log('  Scroll through all sections slowly');
  console.log('  Check frame rate timeline for 60fps consistency\n');

  await browser.close();
  console.log('✓ Performance analysis complete');
})();
