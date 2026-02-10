import { chromium, Browser, Page } from "playwright";
import * as path from "path";
import * as fs from "fs";

const BASE_URL = "http://localhost:3000";
const SCREENSHOT_DIR = path.resolve(__dirname, "screenshots");
const PASSWORD = "changeme";

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

interface TestResult {
  test: string;
  status: "PASS" | "FAIL";
  details: string;
}

const results: TestResult[] = [];
const consoleErrors: string[] = [];
const consoleWarnings: string[] = [];

function report(test: string, status: "PASS" | "FAIL", details: string) {
  results.push({ test, status, details });
  console.log(`[${status}] ${test}: ${details}`);
}

async function screenshot(page: Page, name: string) {
  const filepath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`  Screenshot saved: ${filepath}`);
  return filepath;
}

async function login(page: Page) {
  await page.goto(`${BASE_URL}/admin/login`);
  await page.waitForSelector('input#password');
  await page.fill('input#password', PASSWORD);
  await page.click('button[type="submit"]');
  // Wait for redirect to admin page
  await page.waitForURL('**/admin', { timeout: 10000 });
  // Wait for content to load
  await page.waitForTimeout(2000);
}

async function main() {
  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // Capture console errors
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    } else if (msg.type() === "warning") {
      consoleWarnings.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(`Page Error: ${err.message}`);
  });

  try {
    // ============================================
    // LOGIN
    // ============================================
    console.log("\n=== LOGGING IN ===");
    await login(page);
    console.log("Logged in successfully, now on admin page.");

    // ============================================
    // TEST A: Toast Notifications
    // ============================================
    console.log("\n=== TEST A: Toast Notifications ===");
    try {
      // Should be on Personal section by default
      await page.waitForSelector('input', { timeout: 5000 });

      // Find the Name field (first FormInput)
      const nameInput = page.locator('label:has-text("Name")').locator('..').locator('input').first();
      await nameInput.waitFor({ timeout: 5000 });

      const originalName = await nameInput.inputValue();
      console.log(`  Original name: "${originalName}"`);

      // Modify the name slightly (append a space so we can revert easily)
      await nameInput.fill(originalName + " ");
      await page.waitForTimeout(300);

      // Click Save button
      const saveButton = page.locator('button:has-text("Save")');
      await saveButton.click();

      // Wait for toast to appear - use the toast container specifically (not Next.js route announcer)
      const toastContainer = page.locator('.fixed.top-20.right-6');
      const toastItem = toastContainer.locator('[role="alert"]');
      await toastItem.waitFor({ timeout: 5000 });

      const containerExists = await toastContainer.count() > 0;

      const toastBg = await toastItem.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Check for check icon (svg inside toast)
      const hasIcon = await toastItem.locator('svg').count() > 0;

      // Take screenshot of toast
      await screenshot(page, "A_toast_notification");

      // Check position (top-right)
      const positionCheck = containerExists;

      // Verify green background (#22C55E = rgb(34, 197, 94))
      const isGreen = toastBg.includes("34, 197, 94") || toastBg.includes("22C55E");

      // Wait for auto-dismiss (3 seconds)
      console.log("  Waiting for toast auto-dismiss (~3.5s)...");
      await page.waitForTimeout(3500);
      const toastAfterDismiss = await toastContainer.locator('[role="alert"]').count();
      const autoDismissed = toastAfterDismiss === 0;

      // Revert the name change back to original
      await page.waitForTimeout(500);
      const nameInputAfter = page.locator('label:has-text("Name")').locator('..').locator('input').first();
      await nameInputAfter.fill(originalName);
      await page.waitForTimeout(300);
      const saveBtnRevert = page.locator('button:has-text("Save")');
      if (await saveBtnRevert.isEnabled()) {
        await saveBtnRevert.click();
        await page.waitForTimeout(2000);
      }

      const aDetails = [
        `Position top-right: ${positionCheck ? "YES" : "NO"}`,
        `Green background: ${isGreen ? "YES" : "NO"} (got: ${toastBg})`,
        `Has icon: ${hasIcon ? "YES" : "NO"}`,
        `Auto-dismissed: ${autoDismissed ? "YES" : "NO"}`,
      ].join("; ");

      report("A: Toast Notifications",
        (positionCheck && isGreen && hasIcon && autoDismissed) ? "PASS" : "FAIL",
        aDetails
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      report("A: Toast Notifications", "FAIL", `Error: ${errMsg}`);
      await screenshot(page, "A_toast_error");
    }

    // ============================================
    // TEST B: Dirty Tracking / Save Button States
    // ============================================
    console.log("\n=== TEST B: Dirty Tracking / Save Button States ===");
    try {
      // Reload to fresh state
      await page.goto(`${BASE_URL}/admin`);
      await page.waitForTimeout(2000);

      // Check Save button initial state (should be disabled)
      const saveBtn = page.locator('button:has-text("Save")');
      await saveBtn.waitFor({ timeout: 5000 });
      const isDisabledInitial = await saveBtn.isDisabled();

      // Check opacity when disabled
      const opacityInitial = await saveBtn.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });

      // Check Undo button is NOT visible initially
      const undoBtnInitialCount = await page.locator('button:has-text("Undo")').count();

      // Screenshot: no changes state
      await screenshot(page, "B_no_changes_state");

      // Now make a change
      const nameInput = page.locator('label:has-text("Name")').locator('..').locator('input').first();
      const origVal = await nameInput.inputValue();
      await nameInput.fill(origVal + " changed");
      await page.waitForTimeout(300);

      // Check Save button becomes enabled
      const isEnabledAfterChange = await saveBtn.isEnabled();
      const opacityAfterChange = await saveBtn.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      });

      // Check Undo button appears
      const undoBtnAfterCount = await page.locator('button:has-text("Undo")').count();

      // Screenshot: has changes state
      await screenshot(page, "B_has_changes_state");

      // Revert
      const undoBtn = page.locator('button:has-text("Undo")');
      await undoBtn.click();
      await page.waitForTimeout(300);

      const bDetails = [
        `Save disabled initially: ${isDisabledInitial ? "YES" : "NO"}`,
        `Initial opacity: ${opacityInitial}`,
        `Save enabled after change: ${isEnabledAfterChange ? "YES" : "NO"}`,
        `Opacity after change: ${opacityAfterChange}`,
        `Undo hidden initially: ${undoBtnInitialCount === 0 ? "YES" : "NO"}`,
        `Undo visible after change: ${undoBtnAfterCount > 0 ? "YES" : "NO"}`,
      ].join("; ");

      report("B: Dirty Tracking / Save Button States",
        (isDisabledInitial && isEnabledAfterChange && undoBtnInitialCount === 0 && undoBtnAfterCount > 0) ? "PASS" : "FAIL",
        bDetails
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      report("B: Dirty Tracking / Save Button States", "FAIL", `Error: ${errMsg}`);
      await screenshot(page, "B_dirty_tracking_error");
    }

    // ============================================
    // TEST C: Undo Button
    // ============================================
    console.log("\n=== TEST C: Undo Button ===");
    try {
      // Reload fresh
      await page.goto(`${BASE_URL}/admin`);
      await page.waitForTimeout(2000);

      const nameInput = page.locator('label:has-text("Name")').locator('..').locator('input').first();
      await nameInput.waitFor({ timeout: 5000 });
      const originalValue = await nameInput.inputValue();
      console.log(`  Original value: "${originalValue}"`);

      // Change the name
      await nameInput.fill("Undo Test");
      await page.waitForTimeout(300);

      // Verify it changed
      const changedValue = await nameInput.inputValue();
      console.log(`  Changed value: "${changedValue}"`);

      // Screenshot before undo
      await screenshot(page, "C_before_undo");

      // Click Undo
      const undoBtn = page.locator('button:has-text("Undo")');
      await undoBtn.waitFor({ timeout: 3000 });
      await undoBtn.click();
      await page.waitForTimeout(300);

      // Verify reverted
      const revertedValue = await nameInput.inputValue();
      console.log(`  Reverted value: "${revertedValue}"`);
      const valueReverted = revertedValue === originalValue;

      // Check Save button is disabled again
      const saveBtn = page.locator('button:has-text("Save")');
      const saveDisabledAfterUndo = await saveBtn.isDisabled();

      // Check Undo button disappeared
      const undoBtnCount = await page.locator('button:has-text("Undo")').count();
      const undoDisappeared = undoBtnCount === 0;

      // Screenshot after undo
      await screenshot(page, "C_after_undo");

      const cDetails = [
        `Value reverted to original: ${valueReverted ? "YES" : "NO"} (original="${originalValue}", after_undo="${revertedValue}")`,
        `Save disabled after undo: ${saveDisabledAfterUndo ? "YES" : "NO"}`,
        `Undo button disappeared: ${undoDisappeared ? "YES" : "NO"}`,
      ].join("; ");

      report("C: Undo Button",
        (valueReverted && saveDisabledAfterUndo && undoDisappeared) ? "PASS" : "FAIL",
        cDetails
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      report("C: Undo Button", "FAIL", `Error: ${errMsg}`);
      await screenshot(page, "C_undo_error");
    }

    // ============================================
    // TEST D: Confirm Modal on Delete
    // ============================================
    console.log("\n=== TEST D: Confirm Modal on Delete ===");
    try {
      // Navigate to Experience section
      const expBtn = page.locator('button:has-text("Experience")').first();
      await expBtn.click();
      await page.waitForTimeout(2000);

      // Find the first delete (trash) button
      const deleteBtn = page.locator('button[aria-label="Delete"]').first();
      await deleteBtn.waitFor({ timeout: 5000 });

      // Count items before
      const itemsBefore = await page.locator('button[aria-label="Delete"]').count();
      console.log(`  Experience items with delete buttons: ${itemsBefore}`);

      // Click delete
      await deleteBtn.click();
      await page.waitForTimeout(500);

      // Check for modal overlay
      const modal = page.locator('.fixed.inset-0.z-50');
      const modalExists = await modal.count() > 0;

      // Check overlay background color
      let overlayBg = "";
      if (modalExists) {
        overlayBg = await modal.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
      }

      // Check title
      const modalTitle = page.locator('h3:has-text("Delete Experience")');
      const hasTitleText = await modalTitle.count() > 0;

      // Check Cancel and Delete buttons in modal
      const cancelBtn = page.locator('.fixed.inset-0 button:has-text("Cancel")');
      const deleteConfirmBtn = page.locator('.fixed.inset-0 button:has-text("Delete")');
      const hasCancelBtn = await cancelBtn.count() > 0;
      const hasDeleteBtn = await deleteConfirmBtn.count() > 0;

      // Check Delete button color
      let deleteBtnBg = "";
      if (hasDeleteBtn) {
        deleteBtnBg = await deleteConfirmBtn.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
      }
      const isDeleteRed = deleteBtnBg.includes("239, 68, 68") || deleteBtnBg.includes("EF4444");

      // Screenshot of modal
      await screenshot(page, "D_confirm_modal");

      // Click Cancel
      if (hasCancelBtn) {
        await cancelBtn.click();
        await page.waitForTimeout(500);
      }

      // Verify entry is still there
      const itemsAfterCancel = await page.locator('button[aria-label="Delete"]').count();
      const entryStillThere = itemsAfterCancel === itemsBefore;

      const dDetails = [
        `Modal overlay exists: ${modalExists ? "YES" : "NO"}`,
        `Overlay bg: ${overlayBg}`,
        `Has "Delete Experience?" title: ${hasTitleText ? "YES" : "NO"}`,
        `Has Cancel button: ${hasCancelBtn ? "YES" : "NO"}`,
        `Has Delete button: ${hasDeleteBtn ? "YES" : "NO"}`,
        `Delete button red: ${isDeleteRed ? "YES" : "NO"} (got: ${deleteBtnBg})`,
        `Entry preserved after cancel: ${entryStillThere ? "YES" : "NO"}`,
      ].join("; ");

      report("D: Confirm Modal on Delete",
        (modalExists && hasTitleText && hasCancelBtn && hasDeleteBtn && isDeleteRed && entryStillThere) ? "PASS" : "FAIL",
        dDetails
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      report("D: Confirm Modal on Delete", "FAIL", `Error: ${errMsg}`);
      await screenshot(page, "D_confirm_modal_error");
    }

    // ============================================
    // TEST E: Empty State / Add Buttons
    // ============================================
    console.log("\n=== TEST E: Add Buttons with Dashed Borders ===");
    try {
      const sections = [
        { name: "Experience", label: "Add Experience" },
        { name: "Projects", label: "Add Project" },
        { name: "Skills", label: "Add Skill Category" },
        { name: "Achievements", label: "Add Achievement" },
      ];

      let allFound = true;
      let allDashed = true;
      const addBtnDetails: string[] = [];

      for (const section of sections) {
        // Navigate to section
        const navBtn = page.locator(`aside button:has-text("${section.name}")`).first();
        if (await navBtn.count() === 0) {
          // Try sidebar nav buttons more broadly
          const altNavBtn = page.locator(`button:has-text("${section.name}")`).first();
          await altNavBtn.click();
        } else {
          await navBtn.click();
        }
        await page.waitForTimeout(1500);

        // Find the Add button
        const addBtn = page.locator(`button:has-text("${section.label}")`).first();
        const found = await addBtn.count() > 0;

        let isDashed = false;
        if (found) {
          const borderStyle = await addBtn.evaluate((el) => {
            return window.getComputedStyle(el).borderStyle;
          });
          isDashed = borderStyle === "dashed";
        }

        addBtnDetails.push(`${section.label}: found=${found}, dashed=${isDashed}`);

        if (!found) allFound = false;
        if (!isDashed) allDashed = false;
      }

      // Screenshot on Experience section showing Add button
      const expNavBtn = page.locator(`button:has-text("Experience")`).first();
      await expNavBtn.click();
      await page.waitForTimeout(1000);
      await screenshot(page, "E_add_buttons");

      // Also screenshot Projects section
      const projNavBtn = page.locator(`button:has-text("Projects")`).first();
      await projNavBtn.click();
      await page.waitForTimeout(1000);
      await screenshot(page, "E_add_buttons_projects");

      const eDetails = addBtnDetails.join("; ");
      report("E: Add Buttons (Empty State)",
        (allFound && allDashed) ? "PASS" : "FAIL",
        eDetails
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      report("E: Add Buttons (Empty State)", "FAIL", `Error: ${errMsg}`);
      await screenshot(page, "E_add_buttons_error");
    }

    // ============================================
    // TEST F: Design Spec Compliance
    // ============================================
    console.log("\n=== TEST F: Design Spec Compliance ===");
    try {
      // Go back to Personal section for consistent layout
      const personalNav = page.locator('button:has-text("Personal")').first();
      await personalNav.click();
      await page.waitForTimeout(1000);

      // Top bar height
      const topBar = page.locator('header').first();
      const topBarBox = await topBar.boundingBox();
      const topBarHeight = topBarBox?.height ?? 0;
      const topBarHeightOk = topBarHeight >= 50 && topBarHeight <= 62;

      // Back to Portfolio link
      const backLink = page.locator('a:has-text("Back to Portfolio")');
      const hasBackLink = await backLink.count() > 0;

      // Logout button
      const logoutBtn = page.locator('button:has-text("Logout")');
      const hasLogout = await logoutBtn.count() > 0;

      // ThemeToggle
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      const hasThemeToggle = await themeToggle.count() > 0;

      // Sidebar width
      const sidebar = page.locator('aside').first();
      const sidebarBox = await sidebar.boundingBox();
      const sidebarWidth = sidebarBox?.width ?? 0;
      const sidebarWidthOk = sidebarWidth >= 210 && sidebarWidth <= 240;

      // CONTENT label in sidebar
      const contentLabel = page.locator('aside p:has-text("Content")');
      const hasContentLabel = await contentLabel.count() > 0;

      // 5 nav items
      const navItems = page.locator('aside nav button');
      const navItemCount = await navItems.count();

      // Active sidebar item - check for left border
      const activeNavItem = page.locator('aside nav button').first(); // Personal is active
      const activeBorderLeft = await activeNavItem.evaluate((el) => {
        return window.getComputedStyle(el).borderLeft;
      });
      const hasActiveAccent = activeBorderLeft.includes("solid") && !activeBorderLeft.includes("transparent");

      // Content area max-width
      const contentArea = page.locator('main .max-w-3xl');
      const contentAreaBox = await contentArea.boundingBox();
      const contentMaxWidth = contentAreaBox?.width ?? 0;

      // Form inputs height check
      const formInputs = page.locator('label:has-text("Name")').locator('..').locator('input').first();
      const inputBox = await formInputs.boundingBox();
      const inputHeight = inputBox?.height ?? 0;
      const inputHeightOk = inputHeight >= 36 && inputHeight <= 44;

      // Form input border radius
      const inputBorderRadius = await formInputs.evaluate((el) => {
        return window.getComputedStyle(el).borderRadius;
      });

      // Screenshot of full layout
      await screenshot(page, "F_layout_design_spec");

      const fDetails = [
        `Top bar height: ${topBarHeight}px (spec ~56px, ok=${topBarHeightOk})`,
        `Has Back to Portfolio: ${hasBackLink ? "YES" : "NO"}`,
        `Has Theme Toggle: ${hasThemeToggle ? "YES" : "NO"}`,
        `Has Logout: ${hasLogout ? "YES" : "NO"}`,
        `Sidebar width: ${sidebarWidth}px (spec ~224px, ok=${sidebarWidthOk})`,
        `Has CONTENT label: ${hasContentLabel ? "YES" : "NO"}`,
        `Nav items count: ${navItemCount} (spec: 5)`,
        `Active item left accent: ${hasActiveAccent ? "YES" : "NO"} (border: ${activeBorderLeft})`,
        `Content area width: ${contentMaxWidth}px (spec max ~768px)`,
        `Input height: ${inputHeight}px (spec ~40px, ok=${inputHeightOk})`,
        `Input border-radius: ${inputBorderRadius}`,
      ].join("; ");

      const fPass = topBarHeightOk && hasBackLink && hasThemeToggle && hasLogout
        && sidebarWidthOk && hasContentLabel && navItemCount === 5
        && hasActiveAccent && inputHeightOk;

      report("F: Design Spec Compliance", fPass ? "PASS" : "FAIL", fDetails);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      report("F: Design Spec Compliance", "FAIL", `Error: ${errMsg}`);
      await screenshot(page, "F_design_spec_error");
    }

    // ============================================
    // TEST G: Light + Dark Mode
    // ============================================
    console.log("\n=== TEST G: Light + Dark Mode ===");
    try {
      // First, detect current theme
      const currentTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute("data-theme") || "unknown";
      });
      console.log(`  Current theme: ${currentTheme}`);

      // Capture initial background colors
      const initialBg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      const initialSidebarBg = await page.locator('aside').first().evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Screenshot initial theme
      await screenshot(page, `G_theme_${currentTheme}`);

      // Click theme toggle
      const themeToggle = page.locator('button[aria-label*="Switch to"]');
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Detect new theme
      const newTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute("data-theme") || "unknown";
      });
      console.log(`  New theme: ${newTheme}`);

      // Capture new background colors
      const newBg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      const newSidebarBg = await page.locator('aside').first().evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Check text colors changed
      const newTextColor = await page.locator('h1').first().evaluate((el) => {
        return window.getComputedStyle(el).color;
      });

      // Screenshot new theme
      await screenshot(page, `G_theme_${newTheme}`);

      // Toggle back
      await themeToggle.click();
      await page.waitForTimeout(500);

      const finalTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute("data-theme") || "unknown";
      });

      const themeChanged = currentTheme !== newTheme;
      const bgChanged = initialBg !== newBg;
      const sidebarBgChanged = initialSidebarBg !== newSidebarBg;
      const toggledBack = finalTheme === currentTheme;

      const gDetails = [
        `Initial theme: ${currentTheme}, bg: ${initialBg}`,
        `After toggle: ${newTheme}, bg: ${newBg}`,
        `Theme changed: ${themeChanged ? "YES" : "NO"}`,
        `Background changed: ${bgChanged ? "YES" : "NO"}`,
        `Sidebar bg changed: ${sidebarBgChanged ? "YES" : "NO"}`,
        `Text color in new theme: ${newTextColor}`,
        `Toggled back successfully: ${toggledBack ? "YES" : "NO"}`,
      ].join("; ");

      report("G: Light + Dark Mode",
        (themeChanged && bgChanged && toggledBack) ? "PASS" : "FAIL",
        gDetails
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      report("G: Light + Dark Mode", "FAIL", `Error: ${errMsg}`);
      await screenshot(page, "G_theme_error");
    }

    // ============================================
    // TEST H: Console Errors
    // ============================================
    console.log("\n=== TEST H: Console Errors ===");
    {
      // Filter out known Next.js dev-mode noise
      const significantErrors = consoleErrors.filter(
        (e) =>
          !e.includes("Download the React DevTools") &&
          !e.includes("React DevTools") &&
          !e.includes("[HMR]") &&
          !e.includes("Fast Refresh")
      );

      const significantWarnings = consoleWarnings.filter(
        (w) =>
          !w.includes("Download the React DevTools") &&
          !w.includes("React DevTools") &&
          !w.includes("[HMR]") &&
          !w.includes("Fast Refresh") &&
          !w.includes("DevTools")
      );

      const hDetails = [
        `JS Errors: ${significantErrors.length > 0 ? significantErrors.join(" | ") : "None"}`,
        `Warnings: ${significantWarnings.length > 0 ? significantWarnings.join(" | ") : "None"}`,
      ].join("; ");

      report("H: Console Errors",
        significantErrors.length === 0 ? "PASS" : "FAIL",
        hDetails
      );
    }

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`Fatal error: ${errMsg}`);
  } finally {
    await browser.close();
  }

  // ============================================
  // FINAL REPORT
  // ============================================
  console.log("\n\n========================================");
  console.log("       QA REPORT: ADMIN PANEL UX        ");
  console.log("========================================\n");

  for (const r of results) {
    const icon = r.status === "PASS" ? "[PASS]" : "[FAIL]";
    console.log(`${icon} ${r.test}`);
    console.log(`       ${r.details}\n`);
  }

  const passed = results.filter((r) => r.status === "PASS").length;
  const total = results.length;
  console.log(`========================================`);
  console.log(`  TOTAL: ${passed}/${total} PASSED`);
  console.log(`========================================`);
}

main();
