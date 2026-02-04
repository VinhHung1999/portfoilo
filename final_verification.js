const { chromium } = require('playwright');

(async () => {
  console.log('🎯 FINAL VERIFICATION - Inline paddingTop Fix\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  console.log('Step 1: Hard refresh (clear cache)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('✓ Hard refresh complete\n');
  
  console.log('Step 2: Navigate to Experience section...');
  const sections = await page.locator('main > section').all();
  const expSection = sections[2];
  const projSection = sections[3];
  
  await expSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  console.log('✓ At Experience section\n');
  
  console.log('Step 3: Detailed analysis...');
  const analysis = await page.evaluate(() => {
    const exp = Array.from(document.querySelectorAll('main > section'))[2];
    const proj = Array.from(document.querySelectorAll('main > section'))[3];
    const style = window.getComputedStyle(exp);
    
    let scrollContainer = null;
    let itemCount = 0;
    for (let el of exp.querySelectorAll('div')) {
      const s = window.getComputedStyle(el);
      if (s.overflowY === 'auto' || s.overflowY === 'scroll') {
        scrollContainer = el;
        itemCount = el.querySelectorAll('div[class*="relative"]').length;
        break;
      }
    }
    
    const expRect = exp.getBoundingClientRect();
    const projRect = proj.getBoundingClientRect();
    
    return {
      section_height: Math.round(expRect.height),
      section_padding_top: style.paddingTop,
      section_bottom: Math.round(expRect.bottom),
      projects_top: Math.round(projRect.top),
      overflow_detected: Math.round(expRect.bottom) > window.innerHeight + 50,
      has_scroll_container: !!scrollContainer,
      scroll_height: scrollContainer ? scrollContainer.scrollHeight : null,
      client_height: scrollContainer ? scrollContainer.clientHeight : null,
      needs_scroll: scrollContainer ? scrollContainer.scrollHeight > scrollContainer.clientHeight : false,
      item_count: itemCount
    };
  });
  
  console.log('SECTION METRICS:');
  console.log('  Height: ' + analysis.section_height + 'px');
  console.log('  Padding-top: ' + analysis.section_padding_top);
  console.log('  Section bottom: ' + analysis.section_bottom + 'px');
  console.log('  Projects top: ' + analysis.projects_top + 'px');
  console.log('  OVERFLOW: ' + (analysis.overflow_detected ? '❌ YES' : '✅ NO') + '\n');
  
  console.log('SCROLLABLE CONTAINER:');
  console.log('  Found: ' + (analysis.has_scroll_container ? 'YES' : 'NO'));
  console.log('  Scroll height: ' + (analysis.scroll_height ? analysis.scroll_height + 'px' : 'N/A'));
  console.log('  Client height: ' + (analysis.client_height ? analysis.client_height + 'px' : 'N/A'));
  console.log('  Needs scroll: ' + (analysis.needs_scroll ? '✅ YES' : '❌ NO') + '\n');
  
  console.log('Step 4: Taking screenshot...');
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/final_verify.png',
    fullPage: false
  });
  console.log('✓ Screenshot: final_verify.png\n');
  
  console.log('Step 5: Scroll to bottom to show all items...');
  await expSection.evaluate((el) => {
    for (let c of el.querySelectorAll('div')) {
      if (window.getComputedStyle(c).overflowY === 'auto') {
        c.scrollTop = c.scrollHeight;
        break;
      }
    }
  });
  await page.waitForTimeout(800);
  
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/final_scrolled.png',
    fullPage: false
  });
  console.log('✓ Screenshot after scroll: final_scrolled.png\n');
  
  console.log('='.repeat(70));
  console.log('✅ VERIFICATION RESULTS');
  console.log('='.repeat(70) + '\n');
  
  console.log('CHECKLIST:');
  console.log('  ' + (analysis.section_padding_top === '64px' ? '✅' : '❌') + ' 64px padding-top: ' + analysis.section_padding_top);
  console.log('  ' + (!analysis.overflow_detected ? '✅' : '❌') + ' No overflow into Projects');
  console.log('  ' + (analysis.needs_scroll ? '✅' : '❌') + ' Scrollbar visible (content overflows)');
  console.log('  ' + (analysis.section_height === 1080 ? '✅' : '❌') + ' Section height 1080px');
  console.log('  ✅ Screenshots captured (2 images)\n');
  
  if (analysis.section_padding_top === '64px' && !analysis.overflow_detected && analysis.needs_scroll) {
    console.log('🎉 ALL CHECKS PASSED - Fix is working!');
  } else {
    console.log('⚠️  Some checks failed - review above');
  }
  
  await browser.close();
})();
