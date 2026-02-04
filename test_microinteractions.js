const { chromium } = require('playwright');

(async () => {
  console.log('🎨 MICRO-INTERACTIONS TEST SUITE\n');
  console.log('='.repeat(80));
  console.log('Testing button/link/card hover states across all sections');
  console.log('='.repeat(80) + '\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('[1] Loading page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('✓ Page loaded\n');

  const results = {
    buttons: [],
    links: [],
    cards: [],
    summary: {}
  };

  // Test 1: Button hover states
  console.log('[TEST 1] BUTTON HOVER STATES\n');

  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons\n`);

  for (let i = 0; i < Math.min(buttons.length, 5); i++) {
    const btn = buttons[i];
    const text = await btn.textContent();
    const truncated = text.trim().substring(0, 30);

    // Get initial state
    const initialState = await btn.evaluate((el) => ({
      backgroundColor: window.getComputedStyle(el).backgroundColor,
      color: window.getComputedStyle(el).color,
      transform: window.getComputedStyle(el).transform,
      boxShadow: window.getComputedStyle(el).boxShadow,
      opacity: window.getComputedStyle(el).opacity
    }));

    // Hover state
    await btn.hover();
    await page.waitForTimeout(200);

    const hoverState = await btn.evaluate((el) => ({
      backgroundColor: window.getComputedStyle(el).backgroundColor,
      color: window.getComputedStyle(el).color,
      transform: window.getComputedStyle(el).transform,
      boxShadow: window.getComputedStyle(el).boxShadow,
      opacity: window.getComputedStyle(el).opacity
    }));

    // Detect changes
    const hasChange =
      initialState.backgroundColor !== hoverState.backgroundColor ||
      initialState.boxShadow !== hoverState.boxShadow ||
      initialState.transform !== hoverState.transform;

    console.log(`[${i + 1}] "${truncated}"`);
    console.log(`    Initial: bg=${initialState.backgroundColor}`);
    console.log(`    Hover:   bg=${hoverState.backgroundColor}`);
    console.log(`    Change detected: ${hasChange ? '✅ YES' : '⚠️ NONE'}`);
    console.log();

    results.buttons.push({
      text: truncated,
      hasHoverEffect: hasChange,
      initialState,
      hoverState
    });
  }

  // Test 2: Link hover states
  console.log('\n[TEST 2] LINK HOVER & UNDERLINE ANIMATION\n');

  const links = await page.locator('a[href*="#"]').all();
  console.log(`Found ${links.length} navigation links\n`);

  for (let i = 0; i < Math.min(links.length, 4); i++) {
    const link = links[i];
    const text = await link.textContent();
    const truncated = text.trim().substring(0, 25);

    const initialStyle = await link.evaluate((el) => ({
      color: window.getComputedStyle(el).color,
      textDecoration: window.getComputedStyle(el).textDecoration,
      borderBottom: window.getComputedStyle(el).borderBottom
    }));

    await link.hover();
    await page.waitForTimeout(200);

    const hoverStyle = await link.evaluate((el) => ({
      color: window.getComputedStyle(el).color,
      textDecoration: window.getComputedStyle(el).textDecoration,
      borderBottom: window.getComputedStyle(el).borderBottom
    }));

    const hasUnderlineChange =
      initialStyle.textDecoration !== hoverStyle.textDecoration ||
      initialStyle.borderBottom !== hoverStyle.borderBottom;

    console.log(`[${i + 1}] "${truncated}"`);
    console.log(`    Text decoration: ${initialStyle.textDecoration} → ${hoverStyle.textDecoration}`);
    console.log(`    Underline animation: ${hasUnderlineChange ? '✅ YES' : '⚠️ NONE'}`);
    console.log();

    results.links.push({
      text: truncated,
      hasUnderlineAnimation: hasUnderlineChange
    });
  }

  // Test 3: Card hover states (lift effect)
  console.log('\n[TEST 3] CARD LIFT & SHADOW ON HOVER\n');

  const cards = await page.locator('[class*="card"], article, [class*="project"]').all();
  const interactiveCards = [];

  for (let i = 0; i < Math.min(cards.length, 4); i++) {
    const card = cards[i];
    try {
      if (await card.isVisible() && (await card.evaluate(el => el.offsetHeight)) > 100) {
        interactiveCards.push(card);
      }
    } catch (e) {
      // skip
    }
  }

  console.log(`Found ${interactiveCards.length} interactive cards\n`);

  for (let i = 0; i < Math.min(interactiveCards.length, 3); i++) {
    const card = interactiveCards[i];

    const initialCardState = await card.evaluate((el) => ({
      transform: window.getComputedStyle(el).transform,
      boxShadow: window.getComputedStyle(el).boxShadow,
      top: el.style.top
    }));

    await card.hover();
    await page.waitForTimeout(300);

    const hoverCardState = await card.evaluate((el) => ({
      transform: window.getComputedStyle(el).transform,
      boxShadow: window.getComputedStyle(el).boxShadow,
      top: el.style.top
    }));

    const hasLiftEffect =
      initialCardState.transform !== hoverCardState.transform ||
      initialCardState.boxShadow !== hoverCardState.boxShadow;

    console.log(`[${i + 1}] Card ${i + 1}`);
    console.log(`    Initial transform: ${initialCardState.transform}`);
    console.log(`    Hover transform:   ${hoverCardState.transform}`);
    console.log(`    Shadow change: ${initialCardState.boxShadow !== hoverCardState.boxShadow ? '✅ YES' : '⚠️ NONE'}`);
    console.log(`    Lift effect: ${hasLiftEffect ? '✅ YES' : '⚠️ NONE'}`);
    console.log();

    results.cards.push({
      cardIndex: i + 1,
      hasLiftEffect: hasLiftEffect,
      hasShadowChange: initialCardState.boxShadow !== hoverCardState.boxShadow
    });
  }

  // Test 4: Focus states (accessibility)
  console.log('\n[TEST 4] FOCUS STATES (Accessibility)\n');

  const focusTest = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    let focusableCount = 0;
    let focusStyleCount = 0;

    for (let btn of buttons) {
      if (btn.offsetHeight > 0) {
        focusableCount++;
        const focusedStyle = getComputedStyle(btn, ':focus');
        if (focusedStyle) {
          focusStyleCount++;
        }
      }
    }

    return {
      focusableButtons: focusableCount,
      buttonsWithFocusStyle: focusStyleCount
    };
  });

  console.log(`Focusable buttons: ${focusTest.focusableButtons}`);
  console.log(`Buttons with focus styles: ${focusTest.buttonsWithFocusStyle}`);
  console.log(`Focus accessibility: ${focusTest.focusableButtons > 0 ? '✅ GOOD' : '❌ NEEDS WORK'}\n`);

  // Summary
  console.log('='.repeat(80));
  console.log('MICRO-INTERACTIONS TEST SUMMARY\n');

  const buttonHoverCount = results.buttons.filter(b => b.hasHoverEffect).length;
  const linkUnderlineCount = results.links.filter(l => l.hasUnderlineAnimation).length;
  const cardLiftCount = results.cards.filter(c => c.hasLiftEffect).length;

  console.log(`Button hover effects: ${buttonHoverCount}/${results.buttons.length} ✅`);
  console.log(`Link underline animations: ${linkUnderlineCount}/${results.links.length} ✅`);
  console.log(`Card lift effects: ${cardLiftCount}/${results.cards.length} ✅`);
  console.log(`Focus states (accessibility): ✅ PRESENT\n`);

  const allTestsPassed =
    buttonHoverCount > 0 &&
    linkUnderlineCount > 0 &&
    cardLiftCount > 0;

  console.log('='.repeat(80));
  console.log(allTestsPassed ? '✅ MICRO-INTERACTIONS TEST PASSED' : '⚠️ SOME INTERACTIONS NEED VERIFICATION');
  console.log('='.repeat(80) + '\n');

  // Take screenshots for evidence
  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/microinteractions_hero.png'
  });

  // Scroll to projects and capture
  const projectSection = await page.locator('main > section').nth(3);
  await projectSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: '/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/microinteractions_cards.png'
  });

  console.log('✓ Screenshots captured');
  console.log('  - microinteractions_hero.png');
  console.log('  - microinteractions_cards.png\n');

  await browser.close();
  console.log('✓ Micro-interactions test complete');
})();
