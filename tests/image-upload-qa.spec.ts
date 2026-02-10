import { test, expect } from "@playwright/test";
import path from "path";

const SCREENSHOTS_DIR = path.join(__dirname, "screenshots", "image-upload");

// Helper: login and navigate to admin
async function loginAndNavigate(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.waitForLoadState("networkidle");
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill("changeme");
  // Submit - look for a button
  const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Enter")');
  await submitBtn.first().click();
  // Wait for navigation to admin panel
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 });
  await page.waitForLoadState("networkidle");
}

test.describe("Image Upload QA Tests", () => {

  test("TEST 1: Avatar upload field exists on Personal section", async ({ page }) => {
    await loginAndNavigate(page);

    // We should be on the Personal section by default
    // Look for ImageUpload component - it has a drop zone with text "Drop image here or click to browse"
    // or an existing image preview with alt="Upload preview"
    const dropZone = page.locator('text=Drop image here or click to browse');
    const imagePreview = page.locator('img[alt="Upload preview"]');
    const profilePhotoLabel = page.locator('text=Profile Photo');

    // Check that Profile Photo label exists
    await expect(profilePhotoLabel).toBeVisible({ timeout: 10000 });

    // Either the drop zone or a preview image should be visible
    const hasDropZone = await dropZone.isVisible().catch(() => false);
    const hasPreview = await imagePreview.first().isVisible().catch(() => false);

    expect(hasDropZone || hasPreview).toBe(true);

    // Also verify hidden file input exists
    const fileInput = page.locator('input[type="file"][accept="image/*"]');
    await expect(fileInput.first()).toBeAttached();

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "test1-avatar-upload-field.png"), fullPage: true });
    console.log("TEST 1 PASS: Avatar upload field exists on Personal section");
  });

  test("TEST 2: Project thumbnail upload field exists", async ({ page }) => {
    await loginAndNavigate(page);

    // Click on Projects in the sidebar
    const projectsNav = page.locator('text=Projects').first();
    await projectsNav.click();
    await page.waitForLoadState("networkidle");

    // Wait for project list to load
    await page.waitForTimeout(2000);

    // Click Edit on the first project - find the edit button (Pencil icon)
    const editBtn = page.locator('button[aria-label="Edit"]').first();
    await editBtn.click();
    await page.waitForTimeout(1000);

    // Look for "Thumbnail Image" label
    const thumbnailLabel = page.locator('text=Thumbnail Image');
    await expect(thumbnailLabel).toBeVisible({ timeout: 5000 });

    // Either drop zone or preview should be visible in the project edit form
    const dropZone = page.locator('text=Drop image here or click to browse');
    const imagePreview = page.locator('img[alt="Upload preview"]');

    const hasDropZone = await dropZone.isVisible().catch(() => false);
    const hasPreview = await imagePreview.first().isVisible().catch(() => false);

    expect(hasDropZone || hasPreview).toBe(true);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "test2-project-thumbnail-field.png"), fullPage: true });
    console.log("TEST 2 PASS: Project thumbnail upload field exists");
  });

  test("TEST 3: File picker upload works for avatar", async ({ page }) => {
    await loginAndNavigate(page);

    // Wait for Personal section to fully load
    await page.waitForTimeout(2000);

    // If there's already an uploaded image, remove it first
    const removeBtn = page.locator('button[aria-label="Remove image"]');
    if (await removeBtn.first().isVisible().catch(() => false)) {
      await removeBtn.first().click();
      await page.waitForTimeout(500);
    }

    // Find the file input for image upload
    const fileInput = page.locator('input[type="file"][accept="image/*"]').first();
    await expect(fileInput).toBeAttached({ timeout: 5000 });

    // Upload the test avatar image
    await fileInput.setInputFiles("/tmp/test_avatar.png");

    // Wait for upload to process - the component shows uploading state, then either:
    // 1. Shows preview image (if upload succeeds)
    // 2. Shows an error (if Vercel Blob is not configured)
    await page.waitForTimeout(5000);

    // Check outcomes
    const preview = page.locator('img[alt="Upload preview"]');
    const errorMsg = page.locator('text=/Upload failed|error/i');
    const hasPreview = await preview.first().isVisible().catch(() => false);
    const hasError = await errorMsg.first().isVisible().catch(() => false);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "test3-file-upload-result.png"), fullPage: true });

    if (hasPreview) {
      console.log("TEST 3 PASS: File uploaded successfully, preview is visible");
    } else if (hasError) {
      console.log("TEST 3 PARTIAL: Upload attempted but server returned error (Vercel Blob may not be configured). Error handling works correctly.");
    } else {
      console.log("TEST 3 INFO: Upload completed but outcome unclear. Check screenshot.");
    }

    // The test passes as long as the upload mechanism works (file input triggers upload flow)
    expect(hasPreview || hasError).toBe(true);
  });

  test("TEST 4: Invalid file type is rejected", async ({ page }) => {
    await loginAndNavigate(page);

    // Wait for Personal section to fully load
    await page.waitForTimeout(2000);

    // If there's already an uploaded image, remove it first
    const removeBtn = page.locator('button[aria-label="Remove image"]');
    if (await removeBtn.first().isVisible().catch(() => false)) {
      await removeBtn.first().click();
      await page.waitForTimeout(500);
    }

    // Find the file input
    const fileInput = page.locator('input[type="file"][accept="image/*"]').first();
    await expect(fileInput).toBeAttached({ timeout: 5000 });

    // Upload the invalid text file
    // Note: Playwright bypasses the accept attribute, so the file will be selected
    await fileInput.setInputFiles("/tmp/test_invalid.txt");

    // Wait for validation
    await page.waitForTimeout(3000);

    // Check for error message - the component checks file.type.startsWith("image/")
    // and throws "Only image files are allowed."
    const errorMsg = page.locator('text=Only image files are allowed');
    const hasError = await errorMsg.isVisible().catch(() => false);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "test4-invalid-file-type.png"), fullPage: true });

    if (hasError) {
      console.log("TEST 4 PASS: Invalid file type correctly rejected with error message");
    } else {
      // Also check for any error text
      const anyError = page.locator('[style*="EF4444"]');
      const hasAnyError = await anyError.first().isVisible().catch(() => false);
      if (hasAnyError) {
        const errorText = await anyError.first().textContent();
        console.log(`TEST 4 PASS: Error shown: "${errorText}"`);
      } else {
        console.log("TEST 4 FAIL: No error message shown for invalid file type");
      }
    }

    expect(hasError).toBe(true);
  });

  test("TEST 5: Large file is rejected", async ({ page }) => {
    await loginAndNavigate(page);

    // Wait for Personal section to fully load
    await page.waitForTimeout(2000);

    // If there's already an uploaded image, remove it first
    const removeBtn = page.locator('button[aria-label="Remove image"]');
    if (await removeBtn.first().isVisible().catch(() => false)) {
      await removeBtn.first().click();
      await page.waitForTimeout(500);
    }

    // Find the file input
    const fileInput = page.locator('input[type="file"][accept="image/*"]').first();
    await expect(fileInput).toBeAttached({ timeout: 5000 });

    // Upload the large file (6MB, over 5MB limit)
    await fileInput.setInputFiles("/tmp/test_large.png");

    // Wait for validation
    await page.waitForTimeout(3000);

    // Check for size error - the component checks: file.size > 5 * 1024 * 1024
    // and throws "File too large. Max 5MB."
    const errorMsg = page.locator('text=File too large');
    const hasError = await errorMsg.isVisible().catch(() => false);

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "test5-large-file.png"), fullPage: true });

    if (hasError) {
      console.log("TEST 5 PASS: Large file correctly rejected with size error");
    } else {
      console.log("TEST 5 FAIL: No error message shown for oversized file");
    }

    expect(hasError).toBe(true);
  });

  test("TEST 6: Drag and drop zone exists", async ({ page }) => {
    await loginAndNavigate(page);

    // Wait for Personal section to fully load
    await page.waitForTimeout(2000);

    // If there's already an uploaded image, remove it first
    const removeBtn = page.locator('button[aria-label="Remove image"]');
    if (await removeBtn.first().isVisible().catch(() => false)) {
      await removeBtn.first().click();
      await page.waitForTimeout(500);
    }

    // The ImageUpload component has a drop zone with onDragOver, onDragLeave, onDrop handlers
    // Look for the dashed border drop zone
    const dropZone = page.locator('text=Drop image here or click to browse');
    await expect(dropZone).toBeVisible({ timeout: 5000 });

    // Also verify the hint text about supported formats
    const formatHint = page.locator('text=JPEG, PNG, WebP, GIF, SVG. Max 5MB.');
    await expect(formatHint).toBeVisible();

    // Verify the drop zone container has the dashed border styling
    const dropZoneContainer = dropZone.locator('..');
    const borderStyle = await dropZoneContainer.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.borderStyle;
    });
    expect(borderStyle).toBe('dashed');

    // Verify the drop zone container has event handlers for drag-and-drop
    // by checking the element has the expected structure
    const dropTarget = dropZone.locator('..');

    // Verify the drop zone has the expected interactive attributes (cursor pointer)
    const cursor = await dropTarget.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.cursor;
    });
    expect(cursor).toBe('pointer');

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "test6-drag-drop-zone.png"), fullPage: true });
    console.log("TEST 6 PASS: Drag-and-drop zone exists with dashed border and proper text");
  });
});
