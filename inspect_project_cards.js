const { chromium } = require('playwright');

(async () => {
  console.log('🔍 INSPECTING PROJECT CARD DOM STRUCTURE\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.evaluate(() => window.scrollTo(0, 0));
  const projectSection = await page.locator('section#projects');
  await projectSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const inspect = await page.evaluate(() => {
    const section = document.querySelector('section#projects');
    if (!section) return { error: 'Projects section not found' };

    // Get all divs with aspect-video class
    const aspectVideos = section.querySelectorAll('[class*="aspect-video"]');
    console.log(`Found ${aspectVideos.length} elements with aspect-video class`);

    // Get all motion divs
    const allDivs = section.querySelectorAll('div');
    const motionLike = Array.from(allDivs).filter(el => {
      const style = window.getComputedStyle(el);
      return el.getAttribute('style') && el.getAttribute('style').includes('transform');
    });

    // Get more detailed structure
    const cards = section.querySelectorAll('[style*="background"]');

    return {
      aspectVideoCount: aspectVideos.length,
      allDivsCount: allDivs.length,
      motionLikeCount: motionLike.length,
      cardsCount: cards.length,
      firstAspectVideo: aspectVideos[0] ? {
        className: aspectVideos[0].className,
        html: aspectVideos[0].outerHTML.substring(0, 200)
      } : null,
      allClasses: Array.from(section.querySelectorAll('[class*="grid"]'))
        .map(el => ({ tag: el.tagName, class: el.className }))
        .slice(0, 5)
    };
  });

  console.log('Inspection results:');
  console.log(JSON.stringify(inspect, null, 2));

  // Try different selectors
  console.log('\n\nTesting different selectors:\n');

  const selectors = [
    '[class*="aspect-video"]',
    'div[class*="aspect-video"]',
    '[class*="grid"] > div',
    '[class*="rounded-2xl"]',
    'section#projects [style*="background"]'
  ];

  for (const selector of selectors) {
    const count = await page.locator(selector).count();
    console.log(`${selector}: ${count} elements found`);
  }

  await browser.close();
})();
