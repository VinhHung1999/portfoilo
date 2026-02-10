import { test, expect, Page } from "@playwright/test";

const BASE = "http://localhost:3000";
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 812 };

// Helper: scroll to the Projects section
async function scrollToProjects(page: Page) {
  await page.evaluate(() => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(800);
}

// Helper: get the first project TiltCard's inner motion div
async function getFirstCard(page: Page) {
  // TiltCard: outer div has perspective, inner div is the motion.div with transform
  // The structure is: div[style*=perspective] > div (motion.div with tiltStyle)
  return page.locator('#projects [style*="perspective"] > div').first();
}

// Helper: parse transform string for rotateX/rotateY
function parseRotation(transform: string) {
  const xMatch = transform.match(/rotateX\(([-\d.]+)deg\)/);
  const yMatch = transform.match(/rotateY\(([-\d.]+)deg\)/);
  return {
    rotateX: xMatch ? parseFloat(xMatch[1]) : 0,
    rotateY: yMatch ? parseFloat(yMatch[1]) : 0,
  };
}

// ======================================================
// TEST 3: PROJECTS 3D TILT CARDS
// ======================================================

test.describe("TEST 3: Projects 3D Tilt Cards", () => {
  // ---- Desktop (1440x900) ----
  test.describe("Desktop (1440x900)", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await scrollToProjects(page);
    });

    test("T3.1-3: Project cards exist (at least 3 cards)", async ({ page }) => {
      // Cards live inside TiltCard wrappers with perspective
      const perspectiveWrappers = page.locator('#projects [style*="perspective"]');
      const count = await perspectiveWrappers.count();
      console.log(`[T3.1-3] Found ${count} project cards with perspective wrappers`);
      expect(count).toBeGreaterThanOrEqual(3);
    });

    test("T3.4: Card parent has perspective: 1000px", async ({ page }) => {
      const wrapper = page.locator('#projects [style*="perspective"]').first();
      const style = await wrapper.getAttribute("style");
      console.log(`[T3.4] Perspective wrapper style: ${style}`);
      expect(style).toContain("perspective");
      expect(style).toContain("1000px");
    });

    test("T3.5: Cards have transform-style: preserve-3d", async ({ page }) => {
      const card = await getFirstCard(page);
      const transformStyle = await card.evaluate(
        (el) => getComputedStyle(el).transformStyle
      );
      console.log(`[T3.5] transformStyle: ${transformStyle}`);
      expect(transformStyle).toBe("preserve-3d");
    });
  });

  // ---- Tilt Effect ----
  test.describe("Tilt Effect", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await scrollToProjects(page);
    });

    test("T3.6-10: Hover tilt at top-left, bottom-right, center", async ({ page }) => {
      const card = await getFirstCard(page);
      const box = await card.boundingBox();
      expect(box).not.toBeNull();

      // 6-7: Hover top-left corner
      await page.mouse.move(box!.x + 10, box!.y + 10);
      await page.waitForTimeout(300);

      let transform = await card.evaluate(
        (el) => getComputedStyle(el).transform
      );
      let inlineStyle = await card.getAttribute("style");
      console.log(`[T3.6-7] Top-left inline style: ${inlineStyle}`);
      console.log(`[T3.6-7] Top-left computed transform: ${transform}`);

      // The inline style should contain rotateX and rotateY
      expect(inlineStyle).toContain("rotateX");
      expect(inlineStyle).toContain("rotateY");

      // 8: Angles within ±8 degrees
      const rotTL = parseRotation(inlineStyle || "");
      console.log(`[T3.8] Top-left rotateX=${rotTL.rotateX}, rotateY=${rotTL.rotateY}`);
      expect(Math.abs(rotTL.rotateX)).toBeLessThanOrEqual(8);
      expect(Math.abs(rotTL.rotateY)).toBeLessThanOrEqual(8);
      // At top-left: rotateX should be positive (tilted away at top), rotateY should be negative
      expect(rotTL.rotateX).toBeGreaterThan(0);
      expect(rotTL.rotateY).toBeLessThan(0);

      // 9: Move to bottom-right corner - angles should change direction
      await page.mouse.move(box!.x + box!.width - 10, box!.y + box!.height - 10);
      await page.waitForTimeout(300);

      inlineStyle = await card.getAttribute("style");
      const rotBR = parseRotation(inlineStyle || "");
      console.log(`[T3.9] Bottom-right rotateX=${rotBR.rotateX}, rotateY=${rotBR.rotateY}`);
      expect(Math.abs(rotBR.rotateX)).toBeLessThanOrEqual(8);
      expect(Math.abs(rotBR.rotateY)).toBeLessThanOrEqual(8);
      // At bottom-right: rotateX should be negative, rotateY should be positive
      expect(rotBR.rotateX).toBeLessThan(0);
      expect(rotBR.rotateY).toBeGreaterThan(0);

      // Take screenshot of tilt position
      await page.screenshot({
        path: "tests/screenshots/t3-tilt-bottom-right.png",
        fullPage: false,
      });

      // 10: Move to center - angles should be near 0
      await page.mouse.move(
        box!.x + box!.width / 2,
        box!.y + box!.height / 2
      );
      await page.waitForTimeout(300);

      inlineStyle = await card.getAttribute("style");
      const rotCenter = parseRotation(inlineStyle || "");
      console.log(`[T3.10] Center rotateX=${rotCenter.rotateX}, rotateY=${rotCenter.rotateY}`);
      expect(Math.abs(rotCenter.rotateX)).toBeLessThan(2);
      expect(Math.abs(rotCenter.rotateY)).toBeLessThan(2);
    });

    test("T3.11: Screenshots showing different tilt positions", async ({ page }) => {
      const card = await getFirstCard(page);
      const box = await card.boundingBox();
      expect(box).not.toBeNull();

      // Top-left
      await page.mouse.move(box!.x + 10, box!.y + 10);
      await page.waitForTimeout(300);
      await page.screenshot({
        path: "tests/screenshots/t3-tilt-top-left.png",
        fullPage: false,
      });

      // Bottom-right
      await page.mouse.move(box!.x + box!.width - 10, box!.y + box!.height - 10);
      await page.waitForTimeout(300);
      await page.screenshot({
        path: "tests/screenshots/t3-tilt-bottom-right-2.png",
        fullPage: false,
      });

      // Center
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await page.waitForTimeout(300);
      await page.screenshot({
        path: "tests/screenshots/t3-tilt-center.png",
        fullPage: false,
      });
    });
  });

  // ---- Radial Glow ----
  test.describe("Radial Glow", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await scrollToProjects(page);
    });

    test("T3.12-13: Radial glow overlay follows mouse", async ({ page }) => {
      const card = await getFirstCard(page);
      const box = await card.boundingBox();
      expect(box).not.toBeNull();

      // Hover over the card
      await page.mouse.move(box!.x + 50, box!.y + 50);
      await page.waitForTimeout(300);

      // The glow div is the first child of the TiltCard motion div
      const glowDiv = card.locator("> div").first();
      const glowStyle = await glowDiv.getAttribute("style");
      console.log(`[T3.12] Glow div style: ${glowStyle}`);
      expect(glowStyle).toContain("radial-gradient");
      expect(glowStyle).toContain("opacity: 1");

      // Check that the glow uses --cta-glow (blue, not violet)
      expect(glowStyle).toContain("var(--cta-glow)");

      // Move mouse to another position and check glow changes
      await page.mouse.move(box!.x + box!.width - 20, box!.y + box!.height - 20);
      await page.waitForTimeout(300);
      const glowStyle2 = await glowDiv.getAttribute("style");
      console.log(`[T3.13] Glow div style after move: ${glowStyle2}`);
      // The glow position should differ from before
      expect(glowStyle2).not.toBe(glowStyle);
    });
  });

  // ---- Mouse Leave Reset ----
  test.describe("Mouse Leave Reset", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await scrollToProjects(page);
    });

    test("T3.15-18: Card resets on mouse leave", async ({ page }) => {
      const card = await getFirstCard(page);
      const box = await card.boundingBox();
      expect(box).not.toBeNull();

      // Hover over card first
      await page.mouse.move(box!.x + 20, box!.y + 20);
      await page.waitForTimeout(300);

      // Check scale is 1.02 while hovering
      let inlineStyle = await card.getAttribute("style");
      console.log(`[T3.18-hover] Style while hovering: ${inlineStyle}`);
      expect(inlineStyle).toContain("scale(1.02)");

      // Check transition is fast during hover (100ms)
      expect(inlineStyle).toContain("100ms");

      // Move mouse off the card
      await page.mouse.move(box!.x - 100, box!.y - 100);
      await page.waitForTimeout(100);

      // T3.17: Check reset transition is ~400ms
      inlineStyle = await card.getAttribute("style");
      console.log(`[T3.17] Style after mouse leave: ${inlineStyle}`);
      expect(inlineStyle).toContain("400ms");

      // Wait for transition to complete
      await page.waitForTimeout(500);

      // T3.15-16: Verify card resets to flat
      inlineStyle = await card.getAttribute("style");
      const rot = parseRotation(inlineStyle || "");
      console.log(`[T3.15-16] After leave: rotateX=${rot.rotateX}, rotateY=${rot.rotateY}`);
      expect(rot.rotateX).toBe(0);
      expect(rot.rotateY).toBe(0);

      // T3.18: Scale back to 1
      expect(inlineStyle).toContain("scale(1)");

      // Glow should be invisible
      const glowDiv = card.locator("> div").first();
      const glowStyle = await glowDiv.getAttribute("style");
      console.log(`[T3.18] Glow after leave: ${glowStyle}`);
      expect(glowStyle).toContain("opacity: 0");
    });
  });

  // ---- Mobile (375x812) ----
  test.describe("Mobile (375x812)", () => {
    test("T3.19-22: Tilt is DISABLED on mobile", async ({ page }) => {
      await page.setViewportSize(MOBILE);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await scrollToProjects(page);

      // On mobile, TiltCard is disabled, so no perspective wrapper
      const perspectiveWrappers = page.locator(
        '#projects [style*="perspective"]'
      );
      const count = await perspectiveWrappers.count();
      console.log(`[T3.21] Mobile perspective wrapper count: ${count}`);
      expect(count).toBe(0);

      // Cards should still exist but without 3D transforms
      const cards = page.locator("#projects .rounded-2xl");
      const cardCount = await cards.count();
      console.log(`[T3.20] Mobile card count: ${cardCount}`);
      expect(cardCount).toBeGreaterThanOrEqual(3);

      // Take screenshot
      await page.screenshot({
        path: "tests/screenshots/t3-mobile-no-tilt.png",
        fullPage: false,
      });
    });
  });

  // ---- Project Modal ----
  test.describe("Project Modal", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await scrollToProjects(page);
    });

    test("T3.23-27: Click card opens modal, close works", async ({ page }) => {
      // Click on first project card
      const card = await getFirstCard(page);
      await card.click();
      await page.waitForTimeout(600);

      // T3.24: Modal should be visible
      const modal = page.locator(".fixed.inset-0.z-50");
      await expect(modal).toBeVisible();

      // Modal should have project content
      const modalTitle = modal.locator("h2").first();
      const titleText = await modalTitle.textContent();
      console.log(`[T3.24] Modal title: ${titleText}`);
      expect(titleText).toBeTruthy();

      // Take screenshot of modal
      await page.screenshot({
        path: "tests/screenshots/t3-project-modal.png",
        fullPage: false,
      });

      // T3.25: Close modal by clicking the close button
      const closeBtn = modal.locator("button").filter({ hasText: "\u2715" });
      await closeBtn.click();
      await page.waitForTimeout(500);

      // T3.26: Modal should be gone
      await expect(modal).not.toBeVisible();
    });

    test("T3.25b: Close modal by clicking backdrop", async ({ page }) => {
      const card = await getFirstCard(page);
      await card.click();
      await page.waitForTimeout(600);

      const modal = page.locator(".fixed.inset-0.z-50");
      await expect(modal).toBeVisible();

      // Click the backdrop (top-left corner of the overlay)
      await modal.click({ position: { x: 5, y: 5 } });
      await page.waitForTimeout(500);

      await expect(modal).not.toBeVisible();
    });
  });

  // ---- Reduced motion ----
  test.describe("Reduced motion", () => {
    test("T3.28-30: Tilt disabled with prefers-reduced-motion", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize(DESKTOP);
      await page.goto(BASE, { waitUntil: "networkidle" });
      await scrollToProjects(page);

      // No perspective wrappers should exist (tilt disabled)
      const perspectiveWrappers = page.locator(
        '#projects [style*="perspective"]'
      );
      const count = await perspectiveWrappers.count();
      console.log(`[T3.28] Reduced motion - perspective wrapper count: ${count}`);
      expect(count).toBe(0);

      await page.screenshot({
        path: "tests/screenshots/t3-reduced-motion.png",
        fullPage: false,
      });
    });
  });
});

// ======================================================
// CROSS-CUTTING CHECKS
// ======================================================

test.describe("Cross-Cutting Checks", () => {
  // ---- Console Errors ----
  test("CC.1: No console errors on page load and scroll", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    await page.setViewportSize(DESKTOP);
    await page.goto(BASE, { waitUntil: "networkidle" });

    // Scroll through all sections
    const sections = ["projects", "skills", "achievements", "contact"];
    for (const id of sections) {
      await page.evaluate((sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "instant" });
      }, id);
      await page.waitForTimeout(500);
    }

    console.log(`[CC.1] Console errors found: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log("[CC.1] Errors:", consoleErrors);
    }

    // Filter out known benign warnings if any
    const realErrors = consoleErrors.filter(
      (e) => !e.includes("Download the React DevTools") && !e.includes("favicon")
    );
    expect(realErrors).toEqual([]);
  });

  // ---- Performance: animations use transform/opacity only ----
  test("CC.5: Animations use transform/opacity (GPU composited)", async ({
    page,
  }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(BASE, { waitUntil: "networkidle" });
    await scrollToProjects(page);

    // Check that tilt uses transform (not left/top/margin)
    const card = await getFirstCard(page);
    const box = await card.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 20, box.y + 20);
      await page.waitForTimeout(300);
      const style = await card.getAttribute("style");
      console.log(`[CC.5] Card tilt uses transform: ${style?.includes("transform")}`);
      expect(style).toContain("transform");
      // Ensure no layout-triggering properties in animation
      expect(style).not.toContain("left:");
      expect(style).not.toContain("top:");
      expect(style).not.toContain("margin:");
    }
  });

  // ---- Both Themes ----
  test.describe("Both Themes", () => {
    test("CC.6-9: Effects work in both light and dark mode", async ({
      page,
    }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(BASE, { waitUntil: "networkidle" });

      // ---- Light mode ----
      // Make sure we're in light mode
      const currentTheme = await page.evaluate(() =>
        document.documentElement.getAttribute("data-theme")
      );
      if (currentTheme === "dark") {
        // Toggle to light
        const themeToggle = page.locator("button").filter({ hasText: /moon|sun/i }).first();
        if (await themeToggle.isVisible()) {
          await themeToggle.click();
          await page.waitForTimeout(300);
        }
      }

      await scrollToProjects(page);

      // Verify tilt works in light mode
      const card = await getFirstCard(page);
      const box = await card.boundingBox();
      expect(box).not.toBeNull();

      await page.mouse.move(box!.x + 20, box!.y + 20);
      await page.waitForTimeout(300);

      let inlineStyle = await card.getAttribute("style");
      expect(inlineStyle).toContain("rotateX");
      console.log("[CC.6] Light mode tilt works: PASS");

      // Check light mode CTA color
      const ctaColor = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--cta").trim()
      );
      console.log(`[CC.6] Light mode --cta: ${ctaColor}`);

      // Take light mode screenshot
      await page.screenshot({
        path: "tests/screenshots/t3-light-mode.png",
        fullPage: false,
      });

      // Move mouse off card
      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);

      // ---- Dark mode ----
      // Toggle to dark mode via the theme toggle button
      const themeToggle = page.locator("button[aria-label]").first();
      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(500);
      } else {
        // Try to set dark mode directly
        await page.evaluate(() =>
          document.documentElement.setAttribute("data-theme", "dark")
        );
        await page.waitForTimeout(300);
      }

      const darkTheme = await page.evaluate(() =>
        document.documentElement.getAttribute("data-theme")
      );
      console.log(`[CC.8] Current theme after toggle: ${darkTheme}`);

      await scrollToProjects(page);

      const cardDark = await getFirstCard(page);
      const boxDark = await cardDark.boundingBox();
      expect(boxDark).not.toBeNull();

      await page.mouse.move(boxDark!.x + 20, boxDark!.y + 20);
      await page.waitForTimeout(300);

      inlineStyle = await cardDark.getAttribute("style");
      expect(inlineStyle).toContain("rotateX");
      console.log("[CC.8] Dark mode tilt works: PASS");

      // Check dark mode CTA color
      const ctaColorDark = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--cta").trim()
      );
      console.log(`[CC.8] Dark mode --cta: ${ctaColorDark}`);

      // Take dark mode screenshot
      await page.screenshot({
        path: "tests/screenshots/t3-dark-mode.png",
        fullPage: false,
      });
    });
  });
});
