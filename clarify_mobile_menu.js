const { chromium } = require('playwright');

(async () => {
  console.log('🔍 MOBILE MENU CLARIFICATION - 375px Viewport\n');
  console.log('='.repeat(70));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });

  console.log('Loading page at 375px...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('✓ Loaded\n');

  // Check header area
  const headerAnalysis = await page.evaluate(() => {
    const header = document.querySelector('header');
    const allElements = header ? header.querySelectorAll('*') : [];

    const buttons = Array.from(allElements).filter(el => {
      const tag = el.tagName.toLowerCase();
      const isButton = tag === 'button' || tag === 'a' ||
                      (el.onclick) ||
                      el.getAttribute('role') === 'button';
      return isButton && el.offsetHeight > 0;
    });

    return {
      header_visible: header && header.offsetHeight > 0,
      header_height: header ? header.offsetHeight : 0,
      interactive_elements: buttons.length,
      elements: buttons.map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent.trim().substring(0, 30),
        width: el.offsetWidth,
        height: el.offsetHeight,
        visible: el.offsetHeight > 0
      }))
    };
  });

  console.log('HEADER ANALYSIS:');
  console.log(`  Header visible: ${headerAnalysis.header_visible}`);
  console.log(`  Header height: ${headerAnalysis.header_height}px`);
  console.log(`  Interactive elements found: ${headerAnalysis.interactive_elements}\n`);

  if (headerAnalysis.elements.length > 0) {
    console.log('VISIBLE INTERACTIVE ELEMENTS:');
    headerAnalysis.elements.forEach((el, idx) => {
      console.log(`  [${idx + 1}] <${el.tag}> "${el.text}"`);
      console.log(`      Size: ${el.width}x${el.height}px`);
    });
  } else {
    console.log('⚠️  NO INTERACTIVE ELEMENTS FOUND IN HEADER');
  }

  console.log('\n' + '='.repeat(70));
  console.log('MENU FUNCTIONALITY TEST:\n');

  // Try to find nav/menu
  const navAnalysis = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const navVisible = nav && nav.offsetHeight > 0;

    const navLinks = nav ? nav.querySelectorAll('a') : [];
    const navButtons = nav ? nav.querySelectorAll('button') : [];

    return {
      nav_exists: !!nav,
      nav_visible: navVisible,
      nav_display: nav ? window.getComputedStyle(nav).display : 'N/A',
      links_count: navLinks.length,
      buttons_count: navButtons.length,
      nav_position: nav ? window.getComputedStyle(nav).position : 'N/A'
    };
  });

  console.log(`Nav element exists: ${navAnalysis.nav_exists}`);
  console.log(`Nav visible: ${navAnalysis.nav_visible}`);
  console.log(`Nav display: ${navAnalysis.nav_display}`);
  console.log(`Nav position: ${navAnalysis.nav_position}`);
  console.log(`Links in nav: ${navAnalysis.links_count}`);
  console.log(`Buttons in nav: ${navAnalysis.buttons_count}\n`);

  // Take screenshot
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/mobile_375px.png'
  });

  console.log('='.repeat(70));
  console.log('CLARIFICATION RESULT:\n');

  if (headerAnalysis.interactive_elements > 0) {
    console.log('✅ HAMBURGER ICON: VISIBLE on 375px');
    console.log('   Elements that can trigger menu:', headerAnalysis.interactive_elements);
  } else if (headerAnalysis.header_visible) {
    console.log('⚠️  HEADER VISIBLE but NO INTERACTIVE ELEMENTS');
    console.log('   → Possible: Menu hidden, button not styled, or responsive design issue');
  } else {
    console.log('❌ HEADER NOT VISIBLE on 375px');
    console.log('   → Possible: Header hidden by CSS for mobile');
  }

  if (navAnalysis.nav_exists) {
    console.log(`\n✅ NAV ELEMENT: EXISTS`);
    if (navAnalysis.nav_visible) {
      console.log(`   Status: VISIBLE (display: ${navAnalysis.nav_display})`);
      console.log(`   Links: ${navAnalysis.links_count}, Buttons: ${navAnalysis.buttons_count}`);
    } else {
      console.log(`   Status: HIDDEN (display: ${navAnalysis.nav_display})`);
      console.log('   → Menu may be off-screen or display: none');
    }
  } else {
    console.log('\n⚠️  NAV ELEMENT: NOT FOUND');
    console.log('   → May be using different selector or structure');
  }

  console.log('\n✓ Screenshot: mobile_375px.png');
  console.log('='.repeat(70) + '\n');

  await browser.close();
})();
