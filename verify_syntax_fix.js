const { chromium } = require('playwright');

(async () => {
  console.log('🎯 VERIFICATION - Syntax Fix (2bd87f0)\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ 
    viewport: { width: 1920, height: 1080 },
    javaScriptEnabled: true
  });
  
  console.log('[1] Hard refresh with cache clear...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('✓ Fresh load complete\n');
  
  const sections = await page.locator('main > section').all();
  await sections[2].scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  
  console.log('[2] Detailed analysis...');
  const check = await page.evaluate(() => {
    const exp = Array.from(document.querySelectorAll('main > section'))[2];
    const style = window.getComputedStyle(exp);
    
    let scroll = null;
    let itemCount = 0;
    for (let el of exp.querySelectorAll('div')) {
      const s = window.getComputedStyle(el);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.offsetHeight > 100) {
        scroll = el;
        itemCount = el.querySelectorAll('[class*="relative"]').length;
        break;
      }
    }
    
    const expRect = exp.getBoundingClientRect();
    
    return {
      exp_height: Math.round(expRect.height),
      padding_top: style.paddingTop,
      has_scroll: !!scroll,
      scroll_height: scroll ? scroll.scrollHeight : 0,
      scroll_client: scroll ? scroll.clientHeight : 0,
      can_scroll: scroll ? scroll.scrollHeight > scroll.clientHeight : false,
      items: itemCount
    };
  });
  
  console.log('ANALYSIS:');
  console.log('  Section height: ' + check.exp_height + 'px');
  console.log('  Padding-top: ' + check.padding_top);
  console.log('  Scroll container: ' + (check.has_scroll ? 'FOUND' : 'NOT FOUND'));
  if (check.has_scroll) {
    console.log('  Scroll height: ' + check.scroll_height + 'px');
    console.log('  Client height: ' + check.scroll_client + 'px');
    console.log('  Can scroll: ' + (check.can_scroll ? '✅ YES' : '❌ NO'));
  }
  console.log('  Items: ' + check.items + '\n');
  
  console.log('[3] Screenshot initial...');
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/syntax_fix_1.png'
  });
  
  console.log('[4] Scroll to bottom...');
  await sections[2].evaluate((el) => {
    for (let c of el.querySelectorAll('div')) {
      if ((window.getComputedStyle(c).overflowY === 'auto' || 
            window.getComputedStyle(c).overflowY === 'scroll') && c.offsetHeight > 100) {
        c.scrollTop = c.scrollHeight;
        break;
      }
    }
  });
  await page.waitForTimeout(800);
  
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/syntax_fix_2.png'
  });
  console.log('✓ Screenshots saved\n');
  
  console.log('='.repeat(70));
  console.log('RESULTS:');
  console.log('='.repeat(70));
  console.log('  ' + (check.padding_top === '64px' ? '✅' : '⚠️') + ' Padding 64px: ' + check.padding_top);
  console.log('  ' + (check.exp_height === 1080 ? '✅' : '⚠️') + ' Height 1080px: ' + check.exp_height);
  console.log('  ' + (check.has_scroll ? '✅' : '❌') + ' Scroll container found');
  console.log('  ' + (check.can_scroll ? '✅' : '❌') + ' Content scrollable');
  
  const allGood = check.padding_top === '64px' && check.has_scroll && check.can_scroll && check.exp_height === 1080;
  console.log('\n' + (allGood ? '🎉 SUCCESS!' : '⚠️ Issues detected'));
  console.log('='.repeat(70));
  
  await browser.close();
})();
