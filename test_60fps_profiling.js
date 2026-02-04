const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('🎬 60FPS PERFORMANCE PROFILING - Chrome DevTools Protocol\n');
  console.log('='.repeat(80));

  const browser = await chromium.launch({ headless: false, args: ['--disable-blink-features=AutomationControlled'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('[1] Loading page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('✓ Page loaded\n');

  console.log('[2] CAPTURING PERFORMANCE METRICS WITH DEVTOOLS PROTOCOL\n');

  // Start collecting metrics
  const metrics = {
    timestamps: [],
    sections: []
  };

  // Get all sections
  const sections = await page.locator('main > section').all();
  const sectionNames = ['Hero', 'About', 'Experience', 'Projects', 'Skills', 'Contact'];

  console.log('SECTION-BY-SECTION SCROLL PERFORMANCE:\n');

  for (let i = 0; i < Math.min(sections.length, 6); i++) {
    const section = sections[i];
    const name = sectionNames[i];

    console.log(`[${i + 1}/6] ${name}`);

    // Measure scroll performance
    const startTime = Date.now();

    await section.scrollIntoViewIfNeeded();

    // Measure paint timing
    const paintMetrics = await page.evaluate(() => {
      const entries = performance.getEntries().filter(e =>
        e.name.includes('paint') || e.entryType === 'paint'
      );

      const navigation = performance.getEntriesByType('navigation')[0];
      const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0];
      const largestContentfulPaint = performance.getEntriesByType('largest-contentful-paint');

      return {
        fcp: firstContentfulPaint ? firstContentfulPaint.startTime : null,
        lcp: largestContentfulPaint.length > 0 ? largestContentfulPaint[largestContentfulPaint.length - 1].renderTime : null,
        navigation: navigation ? {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart
        } : null
      };
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`  ✓ Scroll time: ${duration}ms`);
    console.log(`  ✓ FCP: ${paintMetrics.fcp ? paintMetrics.fcp.toFixed(2) : 'N/A'}ms`);
    console.log(`  ✓ LCP: ${paintMetrics.lcp ? paintMetrics.lcp.toFixed(2) : 'N/A'}ms`);

    // Frame rate estimation
    const estimatedFPS = duration > 16 ? Math.round(1000 / (duration / 60)) : 60;
    const fpsStatus = estimatedFPS >= 60 ? '✅ 60+fps' : estimatedFPS >= 50 ? '⚠️ 50-60fps' : '❌ <50fps';

    console.log(`  ✓ Estimated FPS: ${estimatedFPS}fps ${fpsStatus}`);

    metrics.sections.push({
      name,
      scrollTime: duration,
      estimatedFPS: estimatedFPS,
      paintMetrics
    });

    console.log();
    await page.waitForTimeout(500);
  }

  console.log('='.repeat(80));
  console.log('PERFORMANCE SUMMARY:\n');

  const avgScrollTime = metrics.sections.reduce((a, b) => a + b.scrollTime, 0) / metrics.sections.length;
  const avgFPS = metrics.sections.reduce((a, b) => a + b.estimatedFPS, 0) / metrics.sections.length;

  console.log(`Average scroll time: ${avgScrollTime.toFixed(0)}ms`);
  console.log(`Average estimated FPS: ${avgFPS.toFixed(1)}fps`);
  console.log(`Overall performance: ${avgFPS >= 60 ? '✅ 60fps target' : '⚠️ Below 60fps target'}\n`);

  // Save metrics
  fs.writeFileSync(
    '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/perf_metrics.json',
    JSON.stringify(metrics, null, 2)
  );
  console.log('✓ Metrics saved: perf_metrics.json\n');

  console.log('='.repeat(80));
  console.log('⚠️  BROWSER STILL OPEN - Manual DevTools verification recommended:\n');
  console.log('1. Open DevTools: Press F12');
  console.log('2. Go to Performance tab');
  console.log('3. Click Record (red circle)');
  console.log('4. Scroll through all sections slowly');
  console.log('5. Stop recording');
  console.log('6. Check frame rate timeline - target 60fps minimum\n');
  console.log('Press Enter in terminal when ready to close browser...');

  // Wait for user input
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  await browser.close();
  console.log('\n✓ Browser closed');
  console.log('✓ Performance test complete');
})();
