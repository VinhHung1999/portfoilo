const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  console.log('📸 Navigating to localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('🔍 Scrolling to Experience section...');
  await page.evaluate('window.scrollTo(0, 0)');
  await page.waitForTimeout(300);
  
  const expSection = page.locator('*').filter({ hasText: 'Experience' }).first();
  if (await expSection.isVisible()) {
    await expSection.evaluate((el) => el.scrollIntoView());
    await page.waitForTimeout(800);
    console.log('✓ Experience section found and scrolled into view');
  } else {
    console.log('✗ Experience section not visible');
    await browser.close();
    process.exit(1);
  }
  
  // Take screenshot
  const screenshotPath = '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/scrollbar_visual_check.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`✓ Screenshot saved: ${screenshotPath}`);
  
  // Detailed inspection
  const info = await page.evaluate(() => {
    const exp = Array.from(document.querySelectorAll('*')).find(el =>
      el.textContent.includes('Experience') && el.textContent.includes('company')
    );
    
    if (!exp) return { error: "Section not found" };
    
    const scrollContainer = exp.querySelector('[class*="overflow-y"]') || 
                          Array.from(exp.querySelectorAll('*')).find(el => {
                              const style = window.getComputedStyle(el);
                              return style.overflowY === 'auto' || style.overflowY === 'scroll';
                          });
    
    return {
      section_top: exp.getBoundingClientRect().top,
      section_height: exp.getBoundingClientRect().height,
      has_scroll_element: !!scrollContainer,
      scroll_height: scrollContainer ? scrollContainer.scrollHeight : null,
      client_height: scrollContainer ? scrollContainer.clientHeight : null,
      needs_scroll: scrollContainer ? scrollContainer.scrollHeight > scrollContainer.clientHeight : false,
      overflow_y: scrollContainer ? window.getComputedStyle(scrollContainer).overflowY : 'none'
    };
  });
  
  console.log('\n📊 INSPECTION RESULTS:');
  console.log('================================');
  console.log('Section Top:', info.section_top, 'px');
  console.log('Section Height:', info.section_height, 'px');
  console.log('Scroll container found:', info.has_scroll_element);
  console.log('Scroll Height:', info.scroll_height, 'px');
  console.log('Client Height:', info.client_height, 'px');
  console.log('Content overflows (needs scroll):', info.needs_scroll);
  console.log('Overflow-Y CSS:', info.overflow_y);
  
  console.log('\n' + '='.repeat(60));
  console.log('VISUAL VERIFICATION REQUIRED:');
  console.log('='.repeat(60));
  
  if (info.needs_scroll) {
    console.log('\n✅ CONTENT SHOULD OVERFLOW - SCROLLBAR SHOULD BE VISIBLE');
  } else {
    console.log('\n⚠️  WARNING: Content does NOT overflow - scrollbar may NOT appear');
  }
  
  console.log('\nCheck screenshot at:');
  console.log(screenshotPath);
  console.log('\nLook for:');
  console.log('1️⃣  PURPLE/VIOLET scrollbar on the right side');
  console.log('2️⃣  Scrollbar color should be #7B337D (Deep Space Violet)');
  console.log('3️⃣  Smooth scrolling when moving through experience items');
  
  await browser.close();
})();
