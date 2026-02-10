import { test, expect, Page } from "@playwright/test";
import path from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOTS_DIR = path.join(__dirname, "screenshots");

// =====================================================
// BUG FIX 1: Theme flash after React hydration
// =====================================================

test.describe("BUG FIX 1: Theme flash after React hydration", () => {
  test("Dark theme persists through full page lifecycle (no hydration flash)", async ({
    browser,
  }) => {
    // Step 1: Create a context and set dark mode in localStorage
    const context = await browser.newContext();
    const setupPage = await context.newPage();
    await setupPage.goto(BASE_URL, { waitUntil: "networkidle" });

    // Step 2: Switch to dark mode using the theme toggle
    const themeToggle = setupPage.locator("button[aria-label]").filter({ hasText: /🌙|☀️|moon|sun/i }).first();
    // Try to find the toggle button more broadly
    const toggleButton = setupPage.locator('button').filter({ has: setupPage.locator('svg') }).first();

    // Check current theme
    let currentTheme = await setupPage.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    console.log(`[Setup] Initial data-theme: ${currentTheme}`);

    // If not dark, click the theme toggle to switch to dark
    if (currentTheme !== "dark") {
      // Find theme toggle - it's typically a button with sun/moon icon
      // Look for the ThemeToggle component
      await setupPage.evaluate(() => {
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
      });
      // Reload to apply
      await setupPage.reload({ waitUntil: "networkidle" });
    }

    // Verify dark mode is active
    currentTheme = await setupPage.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    console.log(`[Setup] After toggle, data-theme: ${currentTheme}`);
    expect(currentTheme).toBe("dark");

    // Verify localStorage has dark
    const storedTheme = await setupPage.evaluate(() =>
      localStorage.getItem("theme")
    );
    console.log(`[Setup] localStorage theme: ${storedTheme}`);
    expect(storedTheme).toBe("dark");

    await setupPage.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix1-01-dark-mode-set.png"),
      fullPage: false,
    });
    await setupPage.close();

    // Step 3: Fresh page load - check at domcontentloaded
    const testPage = await context.newPage();

    // Set up a listener to capture data-theme at DOMContentLoaded
    let domContentLoadedTheme: string | null = null;
    let domContentLoadedBgColor: string | null = null;

    await testPage.addInitScript(() => {
      // This runs before any page scripts
      (window as any).__themeChecks = [];
      document.addEventListener("DOMContentLoaded", () => {
        const theme = document.documentElement.getAttribute("data-theme");
        const bg = getComputedStyle(document.documentElement).backgroundColor;
        (window as any).__themeChecks.push({
          event: "DOMContentLoaded",
          theme,
          bg,
          timestamp: Date.now(),
        });
      });
    });

    // Navigate and wait for domcontentloaded
    await testPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    // Checkpoint A: At DOMContentLoaded
    domContentLoadedTheme = await testPage.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    domContentLoadedBgColor = await testPage.evaluate(() =>
      getComputedStyle(document.documentElement).backgroundColor
    );

    console.log(
      `[Checkpoint A - DOMContentLoaded] data-theme: ${domContentLoadedTheme}`
    );
    console.log(
      `[Checkpoint A - DOMContentLoaded] background-color: ${domContentLoadedBgColor}`
    );

    await testPage.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix1-02-domcontentloaded.png"),
      fullPage: false,
    });

    expect(domContentLoadedTheme).toBe("dark");

    // Step 4: Wait for full hydration
    await testPage.waitForLoadState("networkidle");
    await testPage.waitForTimeout(1000); // Extra wait for React hydration

    // Checkpoint B: After full hydration
    const postHydrationTheme = await testPage.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    const postHydrationBgColor = await testPage.evaluate(() =>
      getComputedStyle(document.documentElement).backgroundColor
    );

    console.log(
      `[Checkpoint B - Post Hydration] data-theme: ${postHydrationTheme}`
    );
    console.log(
      `[Checkpoint B - Post Hydration] background-color: ${postHydrationBgColor}`
    );

    await testPage.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix1-03-post-hydration.png"),
      fullPage: false,
    });

    expect(postHydrationTheme).toBe("dark");
    // Background should be dark - rgb(9, 9, 11) or similar dark color
    const bgColorMatch = postHydrationBgColor!.match(
      /rgb\((\d+),\s*(\d+),\s*(\d+)\)/
    );
    if (bgColorMatch) {
      const [, r, g, b] = bgColorMatch.map(Number);
      console.log(`[Checkpoint B] RGB values: R=${r}, G=${g}, B=${b}`);
      expect(r).toBeLessThan(30);
      expect(g).toBeLessThan(30);
      expect(b).toBeLessThan(30);
    }

    // Retrieve the DOMContentLoaded captured check
    const themeChecks = await testPage.evaluate(
      () => (window as any).__themeChecks
    );
    console.log(`[Theme checks from initScript]:`, JSON.stringify(themeChecks));

    await testPage.close();
    await context.close();
  });

  test("Dark theme persists with slow JS (200ms delay on all JS)", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const testPage = await context.newPage();

    // Set localStorage for dark mode
    await testPage.goto(BASE_URL, { waitUntil: "networkidle" });
    await testPage.evaluate(() => {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    });

    // Verify dark is set
    const preTheme = await testPage.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    console.log(`[Slow JS Setup] Pre-navigation theme: ${preTheme}`);

    // Add 200ms artificial delay to ALL JS responses
    await testPage.route("**/*.js", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.continue();
    });

    // Also delay JS chunks
    await testPage.route("**/*.js?*", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      await route.continue();
    });

    // Navigate fresh with slow JS
    await testPage.goto(BASE_URL, { waitUntil: "domcontentloaded" });

    // Checkpoint A: At DOMContentLoaded (JS should still be loading due to delays)
    const slowDomTheme = await testPage.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    const slowDomBg = await testPage.evaluate(() =>
      getComputedStyle(document.documentElement).backgroundColor
    );

    console.log(
      `[Slow JS - Checkpoint A - DOMContentLoaded] data-theme: ${slowDomTheme}`
    );
    console.log(
      `[Slow JS - Checkpoint A - DOMContentLoaded] background-color: ${slowDomBg}`
    );

    await testPage.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix1-04-slow-js-domcontentloaded.png"),
      fullPage: false,
    });

    expect(slowDomTheme).toBe("dark");

    // Wait for full hydration with slow JS
    await testPage.waitForLoadState("networkidle");
    await testPage.waitForTimeout(1500); // Extra time for delayed hydration

    // Checkpoint B: After hydration with slow JS
    const slowHydrationTheme = await testPage.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
    const slowHydrationBg = await testPage.evaluate(() =>
      getComputedStyle(document.documentElement).backgroundColor
    );

    console.log(
      `[Slow JS - Checkpoint B - Post Hydration] data-theme: ${slowHydrationTheme}`
    );
    console.log(
      `[Slow JS - Checkpoint B - Post Hydration] background-color: ${slowHydrationBg}`
    );

    await testPage.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix1-05-slow-js-post-hydration.png"),
      fullPage: false,
    });

    expect(slowHydrationTheme).toBe("dark");
    // Verify dark background
    const bgMatch = slowHydrationBg!.match(
      /rgb\((\d+),\s*(\d+),\s*(\d+)\)/
    );
    if (bgMatch) {
      const [, r, g, b] = bgMatch.map(Number);
      console.log(`[Slow JS - Checkpoint B] RGB values: R=${r}, G=${g}, B=${b}`);
      expect(r).toBeLessThan(30);
      expect(g).toBeLessThan(30);
      expect(b).toBeLessThan(30);
    }

    await testPage.close();
    await context.close();
  });
});

// =====================================================
// BUG FIX 2: Mobile scroll spy backward navigation
// =====================================================

test.describe("BUG FIX 2: Mobile scroll spy backward navigation", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("Backward scroll correctly updates active nav state", async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(500); // Let IntersectionObservers initialize

    // Helper: get current URL hash
    const getHash = () => page.evaluate(() => window.location.hash);

    // Helper: open hamburger menu and get active item
    const getActiveMenuItem = async (): Promise<string | null> => {
      // Click hamburger to open menu
      const hamburger = page.locator('button[aria-label="Toggle menu"]');
      await hamburger.click();
      await page.waitForTimeout(400); // Wait for menu animation

      // Find the active menu item - it has color matching --cta
      // The active item has a gradient left accent bar (a <span> child with gradient)
      const menuItems = page.locator(
        'div.fixed.w-80 button.text-2xl'
      );

      const count = await menuItems.count();
      let activeItem: string | null = null;

      for (let i = 0; i < count; i++) {
        const item = menuItems.nth(i);
        // Check if it has the active accent bar (span with gradient background)
        const accentBar = item.locator("span.absolute");
        const hasAccent = (await accentBar.count()) > 0;
        if (hasAccent) {
          activeItem = await item.textContent();
          if (activeItem) activeItem = activeItem.trim();
        }
      }

      // Take screenshot with menu open
      // Close menu
      await hamburger.click();
      await page.waitForTimeout(300);

      return activeItem;
    };

    // Helper: scroll to a section by scrolling the element into view
    const scrollToSection = async (sectionId: string) => {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "start" });
        }
      }, sectionId);
      await page.waitForTimeout(800); // Wait for IntersectionObserver to fire
    };

    // --- STEP 1: Scroll DOWN to Skills ---
    console.log("\n--- Step 1: Scroll DOWN to Skills ---");
    await scrollToSection("skills");

    let hash = await getHash();
    console.log(`After scrolling to Skills: hash = "${hash}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-01-at-skills.png"),
      fullPage: false,
    });

    expect(hash).toBe("#skills");

    // Check active menu item
    let activeItem = await getActiveMenuItem();
    console.log(`Active menu item at Skills: "${activeItem}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-02-skills-menu.png"),
      fullPage: false,
    });

    expect(activeItem).toBe("Skills");

    // --- STEP 2: Scroll BACKWARD (UP) to Experience ---
    console.log("\n--- Step 2: Scroll BACKWARD to Experience ---");
    await scrollToSection("experience");

    hash = await getHash();
    console.log(`After scrolling backward to Experience: hash = "${hash}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-03-at-experience.png"),
      fullPage: false,
    });

    expect(hash).toBe("#experience");

    activeItem = await getActiveMenuItem();
    console.log(`Active menu item at Experience: "${activeItem}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-04-experience-menu.png"),
      fullPage: false,
    });

    expect(activeItem).toBe("Experience");

    // --- STEP 3: Scroll BACKWARD to Hero/top ---
    console.log("\n--- Step 3: Scroll BACKWARD to Hero ---");
    await scrollToSection("hero");

    hash = await getHash();
    console.log(`After scrolling backward to Hero: hash = "${hash}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-05-at-hero.png"),
      fullPage: false,
    });

    // Hash should be empty or "#hero" or just the path
    expect(hash === "" || hash === "#hero" || hash === "#").toBeTruthy();

    activeItem = await getActiveMenuItem();
    console.log(`Active menu item at Hero: "${activeItem}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-06-hero-menu.png"),
      fullPage: false,
    });

    expect(activeItem).toBe("Home");

    // --- STEP 4: Extended backward scroll sequence ---
    // Scroll to Contact
    console.log("\n--- Step 4: Scroll DOWN to Contact ---");
    await scrollToSection("contact");

    hash = await getHash();
    console.log(`At Contact: hash = "${hash}"`);

    activeItem = await getActiveMenuItem();
    console.log(`Active menu item at Contact: "${activeItem}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-07-contact-menu.png"),
      fullPage: false,
    });

    expect(hash).toBe("#contact");
    expect(activeItem).toBe("Contact");

    // Scroll backward to Achievements
    console.log("\n--- Step 5: Scroll BACKWARD to Achievements ---");
    await scrollToSection("achievements");

    hash = await getHash();
    console.log(`After backward scroll to Achievements: hash = "${hash}"`);

    activeItem = await getActiveMenuItem();
    console.log(`Active menu item at Achievements: "${activeItem}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-08-achievements-menu.png"),
      fullPage: false,
    });

    expect(hash).toBe("#achievements");
    expect(activeItem).toBe("Achievements");

    // Scroll backward to Projects
    console.log("\n--- Step 6: Scroll BACKWARD to Projects ---");
    await scrollToSection("projects");

    hash = await getHash();
    console.log(`After backward scroll to Projects: hash = "${hash}"`);

    activeItem = await getActiveMenuItem();
    console.log(`Active menu item at Projects: "${activeItem}"`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, "bugfix2-09-projects-menu.png"),
      fullPage: false,
    });

    expect(hash).toBe("#projects");
    expect(activeItem).toBe("Projects");
  });
});
