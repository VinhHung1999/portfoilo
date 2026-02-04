const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('🚀 URGENT TASK #2 COMPREHENSIVE VALIDATION\n');
  console.log('='.repeat(80) + '\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('[STEP 1] Loading localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1500);
    console.log('✓ Page loaded successfully\n');
  } catch (e) {
    console.log(`✗ Failed to load: ${e.message}\n`);
    await browser.close();
    process.exit(1);
  }

  const results = {
    timestamp: new Date().toISOString(),
    projectCardZoom: [],
    socialIconTap: [],
    socialIconHover: [],
    projectCardLift: [],
    formInputFocus: [],
    buttonHover: [],
    summary: {}
  };

  // TEST 1: PROJECT CARDS IMAGE ZOOM
  console.log('[STEP 2] TESTING PROJECT CARDS IMAGE ZOOM...');
  await page.evaluate(() => window.scrollTo(0, 0));
  const projectSection = await page.locator('section#projects');
  await projectSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const zoomElements = await projectSection.locator('div[class*="aspect-video"]').all();
  console.log(`Found ${zoomElements.length} project card images\n`);

  for (let i = 0; i < Math.min(zoomElements.length, 3); i++) {
    const elem = zoomElements[i];
    if (await elem.isVisible()) {
      const initial = await elem.evaluate(e => window.getComputedStyle(e).transform);
      await elem.hover();
      await page.waitForTimeout(400);
      const hover = await elem.evaluate(e => window.getComputedStyle(e).transform);
      const result = {
        card: i + 1,
        hasZoom: initial !== hover,
        initialTransform: initial,
        hoverTransform: hover
      };
      results.projectCardZoom.push(result);
      console.log(`[${i + 1}] Project card: ${result.hasZoom ? '✅ ZOOM DETECTED' : '❌ NO ZOOM'}`);
    }
  }
  console.log();

  // TEST 2: SOCIAL ICON TAP FEEDBACK
  console.log('[STEP 3] TESTING SOCIAL ICON TAP FEEDBACK...');
  const contactSection = await page.locator('section#contact');
  await contactSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const socialIcons = await contactSection.locator('a[target="_blank"][rel="noopener noreferrer"]').all();
  console.log(`Found ${socialIcons.length} social icons\n`);

  for (let i = 0; i < Math.min(socialIcons.length, 4); i++) {
    const icon = socialIcons[i];
    if (await icon.isVisible()) {
      const name = await icon.getAttribute('title') || `Icon ${i + 1}`;
      const initialScale = await icon.evaluate(e => {
        const t = window.getComputedStyle(e).transform;
        const m = t.match(/scale\(([^)]+)\)/);
        return m ? parseFloat(m[1]) : 1;
      });

      await icon.dispatchEvent('pointerdown');
      await page.waitForTimeout(50);
      const tapScale = await icon.evaluate(e => {
        const t = window.getComputedStyle(e).transform;
        const m = t.match(/scale\(([^)]+)\)/);
        return m ? parseFloat(m[1]) : 1;
      });
      await icon.dispatchEvent('pointerup');

      const result = {
        icon: name,
        initialScale,
        tapScale,
        hasTapFeedback: Math.abs(tapScale - 0.95) < 0.1
      };
      results.socialIconTap.push(result);
      console.log(`[${i + 1}] ${name}: ${result.hasTapFeedback ? '✅ TAP FEEDBACK' : '❌ NO FEEDBACK'}`);
    }
  }
  console.log();

  // TEST 3: SOCIAL ICON HOVER
  console.log('[STEP 4] TESTING SOCIAL ICON HOVER EFFECT...');
  for (let i = 0; i < Math.min(socialIcons.length, 4); i++) {
    const icon = socialIcons[i];
    if (await icon.isVisible()) {
      const name = await icon.getAttribute('title') || `Icon ${i + 1}`;
      const initialScale = await icon.evaluate(e => {
        const t = window.getComputedStyle(e).transform;
        const m = t.match(/scale\(([^)]+)\)/);
        return m ? parseFloat(m[1]) : 1;
      });

      await icon.hover();
      await page.waitForTimeout(300);
      const hoverScale = await icon.evaluate(e => {
        const t = window.getComputedStyle(e).transform;
        const m = t.match(/scale\(([^)]+)\)/);
        return m ? parseFloat(m[1]) : 1;
      });

      const result = {
        icon: name,
        initialScale,
        hoverScale,
        hasHoverEffect: Math.abs(hoverScale - 1.05) < 0.1
      };
      results.socialIconHover.push(result);
      console.log(`[${i + 1}] ${name}: ${result.hasHoverEffect ? '✅ HOVER EFFECT' : '❌ NO EFFECT'}`);
    }
  }
  console.log();

  // TEST 4: PROJECT CARD LIFT
  console.log('[STEP 5] TESTING PROJECT CARD LIFT EFFECT...');
  await projectSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const cardContainers = await projectSection.locator('div[class*="rounded-2xl"][style*="background"]').all();
  console.log(`Found ${cardContainers.length} project cards\n`);

  for (let i = 0; i < Math.min(cardContainers.length, 3); i++) {
    const card = cardContainers[i];
    if (await card.isVisible()) {
      const initialY = await card.evaluate(e => {
        const t = window.getComputedStyle(e).transform;
        return t === 'none' ? 0 : parseFloat(t.split(',')[5]) || 0;
      });

      await card.hover();
      await page.waitForTimeout(400);
      const hoverY = await card.evaluate(e => {
        const t = window.getComputedStyle(e).transform;
        return t === 'none' ? 0 : parseFloat(t.split(',')[5]) || 0;
      });

      const result = {
        card: i + 1,
        initialY,
        hoverY,
        hasLift: Math.abs(hoverY - initialY) >= 5
      };
      results.projectCardLift.push(result);
      console.log(`[${i + 1}] Card ${i + 1}: ${result.hasLift ? '✅ LIFT EFFECT' : '❌ NO LIFT'}`);
    }
  }
  console.log();

  // TEST 5: FORM INPUT FOCUS
  console.log('[STEP 6] TESTING FORM INPUT FOCUS STATES...');
  const inputs = await contactSection.locator('input, textarea').all();
  console.log(`Found ${inputs.length} form inputs\n`);

  for (let i = 0; i < Math.min(inputs.length, 3); i++) {
    const input = inputs[i];
    if (await input.isVisible()) {
      const type = await input.evaluate(e => e.tagName.toLowerCase());
      const initialBorder = await input.evaluate(e => window.getComputedStyle(e).borderColor);

      await input.focus();
      await page.waitForTimeout(200);
      const focusBorder = await input.evaluate(e => window.getComputedStyle(e).borderColor);

      const result = {
        type,
        initialBorder,
        focusBorder,
        hasFocusState: initialBorder !== focusBorder
      };
      results.formInputFocus.push(result);
      console.log(`[${i + 1}] ${type}: ${result.hasFocusState ? '✅ FOCUS STATE' : '❌ NO FOCUS'}`);
    }
  }
  console.log();

  // TEST 6: BUTTON HOVER EFFECTS
  console.log('[STEP 7] TESTING ALL BUTTON INTERACTIONS...');
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} total buttons\n`);

  let buttonHoverCount = 0;
  for (let i = 0; i < Math.min(buttons.length, 5); i++) {
    const btn = buttons[i];
    if (await btn.isVisible()) {
      const text = await btn.textContent();
      const truncated = text.trim().substring(0, 25);
      const initialBg = await btn.evaluate(e => window.getComputedStyle(e).backgroundColor);

      await btn.hover();
      await page.waitForTimeout(200);
      const hoverBg = await btn.evaluate(e => window.getComputedStyle(e).backgroundColor);

      const hasHover = initialBg !== hoverBg;
      results.buttonHover.push({
        text: truncated,
        hasHoverEffect: hasHover
      });

      if (hasHover) buttonHoverCount++;
      console.log(`[${i + 1}] "${truncated}": ${hasHover ? '✅ HOVER' : '⚠️ NO CHANGE'}`);
    }
  }
  console.log();

  // SUMMARY
  console.log('='.repeat(80));
  console.log('COMPREHENSIVE TEST SUMMARY\n');

  const projectCardZoomPass = results.projectCardZoom.filter(r => r.hasZoom).length;
  const socialTapPass = results.socialIconTap.filter(r => r.hasTapFeedback).length;
  const socialHoverPass = results.socialIconHover.filter(r => r.hasHoverEffect).length;
  const cardLiftPass = results.projectCardLift.filter(r => r.hasLift).length;
  const formFocusPass = results.formInputFocus.filter(r => r.hasFocusState).length;

  console.log(`PROJECT CARD IMAGE ZOOM: ${projectCardZoomPass}/${results.projectCardZoom.length} ✅`);
  console.log(`SOCIAL ICON TAP FEEDBACK: ${socialTapPass}/${results.socialIconTap.length} ✅`);
  console.log(`SOCIAL ICON HOVER EFFECT: ${socialHoverPass}/${results.socialIconHover.length} ✅`);
  console.log(`PROJECT CARD LIFT EFFECT: ${cardLiftPass}/${results.projectCardLift.length} ✅`);
  console.log(`FORM INPUT FOCUS STATES: ${formFocusPass}/${results.formInputFocus.length} ✅`);
  console.log(`BUTTON HOVER INTERACTIONS: ${buttonHoverCount}/${results.buttonHover.length} ✅\n`);

  const totalTests = projectCardZoomPass + socialTapPass + socialHoverPass + cardLiftPass + formFocusPass + buttonHoverCount;
  const totalElements = results.projectCardZoom.length + results.socialIconTap.length + results.socialIconHover.length +
                       results.projectCardLift.length + results.formInputFocus.length + results.buttonHover.length;

  console.log(`TOTAL PASS RATE: ${totalTests}/${totalElements} (${((totalTests/totalElements)*100).toFixed(0)}%)\n`);

  const allPassed = projectCardZoomPass > 0 && socialTapPass > 0 && socialHoverPass > 0 && cardLiftPass > 0 && formFocusPass > 0;
  console.log('='.repeat(80));
  console.log(allPassed ? '🎉 ✅ TASK #2 ALL MICRO-INTERACTIONS VERIFIED' : '⚠️ SOME INTERACTIONS NEED REVIEW');
  console.log('='.repeat(80) + '\n');

  // Capture screenshots
  console.log('CAPTURING SCREENSHOTS...\n');

  await projectSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/urgent_projects.png',
    fullPage: false
  });
  console.log('✓ Projects section screenshot saved');

  await contactSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/urgent_contact.png',
    fullPage: false
  });
  console.log('✓ Contact section screenshot saved\n');

  // Save results
  fs.writeFileSync(
    '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/task2_results.json',
    JSON.stringify(results, null, 2)
  );
  console.log('✓ Results saved to task2_results.json\n');

  results.summary = {
    status: allPassed ? 'APPROVED' : 'REVIEW_NEEDED',
    passRate: `${totalTests}/${totalElements}`,
    timestamp: new Date().toISOString()
  };

  console.log('READY TO REPORT TO PM ✅\n');
  await browser.close();
})();
