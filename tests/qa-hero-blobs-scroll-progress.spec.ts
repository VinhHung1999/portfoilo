import { test, expect, Page } from "@playwright/test";
import path from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = path.join(__dirname, "screenshots");

// ============================================================
// TEST 1: HERO GRADIENT MESH BLOBS
// ============================================================

test.describe("TEST 1: Hero Gradient Mesh Blobs", () => {
  // ---- Desktop (1440x900) ----
  test.describe("Desktop (1440x900)", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("1.1 - Navigate and find gradient blob elements", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      // Wait for animations to start
      await page.waitForTimeout(1500);

      // Find the blob container
      const blobContainer = page.locator("#hero .absolute.overflow-hidden").first();
      await expect(blobContainer).toBeVisible();

      // Find all blobs
      const blobs = page.locator(".hero-blob");
      const blobCount = await blobs.count();

      console.log(`[1.1] Blob count on desktop: ${blobCount}`);
      expect(blobCount).toBe(3);
    });

    test("1.2 - Blob 1: blur, animation, will-change, color", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      const blob1 = page.locator(".hero-blob-1");
      const styles = await blob1.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          filter: cs.filter,
          willChange: cs.willChange,
          animationName: cs.animationName,
          animationDuration: cs.animationDuration,
          backgroundColor: cs.backgroundColor,
        };
      });

      console.log(`[1.2] Blob 1 styles:`, JSON.stringify(styles, null, 2));

      // Check blur (80px)
      expect(styles.filter).toContain("blur(80px)");

      // Check animation
      expect(styles.animationName).toContain("blob-drift-1");
      // Duration should be 25s
      expect(styles.animationDuration).toBe("25s");

      // Check will-change
      expect(styles.willChange).toBe("transform");

      // Check color - violet (124, 58, 237) at low opacity
      expect(styles.backgroundColor).toMatch(/rgba?\(124,\s*58,\s*237/);
    });

    test("1.3 - Blob 2: blur, animation, will-change, color", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      const blob2 = page.locator(".hero-blob-2");
      const styles = await blob2.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          filter: cs.filter,
          willChange: cs.willChange,
          animationName: cs.animationName,
          animationDuration: cs.animationDuration,
          backgroundColor: cs.backgroundColor,
        };
      });

      console.log(`[1.3] Blob 2 styles:`, JSON.stringify(styles, null, 2));

      // Check blur (100px)
      expect(styles.filter).toContain("blur(100px)");

      // Check animation
      expect(styles.animationName).toContain("blob-drift-2");
      // Duration should be 30s
      expect(styles.animationDuration).toBe("30s");

      // Check will-change
      expect(styles.willChange).toBe("transform");

      // Check color - blue (37, 99, 235) at low opacity
      expect(styles.backgroundColor).toMatch(/rgba?\(37,\s*99,\s*235/);
    });

    test("1.4 - Blob 3: blur, animation, will-change, color", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      const blob3 = page.locator(".hero-blob-3");
      const styles = await blob3.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          filter: cs.filter,
          willChange: cs.willChange,
          animationName: cs.animationName,
          animationDuration: cs.animationDuration,
          backgroundColor: cs.backgroundColor,
        };
      });

      console.log(`[1.4] Blob 3 styles:`, JSON.stringify(styles, null, 2));

      // Check blur (70px)
      expect(styles.filter).toContain("blur(70px)");

      // Check animation
      expect(styles.animationName).toContain("blob-drift-3");
      // Duration should be 20s
      expect(styles.animationDuration).toBe("20s");

      // Check will-change
      expect(styles.willChange).toBe("transform");

      // Check color - violet (124, 58, 237) at low opacity
      expect(styles.backgroundColor).toMatch(/rgba?\(124,\s*58,\s*237/);
    });

    test("1.5 - Blobs are BEHIND hero content (z-index layering)", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Check blob container z-index
      const blobContainerZIndex = await page.locator("#hero .absolute.overflow-hidden").first().evaluate((el) => {
        return window.getComputedStyle(el).zIndex;
      });

      // Check hero content z-index
      const heroContentZIndex = await page.locator("#hero .relative.z-\\[1\\]").evaluate((el) => {
        return window.getComputedStyle(el).zIndex;
      });

      console.log(`[1.5] Blob container z-index: ${blobContainerZIndex}, Hero content z-index: ${heroContentZIndex}`);

      const blobZ = parseInt(blobContainerZIndex) || 0;
      const contentZ = parseInt(heroContentZIndex) || 0;
      expect(contentZ).toBeGreaterThan(blobZ);
    });

    test("1.6 - Hero text content is readable (sits above blobs)", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);

      // Check that the hero heading is visible
      const heroH1 = page.locator("#hero h1").first();
      await expect(heroH1).toBeVisible();

      const heroText = await heroH1.textContent();
      console.log(`[1.6] Hero heading text: "${heroText}"`);
      expect(heroText).toBeTruthy();
      expect(heroText!.length).toBeGreaterThan(0);

      // Check h2 is also visible
      const heroH2 = page.locator("#hero h2").first();
      await expect(heroH2).toBeVisible();
    });

    test("1.7 - Blob container has overflow: hidden", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Check the hero section itself
      const heroOverflow = await page.locator("#hero").evaluate((el) => {
        return window.getComputedStyle(el).overflow;
      });

      // Check the blob container
      const blobContainerOverflow = await page.locator("#hero .absolute.overflow-hidden").first().evaluate((el) => {
        return window.getComputedStyle(el).overflow;
      });

      console.log(`[1.7] Hero section overflow: "${heroOverflow}", Blob container overflow: "${blobContainerOverflow}"`);

      // Either the hero section or the blob container should have overflow: hidden
      const hasOverflowHidden = heroOverflow === "hidden" || blobContainerOverflow === "hidden";
      expect(hasOverflowHidden).toBe(true);
    });

    test("1.8 - Screenshot of hero showing blobs (desktop)", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test1-hero-blobs-desktop.png"),
        fullPage: false,
      });
      console.log("[1.8] Screenshot saved: test1-hero-blobs-desktop.png");
    });
  });

  // ---- Light vs Dark mode ----
  test.describe("Light vs Dark mode blob opacity", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("1.9 - Light mode blob opacity values (0.05-0.08 range)", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Ensure light mode
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "light");
      });
      await page.waitForTimeout(500);

      const lightOpacities = await page.evaluate(() => {
        const blob1 = document.querySelector(".hero-blob-1") as HTMLElement;
        const blob2 = document.querySelector(".hero-blob-2") as HTMLElement;
        const blob3 = document.querySelector(".hero-blob-3") as HTMLElement;

        const extractAlpha = (bgColor: string) => {
          const match = bgColor.match(/rgba?\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
          return match ? parseFloat(match[1]) : null;
        };

        return {
          blob1: {
            bg: window.getComputedStyle(blob1).backgroundColor,
            alpha: extractAlpha(window.getComputedStyle(blob1).backgroundColor),
          },
          blob2: {
            bg: window.getComputedStyle(blob2).backgroundColor,
            alpha: extractAlpha(window.getComputedStyle(blob2).backgroundColor),
          },
          blob3: {
            bg: window.getComputedStyle(blob3).backgroundColor,
            alpha: extractAlpha(window.getComputedStyle(blob3).backgroundColor),
          },
        };
      });

      console.log(`[1.9] Light mode blob opacities:`, JSON.stringify(lightOpacities, null, 2));

      // Light mode: blob1 = 0.08, blob2 = 0.06, blob3 = 0.05
      // Check they're in the LOW range (0.04-0.10)
      if (lightOpacities.blob1.alpha !== null) {
        expect(lightOpacities.blob1.alpha).toBeGreaterThanOrEqual(0.04);
        expect(lightOpacities.blob1.alpha).toBeLessThanOrEqual(0.10);
      }
      if (lightOpacities.blob2.alpha !== null) {
        expect(lightOpacities.blob2.alpha).toBeGreaterThanOrEqual(0.04);
        expect(lightOpacities.blob2.alpha).toBeLessThanOrEqual(0.10);
      }
      if (lightOpacities.blob3.alpha !== null) {
        expect(lightOpacities.blob3.alpha).toBeGreaterThanOrEqual(0.04);
        expect(lightOpacities.blob3.alpha).toBeLessThanOrEqual(0.10);
      }

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test1-hero-blobs-light-mode.png"),
        fullPage: false,
      });
      console.log("[1.9] Screenshot saved: test1-hero-blobs-light-mode.png");
    });

    test("1.10-1.11 - Dark mode blob opacity values (0.10-0.15 range)", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Switch to dark mode
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "dark");
      });
      await page.waitForTimeout(500);

      const darkOpacities = await page.evaluate(() => {
        const blob1 = document.querySelector(".hero-blob-1") as HTMLElement;
        const blob2 = document.querySelector(".hero-blob-2") as HTMLElement;
        const blob3 = document.querySelector(".hero-blob-3") as HTMLElement;

        const extractAlpha = (bgColor: string) => {
          const match = bgColor.match(/rgba?\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
          return match ? parseFloat(match[1]) : null;
        };

        return {
          blob1: {
            bg: window.getComputedStyle(blob1).backgroundColor,
            alpha: extractAlpha(window.getComputedStyle(blob1).backgroundColor),
          },
          blob2: {
            bg: window.getComputedStyle(blob2).backgroundColor,
            alpha: extractAlpha(window.getComputedStyle(blob2).backgroundColor),
          },
          blob3: {
            bg: window.getComputedStyle(blob3).backgroundColor,
            alpha: extractAlpha(window.getComputedStyle(blob3).backgroundColor),
          },
        };
      });

      console.log(`[1.10-1.11] Dark mode blob opacities:`, JSON.stringify(darkOpacities, null, 2));

      // Dark mode: blob1 = 0.15, blob2 = 0.12, blob3 = 0.10
      if (darkOpacities.blob1.alpha !== null) {
        expect(darkOpacities.blob1.alpha).toBeGreaterThanOrEqual(0.10);
        expect(darkOpacities.blob1.alpha).toBeLessThanOrEqual(0.20);
      }
      if (darkOpacities.blob2.alpha !== null) {
        expect(darkOpacities.blob2.alpha).toBeGreaterThanOrEqual(0.10);
        expect(darkOpacities.blob2.alpha).toBeLessThanOrEqual(0.20);
      }
      if (darkOpacities.blob3.alpha !== null) {
        expect(darkOpacities.blob3.alpha).toBeGreaterThanOrEqual(0.10);
        expect(darkOpacities.blob3.alpha).toBeLessThanOrEqual(0.20);
      }

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test1-hero-blobs-dark-mode.png"),
        fullPage: false,
      });
      console.log("[1.11] Screenshot saved: test1-hero-blobs-dark-mode.png");
    });
  });

  // ---- Mobile (375x812) ----
  test.describe("Mobile (375x812)", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("1.13-1.14 - Mobile: exactly 2 visible blobs (blob 3 hidden)", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      const blobVisibility = await page.evaluate(() => {
        const blob1 = document.querySelector(".hero-blob-1") as HTMLElement;
        const blob2 = document.querySelector(".hero-blob-2") as HTMLElement;
        const blob3 = document.querySelector(".hero-blob-3") as HTMLElement;

        return {
          blob1Display: window.getComputedStyle(blob1).display,
          blob2Display: window.getComputedStyle(blob2).display,
          blob3Display: window.getComputedStyle(blob3).display,
        };
      });

      console.log(`[1.13-1.14] Mobile blob visibility:`, JSON.stringify(blobVisibility, null, 2));

      // Blob 1 and 2 should be visible
      expect(blobVisibility.blob1Display).not.toBe("none");
      expect(blobVisibility.blob2Display).not.toBe("none");

      // Blob 3 should be hidden (display: none)
      expect(blobVisibility.blob3Display).toBe("none");

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test1-hero-blobs-mobile.png"),
        fullPage: false,
      });
      console.log("[1.14-1.15] Screenshot saved: test1-hero-blobs-mobile.png");
    });
  });

  // ---- Reduced Motion ----
  test.describe("Reduced motion", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("1.16-1.18 - Reduced motion: animations paused/removed, blobs still visible", async ({ page }) => {
      // Emulate reduced motion
      await page.emulateMedia({ reducedMotion: "reduce" });

      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);

      const reducedMotionStyles = await page.evaluate(() => {
        const blob1 = document.querySelector(".hero-blob-1") as HTMLElement;
        const blob2 = document.querySelector(".hero-blob-2") as HTMLElement;
        const blob3 = document.querySelector(".hero-blob-3") as HTMLElement;

        const getAnimInfo = (el: HTMLElement) => {
          const cs = window.getComputedStyle(el);
          return {
            animationName: cs.animationName,
            animationDuration: cs.animationDuration,
            animationPlayState: cs.animationPlayState,
            display: cs.display,
            visibility: cs.visibility,
          };
        };

        return {
          blob1: getAnimInfo(blob1),
          blob2: getAnimInfo(blob2),
          blob3: getAnimInfo(blob3),
        };
      });

      console.log(`[1.16-1.17] Reduced motion blob styles:`, JSON.stringify(reducedMotionStyles, null, 2));

      // Animations should be "none" (animation: none !important)
      expect(reducedMotionStyles.blob1.animationName).toBe("none");
      expect(reducedMotionStyles.blob2.animationName).toBe("none");
      expect(reducedMotionStyles.blob3.animationName).toBe("none");

      // Blobs should still be visible
      expect(reducedMotionStyles.blob1.display).not.toBe("none");
      expect(reducedMotionStyles.blob2.display).not.toBe("none");

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test1-hero-blobs-reduced-motion.png"),
        fullPage: false,
      });
      console.log("[1.18] Screenshot saved: test1-hero-blobs-reduced-motion.png");
    });
  });
});

// ============================================================
// TEST 5: SCROLL PROGRESS BAR
// ============================================================

test.describe("TEST 5: Scroll Progress Bar", () => {
  // ---- Desktop ----
  test.describe("Desktop (1440x900)", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("5.1-5.3 - Progress bar exists with correct styles", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // The scroll progress bar is a motion.div with fixed position, top: 0
      const progressBar = await page.evaluate(() => {
        // Find the fixed element at top with height 3
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            return {
              found: true,
              height: cs.height,
              position: cs.position,
              top: cs.top,
              zIndex: cs.zIndex,
              background: cs.background,
              backgroundImage: cs.backgroundImage,
              boxShadow: cs.boxShadow,
              transform: cs.transform,
              transformOrigin: cs.transformOrigin,
            };
          }
        }
        return { found: false };
      });

      console.log(`[5.1-5.3] Progress bar styles:`, JSON.stringify(progressBar, null, 2));

      expect(progressBar.found).toBe(true);

      // Height is 3px
      expect(progressBar.height).toBe("3px");

      // Has gradient background
      expect(progressBar.backgroundImage || progressBar.background).toContain("linear-gradient");

      // z-index >= 60
      const zIndex = parseInt(progressBar.zIndex!);
      expect(zIndex).toBeGreaterThanOrEqual(60);

      // Has box-shadow (glow effect)
      expect(progressBar.boxShadow).not.toBe("none");
    });

    test("5.4 - At page top, bar is at ~0% width", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Ensure we're at top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      const scaleAtTop = await page.evaluate(() => {
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            const transform = cs.transform;
            // Extract scaleX from the transform matrix
            if (transform && transform !== "none") {
              const match = transform.match(/matrix\(([\d.e-]+)/);
              if (match) return parseFloat(match[1]);
            }
            return 0;
          }
        }
        return -1;
      });

      console.log(`[5.4] ScaleX at top of page: ${scaleAtTop}`);
      // At top, scaleX should be very small (close to 0)
      expect(scaleAtTop).toBeLessThanOrEqual(0.1);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test5-scroll-bar-top.png"),
        fullPage: false,
      });
      console.log("[5.4] Screenshot saved: test5-scroll-bar-top.png");
    });

    test("5.5 - At middle, bar is ~50% filled", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Scroll to middle of page
      await page.evaluate(() => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll / 2);
      });
      await page.waitForTimeout(800);

      const scaleAtMiddle = await page.evaluate(() => {
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            const transform = cs.transform;
            if (transform && transform !== "none") {
              const match = transform.match(/matrix\(([\d.e-]+)/);
              if (match) return parseFloat(match[1]);
            }
            return 0;
          }
        }
        return -1;
      });

      console.log(`[5.5] ScaleX at middle of page: ${scaleAtMiddle}`);
      // At middle, scaleX should be roughly 0.4-0.6
      expect(scaleAtMiddle).toBeGreaterThanOrEqual(0.3);
      expect(scaleAtMiddle).toBeLessThanOrEqual(0.7);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test5-scroll-bar-middle.png"),
        fullPage: false,
      });
      console.log("[5.5] Screenshot saved: test5-scroll-bar-middle.png");
    });

    test("5.6 - At bottom, bar is ~100% filled", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(800);

      const scaleAtBottom = await page.evaluate(() => {
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            const transform = cs.transform;
            if (transform && transform !== "none") {
              const match = transform.match(/matrix\(([\d.e-]+)/);
              if (match) return parseFloat(match[1]);
            }
            return 0;
          }
        }
        return -1;
      });

      console.log(`[5.6] ScaleX at bottom of page: ${scaleAtBottom}`);
      // At bottom, scaleX should be close to 1.0
      expect(scaleAtBottom).toBeGreaterThanOrEqual(0.9);
      expect(scaleAtBottom).toBeLessThanOrEqual(1.01);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test5-scroll-bar-bottom.png"),
        fullPage: false,
      });
      console.log("[5.6] Screenshot saved: test5-scroll-bar-bottom.png");
    });
  });

  // ---- Light + Dark mode ----
  test.describe("Light + Dark mode scroll bar", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("5.8-5.9 - Progress bar visible in both light and dark modes", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Scroll to middle for visibility
      await page.evaluate(() => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll / 2);
      });
      await page.waitForTimeout(800);

      // Light mode
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "light");
      });
      await page.waitForTimeout(500);

      const lightBarExists = await page.evaluate(() => {
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            return {
              visible: cs.visibility !== "hidden" && cs.display !== "none",
              background: cs.backgroundImage,
            };
          }
        }
        return { visible: false, background: "" };
      });

      console.log(`[5.8] Light mode progress bar:`, JSON.stringify(lightBarExists, null, 2));
      expect(lightBarExists.visible).toBe(true);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test5-scroll-bar-light-mode.png"),
        fullPage: false,
      });

      // Dark mode
      await page.evaluate(() => {
        document.documentElement.setAttribute("data-theme", "dark");
      });
      await page.waitForTimeout(500);

      const darkBarExists = await page.evaluate(() => {
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            return {
              visible: cs.visibility !== "hidden" && cs.display !== "none",
              background: cs.backgroundImage,
            };
          }
        }
        return { visible: false, background: "" };
      });

      console.log(`[5.9] Dark mode progress bar:`, JSON.stringify(darkBarExists, null, 2));
      expect(darkBarExists.visible).toBe(true);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test5-scroll-bar-dark-mode.png"),
        fullPage: false,
      });
    });
  });

  // ---- Mobile ----
  test.describe("Mobile (375x812)", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("5.10-5.13 - Scroll progress bar works on mobile", async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);

      // Check bar exists on mobile
      const mobileBarExists = await page.evaluate(() => {
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            return true;
          }
        }
        return false;
      });

      console.log(`[5.10] Scroll progress bar exists on mobile: ${mobileBarExists}`);
      expect(mobileBarExists).toBe(true);

      // Scroll to middle and check it fills
      await page.evaluate(() => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll / 2);
      });
      await page.waitForTimeout(800);

      const mobileScaleMiddle = await page.evaluate(() => {
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            const transform = cs.transform;
            if (transform && transform !== "none") {
              const match = transform.match(/matrix\(([\d.e-]+)/);
              if (match) return parseFloat(match[1]);
            }
            return 0;
          }
        }
        return -1;
      });

      console.log(`[5.12] Mobile scroll bar scaleX at middle: ${mobileScaleMiddle}`);
      expect(mobileScaleMiddle).toBeGreaterThan(0.2);

      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(800);

      const mobileScaleBottom = await page.evaluate(() => {
        const allElements = document.querySelectorAll("div");
        for (const el of allElements) {
          const cs = window.getComputedStyle(el);
          if (
            cs.position === "fixed" &&
            cs.top === "0px" &&
            (cs.height === "3px" || el.style.height === "3")
          ) {
            const transform = cs.transform;
            if (transform && transform !== "none") {
              const match = transform.match(/matrix\(([\d.e-]+)/);
              if (match) return parseFloat(match[1]);
            }
            return 0;
          }
        }
        return -1;
      });

      console.log(`[5.12] Mobile scroll bar scaleX at bottom: ${mobileScaleBottom}`);
      expect(mobileScaleBottom).toBeGreaterThanOrEqual(0.9);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, "test5-scroll-bar-mobile.png"),
        fullPage: false,
      });
      console.log("[5.13] Screenshot saved: test5-scroll-bar-mobile.png");
    });
  });
});
