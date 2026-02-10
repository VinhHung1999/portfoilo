import { test, expect } from "@playwright/test";

const SCREENSHOT_DIR = "tests/screenshots/cookie-auth";

test.describe("Admin Cookie-Based Authentication", () => {
  // TEST 1: LOGIN SETS COOKIE
  test("TEST 1: Login sets httpOnly cookie", async ({ page, context }) => {
    // Navigate to login page
    await page.goto("/admin/login");
    await expect(page.locator("h1")).toHaveText("Admin Panel");

    // Enter password and submit
    await page.fill('input[type="password"]', "changeme");
    await page.click('button[type="submit"]');

    // Verify redirect to /admin dashboard
    await page.waitForURL("**/admin", { timeout: 10000 });
    // Wait for the dashboard content to load (not the loading state)
    await expect(
      page.locator("text=Personal").first()
    ).toBeVisible({ timeout: 10000 });

    // Check browser cookies for the auth cookie
    const cookies = await context.cookies();
    const authCookie = cookies.find((c) => c.name === "admin_token");
    console.log("All cookies after login:", JSON.stringify(cookies, null, 2));

    expect(authCookie).toBeDefined();
    expect(authCookie!.httpOnly).toBe(true);
    expect(authCookie!.sameSite).toBe("Strict");
    expect(authCookie!.path).toBe("/");

    // Take screenshot of dashboard
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/test1-dashboard-after-login.png`,
      fullPage: false,
    });
  });

  // TEST 2: COOKIE PERSISTS ON REFRESH
  test("TEST 2: Cookie persists on page refresh", async ({ page, context }) => {
    // First, login
    await page.goto("/admin/login");
    await page.fill('input[type="password"]', "changeme");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin", { timeout: 10000 });
    await expect(
      page.locator("text=Personal").first()
    ).toBeVisible({ timeout: 10000 });

    // Now reload the page
    await page.goto("/admin");

    // Wait and verify we're still on /admin (not redirected to login)
    await page.waitForLoadState("networkidle");

    // Check URL - should still be /admin, NOT /admin/login
    const url = page.url();
    console.log("URL after refresh:", url);
    expect(url).toContain("/admin");
    expect(url).not.toContain("/admin/login");

    // Dashboard content should be visible (Personal section by default)
    await expect(
      page.locator("text=Personal").first()
    ).toBeVisible({ timeout: 10000 });

    // Verify cookie is still present
    const cookies = await context.cookies();
    const authCookie = cookies.find((c) => c.name === "admin_token");
    expect(authCookie).toBeDefined();

    // Take screenshot showing still on admin dashboard
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/test2-still-logged-in-after-refresh.png`,
      fullPage: false,
    });
  });

  // TEST 3: LOGOUT CLEARS COOKIE
  test("TEST 3: Logout clears cookie and redirects", async ({
    page,
    context,
  }) => {
    // First, login
    await page.goto("/admin/login");
    await page.fill('input[type="password"]', "changeme");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin", { timeout: 10000 });
    await expect(
      page.locator("text=Personal").first()
    ).toBeVisible({ timeout: 10000 });

    // Click the Logout button in the top bar
    await page.click("button:has-text('Logout')");

    // Verify redirected to /admin/login
    await page.waitForURL("**/admin/login", { timeout: 10000 });
    await expect(page.locator("h1")).toHaveText("Admin Panel");

    // Verify cookie is cleared or expired
    const cookiesAfterLogout = await context.cookies();
    const authCookieAfterLogout = cookiesAfterLogout.find(
      (c) => c.name === "admin_token"
    );
    console.log(
      "Auth cookie after logout:",
      JSON.stringify(authCookieAfterLogout)
    );
    // Cookie should be gone (maxAge=0 means deleted)
    expect(authCookieAfterLogout).toBeUndefined();

    // Try navigating directly to /admin
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Should be redirected back to login
    await page.waitForURL("**/admin/login", { timeout: 10000 });
    await expect(page.locator("h1")).toHaveText("Admin Panel");

    // Take screenshot showing login page after logout
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/test3-redirected-to-login-after-logout.png`,
      fullPage: false,
    });
  });

  // TEST 4: WRONG PASSWORD
  test("TEST 4: Wrong password shows error, stays on login", async ({
    page,
    context,
  }) => {
    // Navigate to login page
    await page.goto("/admin/login");
    await expect(page.locator("h1")).toHaveText("Admin Panel");

    // Enter wrong password and submit
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for error message to appear
    await expect(page.locator("text=Invalid password")).toBeVisible({
      timeout: 5000,
    });

    // Verify still on login page
    expect(page.url()).toContain("/admin/login");

    // Verify no auth cookie was set
    const cookies = await context.cookies();
    const authCookie = cookies.find((c) => c.name === "admin_token");
    expect(authCookie).toBeUndefined();

    // Take screenshot showing error message
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/test4-wrong-password-error.png`,
      fullPage: false,
    });
  });
});
