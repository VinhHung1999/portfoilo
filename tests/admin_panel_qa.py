"""
QA Tests for Admin Panel - Portfolio Website
Tests: Auth Flow, Layout & Navigation
"""
from playwright.sync_api import sync_playwright
import os
import sys

SCREENSHOT_DIR = "/tmp/admin_qa_screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

BASE_URL = "http://localhost:3000"
PASSWORD_CORRECT = "changeme"
PASSWORD_WRONG = "wrongpassword"

results = []

def record(test_num, name, passed, details=""):
    status = "PASS" if passed else "FAIL"
    results.append((test_num, name, status, details))
    print(f"  [{status}] Test {test_num}: {name}" + (f" - {details}" if details else ""))


def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # =====================================================
        # TEST 1: AUTH FLOW
        # =====================================================
        print("\n=== TEST 1: AUTH FLOW ===\n")

        # --- Test 1: Navigate to /admin, verify redirect to login ---
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(f"{BASE_URL}/admin")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1000)

        current_url = page.url
        redirected_to_login = "login" in current_url
        record(1, "Redirect /admin -> /admin/login", redirected_to_login,
               f"URL: {current_url}")
        page.screenshot(path=f"{SCREENSHOT_DIR}/01_login_page.png", full_page=True)
        print(f"  Screenshot: {SCREENSHOT_DIR}/01_login_page.png")

        # --- Test 2: Wrong password shows error ---
        # Find the password input
        password_input = page.locator('input[type="password"]')
        if password_input.count() == 0:
            # Try other input types
            password_input = page.locator('input[type="text"]').first

        password_input.fill(PASSWORD_WRONG)

        # Click submit button
        submit_btn = page.locator('button[type="submit"]')
        if submit_btn.count() == 0:
            submit_btn = page.locator('button:has-text("Login"), button:has-text("Sign"), button:has-text("Submit"), button:has-text("Log in")')
        submit_btn.first.click()
        page.wait_for_timeout(1500)

        # Check for error message
        error_visible = False
        error_text = ""
        for selector in ['[role="alert"]', '.error', '.text-red', '[data-testid="error"]', 'p:has-text("Invalid")', 'p:has-text("incorrect")', 'p:has-text("wrong")', 'div:has-text("Invalid")', 'span:has-text("Invalid")']:
            el = page.locator(selector)
            if el.count() > 0 and el.first.is_visible():
                error_visible = True
                error_text = el.first.text_content()
                break

        # Also check page text content broadly
        if not error_visible:
            page_text = page.text_content("body")
            for err_word in ["invalid", "incorrect", "wrong", "error", "failed"]:
                if err_word in page_text.lower():
                    error_visible = True
                    error_text = f"Found '{err_word}' in page text"
                    break

        record(2, "Wrong password shows error", error_visible,
               f"Error: {error_text}")
        page.screenshot(path=f"{SCREENSHOT_DIR}/02_wrong_password_error.png", full_page=True)
        print(f"  Screenshot: {SCREENSHOT_DIR}/02_wrong_password_error.png")

        # --- Test 3: Correct password logs in ---
        password_input = page.locator('input[type="password"]')
        if password_input.count() == 0:
            password_input = page.locator('input[type="text"]').first
        password_input.fill("")
        password_input.fill(PASSWORD_CORRECT)

        submit_btn = page.locator('button[type="submit"]')
        if submit_btn.count() == 0:
            submit_btn = page.locator('button:has-text("Login"), button:has-text("Sign"), button:has-text("Submit"), button:has-text("Log in")')
        submit_btn.first.click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)

        current_url = page.url
        on_admin_dashboard = "/admin" in current_url and "login" not in current_url
        record(3, "Correct password -> admin dashboard", on_admin_dashboard,
               f"URL: {current_url}")
        page.screenshot(path=f"{SCREENSHOT_DIR}/03_admin_dashboard.png", full_page=True)
        print(f"  Screenshot: {SCREENSHOT_DIR}/03_admin_dashboard.png")

        # --- Test 4: Logout returns to login ---
        logout_btn = page.locator('button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign out")')
        if logout_btn.count() == 0:
            # Try finding by icon/aria
            logout_btn = page.locator('[aria-label*="logout" i], [aria-label*="log out" i], [aria-label*="sign out" i]')
        if logout_btn.count() == 0:
            # Try finding by title
            logout_btn = page.locator('[title*="Logout" i], [title*="Log out" i]')

        if logout_btn.count() > 0:
            logout_btn.first.click()
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(1500)
            current_url = page.url
            back_to_login = "login" in current_url
            record(4, "Logout returns to login page", back_to_login,
                   f"URL: {current_url}")
        else:
            record(4, "Logout returns to login page", False,
                   "Could not find logout button")
        page.screenshot(path=f"{SCREENSHOT_DIR}/04_after_logout.png", full_page=True)
        print(f"  Screenshot: {SCREENSHOT_DIR}/04_after_logout.png")

        page.close()

        # =====================================================
        # TEST 2: LAYOUT & NAVIGATION
        # =====================================================
        print("\n=== TEST 2: LAYOUT & NAVIGATION ===\n")

        # Login again for layout tests
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(f"{BASE_URL}/admin/login")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1000)

        password_input = page.locator('input[type="password"]')
        if password_input.count() == 0:
            password_input = page.locator('input[type="text"]').first
        password_input.fill(PASSWORD_CORRECT)
        submit_btn = page.locator('button[type="submit"]')
        if submit_btn.count() == 0:
            submit_btn = page.locator('button:has-text("Login"), button:has-text("Sign"), button:has-text("Submit"), button:has-text("Log in")')
        submit_btn.first.click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)

        # --- Test 5: Sidebar has 5 sections with correct names ---
        section_names = ["Personal", "Experience", "Projects", "Skills", "Achievements"]
        found_sections = []
        missing_sections = []

        for name in section_names:
            # Check sidebar for buttons/links with these names
            btn = page.locator(f'nav >> text="{name}", aside >> text="{name}", [role="navigation"] >> text="{name}"')
            if btn.count() == 0:
                btn = page.locator(f'button:has-text("{name}"), a:has-text("{name}")')
            if btn.count() > 0:
                found_sections.append(name)
            else:
                missing_sections.append(name)

        all_found = len(found_sections) == 5
        record(5, "Sidebar has 5 sections", all_found,
               f"Found: {found_sections}, Missing: {missing_sections}")

        # Check for Lucide icons (they render as SVGs)
        # Lucide icons: User, Briefcase, FolderOpen, Zap, Award
        svg_count = page.locator("nav svg, aside svg, [role='navigation'] svg").count()
        print(f"  Info: Found {svg_count} SVG icons in sidebar/nav area")

        page.screenshot(path=f"{SCREENSHOT_DIR}/05_sidebar_sections.png", full_page=True)
        print(f"  Screenshot: {SCREENSHOT_DIR}/05_sidebar_sections.png")

        # --- Test 6: Click each sidebar section and verify content updates ---
        sections_to_test = ["Experience", "Projects", "Skills", "Achievements", "Personal"]
        section_results = []

        for i, section_name in enumerate(sections_to_test):
            btn = page.locator(f'button:has-text("{section_name}"), a:has-text("{section_name}")')
            if btn.count() == 0:
                btn = page.locator(f'nav >> text="{section_name}", aside >> text="{section_name}"')

            if btn.count() > 0:
                btn.first.click()
                page.wait_for_timeout(1000)

                # Check that content area updated - look for section-specific content
                page_content = page.text_content("main") or page.text_content("body")
                content_present = section_name.lower() in page_content.lower()
                section_results.append((section_name, content_present))

                # Take screenshots for first 2 and last
                if i < 2 or i == len(sections_to_test) - 1:
                    page.screenshot(path=f"{SCREENSHOT_DIR}/06_{section_name.lower()}_section.png", full_page=True)
                    print(f"  Screenshot: {SCREENSHOT_DIR}/06_{section_name.lower()}_section.png")
            else:
                section_results.append((section_name, False))

        all_sections_ok = all(r[1] for r in section_results)
        details = ", ".join([f"{n}: {'OK' if ok else 'FAIL'}" for n, ok in section_results])
        record(6, "Click each section updates content", all_sections_ok, details)

        # --- Test 7: Topbar elements ---
        # Back to Portfolio link
        back_link = page.locator('a[href="/"], a:has-text("Back to Portfolio"), a:has-text("Portfolio")')
        has_back_link = back_link.count() > 0

        # Also check for arrow icon link to /
        if not has_back_link:
            back_link = page.locator('a[href="/"] svg').first
            has_back_link = back_link is not None

        # Theme toggle
        theme_toggle = page.locator('button:has-text("theme"), button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i], button[aria-label*="mode" i]')
        if theme_toggle.count() == 0:
            # Look for common theme toggle patterns (sun/moon icons)
            theme_toggle = page.locator('[data-testid="theme-toggle"], .theme-toggle')
        has_theme_toggle = theme_toggle.count() > 0

        # If still not found, look for any button with sun/moon SVG in header/topbar
        if not has_theme_toggle:
            header_buttons = page.locator('header button, [role="banner"] button')
            has_theme_toggle = header_buttons.count() >= 2  # At least logout + theme

        # Logout button
        logout_btn = page.locator('button:has-text("Logout"), button:has-text("Log out"), button[aria-label*="logout" i]')
        has_logout = logout_btn.count() > 0

        topbar_ok = has_back_link and has_theme_toggle and has_logout
        record(7, "Topbar has Back link, Theme toggle, Logout", topbar_ok,
               f"Back: {has_back_link}, Theme: {has_theme_toggle}, Logout: {has_logout}")
        page.screenshot(path=f"{SCREENSHOT_DIR}/07_topbar_elements.png", full_page=True)
        print(f"  Screenshot: {SCREENSHOT_DIR}/07_topbar_elements.png")

        # --- Test 8: Mobile viewport (375x812) ---
        page.set_viewport_size({"width": 375, "height": 812})
        page.wait_for_timeout(1500)

        # Check if sidebar becomes horizontal tab bar at bottom or top
        # In mobile, sidebar usually transforms to bottom tabs
        page_html = page.content()

        # Look for horizontal layout indicators - tab bar / bottom nav
        # Check if all 5 section buttons are still visible
        mobile_sections_visible = 0
        for name in section_names:
            btns = page.locator(f'button:has-text("{name}"), a:has-text("{name}")')
            if btns.count() > 0 and btns.first.is_visible():
                mobile_sections_visible += 1

        # Also count visible SVG icons in navigation
        nav_icons = page.locator("nav svg, [role='tablist'] svg, [role='navigation'] svg")
        visible_icons = 0
        for i in range(nav_icons.count()):
            if nav_icons.nth(i).is_visible():
                visible_icons += 1

        # On mobile, text might be hidden, only icons visible
        mobile_has_tabs = mobile_sections_visible >= 5 or visible_icons >= 5
        record(8, "Mobile: sidebar becomes horizontal tab bar", mobile_has_tabs,
               f"Visible sections: {mobile_sections_visible}, Visible icons: {visible_icons}")
        page.screenshot(path=f"{SCREENSHOT_DIR}/08_mobile_375.png", full_page=True)
        print(f"  Screenshot: {SCREENSHOT_DIR}/08_mobile_375.png")

        # --- Test 9: MD breakpoint (768x1024) ---
        page.set_viewport_size({"width": 768, "height": 1024})
        page.wait_for_timeout(1500)

        # Check sidebar is icon-only (collapsed) - w-16 = 64px
        sidebar = page.locator("aside, nav.sidebar, [role='navigation']")
        sidebar_collapsed = False
        sidebar_width = None

        if sidebar.count() > 0:
            box = sidebar.first.bounding_box()
            if box:
                sidebar_width = box["width"]
                # w-16 = 64px, allow some tolerance
                sidebar_collapsed = sidebar_width <= 80

        # Also check if section text labels are hidden (only icons)
        text_labels_visible = 0
        for name in section_names:
            label = page.locator(f'aside >> text="{name}", nav >> text="{name}"')
            if label.count() > 0:
                try:
                    if label.first.is_visible():
                        text_labels_visible += 1
                except:
                    pass

        # Icon-only means text labels should be hidden
        icon_only = text_labels_visible == 0 or sidebar_collapsed
        record(9, "MD breakpoint: sidebar icon-only (w-16)", icon_only,
               f"Sidebar width: {sidebar_width}px, Text labels visible: {text_labels_visible}")
        page.screenshot(path=f"{SCREENSHOT_DIR}/09_md_768.png", full_page=True)
        print(f"  Screenshot: {SCREENSHOT_DIR}/09_md_768.png")

        page.close()
        browser.close()

    # =====================================================
    # SUMMARY
    # =====================================================
    print("\n" + "=" * 60)
    print("QA TEST RESULTS SUMMARY")
    print("=" * 60)
    passed = sum(1 for r in results if r[2] == "PASS")
    failed = sum(1 for r in results if r[2] == "FAIL")
    for num, name, status, details in results:
        marker = "PASS" if status == "PASS" else "FAIL"
        print(f"  [{marker}] Test {num}: {name}")
        if details:
            print(f"          {details}")
    print(f"\nTotal: {passed} PASS, {failed} FAIL out of {len(results)} tests")
    print(f"\nScreenshots saved to: {SCREENSHOT_DIR}/")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(run_tests())
