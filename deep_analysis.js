const { chromium } = require('playwright');

(async () => {
  console.log('🔬 DEEP ANALYSIS - Scrollable Container Check\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  const sections = await page.locator('main > section').all();
  await sections[2].scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  
  console.log('SECTION vs SCROLLABLE CONTAINER Analysis:\n');
  
  const analysis = await page.evaluate(() => {
    const exp = Array.from(document.querySelectorAll('main > section'))[2];
    const style = window.getComputedStyle(exp);
    
    let scrollContainer = null;
    for (let el of exp.querySelectorAll('*')) {
      const s = window.getComputedStyle(el);
      if (s.overflowY === 'auto' || s.overflowY === 'scroll') {
        scrollContainer = el;
        break;
      }
    }
    
    const expRect = exp.getBoundingClientRect();
    const scrollRect = scrollContainer ? scrollContainer.getBoundingClientRect() : null;
    
    return {
      section: {
        height_css: style.height,
        height_dom: Math.round(expRect.height),
        padding_top: style.paddingTop,
        margin_top: style.marginTop
      },
      scroll_container: scrollContainer ? {
        height_dom: Math.round(scrollRect.height),
        scroll_height: scrollContainer.scrollHeight,
        client_height: scrollContainer.clientHeight,
        can_scroll: scrollContainer.scrollHeight > scrollContainer.clientHeight,
        overflow_y: window.getComputedStyle(scrollContainer).overflowY,
        class: scrollContainer.className
      } : null
    };
  });
  
  console.log('SECTION:');
  console.log('  CSS height:', analysis.section.height_css);
  console.log('  DOM height:', analysis.section.height_dom + 'px');
  console.log('  Padding-top:', analysis.section.padding_top);
  console.log('  Margin-top:', analysis.section.margin_top);
  
  if (analysis.scroll_container) {
    console.log('\nSCROLLABLE CONTAINER:');
    console.log('  DOM height:', analysis.scroll_container.height_dom + 'px');
    console.log('  Scroll height:', analysis.scroll_container.scroll_height + 'px');
    console.log('  Client height:', analysis.scroll_container.client_height + 'px');
    console.log('  Can scroll:', analysis.scroll_container.can_scroll);
    console.log('  Overflow-Y:', analysis.scroll_container.overflow_y);
    console.log('  Class:', analysis.scroll_container.class);
  } else {
    console.log('\n⚠️  NO SCROLLABLE CONTAINER FOUND');
  }
  
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/deep_check.png',
    fullPage: false
  });
  console.log('\n✓ Screenshot saved: deep_check.png');
  
  await browser.close();
})();
