#!/usr/bin/env python3
"""Visual scrollbar verification - screenshot only"""

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    
    print("📸 Navigating to localhost:3000...")
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.wait_for_timeout(1000)
    
    print("🔍 Scrolling to Experience section...")
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(300)
    
    # Find and scroll into view
    exp_section = page.locator("*").filter(has_text="Experience").first
    if exp_section.is_visible():
        exp_section.evaluate("el => el.scrollIntoView()")
        page.wait_for_timeout(800)
        print("✓ Experience section found and scrolled into view")
    else:
        print("✗ Experience section not visible")
        browser.close()
        exit(1)
    
    # Take full section screenshot
    screenshot_path = "/private/tmp/claude-501/-Users-phuhung-Documents-Studies-AIProjects-portfolio/3e734af9-15ae-4e39-81be-cb4b930bb3d7/scratchpad/scrollbar_visual_check.png"
    page.screenshot(path=screenshot_path, full_page=False)
    print(f"✓ Screenshot saved: {screenshot_path}")
    
    # Visual inspection points
    print("\n📊 VISUAL INSPECTION CHECKLIST:")
    print("-" * 60)
    
    # Get viewport info
    viewport_height = page.evaluate("window.innerHeight")
    print(f"✓ Viewport height: {viewport_height}px")
    
    # Check Experience section bounds
    section_info = page.evaluate("""
        () => {
            const exp = Array.from(document.querySelectorAll('*')).find(el =>
                el.textContent.includes('Experience') && el.textContent.includes('company')
            );
            
            if (!exp) return { error: "Section not found" };
            
            const rect = exp.getBoundingClientRect();
            const scrollContainer = exp.querySelector('[class*="overflow-y"]') || 
                                  Array.from(exp.querySelectorAll('*')).find(el => {
                                      const style = window.getComputedStyle(el);
                                      return style.overflowY === 'auto' || style.overflowY === 'scroll';
                                  });
            
            return {
                section_height: rect.height,
                section_top: rect.top,
                has_scroll_element: !!scrollContainer,
                scroll_container_height: scrollContainer ? scrollContainer.clientHeight : null,
                scroll_content_height: scrollContainer ? scrollContainer.scrollHeight : null,
                scroll_overflow_visible: scrollContainer ? 
                    scrollContainer.scrollHeight > scrollContainer.clientHeight : false
            };
        }
    """)
    
    print(f"✓ Section height: {section_info.get('section_height', 'N/A')}px")
    print(f"✓ Scroll container found: {section_info.get('has_scroll_element', False)}")
    print(f"✓ Container height: {section_info.get('scroll_container_height', 'N/A')}px")
    print(f"✓ Content height: {section_info.get('scroll_content_height', 'N/A')}px")
    print(f"✓ Content overflows: {section_info.get('scroll_overflow_visible', False)}")
    
    print("\n" + "=" * 60)
    print("VISUAL VERIFICATION REQUIRED:")
    print("=" * 60)
    print("\n1️⃣  SCROLLBAR VISIBILITY:")
    print("   Look at the Experience section screenshot")
    print("   Is there a PURPLE/VIOLET scrollbar on the right?")
    print("   Answer: YES / NO")
    
    print("\n2️⃣  SCROLLBAR COLOR:")
    print("   If scrollbar visible, is it VIOLET (#7B337D)?")
    print("   Answer: YES / NO / N/A")
    
    print("\n3️⃣  SCROLL FUNCTIONALITY:")
    print("   Can you scroll through all experience items?")
    print("   Answer: YES / NO / N/A")
    
    print("\n" + "=" * 60)
    print(f"\nScreenshot saved for visual inspection")
    print("=" * 60)
    
    browser.close()
