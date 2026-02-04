const { chromium } = require('playwright');

(async () => {
  console.log('🚨 URGENT RE-VERIFICATION');
  console.log('='.repeat(70) + '\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to localhost:3000 (fresh)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('✓ Page loaded\n');
  
  const sections = await page.locator('main > section').all();
  const expSection = sections[2];
  
  await expSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  console.log('✓ At Experience section\n');
  
  console.log('CHECKING FOR OVERFLOW:');
  const check = await page.evaluate(() => {
    const exp = Array.from(document.querySelectorAll('main > section'))[2];
    if (!exp) return { error: 'Not found' };
    
    const rect = exp.getBoundingClientRect();
    const style = window.getComputedStyle(exp);
    
    return {
      height_css: style.height,
      height_dom: Math.round(rect.height),
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      viewport: window.innerHeight,
      class: exp.className
    };
  });
  
  console.log('  CSS height:', check.height_css);
  console.log('  DOM height:', check.height_dom + 'px');
  console.log('  Section top:', check.top + 'px');
  console.log('  Section bottom:', check.bottom + 'px');
  console.log('  Viewport height:', check.viewport + 'px');
  console.log('  Classes:', check.class);
  
  const isOverflowing = check.height_dom > 1100;
  console.log('\n  OVERFLOW STATUS:', isOverflowing ? '⚠️  YES' : '✓ NO\n');
  
  console.log('Taking screenshot...');
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/urgent_recheck.png',
    fullPage: false
  });
  console.log('✓ Saved: urgent_recheck.png');
  
  console.log('\n' + '='.repeat(70));
  if (isOverflowing) {
    console.log('CRITICAL: Section is OVERFLOWING - height exceeds 1080px');
  } else {
    console.log('GOOD: Section fits within bounds');
  }
  console.log('='.repeat(70));
  
  await browser.close();
})();
