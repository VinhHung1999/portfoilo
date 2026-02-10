import { test, expect, Page } from '@playwright/test';

const SCREENSHOT_DIR = 'tests/screenshots';

async function login(page: Page) {
  await page.goto('/admin/login');
  await page.waitForLoadState('networkidle');
  await page.locator('input#password').fill('changeme');
  await page.locator('button[type="submit"]').click();
  // Wait for redirect to /admin
  await page.waitForURL('**/admin', { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  // Wait for content to load (skeleton disappears)
  await page.waitForTimeout(1500);
}

async function navigateToSection(page: Page, sectionLabel: string) {
  // Sidebar buttons (visible at lg viewport 1280px)
  const sidebarBtn = page.locator('aside nav button').filter({ hasText: sectionLabel });
  await sidebarBtn.click();
  await page.waitForTimeout(1000);
}

/** Get the input element associated with a label */
async function getInputByLabel(page: Page, labelText: string) {
  const label = page.locator(`label`).filter({ hasText: labelText }).first();
  const forAttr = await label.getAttribute('for');
  if (forAttr) {
    // Use attribute selector to avoid CSS.escape issues with special chars like colons
    return page.locator(`[id="${forAttr}"]`);
  }
  // Fallback: next sibling input
  return label.locator('..').locator('input').first();
}

test.describe.serial('Admin Panel Content Editing - QA Tests', () => {

  // ========== SECTION A: Personal Info ==========
  test('A. Personal Info - Edit Name', async ({ page }) => {
    console.log('=== SECTION A: Personal Info ===');

    // A1: Login - should land on Personal section by default
    await login(page);
    const heading = page.locator('h1:has-text("Personal Info")');
    await expect(heading).toBeVisible();
    console.log('A1: PASS - Logged in, on Personal Info section');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/A01-after-login.png`, fullPage: true });

    // A2: Find the Name input and note current value
    const nameInput = await getInputByLabel(page, 'Name');
    const originalName = await nameInput.inputValue();
    console.log(`A2: PASS - Current name: "${originalName}"`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/A02-original-name.png`, fullPage: true });

    // A3: Change name to "QA Test Name"
    await nameInput.clear();
    await nameInput.fill('QA Test Name');
    const newVal = await nameInput.inputValue();
    expect(newVal).toBe('QA Test Name');
    console.log('A3: PASS - Name changed to "QA Test Name"');

    // A4: Verify Save button becomes enabled
    const saveButton = page.locator('button:has-text("Save")');
    await page.waitForTimeout(300);
    const isDisabled = await saveButton.isDisabled();
    expect(isDisabled).toBe(false);
    console.log(`A4: PASS - Save button enabled: ${!isDisabled}`);
    // Also check Undo button appeared (only shows when isDirty)
    const undoButton = page.locator('button:has-text("Undo")');
    await expect(undoButton).toBeVisible();
    console.log('A4: PASS - Undo button also visible');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/A04-save-enabled.png`, fullPage: true });

    // A5: Click Save
    await saveButton.click();
    console.log('A5: Clicked Save');

    // A6: Verify success toast appears
    const toast = page.locator('[role="alert"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    const toastText = await toast.textContent();
    console.log(`A6: PASS - Toast appeared: "${toastText}"`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/A06-toast-success.png`, fullPage: true });

    // Wait for toast to auto-dismiss (3s for success)
    await page.waitForTimeout(3500);

    // A7: Reload the page and verify persistence
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    // If redirected to login, re-login
    if (page.url().includes('login')) {
      await login(page);
    }
    await page.waitForTimeout(1500);

    // A8: Verify name persisted
    const nameInput2 = await getInputByLabel(page, 'Name');
    const persistedName = await nameInput2.inputValue();
    expect(persistedName).toBe('QA Test Name');
    console.log(`A8: PASS - Name persisted after reload: "${persistedName}"`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/A08-persisted.png`, fullPage: true });

    // A9: Restore original value
    await nameInput2.clear();
    await nameInput2.fill(originalName);
    const saveBtn2 = page.locator('button:has-text("Save")');
    await page.waitForTimeout(300);
    await saveBtn2.click();
    // Wait for toast
    const toast2 = page.locator('[role="alert"]').first();
    await expect(toast2).toBeVisible({ timeout: 5000 });
    console.log(`A9: PASS - Restored name to "${originalName}"`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/A09-restored.png`, fullPage: true });

    console.log('=== SECTION A: ALL PASS ===');
  });

  // ========== SECTION B: Experience ==========
  test('B. Experience - Edit Entry', async ({ page }) => {
    console.log('=== SECTION B: Experience ===');

    await login(page);

    // B1: Click Experience in sidebar
    await navigateToSection(page, 'Experience');
    const heading = page.locator('h1:has-text("Experience")');
    await expect(heading).toBeVisible();
    console.log('B1: PASS - Navigated to Experience section');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/B01-experience.png`, fullPage: true });

    // B2: Verify experience list shows entries (collapsed cards with Edit buttons)
    const editBtns = page.locator('button[aria-label="Edit"]');
    const editCount = await editBtns.count();
    expect(editCount).toBeGreaterThan(0);
    console.log(`B2: PASS - Found ${editCount} experience entries`);

    // B3: Click Edit (pencil icon) on first entry
    await editBtns.first().click();
    await page.waitForTimeout(500);
    console.log('B3: PASS - Clicked Edit on first entry');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/B03-edit-expanded.png`, fullPage: true });

    // B4: Verify expanded form has fields
    const roleLabel = page.locator('label').filter({ hasText: 'Role' }).first();
    await expect(roleLabel).toBeVisible();
    const companyLabel = page.locator('label').filter({ hasText: 'Company' }).first();
    await expect(companyLabel).toBeVisible();
    console.log('B4: PASS - Edit form expanded with Role and Company fields');

    // B5: Modify the role/title
    const roleInput = await getInputByLabel(page, 'Role');
    const originalRole = await roleInput.inputValue();
    console.log(`B5: Original role: "${originalRole}"`);
    await roleInput.clear();
    await roleInput.fill(originalRole + ' - QA Test');
    console.log(`B5: PASS - Changed role to "${originalRole} - QA Test"`);

    // B6: Click Done to collapse
    const doneBtn = page.locator('button:has-text("Done")').first();
    await doneBtn.click();
    await page.waitForTimeout(500);
    console.log('B6: PASS - Clicked Done');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/B06-collapsed.png`, fullPage: true });

    // Verify the role text shows on the collapsed card
    const roleText = page.locator('p.text-base.font-semibold').first();
    const displayedRole = await roleText.textContent();
    expect(displayedRole).toContain('QA Test');
    console.log(`B6: PASS - Collapsed card shows updated role: "${displayedRole}"`);

    // B7: Click Save
    const saveBtn = page.locator('button:has-text("Save")');
    await saveBtn.click();
    console.log('B7: Clicked Save');

    // B8: Verify success toast
    const toast = page.locator('[role="alert"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    console.log('B8: PASS - Success toast appeared');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/B08-saved.png`, fullPage: true });

    await page.waitForTimeout(3500);

    // B9: Reload and verify persistence
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    if (page.url().includes('login')) {
      await login(page);
    }
    await page.waitForTimeout(1500);
    await navigateToSection(page, 'Experience');
    await page.waitForTimeout(1000);

    // Click edit on first entry
    await page.locator('button[aria-label="Edit"]').first().click();
    await page.waitForTimeout(500);

    const roleInput2 = await getInputByLabel(page, 'Role');
    const persistedRole = await roleInput2.inputValue();
    expect(persistedRole).toContain('QA Test');
    console.log(`B9: PASS - Role persisted: "${persistedRole}"`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/B09-persisted.png`, fullPage: true });

    // B10: Restore original value
    await roleInput2.clear();
    await roleInput2.fill(originalRole);
    await page.locator('button:has-text("Done")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Save")').click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
    console.log(`B10: PASS - Restored role to "${originalRole}"`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/B10-restored.png`, fullPage: true });

    console.log('=== SECTION B: ALL PASS ===');
  });

  // ========== SECTION C: Projects ==========
  test('C. Projects - Edit and Tags', async ({ page }) => {
    console.log('=== SECTION C: Projects ===');

    await login(page);

    // C1: Click Projects in sidebar
    await navigateToSection(page, 'Projects');
    const heading = page.locator('h1:has-text("Projects")');
    await expect(heading).toBeVisible();
    console.log('C1: PASS - Navigated to Projects section');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/C01-projects.png`, fullPage: true });

    // C2: Verify project list shows entries
    const editBtns = page.locator('button[aria-label="Edit"]');
    const projCount = await editBtns.count();
    expect(projCount).toBeGreaterThan(0);
    console.log(`C2: PASS - Found ${projCount} project entries`);

    // C3: Click Edit on first project
    await editBtns.first().click();
    await page.waitForTimeout(500);
    console.log('C3: PASS - Clicked Edit on first project');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/C03-project-edit.png`, fullPage: true });

    // C4: Verify form has expected fields
    await expect(page.locator('label').filter({ hasText: 'Title' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Short Description' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Full Description' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Tech Stack' }).first()).toBeVisible();
    console.log('C4: PASS - Form shows Title, Short Description, Full Description, Tech Stack fields');

    // C5: Add a tag to Tech Stack
    // When tags already exist, the placeholder is empty, so find the input within the Tech Stack label container
    const techStackSection = page.locator('label').filter({ hasText: 'Tech Stack' }).locator('..');
    const tagInput = techStackSection.locator('input[type="text"]');
    await tagInput.fill('QATest');
    await tagInput.press('Enter');
    await page.waitForTimeout(500);
    console.log('C5: PASS - Typed "QATest" and pressed Enter');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/C05-tag-added.png`, fullPage: true });

    // C6: Verify tag pill appears
    const tagPill = page.locator('span:has-text("QATest")');
    await expect(tagPill).toBeVisible();
    console.log('C6: PASS - QATest tag pill visible');

    // C7: Remove the tag by clicking x
    const removeTagBtn = page.locator('button[aria-label="Remove QATest"]');
    await removeTagBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('button[aria-label="Remove QATest"]')).not.toBeVisible();
    console.log('C7: PASS - Removed QATest tag');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/C07-tag-removed.png`, fullPage: true });

    // C8: Click Done to collapse
    await page.locator('button:has-text("Done")').first().click();
    await page.waitForTimeout(300);
    console.log('C8: PASS - Clicked Done');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/C08-done.png`, fullPage: true });

    console.log('=== SECTION C: ALL PASS ===');
  });

  // ========== SECTION D: Skills ==========
  test('D. Skills - Edit Category', async ({ page }) => {
    console.log('=== SECTION D: Skills ===');

    await login(page);

    // D1: Click Skills in sidebar
    await navigateToSection(page, 'Skills');
    const heading = page.locator('h1:has-text("Skills")');
    await expect(heading).toBeVisible();
    console.log('D1: PASS - Navigated to Skills section');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/D01-skills.png`, fullPage: true });

    // D2: Verify skill categories are shown
    const categoryNames = page.locator('p.text-base.font-semibold');
    const catCount = await categoryNames.count();
    expect(catCount).toBeGreaterThan(0);
    console.log(`D2: PASS - Found ${catCount} skill categories`);
    for (let i = 0; i < catCount; i++) {
      const catName = await categoryNames.nth(i).textContent();
      console.log(`D2: Category ${i}: "${catName}"`);
    }
    await page.screenshot({ path: `${SCREENSHOT_DIR}/D02-categories.png`, fullPage: true });

    // D3: Click Edit on first category
    await page.locator('button[aria-label="Edit"]').first().click();
    await page.waitForTimeout(500);
    console.log('D3: PASS - Clicked Edit on first category');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/D03-skills-edit.png`, fullPage: true });

    // D4: Verify existing skills shown as tag pills
    const skillPills = page.locator('span.inline-flex');
    const pillCount = await skillPills.count();
    expect(pillCount).toBeGreaterThan(0);
    console.log(`D4: PASS - Found ${pillCount} skill pills`);

    // D5: Add a skill
    // Skills TagInput - find input within the "Skills" label container (not "Category Name" one)
    const skillsSection = page.locator('label').filter({ hasText: /^Skills/ }).locator('..');
    const tagInput = skillsSection.locator('input[type="text"]');
    await tagInput.fill('QATestSkill');
    await tagInput.press('Enter');
    await page.waitForTimeout(500);
    console.log('D5: PASS - Added "QATestSkill"');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/D05-skill-added.png`, fullPage: true });

    // D6: Verify it appears
    const newSkillPill = page.locator('button[aria-label="Remove QATestSkill"]');
    await expect(newSkillPill).toBeVisible();
    console.log('D6: PASS - QATestSkill visible (found its remove button)');

    // D7: Remove it
    await newSkillPill.click();
    await page.waitForTimeout(300);
    await expect(page.locator('button[aria-label="Remove QATestSkill"]')).not.toBeVisible();
    console.log('D7: PASS - Removed QATestSkill');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/D07-skill-removed.png`, fullPage: true });

    // D8: Click Done
    await page.locator('button:has-text("Done")').first().click();
    await page.waitForTimeout(300);
    console.log('D8: PASS - Clicked Done');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/D08-done.png`, fullPage: true });

    console.log('=== SECTION D: ALL PASS ===');
  });

  // ========== SECTION E: Achievements ==========
  test('E. Achievements - View and Edit', async ({ page }) => {
    console.log('=== SECTION E: Achievements ===');

    await login(page);

    // E1: Click Achievements in sidebar
    await navigateToSection(page, 'Achievements');
    const heading = page.locator('h1:has-text("Achievements")');
    await expect(heading).toBeVisible();
    console.log('E1: PASS - Navigated to Achievements section');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/E01-achievements.png`, fullPage: true });

    // E2: Verify achievements list
    const editBtns = page.locator('button[aria-label="Edit"]');
    const achCount = await editBtns.count();
    expect(achCount).toBeGreaterThan(0);
    console.log(`E2: PASS - Found ${achCount} achievement entries`);

    // E3: Click Edit on first achievement
    await editBtns.first().click();
    await page.waitForTimeout(500);
    console.log('E3: PASS - Clicked Edit on first achievement');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/E03-achievement-edit.png`, fullPage: true });

    // E4: Verify form fields - Title, Description, Date, Icon
    await expect(page.locator('label').filter({ hasText: 'Title' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Description' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Date' }).first()).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'Icon' }).first()).toBeVisible();
    console.log('E4: PASS - Form shows Title, Description, Date, Icon fields');

    // E5: Check for icon selector
    const iconLabel = page.locator('label').filter({ hasText: 'Icon' }).first();
    await expect(iconLabel).toBeVisible();
    console.log('E5: PASS - Icon selector/field exists');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/E05-form-fields.png`, fullPage: true });

    // E6: Click Done
    await page.locator('button:has-text("Done")').first().click();
    await page.waitForTimeout(300);
    console.log('E6: PASS - Clicked Done');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/E06-done.png`, fullPage: true });

    console.log('=== SECTION E: ALL PASS ===');
  });

  // ========== SECTION F: Add + Delete Experience ==========
  test('F. Experience - Add and Delete', async ({ page }) => {
    console.log('=== SECTION F: Add + Delete Experience ===');

    await login(page);

    // F1: Go to Experience
    await navigateToSection(page, 'Experience');
    const heading = page.locator('h1:has-text("Experience")');
    await expect(heading).toBeVisible();
    console.log('F1: PASS - Navigated to Experience');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/F01-experience.png`, fullPage: true });

    // Count initial entries
    const initialCount = await page.locator('button[aria-label="Edit"]').count();
    console.log(`F1: Initial experience count: ${initialCount}`);

    // F2: Click "Add Experience" button
    await page.locator('button:has-text("Add Experience")').click();
    await page.waitForTimeout(500);
    console.log('F2: PASS - Clicked Add Experience');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/F02-add-clicked.png`, fullPage: true });

    // F3: Verify new empty form appears (should auto-expand in edit mode)
    const companyLabel = page.locator('label').filter({ hasText: 'Company' }).first();
    await expect(companyLabel).toBeVisible();
    console.log('F3: PASS - New empty form appeared');

    // F4: Fill in fields
    const companyInput = await getInputByLabel(page, 'Company');
    await companyInput.fill('QA Test Co');
    console.log('F4: Filled Company = "QA Test Co"');

    const roleInput = await getInputByLabel(page, 'Role');
    await roleInput.fill('QA Tester');
    console.log('F4: Filled Role = "QA Tester"');

    const startInput = await getInputByLabel(page, 'Start Date');
    await startInput.fill('Jan 2024');
    console.log('F4: Filled Start Date = "Jan 2024"');

    await page.screenshot({ path: `${SCREENSHOT_DIR}/F04-filled.png`, fullPage: true });
    console.log('F4: PASS - Filled all fields');

    // F5: Click Done
    await page.locator('button:has-text("Done")').first().click();
    await page.waitForTimeout(500);
    console.log('F5: PASS - Clicked Done');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/F05-after-done.png`, fullPage: true });

    // Verify the new entry shows in collapsed view
    await expect(page.locator('text=QA Test Co').first()).toBeVisible();
    console.log('F5: PASS - "QA Test Co" visible in collapsed card');

    // F6: Click Save
    await page.locator('button:has-text("Save")').click();
    console.log('F6: Clicked Save');

    // Verify success toast
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
    console.log('F6: PASS - Success toast appeared');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/F06-saved.png`, fullPage: true });

    await page.waitForTimeout(3500);

    // F7: Verify the new entry appears
    await expect(page.locator('text=QA Test Co').first()).toBeVisible();
    const newCount = await page.locator('button[aria-label="Edit"]').count();
    expect(newCount).toBe(initialCount + 1);
    console.log(`F7: PASS - Entry count increased from ${initialCount} to ${newCount}`);

    // F8: Delete the new entry (last one)
    await page.locator('button[aria-label="Delete"]').last().click();
    await page.waitForTimeout(500);
    console.log('F8: PASS - Clicked Delete on new entry');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/F08-confirm-modal.png`, fullPage: true });

    // F9: Verify confirmation modal
    await expect(page.locator('h3:has-text("Delete Experience?")')).toBeVisible();
    console.log('F9: PASS - Confirmation modal appeared');

    // Verify modal mentions the role in its message
    const modalMessage = page.locator('p').filter({ hasText: 'This will remove' });
    await expect(modalMessage).toBeVisible();
    const msgText = await modalMessage.textContent();
    expect(msgText).toContain('QA Tester');
    console.log(`F9: PASS - Modal message: "${msgText}"`);

    // F10: Confirm the delete
    // The modal has "Cancel" and "Delete" buttons. Click the red "Delete" button.
    const modalDeleteBtn = page.locator('button').filter({ hasText: 'Delete' }).last();
    await modalDeleteBtn.click();
    await page.waitForTimeout(500);
    console.log('F10: PASS - Confirmed delete');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/F10-after-delete.png`, fullPage: true });

    // Verify entry removed from list
    await expect(page.locator('text=QA Test Co')).toHaveCount(0);
    console.log('F10: PASS - "QA Test Co" no longer visible');

    // F11: Save the deletion
    await page.locator('button:has-text("Save")').click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
    console.log('F11: PASS - Saved after delete, toast appeared');
    await page.screenshot({ path: `${SCREENSHOT_DIR}/F11-delete-saved.png`, fullPage: true });

    await page.waitForTimeout(3500);

    // F12: Verify entry is gone (count back to original)
    const finalCount = await page.locator('button[aria-label="Edit"]').count();
    expect(finalCount).toBe(initialCount);
    console.log(`F12: PASS - Entry count back to ${finalCount} (was ${initialCount})`);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/F12-final.png`, fullPage: true });

    console.log('=== SECTION F: ALL PASS ===');
  });
});
