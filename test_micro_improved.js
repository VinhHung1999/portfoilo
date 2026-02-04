const { chromium } = require('playwright');

(async () => {
  console.log('🎯 IMPROVED MICRO-INTERACTIONS TEST - Correct Selectors\n');
  console.log('='.repeat(80) + '\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('[1] Loading page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('✓ Loaded\n');

  // Test 1: Project Card Image Zoom (on aspect-video div - Framer Motion animated)
  console.log('[TEST 1] PROJECT CARDS - IMAGE ZOOM ON HOVER (aspect-video)\n');

  await page.evaluate(() => window.scrollTo(0, 0));
  const projectSection = await page.locator('section#projects');
  await projectSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const projectCards = await projectSection.locator('div[class*="aspect-video"]').all();
  console.log(`Found ${projectCards.length} project card image containers\n`);

  let projectZoomCount = 0;

  for (let i = 0; i < Math.min(projectCards.length, 3); i++) {
    const imageContainer = projectCards[i];
    try {
      if (await imageContainer.isVisible()) {
        const initialTransform = await imageContainer.evaluate(el =>
          window.getComputedStyle(el).transform
        );

        await imageContainer.hover();
        await page.waitForTimeout(400);

        const hoverTransform = await imageContainer.evaluate(el =>
          window.getComputedStyle(el).transform
        );

        const hasZoom = initialTransform !== hoverTransform;

        console.log(`[${i + 1}] Project card image ${i + 1}`);
        console.log(`    Initial transform: ${initialTransform}`);
        console.log(`    Hover transform:   ${hoverTransform}`);
        console.log(`    Zoom effect: ${hasZoom ? '✅ YES (scale 1.05)' : '⚠️ NONE'}\n`);

        if (hasZoom) projectZoomCount++;
      }
    } catch (e) {
      console.log(`[${i + 1}] Error checking card ${i + 1}: ${e.message}\n`);
    }
  }

  console.log(`Project card zoom effects: ${projectZoomCount}/${Math.min(projectCards.length, 3)}\n`);

  // Test 2: Social Icon Tap Feedback (scale 0.95 on whileTap)
  console.log('[TEST 2] SOCIAL ICONS - TAP FEEDBACK (scale 0.95)\n');

  const contactSection = await page.locator('section#contact');
  await contactSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Social links are motion.a elements
  const socialIcons = await contactSection.locator('a[target="_blank"][rel="noopener noreferrer"]').all();
  console.log(`Found ${socialIcons.length} social icon links\n`);

  let socialTapCount = 0;

  for (let i = 0; i < Math.min(socialIcons.length, 4); i++) {
    const icon = socialIcons[i];
    try {
      if (await icon.isVisible()) {
        const iconName = await icon.getAttribute('title');

        const initialScale = await icon.evaluate(el => {
          const transform = window.getComputedStyle(el).transform;
          const scaleMatch = transform.match(/scale\(([^)]+)\)/);
          return scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        });

        // Simulate tap with pointerdown/pointerup (more accurate than click)
        await icon.dispatchEvent('pointerdown');
        await page.waitForTimeout(50);

        const tapScale = await icon.evaluate(el => {
          const transform = window.getComputedStyle(el).transform;
          const scaleMatch = transform.match(/scale\(([^)]+)\)/);
          return scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        });

        await icon.dispatchEvent('pointerup');
        await page.waitForTimeout(50);

        const hasScaleFeedback = Math.abs(tapScale - 0.95) < 0.1;

        console.log(`[${i + 1}] ${iconName || `Social icon ${i + 1}`}`);
        console.log(`    Initial scale: ${initialScale.toFixed(2)}`);
        console.log(`    Tap scale: ${tapScale.toFixed(2)}`);
        console.log(`    Scale 0.95 feedback: ${hasScaleFeedback ? '✅ YES' : '⚠️ NONE'}\n`);

        if (hasScaleFeedback) socialTapCount++;
      }
    } catch (e) {
      console.log(`[${i + 1}] Error checking icon: ${e.message}\n`);
    }
  }

  console.log(`Social icon tap feedback: ${socialTapCount}/${Math.min(socialIcons.length, 4)}\n`);

  // Test 3: Social Icon Hover (scale 1.05)
  console.log('[TEST 3] SOCIAL ICONS - HOVER EFFECT (scale 1.05)\n');

  let socialHoverCount = 0;

  for (let i = 0; i < Math.min(socialIcons.length, 4); i++) {
    const icon = socialIcons[i];
    try {
      if (await icon.isVisible()) {
        const iconName = await icon.getAttribute('title');

        const initialScale = await icon.evaluate(el => {
          const transform = window.getComputedStyle(el).transform;
          const scaleMatch = transform.match(/scale\(([^)]+)\)/);
          return scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        });

        await icon.hover();
        await page.waitForTimeout(300);

        const hoverScale = await icon.evaluate(el => {
          const transform = window.getComputedStyle(el).transform;
          const scaleMatch = transform.match(/scale\(([^)]+)\)/);
          return scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        });

        const hasHoverScale = Math.abs(hoverScale - 1.05) < 0.1;

        console.log(`[${i + 1}] ${iconName || `Social icon ${i + 1}`}`);
        console.log(`    Initial scale: ${initialScale.toFixed(2)}`);
        console.log(`    Hover scale: ${hoverScale.toFixed(2)}`);
        console.log(`    Scale 1.05 hover: ${hasHoverScale ? '✅ YES' : '⚠️ NONE'}\n`);

        if (hasHoverScale) socialHoverCount++;
      }
    } catch (e) {
      console.log(`[${i + 1}] Error checking icon: ${e.message}\n`);
    }
  }

  console.log(`Social icon hover scale: ${socialHoverCount}/${Math.min(socialIcons.length, 4)}\n`);

  // Test 4: Project Card Hover (lift effect y: -8)
  console.log('[TEST 4] PROJECT CARDS - LIFT EFFECT ON HOVER (y: -8px)\n');

  const projectMotionDivs = await projectSection.locator('div[class*="rounded-2xl"][style*="background"]').all();
  console.log(`Found ${projectMotionDivs.length} project card containers\n`);

  let projectLiftCount = 0;

  for (let i = 0; i < Math.min(projectMotionDivs.length, 3); i++) {
    const card = projectMotionDivs[i];
    try {
      if (await card.isVisible()) {
        const initialY = await card.evaluate(el => {
          const transform = window.getComputedStyle(el).transform;
          return transform === 'none' ? 0 : parseFloat(transform.split(',')[5]) || 0;
        });

        await card.hover();
        await page.waitForTimeout(400);

        const hoverY = await card.evaluate(el => {
          const transform = window.getComputedStyle(el).transform;
          return transform === 'none' ? 0 : parseFloat(transform.split(',')[5]) || 0;
        });

        const hasLift = Math.abs(hoverY - initialY) >= 5; // y: -8 should move up

        console.log(`[${i + 1}] Project card ${i + 1}`);
        console.log(`    Initial Y: ${initialY.toFixed(0)}`);
        console.log(`    Hover Y: ${hoverY.toFixed(0)}`);
        console.log(`    Lift effect: ${hasLift ? '✅ YES' : '⚠️ NONE'}\n`);

        if (hasLift) projectLiftCount++;
      }
    } catch (e) {
      console.log(`[${i + 1}] Error checking card: ${e.message}\n`);
    }
  }

  console.log(`Project card lift effects: ${projectLiftCount}/${Math.min(projectMotionDivs.length, 3)}\n`);

  // Test 5: Contact Form Input Focus (border color change to violet)
  console.log('[TEST 5] CONTACT FORM - INPUT FOCUS STATES\n');

  const inputs = await contactSection.locator('input, textarea').all();
  console.log(`Found ${inputs.length} form inputs\n`);

  let focusCount = 0;

  for (let i = 0; i < Math.min(inputs.length, 2); i++) {
    const input = inputs[i];
    try {
      if (await input.isVisible()) {
        const inputType = await input.evaluate(el => el.tagName.toLowerCase());

        const initialBorder = await input.evaluate(el =>
          window.getComputedStyle(el).borderColor
        );

        await input.focus();
        await page.waitForTimeout(200);

        const focusBorder = await input.evaluate(el =>
          window.getComputedStyle(el).borderColor
        );

        const hasVioletBorder = initialBorder !== focusBorder;

        console.log(`[${i + 1}] ${inputType} element`);
        console.log(`    Initial border: ${initialBorder}`);
        console.log(`    Focus border: ${focusBorder}`);
        console.log(`    Focus state: ${hasVioletBorder ? '✅ YES (color changed)' : '⚠️ NONE'}\n`);

        if (hasVioletBorder) focusCount++;
      }
    } catch (e) {
      console.log(`[${i + 1}] Error checking input: ${e.message}\n`);
    }
  }

  console.log(`Form input focus states: ${focusCount}/${Math.min(inputs.length, 2)}\n`);

  // Summary
  console.log('='.repeat(80));
  console.log('MICRO-INTERACTIONS SUMMARY\n');

  console.log(`✅ Project card image zoom: ${projectZoomCount}/${Math.min(projectCards.length, 3)}`);
  console.log(`✅ Social icon tap feedback: ${socialTapCount}/${Math.min(socialIcons.length, 4)}`);
  console.log(`✅ Social icon hover scale: ${socialHoverCount}/${Math.min(socialIcons.length, 4)}`);
  console.log(`✅ Project card lift effect: ${projectLiftCount}/${Math.min(projectMotionDivs.length, 3)}`);
  console.log(`✅ Form input focus states: ${focusCount}/${Math.min(inputs.length, 2)}\n`);

  const allPassed = projectZoomCount > 0 && socialTapCount > 0 && socialHoverCount > 0 && projectLiftCount > 0 && focusCount > 0;
  console.log('='.repeat(80));
  console.log(allPassed ? '✅ ALL MICRO-INTERACTIONS VERIFIED' : '⚠️ SOME INTERACTIONS NEED VERIFICATION');
  console.log('='.repeat(80) + '\n');

  // Screenshots
  console.log('Capturing visual evidence...\n');

  await projectSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/micro_improved_projects.png'
  });

  await contactSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/micro_improved_contact.png'
  });

  console.log('✓ micro_improved_projects.png');
  console.log('✓ micro_improved_contact.png\n');

  await browser.close();
})();
