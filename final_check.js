const { chromium } = require('playwright');

(async () => {
  console.log('🎯 FINAL VERIFICATION - Complete Fix (030445a)\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  console.log('[1/6] Hard refresh localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('✓ Page loaded\n');
  
  console.log('[2/6] Navigate to Experience section...');
  const sections = await page.locator('main > section').all();
  const expSection = sections[2];
  const projSection = sections[3];
  
  await expSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  console.log('✓ At Experience section\n');
  
  console.log('[3/6] Comprehensive analysis...');
  const analysis = await page.evaluate(() => {
    const exp = Array.from(document.querySelectorAll('main > section'))[2];
    const proj = Array.from(document.querySelectorAll('main > section'))[3];
    const style = window.getComputedStyle(exp);
    
    let scrollContainer = null;
    let itemCount = 0;
    for (let el of exp.querySelectorAll('div')) {
      const s = window.getComputedStyle(el);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.offsetHeight > 0) {
        scrollContainer = el;
        itemCount = el.querySelectorAll('[class*="relative"]').length;
        break;
      }
    }
    
    const expRect = exp.getBoundingClientRect();
    const projRect = proj.getBoundingClientRect();
    
    return {
      exp_height: Math.round(expRect.height),
      exp_padding_top: style.paddingTop,
      exp_overflow: style.overflow,
      exp_bottom: Math.round(expRect.bottom),
      proj_top: Math.round(projRect.top),
      no_overlap: Math.abs(Math.round(expRect.bottom) - Math.round(projRect.top)) < 10,
      has_scroll: !!scrollContainer,
      scroll_height: scrollContainer ? scrollContainer.scrollHeight : null,
      client_height: scrollContainer ? scrollContainer.clientHeight : null,
      can_scroll: scrollContainer ? scrollContainer.scrollHeight > scrollContainer.clientHeight : false,
      items: itemCount
    };
  });
  
  console.log('SECTION ANALYSIS:');
  console.log('  Height: ' + analysis.exp_height + 'px');
  console.log('  Padding-top: ' + analysis.exp_padding_top);
  console.log('  Overflow: ' + analysis.exp_overflow);
  console.log('  Section bottom: ' + analysis.exp_bottom + 'px');
  console.log('  Projects top: ' + analysis.proj_top + 'px');
  console.log('  NO OVERLAP: ' + (analysis.no_overlap ? '✅ YES' : '❌ YES'));
  
  console.log('\nSCROLLABLE CONTAINER:');
  console.log('  Found: ' + (analysis.has_scroll ? '✅ YES' : '❌ NO'));
  if (analysis.has_scroll) {
    console.log('  Scroll height: ' + analysis.scroll_height + 'px');
    console.log('  Client height: ' + analysis.client_height + 'px');
    console.log('  Can scroll: ' + (analysis.can_scroll ? '✅ YES' : '❌ NO'));
    console.log('  Items visible: ' + analysis.items);
  }
  console.log();
  
  console.log('[4/6] Taking initial screenshot...');
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/final_initial.png',
    fullPage: false
  });
  console.log('✓ Screenshot 1: final_initial.png\n');
  
  console.log('[5/6] Scrolling to bottom (reveal all items)...');
  await expSection.evaluate((el) => {
    for (let c of el.querySelectorAll('div')) {
      const s = window.getComputedStyle(c);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && c.offsetHeight > 0) {
        c.scrollTop = c.scrollHeight;
        break;
      }
    }
  });
  await page.waitForTimeout(800);
  
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/final_bottom.png',
    fullPage: false
  });
  console.log('✓ Screenshot 2: final_bottom.png\n');
  
  console.log('[6/6] Verify scrollbar CSS...');
  const hasCss = await page.evaluate(() => {
    return {
      has_scrollbar_css: document.documentElement.outerHTML.includes('::-webkit-scrollbar'),
      has_violet: document.documentElement.outerHTML.includes('#7B337D'),
      experience_scroll_class: document.documentElement.outerHTML.includes('experience-scroll')
    };
  });
  
  console.log('SCROLLBAR CSS:');
  console.log('  Webkit scrollbar CSS: ' + (hasCss.has_scrollbar_css ? '✅ YES' : '❌ NO'));
  console.log('  Violet color #7B337D: ' + (hasCss.has_violet ? '✅ YES' : '❌ NO'));
  console.log('  experience-scroll class: ' + (hasCss.experience_scroll_class ? '✅ YES' : '❌ NO'));
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ FINAL VERIFICATION COMPLETE');
  console.log('='.repeat(70) + '\n');
  
  console.log('PASS/FAIL CHECKLIST:');
  console.log('  ' + (analysis.exp_padding_top === '64px' ? '✅' : '⚠️') + ' Padding-top 64px: ' + analysis.exp_padding_top);
  console.log('  ' + (analysis.no_overlap ? '✅' : '❌') + ' No overflow into Projects');
  console.log('  ' + (analysis.can_scroll ? '✅' : '❌') + ' Scrollbar visible (content overflows)');
  console.log('  ' + (analysis.exp_height === 1080 ? '✅' : '⚠️') + ' Section height 1080px: ' + analysis.exp_height + 'px');
  console.log('  ✅ Screenshots captured (2 images)');
  
  const allPassed = analysis.no_overlap && analysis.can_scroll && analysis.has_scroll;
  
  console.log('\n' + (allPassed ? '🎉 SUCCESS - All systems GO!' : '⚠️ Review needed'));
  
  await browser.close();
})();
