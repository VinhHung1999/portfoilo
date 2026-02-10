import { test, expect, Page } from "@playwright/test";

const SCREENSHOT_DIR = "tests/screenshots/nav-hash";

// Helper: wait for scroll to settle and IntersectionObserver to fire
async function waitForScrollSettle(page: Page, ms = 1500) {
  await page.waitForTimeout(ms);
}

// Helper: scroll to a section by ID
async function scrollToSectionById(page: Page, sectionId: string) {
  await page.evaluate((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, sectionId);
  await waitForScrollSettle(page);
}

// Helper: get the active nav button text (desktop)
async function getActiveDesktopNavText(page: Page): Promise<string | null> {
  // Active nav button has an underline span child (the gradient bar)
  // We look for the button whose child span has the gradient background
  const activeButton = page.locator(
    'header nav .hidden.md\\:flex button'
  );
  const count = await activeButton.count();
  for (let i = 0; i < count; i++) {
    const btn = activeButton.nth(i);
    const color = await btn.evaluate((el) => el.style.color);
    if (color && color.includes("var(--cta)")) {
      return btn.innerText();
    }
  }
  return null;
}

// Helper: get active section from useActiveSection state via color check
async function getActiveNavByColor(page: Page): Promise<string | null> {
  const buttons = page.locator('header nav .hidden.md\\:flex button');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    const btn = buttons.nth(i);
    const style = await btn.getAttribute("style");
    if (style && style.includes("var(--cta)")) {
      return (await btn.innerText()).trim();
    }
  }
  return null;
}

// Helper: check if a desktop nav button has the gradient underline bar
async function hasGradientUnderline(page: Page, linkName: string): Promise<boolean> {
  const buttons = page.locator('header nav .hidden.md\\:flex button');
  const count = await buttons.count();
  for (let i = 0; i < count; i++) {
    const btn = buttons.nth(i);
    const text = (await btn.innerText()).trim();
    if (text === linkName.toUpperCase() || text === linkName) {
      // Check for the gradient underline span
      const underline = btn.locator('span');
      const underlineCount = await underline.count();
      for (let j = 0; j < underlineCount; j++) {
        const span = underline.nth(j);
        const bg = await span.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return style.backgroundImage || style.background;
        });
        if (bg && bg.includes("gradient")) {
          return true;
        }
      }
    }
  }
  return false;
}

// ================================================================
// TEST 1: NAV ACTIVE STATE (Scroll Spy) - DESKTOP
// ================================================================
test.describe("TEST 1: Nav Active State - Desktop (1440x900)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("1.1 Home nav link is active by default on page load", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    const activeNav = await getActiveNavByColor(page);
    console.log(`[1.1] Active nav on load: ${activeNav}`);
    expect(activeNav).toBe("HOME");

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-01-home-active.png`, fullPage: false });
  });

  test("1.2 Active nav has gradient underline and CTA text color", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    // Check CTA color on Home
    const homeBtn = page.locator('header nav .hidden.md\\:flex button').first();
    const homeColor = await homeBtn.evaluate((el) => el.style.color);
    console.log(`[1.2] Home button color: ${homeColor}`);
    expect(homeColor).toContain("var(--cta)");

    // Check gradient underline
    const hasUnderline = await hasGradientUnderline(page, "HOME");
    console.log(`[1.2] Home has gradient underline: ${hasUnderline}`);
    expect(hasUnderline).toBe(true);
  });

  test("1.3 Scroll through each section - nav updates correctly", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    const sections = [
      { id: "experience", name: "EXPERIENCE" },
      { id: "projects", name: "PROJECTS" },
      { id: "skills", name: "SKILLS" },
      { id: "achievements", name: "ACHIEVEMENTS" },
      { id: "contact", name: "CONTACT" },
    ];

    for (const section of sections) {
      await scrollToSectionById(page, section.id);

      const activeNav = await getActiveNavByColor(page);
      console.log(`[1.3] Scrolled to ${section.id} -> Active nav: ${activeNav}`);

      // Check CTA color
      expect(activeNav).toBe(section.name);

      // Check gradient underline
      const hasUnderline = await hasGradientUnderline(page, section.name);
      console.log(`[1.3] ${section.name} has gradient underline: ${hasUnderline}`);
      expect(hasUnderline).toBe(true);

      await page.screenshot({
        path: `${SCREENSHOT_DIR}/desktop-02-scroll-${section.id}.png`,
        fullPage: false,
      });
    }
  });

  test("1.4 Scroll back to top - Home becomes active again", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    // Scroll down to Projects first
    await scrollToSectionById(page, "projects");
    let activeNav = await getActiveNavByColor(page);
    console.log(`[1.4] After scrolling to projects: ${activeNav}`);
    expect(activeNav).toBe("PROJECTS");

    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await waitForScrollSettle(page);

    activeNav = await getActiveNavByColor(page);
    console.log(`[1.4] After scrolling back to top: ${activeNav}`);
    expect(activeNav).toBe("HOME");

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-03-scroll-back-top.png`, fullPage: false });
  });

  test("1.5 Edge case: scroll to very bottom - Contact stays active", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    // Scroll to absolute bottom of page
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await waitForScrollSettle(page);

    const activeNav = await getActiveNavByColor(page);
    console.log(`[1.5] At very bottom: ${activeNav}`);
    expect(activeNav).toBe("CONTACT");

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-04-very-bottom.png`, fullPage: false });
  });
});

// ================================================================
// TEST 1: NAV ACTIVE STATE (Scroll Spy) - MOBILE
// ================================================================
test.describe("TEST 1: Nav Active State - Mobile (375x812)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("1.6a Mobile menu shows active state with CTA color and left accent bar (forward scroll)", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    // Scroll forward to Skills section (far enough from Hero)
    await scrollToSectionById(page, "skills");
    await page.waitForTimeout(1500);

    const hash = await page.evaluate(() => window.location.hash);
    console.log(`[1.6a] URL hash after scrolling to skills: ${hash}`);

    // Open hamburger menu
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await hamburger.click();
    await page.waitForTimeout(1200);

    const mobileMenuPanel = page.locator('.fixed.top-0.right-0.bottom-0');
    const mobileMenuButtons = mobileMenuPanel.locator('button');
    const count = await mobileMenuButtons.count();

    let activeButtonName: string | null = null;
    for (let i = 0; i < count; i++) {
      const btn = mobileMenuButtons.nth(i);
      const text = (await btn.innerText()).trim();
      const style = await btn.getAttribute("style");
      console.log(`[1.6a] Mobile btn[${i}]: "${text}" style="${style}"`);
      if (style && style.includes("var(--cta)")) {
        activeButtonName = text;
      }
    }
    console.log(`[1.6a] Active mobile button: ${activeButtonName}`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile-01a-menu-skills.png`, fullPage: false });

    // Verify Skills is active
    expect(activeButtonName).toBe("Skills");

    // Check the accent bar on Skills button
    const skillsBtn = mobileMenuButtons.filter({ hasText: "Skills" }).first();
    const accentBars = skillsBtn.locator('span');
    const accentCount = await accentBars.count();
    let hasAccent = false;
    for (let j = 0; j < accentCount; j++) {
      const span = accentBars.nth(j);
      const bg = await span.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return computed.backgroundImage || computed.background;
      });
      const width = await span.evaluate((el) => {
        return window.getComputedStyle(el).width;
      });
      console.log(`[1.6a] Skills accent bar bg: ${bg}, width: ${width}`);
      if (bg && bg.includes("gradient") && width === "3px") {
        hasAccent = true;
      }
    }
    console.log(`[1.6a] Skills has left accent bar: ${hasAccent}`);
    expect(hasAccent).toBe(true);
  });

  test("1.6b Mobile scroll spy: backward scroll to Experience (BUG)", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    // First scroll far down to Skills
    await scrollToSectionById(page, "skills");
    await page.waitForTimeout(1500);

    // Now scroll backward to Experience
    await scrollToSectionById(page, "experience");
    await page.waitForTimeout(2000); // extra time for observer

    const hash = await page.evaluate(() => window.location.hash);
    console.log(`[1.6b] URL hash after scrolling backward to experience: ${hash}`);

    // Check if the viewport is actually at Experience
    const expTop = await page.evaluate(() => {
      const el = document.getElementById("experience");
      return el ? el.getBoundingClientRect().top : null;
    });
    console.log(`[1.6b] Experience section top offset: ${expTop}`);

    // Open hamburger menu
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await hamburger.click();
    await page.waitForTimeout(1200);

    const mobileMenuPanel = page.locator('.fixed.top-0.right-0.bottom-0');
    const mobileMenuButtons = mobileMenuPanel.locator('button');
    const count = await mobileMenuButtons.count();

    let activeButtonName: string | null = null;
    for (let i = 0; i < count; i++) {
      const btn = mobileMenuButtons.nth(i);
      const text = (await btn.innerText()).trim();
      const style = await btn.getAttribute("style");
      console.log(`[1.6b] Mobile btn[${i}]: "${text}" style="${style}"`);
      if (style && style.includes("var(--cta)")) {
        activeButtonName = text;
      }
    }
    console.log(`[1.6b] Active mobile button after backward scroll: ${activeButtonName}`);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile-01b-menu-experience.png`, fullPage: false });

    // KNOWN BUG: On mobile 375x812, scrolling backward to Experience from Skills
    // does not update the scroll spy. The observer rootMargin "-80px 0px -40% 0px"
    // and threshold 0.3 means Experience needs 30% visibility in the reduced viewport,
    // which may not trigger when sections are tall on mobile.
    if (activeButtonName !== "Experience") {
      console.log(`[1.6b] BUG CONFIRMED: Scroll spy stuck on "${activeButtonName}" instead of "Experience" on mobile (375x812)`);
      console.log(`[1.6b] Root cause: IntersectionObserver rootMargin and threshold not tuned for mobile viewports`);
    }
    expect(activeButtonName).toBe("Experience");
  });
});

// ================================================================
// TEST 2: URL HASH SYNC
// ================================================================
test.describe("TEST 2: URL Hash Sync", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("2.1 Scroll to sections updates URL hash", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    // Initial: no hash
    let url = page.url();
    console.log(`[2.1] Initial URL: ${url}`);
    expect(new URL(url).hash).toBe("");

    const sections = [
      { id: "experience", hash: "#experience" },
      { id: "projects", hash: "#projects" },
      { id: "skills", hash: "#skills" },
      { id: "achievements", hash: "#achievements" },
      { id: "contact", hash: "#contact" },
    ];

    for (const section of sections) {
      await scrollToSectionById(page, section.id);
      url = page.url();
      const currentHash = new URL(url).hash;
      console.log(`[2.1] Scrolled to ${section.id} -> URL hash: ${currentHash}`);
      expect(currentHash).toBe(section.hash);
    }

    // Scroll back to top -> hash should clear
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await waitForScrollSettle(page);
    url = page.url();
    const topHash = new URL(url).hash;
    console.log(`[2.1] Scrolled back to top -> URL hash: "${topHash}"`);
    // Should be empty or just the pathname
    expect(topHash).toBe("");
  });

  test("2.2 Nav click updates URL hash AND scrolls to section", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    // Click "Projects" nav link
    const projectsBtn = page.locator('header nav .hidden.md\\:flex button', { hasText: "Projects" });
    await projectsBtn.click();
    await waitForScrollSettle(page, 2000);

    // Verify URL hash
    let url = page.url();
    console.log(`[2.2] After clicking Projects -> URL: ${url}`);
    expect(new URL(url).hash).toBe("#projects");

    // Verify the page scrolled to Projects section (section should be near viewport top)
    const projectsSectionTop = await page.evaluate(() => {
      const el = document.getElementById("projects");
      return el ? el.getBoundingClientRect().top : null;
    });
    console.log(`[2.2] Projects section top offset: ${projectsSectionTop}`);
    expect(projectsSectionTop).not.toBeNull();
    expect(Math.abs(projectsSectionTop!)).toBeLessThan(200); // Within 200px of viewport top

    // Click "Contact" nav link
    const contactBtn = page.locator('header nav .hidden.md\\:flex button', { hasText: "Contact" });
    await contactBtn.click();
    await waitForScrollSettle(page, 2000);

    url = page.url();
    console.log(`[2.2] After clicking Contact -> URL: ${url}`);
    expect(new URL(url).hash).toBe("#contact");

    const contactSectionTop = await page.evaluate(() => {
      const el = document.getElementById("contact");
      return el ? el.getBoundingClientRect().top : null;
    });
    console.log(`[2.2] Contact section top offset: ${contactSectionTop}`);
    expect(contactSectionTop).not.toBeNull();
    expect(Math.abs(contactSectionTop!)).toBeLessThan(200);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-05-nav-click-contact.png`, fullPage: false });
  });

  test("2.3 Page load with hash scrolls to section and activates nav", async ({ page }) => {
    // Navigate directly with hash
    await page.goto("/#experience", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 3000); // Extra time for scroll on load

    // Verify Experience nav is active
    const activeNav = await getActiveNavByColor(page);
    console.log(`[2.3] Active nav after loading /#experience: ${activeNav}`);
    expect(activeNav).toBe("EXPERIENCE");

    // Verify page scrolled to Experience section
    const sectionTop = await page.evaluate(() => {
      const el = document.getElementById("experience");
      return el ? el.getBoundingClientRect().top : null;
    });
    console.log(`[2.3] Experience section top offset: ${sectionTop}`);
    expect(sectionTop).not.toBeNull();
    expect(Math.abs(sectionTop!)).toBeLessThan(200);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-06-load-with-hash.png`, fullPage: false });
  });

  test("2.4 Browser back/forward navigates between sections", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForScrollSettle(page, 2000);

    // Click "Projects" (pushState)
    const projectsBtn = page.locator('header nav .hidden.md\\:flex button', { hasText: "Projects" });
    await projectsBtn.click();
    await waitForScrollSettle(page, 2000);

    let url = page.url();
    console.log(`[2.4] After clicking Projects: ${url}`);
    expect(new URL(url).hash).toBe("#projects");

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-07-before-back.png`, fullPage: false });

    // Click "Skills" (pushState)
    const skillsBtn = page.locator('header nav .hidden.md\\:flex button', { hasText: "Skills" });
    await skillsBtn.click();
    await waitForScrollSettle(page, 2000);

    url = page.url();
    console.log(`[2.4] After clicking Skills: ${url}`);
    expect(new URL(url).hash).toBe("#skills");

    // Press browser Back
    await page.goBack();
    await waitForScrollSettle(page, 2000);

    url = page.url();
    const backHash = new URL(url).hash;
    console.log(`[2.4] After Back -> URL hash: ${backHash}`);
    expect(backHash).toBe("#projects");

    // Verify page navigated to Projects section
    const projectsSectionTop = await page.evaluate(() => {
      const el = document.getElementById("projects");
      return el ? el.getBoundingClientRect().top : null;
    });
    console.log(`[2.4] Projects section top after back: ${projectsSectionTop}`);
    expect(projectsSectionTop).not.toBeNull();
    expect(Math.abs(projectsSectionTop!)).toBeLessThan(300);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-08-after-back.png`, fullPage: false });

    // Press browser Forward
    await page.goForward();
    await waitForScrollSettle(page, 2000);

    url = page.url();
    const fwdHash = new URL(url).hash;
    console.log(`[2.4] After Forward -> URL hash: ${fwdHash}`);
    expect(fwdHash).toBe("#skills");

    // Verify page navigated to Skills section
    const skillsSectionTop = await page.evaluate(() => {
      const el = document.getElementById("skills");
      return el ? el.getBoundingClientRect().top : null;
    });
    console.log(`[2.4] Skills section top after forward: ${skillsSectionTop}`);
    expect(skillsSectionTop).not.toBeNull();
    expect(Math.abs(skillsSectionTop!)).toBeLessThan(300);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-09-after-forward.png`, fullPage: false });
  });
});
