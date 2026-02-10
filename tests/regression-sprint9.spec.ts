import { test, expect, type Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const ADMIN_PASSWORD = "changeme";

// Toast selector: scoped to the toast container to avoid matching Next.js route announcer
const TOAST_SELECTOR = '.fixed.top-20.right-6 [role="alert"]';

/**
 * Helper: Login to admin panel via the login page (cookie-based auth).
 */
async function loginAdmin(page: Page) {
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: "networkidle" });
  await page.fill('input#password', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  // Wait for redirect to /admin
  await page.waitForURL("**/admin", { timeout: 10000 });
  await page.waitForSelector('h1:has-text("Personal Info")', { timeout: 10000 });
}

/**
 * Helper: Navigate to sidebar section
 */
async function goToSection(page: Page, sectionName: string) {
  // Click sidebar item (desktop layout)
  await page.click(`nav >> text="${sectionName}"`, { timeout: 5000 }).catch(async () => {
    // Fallback: try mobile tab bar
    await page.click(`text="${sectionName}"`, { timeout: 5000 });
  });
  // Wait for section header to appear
  await page.waitForSelector(`h1:has-text("${sectionName}")`, { timeout: 5000 });
}

/**
 * Helper: Wait for success toast and verify
 */
async function waitForToast(page: Page, expectedText: string) {
  const toast = page.locator(TOAST_SELECTOR).first();
  await toast.waitFor({ timeout: 5000 });
  const toastText = await toast.textContent();
  console.log(`Toast message: "${toastText}"`);
  expect(toastText).toContain(expectedText);
  return toastText;
}

// ============================================================================
// TEST A: Personal Info Form
// ============================================================================
test.describe("TEST A: Personal Info Form", () => {
  test("Edit name, save, reload, verify persistence, restore", async ({ page }) => {
    // Step 1: Login
    await loginAdmin(page);
    await page.screenshot({ path: "tests/screenshots/regA01-after-login.png" });

    // Step 2: Note current name value
    const nameField = page.locator('label:has-text("Name")').locator('..').locator('input');
    await nameField.waitFor({ timeout: 5000 });
    const originalName = await nameField.inputValue();
    console.log(`Original name: "${originalName}"`);
    expect(originalName).toBeTruthy();

    await page.screenshot({ path: "tests/screenshots/regA02-original-name.png" });

    // Step 3: Change name to "Regression Test"
    await nameField.fill("Regression Test");
    await page.waitForTimeout(300);

    // Step 4: Verify Save button becomes enabled (not disabled)
    const saveButton = page.locator('button:has-text("Save")');
    await expect(saveButton).toBeEnabled();
    console.log("Save button is enabled after edit");

    await page.screenshot({ path: "tests/screenshots/regA03-save-enabled.png" });

    // Step 5: Click Save
    await saveButton.click();

    // Step 6: Verify success toast appears
    await waitForToast(page, "Personal info saved");

    await page.screenshot({ path: "tests/screenshots/regA04-toast-success.png" });

    // Step 7: Reload page and re-login if needed
    await page.reload({ waitUntil: "networkidle" });
    // After reload with cookie auth, we should still be authenticated
    // But we might be on login page - check and re-login if needed
    const url = page.url();
    if (url.includes("login")) {
      await loginAdmin(page);
    } else {
      await page.waitForSelector('h1:has-text("Personal Info")', { timeout: 10000 });
    }

    // Step 8: Verify "Regression Test" persisted
    const nameFieldAfterReload = page.locator('label:has-text("Name")').locator('..').locator('input');
    await nameFieldAfterReload.waitFor({ timeout: 5000 });
    const nameAfterReload = await nameFieldAfterReload.inputValue();
    console.log(`Name after reload: "${nameAfterReload}"`);
    expect(nameAfterReload).toBe("Regression Test");

    await page.screenshot({ path: "tests/screenshots/regA05-persisted.png" });

    // Step 9: RESTORE - Change back to original name
    await nameFieldAfterReload.fill(originalName);
    await page.waitForTimeout(300);
    const saveButton2 = page.locator('button:has-text("Save")');
    await expect(saveButton2).toBeEnabled();
    await saveButton2.click();

    // Wait for success toast
    await waitForToast(page, "Personal info saved");

    // Verify restoration
    await page.waitForTimeout(500);
    const nameFieldRestored = page.locator('label:has-text("Name")').locator('..').locator('input');
    const restoredName = await nameFieldRestored.inputValue();
    console.log(`Restored name: "${restoredName}"`);
    expect(restoredName).toBe(originalName);

    await page.screenshot({ path: "tests/screenshots/regA06-restored.png" });
    console.log("TEST A: PASS");
  });
});

// ============================================================================
// TEST B: Experience Edit + Add
// ============================================================================
test.describe("TEST B: Experience Edit + Add", () => {
  test("Edit, add, save, delete experience entry", async ({ page }) => {
    await loginAdmin(page);

    // Step 1: Go to Experience section
    await goToSection(page, "Experience");
    await page.waitForTimeout(1000);

    await page.screenshot({ path: "tests/screenshots/regB01-experience-section.png" });

    // Count initial entries
    const initialCards = page.locator('button[aria-label="Edit"]');
    const initialCount = await initialCards.count();
    console.log(`Initial experience entries: ${initialCount}`);
    expect(initialCount).toBeGreaterThan(0);

    // Step 2: Click Edit on first entry
    const firstEditBtn = page.locator('button[aria-label="Edit"]').first();
    await firstEditBtn.click();
    await page.waitForTimeout(500);

    // Step 3: Verify form expands (check for Company/Role inputs)
    const companyInput = page.locator('label:has-text("Company")').locator('..').locator('input');
    await expect(companyInput).toBeVisible();
    console.log("Edit form expanded - Company input visible");

    await page.screenshot({ path: "tests/screenshots/regB02-edit-expanded.png" });

    // Step 4: Click Done (no changes)
    const doneButton = page.locator('button:has-text("Done")');
    await doneButton.click();
    await page.waitForTimeout(500);

    // Verify form collapsed
    await expect(companyInput).not.toBeVisible();
    console.log("Form collapsed after Done");

    // Step 5: Click "+ Add Experience"
    const addButton = page.locator('button:has-text("Add Experience")');
    await addButton.click();
    await page.waitForTimeout(500);

    // Step 6: Fill Company and Role
    const allCompanyInputs = page.locator('label:has-text("Company")').locator('..').locator('input');
    const newCompanyInput = allCompanyInputs.last();
    await newCompanyInput.fill("Regression Co");

    const allRoleInputs = page.locator('label:has-text("Role")').locator('..').locator('input');
    const newRoleInput = allRoleInputs.last();
    await newRoleInput.fill("Tester");

    await page.screenshot({ path: "tests/screenshots/regB03-new-entry-filled.png" });

    // Step 7: Click Done
    const doneButton2 = page.locator('button:has-text("Done")');
    await doneButton2.click();
    await page.waitForTimeout(500);

    // Step 8: Click Save
    const saveButton = page.locator('button:has-text("Save")');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // Step 9: Verify toast
    await waitForToast(page, "Experience saved");

    await page.screenshot({ path: "tests/screenshots/regB04-saved-with-new.png" });

    // Wait for toast to dismiss
    await page.waitForTimeout(3500);

    // Verify count increased
    const afterAddCount = await page.locator('button[aria-label="Edit"]').count();
    console.log(`Entries after add: ${afterAddCount}`);
    expect(afterAddCount).toBe(initialCount + 1);

    // Step 10: DELETE the new entry (click trash on last entry)
    const lastDeleteBtn = page.locator('button[aria-label="Delete"]').last();
    await lastDeleteBtn.click();
    await page.waitForTimeout(500);

    // Confirm modal should appear
    const modal = page.locator('h3:has-text("Delete Experience?")');
    await expect(modal).toBeVisible();
    console.log("Delete confirmation modal appeared");

    await page.screenshot({ path: "tests/screenshots/regB05-confirm-delete.png" });

    // Click "Delete" in modal (the red button inside the modal dialog)
    const modalDeleteBtn = page.locator('.fixed.inset-0 button:has-text("Delete")');
    await modalDeleteBtn.click();
    await page.waitForTimeout(500);

    // Save after delete
    const saveAfterDelete = page.locator('button:has-text("Save")');
    await expect(saveAfterDelete).toBeEnabled();
    await saveAfterDelete.click();

    // Wait for save toast
    await waitForToast(page, "Experience saved");

    await page.waitForTimeout(1000);

    // Step 11: Verify count returns to original
    const finalCount = await page.locator('button[aria-label="Edit"]').count();
    console.log(`Final entry count: ${finalCount} (original was ${initialCount})`);
    expect(finalCount).toBe(initialCount);

    await page.screenshot({ path: "tests/screenshots/regB06-restored.png" });
    console.log("TEST B: PASS");
  });
});

// ============================================================================
// TEST C: Toast Notifications
// ============================================================================
test.describe("TEST C: Toast Notifications", () => {
  test("Success toast appears and auto-dismisses", async ({ page }) => {
    await loginAdmin(page);

    // Step 1: Make a change on Personal Info
    const nameField = page.locator('label:has-text("Name")').locator('..').locator('input');
    await nameField.waitFor({ timeout: 5000 });
    const originalName = await nameField.inputValue();

    await nameField.fill(originalName + " X");
    await page.waitForTimeout(300);

    // Save
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();

    // Step 2: Verify green success toast at top-right
    const toast = page.locator(TOAST_SELECTOR).first();
    await toast.waitFor({ timeout: 5000 });
    await expect(toast).toBeVisible();
    const toastText = await toast.textContent();
    expect(toastText).toContain("Personal info saved");
    console.log(`Success toast appeared: "${toastText}"`);

    // Check it's positioned at top-right (the container is fixed top-20 right-6)
    const toastContainer = page.locator('.fixed.top-20.right-6');
    await expect(toastContainer).toBeVisible();
    console.log("Toast positioned at top-right");

    await page.screenshot({ path: "tests/screenshots/regC01-toast-visible.png" });

    // Step 3: Verify auto-dismiss after ~3 seconds
    // Toast config: success autoDismiss = 3000ms
    await page.waitForTimeout(4000);

    const toastCount = await page.locator(TOAST_SELECTOR).count();
    console.log(`Toasts remaining after 4s: ${toastCount}`);
    expect(toastCount).toBe(0);
    console.log("Toast auto-dismissed successfully");

    await page.screenshot({ path: "tests/screenshots/regC02-toast-dismissed.png" });

    // Step 4: RESTORE
    const nameField2 = page.locator('label:has-text("Name")').locator('..').locator('input');
    await nameField2.fill(originalName);
    await page.waitForTimeout(300);
    const saveButton2 = page.locator('button:has-text("Save")');
    await saveButton2.click();

    // Wait for the save toast
    await waitForToast(page, "Personal info saved");
    await page.waitForTimeout(500);

    // Verify restoration
    const restoredName = await nameField2.inputValue();
    console.log(`Restored name: "${restoredName}"`);
    expect(restoredName).toBe(originalName);

    console.log("TEST C: PASS");
  });
});

// ============================================================================
// TEST D: Undo Button
// ============================================================================
test.describe("TEST D: Undo Button", () => {
  test("Undo reverts changes and disables Save", async ({ page }) => {
    await loginAdmin(page);

    // Step 1: On Personal section, note original value
    const nameField = page.locator('label:has-text("Name")').locator('..').locator('input');
    await nameField.waitFor({ timeout: 5000 });
    const originalName = await nameField.inputValue();
    console.log(`Original name: "${originalName}"`);

    // Verify Save is initially disabled (no changes)
    const saveButton = page.locator('button:has-text("Save")');
    await expect(saveButton).toBeDisabled();
    console.log("Save button initially disabled");

    // Verify Undo is NOT visible initially
    const undoButton = page.locator('button:has-text("Undo")');
    const undoVisibleBefore = await undoButton.isVisible().catch(() => false);
    expect(undoVisibleBefore).toBe(false);
    console.log("Undo button not visible before changes");

    await page.screenshot({ path: "tests/screenshots/regD01-before-change.png" });

    // Step 2: Change a field
    await nameField.fill("Undo Test Name");
    await page.waitForTimeout(300);

    // Step 3: Verify Undo button appears
    await expect(undoButton).toBeVisible();
    console.log("Undo button appeared after change");

    // Verify Save is enabled
    await expect(saveButton).toBeEnabled();
    console.log("Save button enabled after change");

    await page.screenshot({ path: "tests/screenshots/regD02-after-change.png" });

    // Step 4: Click Undo
    await undoButton.click();
    await page.waitForTimeout(300);

    // Step 5: Verify field reverts to original
    const nameAfterUndo = await nameField.inputValue();
    console.log(`Name after undo: "${nameAfterUndo}"`);
    expect(nameAfterUndo).toBe(originalName);

    // Step 6: Verify Save becomes disabled again
    await expect(saveButton).toBeDisabled();
    console.log("Save button disabled after undo");

    // Verify Undo button disappears
    const undoVisibleAfter = await undoButton.isVisible().catch(() => false);
    expect(undoVisibleAfter).toBe(false);
    console.log("Undo button hidden after undo");

    await page.screenshot({ path: "tests/screenshots/regD03-after-undo.png" });
    console.log("TEST D: PASS");
  });
});

// ============================================================================
// TEST E: Confirm Modal on Delete
// ============================================================================
test.describe("TEST E: Confirm Modal on Delete", () => {
  test("Delete triggers modal, Cancel preserves entry", async ({ page }) => {
    await loginAdmin(page);

    // Step 1: Go to Experience section
    await goToSection(page, "Experience");
    await page.waitForTimeout(1000);

    // Count entries before
    const countBefore = await page.locator('button[aria-label="Delete"]').count();
    console.log(`Experience entries before: ${countBefore}`);
    expect(countBefore).toBeGreaterThan(0);

    // Step 2: Click delete on first entry
    const firstDeleteBtn = page.locator('button[aria-label="Delete"]').first();
    await firstDeleteBtn.click();
    await page.waitForTimeout(500);

    // Step 3: Verify confirmation modal appears with overlay
    const modalTitle = page.locator('h3:has-text("Delete Experience?")');
    await expect(modalTitle).toBeVisible();
    console.log("Confirmation modal appeared with title 'Delete Experience?'");

    // Check overlay (fixed inset-0 with background)
    const overlay = page.locator('.fixed.inset-0');
    await expect(overlay).toBeVisible();
    console.log("Modal overlay visible");

    // Check Cancel and Delete buttons exist in modal
    const cancelBtn = page.locator('.fixed.inset-0 button:has-text("Cancel")');
    await expect(cancelBtn).toBeVisible();
    const deleteBtn = page.locator('.fixed.inset-0 button:has-text("Delete")');
    await expect(deleteBtn).toBeVisible();
    console.log("Cancel and Delete buttons visible in modal");

    await page.screenshot({ path: "tests/screenshots/regE01-confirm-modal.png" });

    // Step 4: Click Cancel
    await cancelBtn.click();
    await page.waitForTimeout(500);

    // Step 5: Verify entry still exists
    const countAfterCancel = await page.locator('button[aria-label="Delete"]').count();
    console.log(`Experience entries after cancel: ${countAfterCancel}`);
    expect(countAfterCancel).toBe(countBefore);

    // Verify modal is gone
    const modalGone = await modalTitle.isVisible().catch(() => false);
    expect(modalGone).toBe(false);
    console.log("Modal dismissed, all entries preserved");

    await page.screenshot({ path: "tests/screenshots/regE02-after-cancel.png" });
    console.log("TEST E: PASS");
  });
});
