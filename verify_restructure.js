const { chromium } = require('playwright');

(async () => {
  console.log('🎯 FINAL VERIFICATION - Explicit Heights (5628ae9)\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  console.log('[1] Hard refresh...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('✓ Fresh load\n');
  
  const sections = await page.locator('main > section').all();
  await sections[2].scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  
  console.log('[2] Critical analysis...');
  const data = await page.evaluate(() => {
    const section = Array.from(document.querySelectorAll('main > section'))[2];
    const spacer = section.querySelector('[class*="h-16"]');
    let contentDiv = null;
    let timeline = null;
    
    // Find content div with calc height
    for (let el of section.querySelectorAll('div')) {
      const h = el.style.height;
      if (h && h.includes('calc')) {
        contentDiv = el;
        break;
      }
    }
    
    // Find timeline scrollable
    for (let el of section.querySelectorAll('div')) {
      const s = window.getComputedStyle(el);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.offsetHeight > 100) {
        timeline = el;
        break;
      }
    }
    
    const sectionRect = section.getBoundingClientRect();
    
    return {
      section_height: Math.round(sectionRect.height),
      spacer_exists: !!spacer,
      spacer_height: spacer ? Math.round(spacer.offsetHeight) : 0,
      content_div_exists: !!contentDiv,
      content_height_style: contentDiv ? contentDiv.style.height : 'N/A',
      content_height_actual: contentDiv ? Math.round(contentDiv.offsetHeight) : 0,
      timeline_exists: !!timeline,
      timeline_height: timeline ? Math.round(timeline.offsetHeight) : 0,
      timeline_scroll: timeline ? timeline.scrollHeight : 0,
      timeline_client: timeline ? timeline.clientHeight : 0,
      can_scroll: timeline ? timeline.scrollHeight > timeline.clientHeight : false
    };
  });
  
  console.log('STRUCTURE:');
  console.log('  Section height: ' + data.section_height + 'px');
  console.log('  Spacer exists: ' + (data.spacer_exists ? 'YES (' + data.spacer_height + 'px)' : 'NO'));
  console.log('  Content div exists: ' + (data.content_div_exists ? 'YES' : 'NO'));
  if (data.content_div_exists) {
    console.log('    Height style: ' + data.content_height_style);
    console.log('    Actual height: ' + data.content_height_actual + 'px');
  }
  console.log('  Timeline exists: ' + (data.timeline_exists ? 'YES' : 'NO'));
  if (data.timeline_exists) {
    console.log('    Height: ' + data.timeline_height + 'px');
    console.log('    Scroll height: ' + data.timeline_scroll + 'px');
    console.log('    Client height: ' + data.timeline_client + 'px');
    console.log('    Can scroll: ' + (data.can_scroll ? '✅ YES' : '❌ NO'));
  }
  console.log();
  
  console.log('[3] Screenshot initial view...');
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/restructure_1.png'
  });
  console.log('✓ restructure_1.png\n');
  
  console.log('[4] Scrolling to bottom...');
  if (data.timeline_exists) {
    await sections[2].evaluate((el) => {
      for (let c of el.querySelectorAll('div')) {
        const s = window.getComputedStyle(c);
        if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && c.offsetHeight > 100) {
          c.scrollTop = c.scrollHeight;
          break;
        }
      }
    });
    await page.waitForTimeout(800);
  }
  
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/restructure_2.png'
  });
  console.log('✓ restructure_2.png\n');
  
  console.log('='.repeat(70));
  console.log('✅ FINAL RESULTS');
  console.log('='.repeat(70) + '\n');
  
  console.log('CHECKLIST:');
  console.log('  ' + (data.section_height === 1080 ? '✅' : '⚠️') + ' Section 1080px: ' + data.section_height);
  console.log('  ' + (data.spacer_exists && data.spacer_height === 64 ? '✅' : '❌') + ' Spacer 64px: ' + (data.spacer_exists ? data.spacer_height + 'px' : 'NOT FOUND'));
  console.log('  ' + (data.content_div_exists ? '✅' : '❌') + ' Content area with calc(): ' + (data.content_div_exists ? data.content_height_style : 'NOT FOUND'));
  console.log('  ' + (data.timeline_exists ? '✅' : '❌') + ' Timeline container found');
  console.log('  ' + (data.can_scroll ? '✅' : '❌') + ' SCROLLBAR VISIBLE (can scroll)');
  console.log('  ' + (data.timeline_height > 0 && data.timeline_height < 1080 ? '✅' : '⚠️') + ' Timeline constrained (not 2248px)');
  
  const success = data.spacer_exists && data.content_div_exists && data.timeline_exists && data.can_scroll;
  console.log('\n' + (success ? '🎉 SUCCESS - FIX IS WORKING!' : '⚠️ Issues remain'));
  console.log('='.repeat(70));
  
  await browser.close();
})();
