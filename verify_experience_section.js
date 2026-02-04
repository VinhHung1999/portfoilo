const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  console.log('📸 Navigating to localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  console.log('🔍 Scrolling to 3rd section (Experience)...');
  // Get all sections
  const sections = await page.locator('main > section').all();
  console.log(`✓ Found ${sections.length} sections`);
  
  if (sections.length >= 3) {
    // Scroll to 3rd section (Experience is index 2: Hero=0, About=1, Experience=2)
    const expSection = sections[2];
    await expSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    console.log('✓ Scrolled to Experience section (3rd section)');
    
    // Take screenshot
    const screenshotPath = '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/experience_section.png';
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`✓ Screenshot saved: ${screenshotPath}`);
    
    // Get section info
    const sectionInfo = await expSection.evaluate((el) => {
      return {
        text_content: el.textContent.substring(0, 100),
        html: el.outerHTML.substring(0, 200)
      };
    });
    
    console.log('\n📋 Section Content Sample:');
    console.log(sectionInfo.text_content);
  } else {
    console.log('✗ Not enough sections found');
  }
  
  await browser.close();
})();
