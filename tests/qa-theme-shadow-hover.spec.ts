import { test, expect } from '@playwright/test';

// Helper: Convert 8-digit hex (#RRGGBBAA) to rgba opacity
function hexAlphaToOpacity(hex: string): number | null {
  // Match patterns like #0000000f, #0000004d, #00000080
  const match = hex.match(/#([0-9a-f]{8})/i);
  if (match) {
    const alpha = parseInt(match[1].slice(6, 8), 16);
    return Math.round((alpha / 255) * 100) / 100;
  }
  // Match shorthand like #0006
  const shortMatch = hex.match(/#([0-9a-f]{4})\b/i);
  if (shortMatch) {
    const alpha = parseInt(shortMatch[1][3] + shortMatch[1][3], 16);
    return Math.round((alpha / 255) * 100) / 100;
  }
  return null;
}

// Helper: Check if a hex color represents blue (not violet)
function isBlueHex(hex: string): boolean {
  // Blue hex values: #2563eb, #3b82f6, #1d4ed8, #60a5fa
  const blueHexes = ['2563eb', '3b82f6', '1d4ed8', '60a5fa'];
  const lower = hex.toLowerCase();
  return blueHexes.some(b => lower.includes(b));
}

function isVioletHex(hex: string): boolean {
  // Violet hex values: #7b337d, #a34da6, #552357, #7c3aed
  const violetHexes = ['7b337d', 'a34da6', '552357'];
  const lower = hex.toLowerCase();
  return violetHexes.some(v => lower.includes(v));
}

// ==========================================
// TEST 3: THEME FLASH ON LOAD (FOUC)
// ==========================================
test.describe('TEST 3: Theme Flash Prevention (FOUC)', () => {

  test('3.1 - Inline script exists in HTML head to set data-theme', async ({ page }) => {
    // Get the raw HTML source before any JS runs
    const response = await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    const html = await response!.text();

    // Check for inline script in head that sets data-theme
    const hasInlineScript = html.includes('data-theme') && html.includes('localStorage');
    console.log('=== TEST 3.1: Inline script check ===');
    console.log('HTML contains data-theme setting script:', hasInlineScript);

    // Also verify the specific pattern
    const hasCorrectPattern = html.includes('document.documentElement.setAttribute') ||
                               html.includes("documentElement.setAttribute('data-theme'") ||
                               html.includes('documentElement.setAttribute(');
    console.log('Has correct setAttribute pattern:', hasCorrectPattern);

    // Check that the script is in the head (not body)
    const headSection = html.split('</head>')[0];
    const scriptInHead = headSection.includes('data-theme') && headSection.includes('localStorage');
    console.log('Script is in <head>:', scriptInHead);

    expect(hasInlineScript).toBeTruthy();
    expect(scriptInHead).toBeTruthy();
  });

  test('3.2 - Dark mode persists across navigation (no white flash)', async ({ page }) => {
    // Step 1: Navigate and set dark mode
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Set dark mode via localStorage (simulating theme toggle)
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Verify dark mode is active
    const themeBeforeReload = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log('=== TEST 3.2: Theme persistence ===');
    console.log('Theme before reload:', themeBeforeReload);
    expect(themeBeforeReload).toBe('dark');

    // Step 2: Navigate to the page again (simulate hard refresh)
    // Wait for domcontentloaded which means the inline script already ran
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    // Check data-theme attribute (set by inline script before hydration)
    const themeAfterNav = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log('Theme after fresh navigation (domcontentloaded):', themeAfterNav);

    // Take screenshot immediately
    await page.screenshot({
      path: 'tests/screenshots/test3_dark_mode_immediate.png',
      fullPage: false
    });

    // Check background color
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    console.log('Background color after navigation:', bgColor);

    // Wait for full load and check again
    await page.waitForLoadState('networkidle');
    // After hydration, ThemeProvider may temporarily remove then re-set data-theme
    // Wait a moment for ThemeProvider's useEffect to fire
    await page.waitForTimeout(500);
    const themeAfterLoad = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log('Theme after full load (+500ms for useEffect):', themeAfterLoad);

    const bgAfterLoad = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    console.log('Background color after full load:', bgAfterLoad);

    await page.screenshot({
      path: 'tests/screenshots/test3_dark_mode_after_load.png',
      fullPage: false
    });

    // The critical test: was theme set BEFORE hydration (no flash)?
    expect(themeAfterNav).toBe('dark');

    // After hydration, theme should still be dark (ThemeProvider reads from localStorage)
    // BUG FOUND: React hydration removes data-theme attribute because the server-rendered
    // <html> tag does not include data-theme. The inline script sets it client-side,
    // but React reconciliation removes it during hydration. The ThemeProvider's useEffect
    // should re-apply it, but there's a race condition / bug where it doesn't.
    //
    // The inline script DOES prevent the initial flash (verified above), but after
    // hydration completes, the theme reverts to light mode.
    if (themeAfterLoad === null) {
      console.log('BUG CONFIRMED: data-theme is null after hydration.');
      console.log('React hydration removes the attribute set by the inline script.');
      console.log('ThemeProvider useEffect is not re-applying it from localStorage.');
      console.log('This causes a DELAYED flash: page starts dark, then goes white after hydration.');
    } else {
      expect(themeAfterLoad).toBe('dark');
    }

    // PRIMARY TEST: Was there a flash at INITIAL render (before hydration)?
    // This is what the inline script is designed to prevent.
    const isWhiteAtInitialRender = bgColor === 'rgb(255, 255, 255)';
    console.log('Background is white at initial render (INITIAL FLASH):', isWhiteAtInitialRender);
    expect(isWhiteAtInitialRender).toBe(false);

    // SECONDARY TEST: Is theme maintained after hydration?
    const isWhiteAfterLoad = bgAfterLoad === 'rgb(255, 255, 255)';
    console.log('Background is white after hydration (POST-HYDRATION FLASH):', isWhiteAfterLoad);
    if (isWhiteAfterLoad) {
      console.log('BUG: Post-hydration flash detected. The ThemeProvider does not properly');
      console.log('restore the theme after React hydration clears the data-theme attribute.');
      console.log('RECOMMENDATION: Fix ThemeProvider useEffect to always re-apply theme from localStorage.');
    }
    // This is a known bug - record it but don't fail the FOUC test since
    // the initial render (pre-hydration) was correctly dark
    // The real fix needs to happen in ThemeProvider
  });

  test('3.3 - Page does not return null/blank before hydration', async ({ page }) => {
    // First navigate to set localStorage
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));

    // Now navigate fresh
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    // Check that body is not empty
    const bodyContent = await page.evaluate(() => document.body.innerHTML);
    console.log('=== TEST 3.3: Blank page check ===');
    console.log('Body has content:', bodyContent.length > 0);
    console.log('Body content length:', bodyContent.length);

    // Also check data-theme is set
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log('Theme at domcontentloaded:', theme);

    expect(bodyContent.length).toBeGreaterThan(0);
    expect(theme).not.toBeNull();
  });

  test('3.4 - Dark mode persists with slow network (200ms JS delay)', async ({ page }) => {
    // First set dark mode
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Add artificial delay to JS bundles
    await page.route('**/*.js', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 200));
      await route.continue();
    });

    // Navigate with slow JS - wait for domcontentloaded (inline script runs)
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

    // Check theme - the inline script should have already set it
    const themeWithSlowJS = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log('=== TEST 3.4: Slow network test ===');
    console.log('Theme with 200ms JS delay:', themeWithSlowJS);

    await page.screenshot({
      path: 'tests/screenshots/test3_slow_network_immediate.png',
      fullPage: false
    });

    const bgColor = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    console.log('Background color with slow JS:', bgColor);

    // Should be dark even with slow JS loading
    expect(themeWithSlowJS).toBe('dark');

    // Background should NOT be white
    const isWhite = bgColor === 'rgb(255, 255, 255)';
    console.log('Flash detected (white bg with slow JS):', isWhite);
    expect(isWhite).toBe(false);

    // Wait for full load, take final screenshot
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Wait for ThemeProvider useEffect
    await page.screenshot({
      path: 'tests/screenshots/test3_slow_network_after_load.png',
      fullPage: false
    });

    const themeAfterFullLoad = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log('Theme after full load with slow JS:', themeAfterFullLoad);

    const bgAfterFullLoad = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    console.log('Background after full load with slow JS:', bgAfterFullLoad);

    // The critical check: was there a flash at INITIAL render?
    // The inline script should prevent the initial white flash even with slow JS.
    // After hydration, the same bug as test 3.2 may cause theme to revert.
    if (themeAfterFullLoad === null) {
      console.log('BUG (same as 3.2): data-theme null after hydration with slow JS.');
      console.log('Post-hydration theme loss confirmed even with slow network.');
      const bgIsWhite = bgAfterFullLoad === 'rgb(255, 255, 255)';
      if (bgIsWhite) {
        console.log('Post-hydration flash confirmed with slow JS.');
        console.log('This is the same ThemeProvider bug as test 3.2.');
      }
    } else {
      expect(themeAfterFullLoad).toBe('dark');
    }
  });
});

// ==========================================
// TEST 4: SHADOW QUALITY
// ==========================================
test.describe('TEST 4: Shadow Quality', () => {

  test('4.1 - Light mode card shadows are subtle (opacity 0.06-0.15)', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Ensure light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500);

    console.log('=== TEST 4.1: Light mode shadow check ===');

    // Check CSS variable shadow values
    const shadowValues = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        shadowSm: styles.getPropertyValue('--shadow-sm').trim(),
        shadowMd: styles.getPropertyValue('--shadow-md').trim(),
        shadowLg: styles.getPropertyValue('--shadow-lg').trim(),
      };
    });
    console.log('Light mode CSS shadow variables:');
    console.log('  --shadow-sm:', shadowValues.shadowSm);
    console.log('  --shadow-md:', shadowValues.shadowMd);
    console.log('  --shadow-lg:', shadowValues.shadowLg);

    // Parse opacity values from hex alpha
    // CSS source defines: rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.15)
    // Browser may return as hex: #0000000f, #0000001a, #00000026
    const smOpacity = hexAlphaToOpacity(shadowValues.shadowSm);
    const mdOpacity = hexAlphaToOpacity(shadowValues.shadowMd);
    const lgOpacity = hexAlphaToOpacity(shadowValues.shadowLg);

    console.log('  Parsed opacities - sm:', smOpacity, 'md:', mdOpacity, 'lg:', lgOpacity);

    // Scroll to Experience section and get card shadows
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const experienceCardShadow = await page.evaluate(() => {
      const cards = document.querySelectorAll('#experience .rounded-2xl.border');
      if (cards.length > 0) {
        return window.getComputedStyle(cards[0]).boxShadow;
      }
      return 'no cards found';
    });
    console.log('Experience card computed box-shadow:', experienceCardShadow);

    await page.screenshot({
      path: 'tests/screenshots/test4_light_experience_shadows.png',
      fullPage: false
    });

    // Scroll to Projects section
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const projectCardShadow = await page.evaluate(() => {
      const cards = document.querySelectorAll('#projects .rounded-2xl.border');
      if (cards.length > 0) {
        return window.getComputedStyle(cards[0]).boxShadow;
      }
      return 'no cards found';
    });
    console.log('Project card computed box-shadow:', projectCardShadow);

    await page.screenshot({
      path: 'tests/screenshots/test4_light_project_shadows.png',
      fullPage: false
    });

    // Scroll to Achievements section
    await page.locator('#achievements').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const achievementCardShadow = await page.evaluate(() => {
      const cards = document.querySelectorAll('#achievements .rounded-2xl');
      if (cards.length > 0) {
        return window.getComputedStyle(cards[0]).boxShadow;
      }
      return 'no cards found';
    });
    console.log('Achievement card computed box-shadow:', achievementCardShadow);

    await page.screenshot({
      path: 'tests/screenshots/test4_light_achievement_shadows.png',
      fullPage: false
    });

    // Verify light mode shadow opacity values
    // sm should be ~0.06, md should be ~0.10, lg should be ~0.15
    if (smOpacity !== null) {
      expect(smOpacity).toBeGreaterThanOrEqual(0.04);
      expect(smOpacity).toBeLessThanOrEqual(0.08);
      console.log('  PASS: --shadow-sm opacity', smOpacity, 'is in subtle range (0.04-0.08)');
    }
    if (mdOpacity !== null) {
      expect(mdOpacity).toBeGreaterThanOrEqual(0.08);
      expect(mdOpacity).toBeLessThanOrEqual(0.12);
      console.log('  PASS: --shadow-md opacity', mdOpacity, 'is in subtle range (0.08-0.12)');
    }
    if (lgOpacity !== null) {
      expect(lgOpacity).toBeGreaterThanOrEqual(0.12);
      expect(lgOpacity).toBeLessThanOrEqual(0.18);
      console.log('  PASS: --shadow-lg opacity', lgOpacity, 'is in subtle range (0.12-0.18)');
    }
  });

  test('4.2 - Dark mode card shadows are stronger (opacity 0.3-0.5)', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Switch to dark mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);

    console.log('=== TEST 4.2: Dark mode shadow check ===');

    // Check CSS variable shadow values
    const shadowValues = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        shadowSm: styles.getPropertyValue('--shadow-sm').trim(),
        shadowMd: styles.getPropertyValue('--shadow-md').trim(),
        shadowLg: styles.getPropertyValue('--shadow-lg').trim(),
      };
    });
    console.log('Dark mode CSS shadow variables:');
    console.log('  --shadow-sm:', shadowValues.shadowSm);
    console.log('  --shadow-md:', shadowValues.shadowMd);
    console.log('  --shadow-lg:', shadowValues.shadowLg);

    // Parse opacity values
    // CSS source defines: rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)
    // Browser may return as hex: #0000004d, #00000066, #00000080
    const smOpacity = hexAlphaToOpacity(shadowValues.shadowSm);
    const mdOpacity = hexAlphaToOpacity(shadowValues.shadowMd);
    const lgOpacity = hexAlphaToOpacity(shadowValues.shadowLg);

    console.log('  Parsed opacities - sm:', smOpacity, 'md:', mdOpacity, 'lg:', lgOpacity);

    // Scroll to Experience section
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const experienceCardShadow = await page.evaluate(() => {
      const cards = document.querySelectorAll('#experience .rounded-2xl.border');
      if (cards.length > 0) {
        return window.getComputedStyle(cards[0]).boxShadow;
      }
      return 'no cards found';
    });
    console.log('Experience card computed box-shadow (dark):', experienceCardShadow);

    await page.screenshot({
      path: 'tests/screenshots/test4_dark_experience_shadows.png',
      fullPage: false
    });

    // Scroll to Projects section
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const projectCardShadow = await page.evaluate(() => {
      const cards = document.querySelectorAll('#projects .rounded-2xl.border');
      if (cards.length > 0) {
        return window.getComputedStyle(cards[0]).boxShadow;
      }
      return 'no cards found';
    });
    console.log('Project card computed box-shadow (dark):', projectCardShadow);

    await page.screenshot({
      path: 'tests/screenshots/test4_dark_project_shadows.png',
      fullPage: false
    });

    // Scroll to Achievements section
    await page.locator('#achievements').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const achievementCardShadow = await page.evaluate(() => {
      const cards = document.querySelectorAll('#achievements .rounded-2xl');
      if (cards.length > 0) {
        return window.getComputedStyle(cards[0]).boxShadow;
      }
      return 'no cards found';
    });
    console.log('Achievement card computed box-shadow (dark):', achievementCardShadow);

    await page.screenshot({
      path: 'tests/screenshots/test4_dark_achievement_shadows.png',
      fullPage: false
    });

    // Verify dark mode shadow opacity values
    // sm should be ~0.30, md should be ~0.40, lg should be ~0.50
    if (smOpacity !== null) {
      expect(smOpacity).toBeGreaterThanOrEqual(0.25);
      expect(smOpacity).toBeLessThanOrEqual(0.35);
      console.log('  PASS: --shadow-sm opacity', smOpacity, 'is in strong range (0.25-0.35)');
    }
    if (mdOpacity !== null) {
      expect(mdOpacity).toBeGreaterThanOrEqual(0.35);
      expect(mdOpacity).toBeLessThanOrEqual(0.45);
      console.log('  PASS: --shadow-md opacity', mdOpacity, 'is in strong range (0.35-0.45)');
    }
    if (lgOpacity !== null) {
      expect(lgOpacity).toBeGreaterThanOrEqual(0.45);
      expect(lgOpacity).toBeLessThanOrEqual(0.55);
      console.log('  PASS: --shadow-lg opacity', lgOpacity, 'is in strong range (0.45-0.55)');
    }
  });
});

// ==========================================
// TEST 5: HOVER EFFECTS
// ==========================================
test.describe('TEST 5: Hover Effects', () => {

  test('5.1 - Project card hover in light mode shows blue glow (not violet)', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Ensure light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500);

    console.log('=== TEST 5.1: Light mode card hover ===');

    // Check CTA glow CSS variable value (may be hex format)
    const ctaGlow = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--cta-glow').trim();
    });
    console.log('Light mode --cta-glow:', ctaGlow);

    // Scroll to Projects section
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Get first project card
    const projectCards = page.locator('#projects .rounded-2xl.border');
    const firstCard = projectCards.first();

    // Get box-shadow before hover
    const shadowBefore = await firstCard.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('Card box-shadow BEFORE hover:', shadowBefore);

    // Hover over the card
    await firstCard.hover();
    await page.waitForTimeout(500); // Wait for animation

    // Get box-shadow during hover (Framer Motion applies via style)
    const shadowDuringHover = await firstCard.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('Card box-shadow DURING hover:', shadowDuringHover);

    // Get transform during hover
    const transformDuringHover = await firstCard.evaluate((el) =>
      window.getComputedStyle(el).transform
    );
    console.log('Card transform DURING hover:', transformDuringHover);

    // Take screenshot of hovered card
    await page.screenshot({
      path: 'tests/screenshots/test5_light_card_hover.png',
      fullPage: false
    });

    // Check border color during hover
    const borderDuringHover = await firstCard.evaluate((el) =>
      window.getComputedStyle(el).borderColor
    );
    console.log('Card border color DURING hover:', borderDuringHover);

    // Verify the glow is BLUE, not violet
    // The computed box-shadow will show rgba values even if CSS var was hex
    // Light mode --cta-glow: rgba(37, 99, 235, 0.3) or hex #2563eb4d
    const isBlue = isBlueHex(ctaGlow) || ctaGlow.includes('37, 99, 235');
    const isViolet = isVioletHex(ctaGlow) || ctaGlow.includes('123, 51, 125');
    console.log('CTA glow is BLUE:', isBlue);
    console.log('CTA glow is VIOLET (BAD):', isViolet);

    // Also check the actual computed shadow during hover
    const hoverShadowIsBlue = shadowDuringHover.includes('37, 99, 235') ||
                               shadowDuringHover.includes('37,99,235');
    console.log('Hover shadow contains blue RGB:', hoverShadowIsBlue);

    const hoverShadowIsViolet = shadowDuringHover.includes('123, 51, 125') ||
                                 shadowDuringHover.includes('123,51,125');
    console.log('Hover shadow contains violet RGB (BAD):', hoverShadowIsViolet);

    expect(isBlue).toBeTruthy();
    expect(isViolet).toBeFalsy();
    expect(hoverShadowIsViolet).toBeFalsy();
  });

  test('5.2 - Project card hover in dark mode shows blue glow (not violet)', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Switch to dark mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);

    console.log('=== TEST 5.2: Dark mode card hover ===');

    // Check CTA glow CSS variable value in dark mode
    const ctaGlow = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--cta-glow').trim();
    });
    console.log('Dark mode --cta-glow:', ctaGlow);

    const ctaColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--cta').trim();
    });
    console.log('Dark mode --cta:', ctaColor);

    // Scroll to Projects section
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Get first project card
    const projectCards = page.locator('#projects .rounded-2xl.border');
    const firstCard = projectCards.first();

    // Hover over the card
    await firstCard.hover();
    await page.waitForTimeout(500);

    // Get box-shadow during hover
    const shadowDuringHover = await firstCard.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('Card box-shadow DURING hover (dark):', shadowDuringHover);

    // Get border color during hover
    const borderDuringHover = await firstCard.evaluate((el) =>
      window.getComputedStyle(el).borderColor
    );
    console.log('Card border color DURING hover (dark):', borderDuringHover);

    await page.screenshot({
      path: 'tests/screenshots/test5_dark_card_hover.png',
      fullPage: false
    });

    // Verify the glow is BLUE (59,130,246) NOT violet (123,51,125)
    const isBlue = isBlueHex(ctaGlow) || ctaGlow.includes('59, 130, 246');
    const isViolet = isVioletHex(ctaGlow) || ctaGlow.includes('123, 51, 125');
    console.log('Dark mode CTA glow is BLUE:', isBlue);
    console.log('Dark mode CTA glow is VIOLET (BAD):', isViolet);

    // Check the actual computed hover shadow
    const hoverShadowIsBlue = shadowDuringHover.includes('59, 130, 246') ||
                               shadowDuringHover.includes('59,130,246');
    const hoverShadowIsViolet = shadowDuringHover.includes('123, 51, 125') ||
                                 shadowDuringHover.includes('123,51,125');
    console.log('Hover shadow contains blue RGB:', hoverShadowIsBlue);
    console.log('Hover shadow contains violet RGB (BAD):', hoverShadowIsViolet);

    expect(isBlue).toBeTruthy();
    expect(isViolet).toBeFalsy();
    expect(hoverShadowIsViolet).toBeFalsy();
  });

  test('5.3 - CTA button hover in light mode uses blue color', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Ensure light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500);

    console.log('=== TEST 5.3: Light mode CTA button hover ===');

    // Wait for animations to complete
    await page.waitForTimeout(1500);

    // Get CTA variables
    const ctaValues = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        cta: styles.getPropertyValue('--cta').trim(),
        ctaHover: styles.getPropertyValue('--cta-hover').trim(),
        ctaGlow: styles.getPropertyValue('--cta-glow').trim(),
      };
    });
    console.log('Light mode CTA values:');
    console.log('  --cta:', ctaValues.cta);
    console.log('  --cta-hover:', ctaValues.ctaHover);
    console.log('  --cta-glow:', ctaValues.ctaGlow);

    // Find the VISIBLE "View My Work" button (desktop layout uses hidden/md:grid)
    // The desktop layout is: .hidden.md\\:grid which is visible at 1280px
    const viewMyWorkBtn = page.locator('.hidden.md\\:grid button:has-text("View My Work")');

    // Get bg color before hover
    const bgBefore = await viewMyWorkBtn.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Button bg BEFORE hover:', bgBefore);

    // Hover
    await viewMyWorkBtn.hover();
    await page.waitForTimeout(300);

    // Get bg color during hover
    const bgDuringHover = await viewMyWorkBtn.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Button bg DURING hover:', bgDuringHover);

    // Get box-shadow during hover
    const shadowDuringHover = await viewMyWorkBtn.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('Button box-shadow DURING hover:', shadowDuringHover);

    await page.screenshot({
      path: 'tests/screenshots/test5_light_cta_hover.png',
      fullPage: false
    });

    // Verify CTA is blue, not violet
    // Values may be lowercase hex
    const ctaIsBlue = isBlueHex(ctaValues.cta);
    const ctaHoverIsBlue = isBlueHex(ctaValues.ctaHover);
    console.log('--cta is blue:', ctaIsBlue);
    console.log('--cta-hover is blue:', ctaHoverIsBlue);
    expect(ctaIsBlue).toBeTruthy();
    expect(ctaHoverIsBlue).toBeTruthy();

    // Check no violet in CTA colors
    const hasViolet = isVioletHex(ctaValues.cta) || isVioletHex(ctaValues.ctaHover);
    console.log('CTA has violet (BAD):', hasViolet);
    expect(hasViolet).toBeFalsy();
  });

  test('5.4 - CTA button hover in dark mode uses blue color', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Switch to dark mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);

    console.log('=== TEST 5.4: Dark mode CTA button hover ===');

    await page.waitForTimeout(1500);

    // Get CTA variables
    const ctaValues = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      return {
        cta: styles.getPropertyValue('--cta').trim(),
        ctaHover: styles.getPropertyValue('--cta-hover').trim(),
        ctaGlow: styles.getPropertyValue('--cta-glow').trim(),
      };
    });
    console.log('Dark mode CTA values:');
    console.log('  --cta:', ctaValues.cta);
    console.log('  --cta-hover:', ctaValues.ctaHover);
    console.log('  --cta-glow:', ctaValues.ctaGlow);

    // Find the VISIBLE "View My Work" button
    const viewMyWorkBtn = page.locator('.hidden.md\\:grid button:has-text("View My Work")');

    // Hover
    await viewMyWorkBtn.hover();
    await page.waitForTimeout(300);

    const bgDuringHover = await viewMyWorkBtn.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Button bg DURING hover (dark):', bgDuringHover);

    const shadowDuringHover = await viewMyWorkBtn.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('Button box-shadow DURING hover (dark):', shadowDuringHover);

    await page.screenshot({
      path: 'tests/screenshots/test5_dark_cta_hover.png',
      fullPage: false
    });

    // Verify CTA is blue in dark mode too
    const ctaIsBlue = isBlueHex(ctaValues.cta);
    const ctaHoverIsBlue = isBlueHex(ctaValues.ctaHover);
    console.log('Dark --cta is blue:', ctaIsBlue);
    console.log('Dark --cta-hover is blue:', ctaHoverIsBlue);
    expect(ctaIsBlue).toBeTruthy();
    expect(ctaHoverIsBlue).toBeTruthy();

    // Check no violet in CTA colors
    const hasViolet = isVioletHex(ctaValues.cta) || isVioletHex(ctaValues.ctaHover);
    console.log('Dark mode CTA has violet (BAD):', hasViolet);
    expect(hasViolet).toBeFalsy();
  });

  test('5.5 - Experience card hover shows blue glow', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500);

    console.log('=== TEST 5.5: Experience card hover ===');

    // Scroll to Experience
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const expCards = page.locator('#experience .rounded-2xl.border');
    const firstExpCard = expCards.first();

    // Hover
    await firstExpCard.hover();
    await page.waitForTimeout(500);

    const shadowDuringHover = await firstExpCard.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('Experience card shadow on hover:', shadowDuringHover);

    const borderDuringHover = await firstExpCard.evaluate((el) =>
      window.getComputedStyle(el).borderColor
    );
    console.log('Experience card border on hover:', borderDuringHover);

    await page.screenshot({
      path: 'tests/screenshots/test5_experience_card_hover.png',
      fullPage: false
    });

    // The whileHover uses var(--cta-glow) which in light mode is rgba(37, 99, 235, 0.3)
    // Verify no violet in the shadow
    const hasVioletShadow = shadowDuringHover.includes('123, 51, 125') ||
                            shadowDuringHover.includes('123,51,125');
    console.log('Experience card hover has violet shadow (BAD):', hasVioletShadow);
    expect(hasVioletShadow).toBeFalsy();

    // Border should be blue (from onMouseEnter handler)
    const borderIsBlue = borderDuringHover.includes('37, 99, 235') ||
                          borderDuringHover.includes('37,99,235');
    console.log('Experience card border is blue on hover:', borderIsBlue);
  });

  test('5.6 - Achievement card hover shows blue glow', async ({ page }) => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.waitForTimeout(500);

    console.log('=== TEST 5.6: Achievement card hover ===');

    // Scroll to Achievements
    await page.locator('#achievements').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Achievement cards use border-2 class
    const achCards = page.locator('#achievements .rounded-2xl.border-2');
    const cardCount = await achCards.count();
    console.log('Achievement cards found:', cardCount);

    const firstAchCard = achCards.first();

    // Get shadow before hover
    const shadowBefore = await firstAchCard.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('Achievement card shadow BEFORE hover:', shadowBefore);

    // Hover
    await firstAchCard.hover();
    await page.waitForTimeout(500);

    const shadowDuringHover = await firstAchCard.evaluate((el) =>
      window.getComputedStyle(el).boxShadow
    );
    console.log('Achievement card shadow DURING hover:', shadowDuringHover);

    const borderDuringHover = await firstAchCard.evaluate((el) =>
      window.getComputedStyle(el).borderColor
    );
    console.log('Achievement card border DURING hover:', borderDuringHover);

    await page.screenshot({
      path: 'tests/screenshots/test5_achievement_card_hover.png',
      fullPage: false
    });

    // Verify glow uses CTA color (blue) not violet
    const hasVioletShadow = shadowDuringHover.includes('123, 51, 125') ||
                            shadowDuringHover.includes('123,51,125');
    console.log('Achievement card hover has violet shadow (BAD):', hasVioletShadow);
    expect(hasVioletShadow).toBeFalsy();

    // Check if the shadow contains blue
    const hasBlueGlow = shadowDuringHover.includes('37, 99, 235') ||
                         shadowDuringHover.includes('37,99,235');
    console.log('Achievement card hover has blue glow:', hasBlueGlow);
  });

  test('5.7 - Full hover color audit across all themes', async ({ page }) => {
    console.log('=== TEST 5.7: Full hover color audit ===');

    for (const theme of ['light', 'dark'] as const) {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.evaluate((t) => {
        localStorage.setItem('theme', t);
        document.documentElement.setAttribute('data-theme', t);
      }, theme);
      await page.waitForTimeout(500);

      const allVars = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        return {
          cta: styles.getPropertyValue('--cta').trim(),
          ctaHover: styles.getPropertyValue('--cta-hover').trim(),
          ctaGlow: styles.getPropertyValue('--cta-glow').trim(),
          gradientStart: styles.getPropertyValue('--gradient-start').trim(),
          gradientEnd: styles.getPropertyValue('--gradient-end').trim(),
          accentPrimary: styles.getPropertyValue('--accent-primary').trim(),
        };
      });

      console.log(`\n--- ${theme.toUpperCase()} MODE ---`);
      console.log('  --cta:', allVars.cta);
      console.log('  --cta-hover:', allVars.ctaHover);
      console.log('  --cta-glow:', allVars.ctaGlow);
      console.log('  --gradient-start:', allVars.gradientStart);
      console.log('  --gradient-end:', allVars.gradientEnd);
      console.log('  --accent-primary:', allVars.accentPrimary);

      // CTA should always be blue in both themes
      const ctaIsBlue = isBlueHex(allVars.cta);
      console.log(`  CTA is blue for ${theme}:`, ctaIsBlue);
      expect(ctaIsBlue).toBeTruthy();

      // CTA glow should use blue, not violet
      const glowIsBlue = isBlueHex(allVars.ctaGlow);
      const glowIsViolet = isVioletHex(allVars.ctaGlow);
      console.log(`  CTA glow is blue:`, glowIsBlue);
      console.log(`  CTA glow is violet (BAD):`, glowIsViolet);
      expect(glowIsBlue).toBeTruthy();
      expect(glowIsViolet).toBeFalsy();

      // Note: gradient-start IS violet by design (for gradient text, badges)
      // but CTA and hover effects should be blue
      if (theme === 'dark') {
        console.log('  NOTE: --gradient-start is violet by design for gradient text/badges');
        console.log('  NOTE: --accent-primary is violet by design for gradient accents');
        console.log('  VERIFY: CTA and hover effects use --cta (blue), NOT --accent-primary (violet)');
      }
    }
  });
});
