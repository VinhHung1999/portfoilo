import { test, expect } from '@playwright/test';

const SCREENSHOT_DIR = 'tests/screenshots';

test.describe('Sprint 9 QA - Portfolio Integrity', () => {

  // ========== TEST 1: Portfolio Renders All 6 Sections ==========
  test('TEST 1: All 6 sections render correctly', async ({ page }) => {
    console.log('=== TEST 1: Portfolio Renders Correctly ===');

    // Navigate to main portfolio (NOT /admin)
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for Framer Motion animations
    await page.waitForTimeout(2000);

    // 1.1: HeroAbout section
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();
    // Check name is rendered (desktop layout h1 is inside the md:grid container)
    const heroName = page.locator('#hero h1').filter({ hasText: /.+/ });
    // At 1280px desktop viewport, the desktop h1 is visible
    const visibleNames = await heroName.all();
    let nameText = '';
    for (const el of visibleNames) {
      if (await el.isVisible()) {
        nameText = await el.textContent() || '';
        break;
      }
    }
    console.log(`1.1: HeroAbout - Name: "${nameText}"`);
    expect(nameText).toBeTruthy();

    // Check tagline (h2) - find the visible one
    const taglines = page.locator('#hero h2');
    let taglineText = '';
    for (const el of await taglines.all()) {
      if (await el.isVisible()) {
        taglineText = await el.textContent() || '';
        break;
      }
    }
    console.log(`1.1: HeroAbout - Tagline: "${taglineText}"`);
    expect(taglineText).toBeTruthy();

    // Check CTAs - at least one "View My Work" and "Get in Touch" are visible
    const viewWorkBtn = page.locator('button:has-text("View My Work")');
    const viewWorkVisible = await viewWorkBtn.first().isVisible() || await viewWorkBtn.last().isVisible();
    expect(viewWorkVisible).toBe(true);
    const getInTouchBtn = page.locator('button:has-text("Get in Touch")');
    const getInTouchVisible = await getInTouchBtn.first().isVisible() || await getInTouchBtn.last().isVisible();
    expect(getInTouchVisible).toBe(true);
    console.log('1.1: PASS - HeroAbout: Name, tagline, CTAs all visible');

    // Take hero screenshot
    await page.screenshot({ path: `${SCREENSHOT_DIR}/T1-hero-section.png`, fullPage: false });
    console.log('1.1: Screenshot saved: T1-hero-section.png');

    // 1.2: Experience section
    const experienceSection = page.locator('#experience');
    await experienceSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await expect(experienceSection).toBeVisible();
    // Check for experience heading or content
    const expContent = experienceSection.locator('*').first();
    await expect(expContent).toBeVisible();
    console.log('1.2: PASS - Experience section visible');

    // Take experience screenshot
    await page.screenshot({ path: `${SCREENSHOT_DIR}/T1-experience-section.png`, fullPage: false });
    console.log('1.2: Screenshot saved: T1-experience-section.png');

    // 1.3: Skills section
    const skillsSection = page.locator('#skills');
    await skillsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await expect(skillsSection).toBeVisible();
    console.log('1.3: PASS - Skills section visible');

    // 1.4: Projects section
    const projectsSection = page.locator('#projects');
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await expect(projectsSection).toBeVisible();
    console.log('1.4: PASS - Projects section visible');

    // 1.5: Achievements section
    const achievementsSection = page.locator('#achievements');
    await achievementsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await expect(achievementsSection).toBeVisible();
    console.log('1.5: PASS - Achievements section visible');

    // 1.6: Contact section
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await expect(contactSection).toBeVisible();
    console.log('1.6: PASS - Contact section visible');

    // Take contact screenshot
    await page.screenshot({ path: `${SCREENSHOT_DIR}/T1-contact-section.png`, fullPage: false });
    console.log('1.6: Screenshot saved: T1-contact-section.png');

    // 1.7: Navigation bar
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();
    console.log('1.7: PASS - Navigation bar exists');

    // Verify nav links
    const expectedNavLinks = ['Home', 'Experience', 'Projects', 'Skills', 'Achievements', 'Contact'];
    for (const linkName of expectedNavLinks) {
      const navBtn = nav.locator(`button:has-text("${linkName}")`);
      await expect(navBtn).toBeVisible();
    }
    console.log(`1.7: PASS - All ${expectedNavLinks.length} nav links present: ${expectedNavLinks.join(', ')}`);

    console.log('=== TEST 1: ALL PASS ===');
  });

  // ========== TEST 2: Light + Dark Mode ==========
  test('TEST 2: Light and Dark mode toggle', async ({ page }) => {
    console.log('=== TEST 2: Light + Dark Mode ===');

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // 2.1: Find the theme toggle button
    const themeToggle = page.locator('button[aria-label*="Switch to"]').first();
    await expect(themeToggle).toBeVisible();
    const initialLabel = await themeToggle.getAttribute('aria-label');
    console.log(`2.1: PASS - Theme toggle found with label: "${initialLabel}"`);

    // Get initial theme
    const initialTheme = await page.locator('html').getAttribute('data-theme');
    console.log(`2.1: Initial theme: "${initialTheme}"`);

    // Take screenshot of initial mode
    await page.screenshot({ path: `${SCREENSHOT_DIR}/T2-initial-mode-${initialTheme}.png`, fullPage: false });
    console.log(`2.1: Screenshot saved: T2-initial-mode-${initialTheme}.png`);

    // Get initial background color
    const initialBg = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
    });
    console.log(`2.1: Initial --bg-primary: "${initialBg}"`);

    // 2.2: Click theme toggle to switch
    await themeToggle.click();
    await page.waitForTimeout(500);

    const newTheme = await page.locator('html').getAttribute('data-theme');
    console.log(`2.2: After toggle, theme: "${newTheme}"`);
    expect(newTheme).not.toBe(initialTheme);
    console.log('2.2: PASS - Theme changed');

    // 2.3: Verify colors changed
    const newBg = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
    });
    console.log(`2.3: New --bg-primary: "${newBg}"`);
    expect(newBg).not.toBe(initialBg);
    console.log('2.3: PASS - Background color changed');

    // Verify text color changed
    const newTextColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    });
    console.log(`2.3: New --text-primary: "${newTextColor}"`);

    // Take screenshot of toggled mode
    await page.screenshot({ path: `${SCREENSHOT_DIR}/T2-toggled-mode-${newTheme}.png`, fullPage: false });
    console.log(`2.3: Screenshot saved: T2-toggled-mode-${newTheme}.png`);

    // 2.4: Switch back
    const themeToggle2 = page.locator('button[aria-label*="Switch to"]').first();
    await themeToggle2.click();
    await page.waitForTimeout(500);

    const restoredTheme = await page.locator('html').getAttribute('data-theme');
    expect(restoredTheme).toBe(initialTheme);
    console.log(`2.4: PASS - Theme restored to "${restoredTheme}"`);

    // Verify background restored
    const restoredBg = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
    });
    expect(restoredBg).toBe(initialBg);
    console.log('2.4: PASS - Colors restored');

    // Take screenshot of restored mode
    await page.screenshot({ path: `${SCREENSHOT_DIR}/T2-restored-mode-${restoredTheme}.png`, fullPage: false });
    console.log(`2.4: Screenshot saved: T2-restored-mode-${restoredTheme}.png`);

    console.log('=== TEST 2: ALL PASS ===');
  });
});
