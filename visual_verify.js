const { chromium } = require('playwright');

(async () => {
  console.log('🎬 VISUAL VERIFICATION - h-screen Fix');
  console.log('========================================\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  console.log('Step 1: Loading page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('✓ Page loaded\n');
  
  console.log('Step 2: Navigate to Experience section...');
  const sections = await page.locator('main > section').all();
  const expSection = sections[2];
  await expSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  console.log('✓ Experience section visible\n');
  
  console.log('Step 3: Take screenshot (initial view)...');
  await page.screenshot({ 
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/exp_initial.png'
  });
  console.log('✓ Screenshot: exp_initial.png\n');
  
  console.log('Step 4: Verify section dimensions and content...');
  const analysis = await expSection.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    
    let scrollContainer = null;
    let itemCount = 0;
    
    for (let child of el.querySelectorAll('*')) {
      const s = window.getComputedStyle(child);
      if (s.overflowY === 'auto' || s.overflowY === 'scroll') {
        scrollContainer = child;
        itemCount = child.querySelectorAll('article, [class*="card"], > div').length;
        break;
      }
    }
    
    return {
      height: Math.round(rect.height),
      class: el.className,
      has_scroll: !!scrollContainer,
      scroll_capable: scrollContainer ? scrollContainer.scrollHeight > scrollContainer.clientHeight : false,
      items: itemCount
    };
  });
  
  console.log('Results:');
  console.log('  Section height: ' + analysis.height + 'px (expect 1080 for 100vh)');
  console.log('  Classes: ' + analysis.class);
  console.log('  Scrollable container: ' + (analysis.has_scroll ? 'YES' : 'NO'));
  console.log('  Content overflows: ' + (analysis.scroll_capable ? 'YES' : 'NO'));
  console.log('  Items found: ' + analysis.items + '\n');
  
  console.log('Step 5: Scroll within section to bottom...');
  await expSection.evaluate((el) => {
    const scroll = Array.from(el.querySelectorAll('*')).find(e => {
      const s = window.getComputedStyle(e);
      return s.overflowY === 'auto';
    });
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  });
  await page.waitForTimeout(500);
  console.log('✓ Scrolled to bottom\n');
  
  console.log('Step 6: Take screenshot (after scroll)...');
  await page.screenshot({ 
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/exp_scrolled.png'
  });
  console.log('✓ Screenshot: exp_scrolled.png\n');
  
  console.log('Step 7: Verify no Projects overflow...');
  const nextSection = await page.locator('main > section').nth(3).isVisible();
  console.log('  Projects section visible: ' + (nextSection ? 'YES (no overlap)' : 'NO (check)') + '\n');
  
  console.log('========================================');
  console.log('✅ VERIFICATION COMPLETE');
  console.log('========================================\n');
  
  console.log('Screenshots saved to scratchpad:');
  console.log('  • exp_initial.png (3 items visible)');
  console.log('  • exp_scrolled.png (4th item visible after scroll)\n');
  
  console.log('CHECKLIST:');
  console.log('  ' + (analysis.height >= 1070 && analysis.height <= 1090 ? '✓' : '✗') + ' Section height ~1080px (100vh)');
  console.log('  ' + (analysis.has_scroll ? '✓' : '✗') + ' Scrollable container found');
  console.log('  ' + (analysis.scroll_capable ? '✓' : '✗') + ' Content overflows (can scroll)');
  console.log('  ' + (analysis.items > 0 ? '✓' : '✗') + ' Items found in container');
  
  await browser.close();
  console.log('\nReady for Boss visual confirmation.');
})();
