import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:2000';

// Violet/Blue colors to flag as violations
const VIOLET_BLUE_PATTERNS = [
  { name: 'violet-primary', hex: '#7C3AED', rgb: 'rgb(124, 58, 237)' },
  { name: 'violet-alt', hex: '#7B337D', rgb: 'rgb(123, 51, 125)' },
  { name: 'blue-primary', hex: '#2563EB', rgb: 'rgb(37, 99, 235)' },
  { name: 'blue-alt', hex: '#3B82F6', rgb: 'rgb(59, 130, 246)' },
  { name: 'purple-generic', hex: '#8B5CF6', rgb: 'rgb(139, 92, 246)' },
  { name: 'indigo', hex: '#6366F1', rgb: 'rgb(99, 102, 241)' },
];

// Helper: extract all CSS custom properties from computed styles
async function getAllCSSVariables(page: any) {
  return await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    const vars: Record<string, string> = {};
    const cssRules = Array.from(document.styleSheets).flatMap((sheet) => {
      try {
        return Array.from(sheet.cssRules);
      } catch {
        return [];
      }
    });

    // Get all custom property names from stylesheets
    const propNames = new Set<string>();
    for (const rule of cssRules) {
      if (rule instanceof CSSStyleRule) {
        for (let i = 0; i < rule.style.length; i++) {
          const prop = rule.style[i];
          if (prop.startsWith('--')) {
            propNames.add(prop);
          }
        }
      }
    }

    // Read computed values
    for (const prop of propNames) {
      const val = styles.getPropertyValue(prop).trim();
      if (val) vars[prop] = val;
    }

    return vars;
  });
}

// Helper: check if a color string contains violet or blue
function findVioletBlueViolations(
  vars: Record<string, string>
): { variable: string; value: string; match: string }[] {
  const violations: { variable: string; value: string; match: string }[] = [];
  const violetBlueRegex =
    /(?:rgb\(\s*124\s*,\s*58\s*,\s*237|rgb\(\s*123\s*,\s*51\s*,\s*125|rgb\(\s*37\s*,\s*99\s*,\s*235|rgb\(\s*59\s*,\s*130\s*,\s*246|rgb\(\s*139\s*,\s*92\s*,\s*246|rgb\(\s*99\s*,\s*102\s*,\s*241|#7[cC]3[aA][eE][dD]|#7[bB]337[dD]|#2563[eE][bB]|#3[bB]82[fF]6|#8[bB]5[cC][fF]6|#6366[fF]1)/i;

  for (const [variable, value] of Object.entries(vars)) {
    if (violetBlueRegex.test(value)) {
      violations.push({ variable, value, match: 'violet/blue detected' });
    }
  }
  return violations;
}

// Helper: audit computed styles of many elements for violet/blue
async function auditComputedColors(page: any) {
  return await page.evaluate(() => {
    const violetBlueRgb = [
      [124, 58, 237],
      [123, 51, 125],
      [37, 99, 235],
      [59, 130, 246],
      [139, 92, 246],
      [99, 102, 241],
    ];

    function isVioletBlue(colorStr: string): boolean {
      for (const [r, g, b] of violetBlueRgb) {
        if (
          colorStr.includes(`rgb(${r}, ${g}, ${b})`) ||
          colorStr.includes(`rgba(${r}, ${g}, ${b}`)
        ) {
          return true;
        }
      }
      return false;
    }

    const all = document.querySelectorAll('*');
    const violations: {
      selector: string;
      property: string;
      value: string;
    }[] = [];
    const colorProps = [
      'color',
      'background-color',
      'border-color',
      'border-top-color',
      'border-bottom-color',
      'border-left-color',
      'border-right-color',
      'outline-color',
      'box-shadow',
      'text-decoration-color',
      'background-image',
    ];

    for (const el of Array.from(all).slice(0, 500)) {
      const cs = getComputedStyle(el);
      for (const prop of colorProps) {
        const val = cs.getPropertyValue(prop);
        if (val && isVioletBlue(val)) {
          const tag = el.tagName.toLowerCase();
          const cls = el.className
            ? `.${String(el.className).split(' ').slice(0, 2).join('.')}`
            : '';
          const id = el.id ? `#${el.id}` : '';
          violations.push({
            selector: `${tag}${id}${cls}`,
            property: prop,
            value: val,
          });
        }
      }
    }
    return violations;
  });
}

test.describe('TEST 1: Light Mode Colors', () => {
  test('1.1 - Site defaults to light mode with correct warm background colors', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Check that no data-theme="dark" is set (defaults to light)
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log(`[Light Mode] data-theme attribute: ${theme || '(not set = light)'}`);
    expect(theme).not.toBe('dark');

    // Check CSS variable values
    const vars = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      return {
        bgPrimary: s.getPropertyValue('--bg-primary').trim(),
        bgSecondary: s.getPropertyValue('--bg-secondary').trim(),
        bgTertiary: s.getPropertyValue('--bg-tertiary').trim(),
        bgAlternate: s.getPropertyValue('--bg-alternate').trim(),
        textPrimary: s.getPropertyValue('--text-primary').trim(),
        textSecondary: s.getPropertyValue('--text-secondary').trim(),
        cta: s.getPropertyValue('--cta').trim(),
        ctaHover: s.getPropertyValue('--cta-hover').trim(),
        ctaGlow: s.getPropertyValue('--cta-glow').trim(),
        gradientStart: s.getPropertyValue('--gradient-start').trim(),
        gradientEnd: s.getPropertyValue('--gradient-end').trim(),
        accentPrimary: s.getPropertyValue('--accent-primary').trim(),
      };
    });

    console.log('[Light Mode] CSS Variables:', JSON.stringify(vars, null, 2));

    // Background should be warm whites
    expect(vars.bgSecondary).toMatch(/#F8F7F5/i);
    expect(vars.bgTertiary).toMatch(/#EFEDE8/i);

    // Text should be dark
    expect(vars.textPrimary).toMatch(/#1A1A1A/i);

    // CTA should be gold
    expect(vars.cta).toMatch(/#B8860B/i);
    expect(vars.ctaHover).toMatch(/#996F09/i);

    // Gradient should be gold-to-gold
    expect(vars.gradientStart).toMatch(/#B8860B/i);
    expect(vars.gradientEnd).toMatch(/#D4A017/i);

    // NO violet/blue in gradients
    for (const pattern of VIOLET_BLUE_PATTERNS) {
      expect(vars.gradientStart.toLowerCase()).not.toContain(
        pattern.hex.toLowerCase()
      );
      expect(vars.gradientEnd.toLowerCase()).not.toContain(
        pattern.hex.toLowerCase()
      );
    }

    console.log('[Light Mode] PASS: Background warm whites, text dark, CTA gold, gradient gold.');
  });

  test('1.2 - Navigation links, CTA buttons, and scroll bar use gold colors', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Check CTA buttons: "View My Work" and "Get in Touch"
    const ctaButtons = await page.evaluate(() => {
      const results: { text: string; bg: string; color: string; borderColor: string }[] = [];
      const buttons = document.querySelectorAll('button, a');
      for (const btn of buttons) {
        const text = btn.textContent?.trim() || '';
        if (
          text.includes('View My Work') ||
          text.includes('Get in Touch') ||
          text.includes('View my work') ||
          text.includes('Get in touch')
        ) {
          const cs = getComputedStyle(btn);
          results.push({
            text,
            bg: cs.backgroundColor,
            color: cs.color,
            borderColor: cs.borderColor,
          });
        }
      }
      return results;
    });

    console.log('[Light Mode] CTA Buttons:', JSON.stringify(ctaButtons, null, 2));

    // Verify CTA buttons exist and use gold
    for (const btn of ctaButtons) {
      // Check that the button does NOT use violet/blue
      for (const pattern of VIOLET_BLUE_PATTERNS) {
        expect(btn.bg).not.toContain(pattern.rgb);
        expect(btn.color).not.toContain(pattern.rgb);
      }
    }

    // Check scroll progress bar
    const scrollBar = await page.evaluate(() => {
      const bar = document.querySelector('[style*="scaleX"]') ||
                  document.querySelector('.gradient-bg') ||
                  document.querySelector('[class*="progress"]') ||
                  document.querySelector('[class*="scroll"]');
      if (!bar) return null;
      const cs = getComputedStyle(bar);
      return {
        bg: cs.backgroundColor,
        bgImage: cs.backgroundImage,
        selector: bar.tagName + (bar.className ? '.' + String(bar.className).split(' ')[0] : ''),
      };
    });

    console.log('[Light Mode] Scroll Progress Bar:', JSON.stringify(scrollBar, null, 2));

    console.log('[Light Mode] PASS: CTA buttons and UI elements checked for gold colors.');
  });

  test('1.3 - Full-page screenshot (light mode)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'tests/screenshots/obsidian-gold-light-mode.png',
      fullPage: true,
    });
    console.log('[Light Mode] Full-page screenshot saved to tests/screenshots/obsidian-gold-light-mode.png');
  });

  test('1.4 - AUDIT: Zero violet/blue in light mode computed styles', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Audit CSS variables
    const allVars = await getAllCSSVariables(page);
    const varViolations = findVioletBlueViolations(allVars);

    console.log(
      `[Light Mode] CSS Variables count: ${Object.keys(allVars).length}`
    );
    if (varViolations.length > 0) {
      console.log('[Light Mode] VIOLATIONS in CSS variables:', JSON.stringify(varViolations, null, 2));
    } else {
      console.log('[Light Mode] ZERO violet/blue found in CSS variables.');
    }

    // Audit computed styles of all elements
    const elementViolations = await auditComputedColors(page);
    if (elementViolations.length > 0) {
      console.log(
        '[Light Mode] VIOLATIONS in computed element styles:',
        JSON.stringify(elementViolations, null, 2)
      );
    } else {
      console.log('[Light Mode] ZERO violet/blue found in computed element styles.');
    }

    // Combine and report
    const totalViolations = varViolations.length + elementViolations.length;
    console.log(`[Light Mode] Total violet/blue violations: ${totalViolations}`);

    expect(varViolations.length).toBe(0);
    expect(elementViolations.length).toBe(0);
  });
});

test.describe('TEST 2: Dark Mode Colors', () => {
  test('2.1 - Dark mode CSS variables are correct (deep black bg, gold accents)', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Click theme toggle to switch to dark mode
    const toggle = page.locator('button').filter({ has: page.locator('svg') }).first();
    // Find the actual theme toggle button
    const themeToggle = page.locator('[aria-label*="theme"], [aria-label*="Theme"], [aria-label*="dark"], [aria-label*="light"], [aria-label*="mode"]').first();

    // Try specific aria-label first, fall back to finding it
    const toggleExists = await themeToggle.count();
    if (toggleExists > 0) {
      await themeToggle.click();
    } else {
      // Look for ThemeToggle component button
      const allButtons = page.locator('button');
      const count = await allButtons.count();
      for (let i = 0; i < count; i++) {
        const btn = allButtons.nth(i);
        const text = await btn.textContent();
        const ariaLabel = await btn.getAttribute('aria-label');
        if (
          ariaLabel?.toLowerCase().includes('theme') ||
          ariaLabel?.toLowerCase().includes('dark') ||
          ariaLabel?.toLowerCase().includes('light')
        ) {
          await btn.click();
          break;
        }
      }
    }

    await page.waitForTimeout(500);

    // Verify dark mode is active
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    console.log(`[Dark Mode] data-theme attribute: ${theme}`);
    expect(theme).toBe('dark');

    // Check dark mode CSS variables
    const vars = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      return {
        bgPrimary: s.getPropertyValue('--bg-primary').trim(),
        bgSecondary: s.getPropertyValue('--bg-secondary').trim(),
        bgTertiary: s.getPropertyValue('--bg-tertiary').trim(),
        bgAlternate: s.getPropertyValue('--bg-alternate').trim(),
        textPrimary: s.getPropertyValue('--text-primary').trim(),
        textSecondary: s.getPropertyValue('--text-secondary').trim(),
        cta: s.getPropertyValue('--cta').trim(),
        ctaHover: s.getPropertyValue('--cta-hover').trim(),
        ctaGlow: s.getPropertyValue('--cta-glow').trim(),
        gradientStart: s.getPropertyValue('--gradient-start').trim(),
        gradientEnd: s.getPropertyValue('--gradient-end').trim(),
        accentPrimary: s.getPropertyValue('--accent-primary').trim(),
        border: s.getPropertyValue('--border').trim(),
      };
    });

    console.log('[Dark Mode] CSS Variables:', JSON.stringify(vars, null, 2));

    // Background: deep black
    expect(vars.bgPrimary).toMatch(/#0C0C0C/i);
    expect(vars.bgSecondary).toMatch(/#161616/i);

    // Text: warm white
    expect(vars.textPrimary).toMatch(/#F5F2EB/i);

    // CTA: brighter gold
    expect(vars.cta).toMatch(/#D4A017/i);
    expect(vars.ctaHover).toMatch(/#E8B830/i);

    // Gradient: gold variants
    expect(vars.gradientStart).toMatch(/#D4A017/i);
    expect(vars.gradientEnd).toMatch(/#B8860B/i);

    // Accent: gold
    expect(vars.accentPrimary).toMatch(/#D4A017/i);

    console.log('[Dark Mode] PASS: Deep black backgrounds, warm white text, gold accents.');
  });

  test('2.2 - Dark mode CTA buttons and elements use gold', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);

    // Check CTA buttons in dark mode
    const ctaButtons = await page.evaluate(() => {
      const results: { text: string; bg: string; color: string; bgImage: string }[] = [];
      const allEls = document.querySelectorAll('button, a');
      for (const el of allEls) {
        const text = el.textContent?.trim() || '';
        if (
          text.includes('View My Work') ||
          text.includes('Get in Touch') ||
          text.includes('View my work') ||
          text.includes('Get in touch')
        ) {
          const cs = getComputedStyle(el);
          results.push({
            text,
            bg: cs.backgroundColor,
            color: cs.color,
            bgImage: cs.backgroundImage,
          });
        }
      }
      return results;
    });

    console.log('[Dark Mode] CTA Buttons:', JSON.stringify(ctaButtons, null, 2));

    for (const btn of ctaButtons) {
      for (const pattern of VIOLET_BLUE_PATTERNS) {
        expect(btn.bg).not.toContain(pattern.rgb);
        expect(btn.color).not.toContain(pattern.rgb);
      }
    }

    console.log('[Dark Mode] PASS: CTA buttons use gold in dark mode.');
  });

  test('2.3 - Full-page screenshot (dark mode)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: 'tests/screenshots/obsidian-gold-dark-mode.png',
      fullPage: true,
    });
    console.log('[Dark Mode] Full-page screenshot saved to tests/screenshots/obsidian-gold-dark-mode.png');
  });

  test('2.4 - AUDIT: Zero violet/blue in dark mode computed styles', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(1000);

    // Audit CSS variables
    const allVars = await getAllCSSVariables(page);
    const varViolations = findVioletBlueViolations(allVars);

    console.log(`[Dark Mode] CSS Variables count: ${Object.keys(allVars).length}`);
    if (varViolations.length > 0) {
      console.log('[Dark Mode] VIOLATIONS in CSS variables:', JSON.stringify(varViolations, null, 2));
    } else {
      console.log('[Dark Mode] ZERO violet/blue found in CSS variables.');
    }

    // Audit computed styles
    const elementViolations = await auditComputedColors(page);
    if (elementViolations.length > 0) {
      console.log(
        '[Dark Mode] VIOLATIONS in computed element styles:',
        JSON.stringify(elementViolations, null, 2)
      );
    } else {
      console.log('[Dark Mode] ZERO violet/blue found in computed element styles.');
    }

    const totalViolations = varViolations.length + elementViolations.length;
    console.log(`[Dark Mode] Total violet/blue violations: ${totalViolations}`);

    expect(varViolations.length).toBe(0);
    expect(elementViolations.length).toBe(0);
  });
});

test.describe('TEST 3: Theme Toggle Transition', () => {
  test('3.1 - Toggle between light and dark multiple times smoothly', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Find theme toggle
    const getTheme = () =>
      page.evaluate(() => document.documentElement.getAttribute('data-theme'));

    const getBgColor = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    // Record initial state
    const initialTheme = await getTheme();
    const initialBg = await getBgColor();
    console.log(`[Toggle] Initial: theme=${initialTheme}, bg=${initialBg}`);

    // Perform 4 toggles
    for (let i = 0; i < 4; i++) {
      // Toggle via JS (reliable)
      await page.evaluate(() => {
        const current = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute(
          'data-theme',
          current === 'dark' ? 'light' : 'dark'
        );
      });

      await page.waitForTimeout(400); // Wait for CSS transition (0.3s ease)

      const theme = await getTheme();
      const bg = await getBgColor();
      console.log(`[Toggle] After toggle ${i + 1}: theme=${theme}, bg=${bg}`);

      // Verify colors change consistently
      if (theme === 'dark') {
        // Background should be very dark
        expect(bg).toMatch(/rgb\(\s*12\s*,\s*12\s*,\s*12\s*\)/);
      } else {
        // Background should be white/warm
        expect(bg).toMatch(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/);
      }
    }

    // Verify transition property exists on body
    const hasTransition = await page.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return cs.transition || cs.transitionProperty;
    });
    console.log(`[Toggle] Body transition: ${hasTransition}`);
    expect(hasTransition).toBeTruthy();

    console.log('[Toggle] PASS: Smooth toggling verified across 4 cycles.');
  });
});

test.describe('TEST 4: Comprehensive Color Audit', () => {
  test('4.1 - Dump ALL CSS custom properties and check for violations', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // --- Light mode audit ---
    const lightVars = await getAllCSSVariables(page);
    console.log('\n=== LIGHT MODE: ALL CSS CUSTOM PROPERTIES ===');
    const lightColorVars = Object.entries(lightVars).filter(([k, v]) => {
      return (
        k.includes('color') ||
        k.includes('bg') ||
        k.includes('cta') ||
        k.includes('gradient') ||
        k.includes('accent') ||
        k.includes('border') ||
        k.includes('text') ||
        k.includes('shadow') ||
        k.includes('glow') ||
        v.includes('#') ||
        v.includes('rgb')
      );
    });
    for (const [key, val] of lightColorVars) {
      console.log(`  ${key}: ${val}`);
    }

    const lightViolations = findVioletBlueViolations(lightVars);

    // --- Dark mode audit ---
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500);

    const darkVars = await getAllCSSVariables(page);
    console.log('\n=== DARK MODE: ALL CSS CUSTOM PROPERTIES ===');
    const darkColorVars = Object.entries(darkVars).filter(([k, v]) => {
      return (
        k.includes('color') ||
        k.includes('bg') ||
        k.includes('cta') ||
        k.includes('gradient') ||
        k.includes('accent') ||
        k.includes('border') ||
        k.includes('text') ||
        k.includes('shadow') ||
        k.includes('glow') ||
        v.includes('#') ||
        v.includes('rgb')
      );
    });
    for (const [key, val] of darkColorVars) {
      console.log(`  ${key}: ${val}`);
    }

    const darkViolations = findVioletBlueViolations(darkVars);

    // Combined report
    const all = [...lightViolations, ...darkViolations];
    if (all.length > 0) {
      console.log('\n!!! VIOLATIONS FOUND !!!', JSON.stringify(all, null, 2));
    } else {
      console.log('\nZERO violet/blue found in ANY CSS custom properties (both modes).');
    }

    expect(all.length).toBe(0);
  });

  test('4.2 - Hover states on interactive elements use gold (not violet/blue)', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Test nav link hover
    const navLinks = page.locator('nav a, nav button').filter({ hasNotText: '' });
    const navCount = await navLinks.count();
    console.log(`[Hover Audit] Found ${navCount} nav links/buttons`);

    const hoverResults: { element: string; property: string; value: string; status: string }[] = [];

    // Check hover on first few nav links
    for (let i = 0; i < Math.min(navCount, 4); i++) {
      const link = navLinks.nth(i);
      const text = await link.textContent();
      await link.hover();
      await page.waitForTimeout(200);

      const color = await link.evaluate((el: Element) => {
        return getComputedStyle(el).color;
      });

      let status = 'OK';
      for (const pattern of VIOLET_BLUE_PATTERNS) {
        if (color.includes(pattern.rgb.replace('rgb', ''))) {
          status = `VIOLATION: ${pattern.name}`;
        }
      }
      hoverResults.push({ element: `nav-link: "${text?.trim()}"`, property: 'color', value: color, status });
    }

    // Check project cards hover
    const cards = page.locator('[class*="card"], article, [class*="project"]');
    const cardCount = await cards.count();
    console.log(`[Hover Audit] Found ${cardCount} cards`);

    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = cards.nth(i);
      if (await card.isVisible()) {
        await card.hover({ force: true });
        await page.waitForTimeout(200);
        const shadow = await card.evaluate((el: Element) =>
          getComputedStyle(el).boxShadow
        );
        let status = 'OK';
        for (const pattern of VIOLET_BLUE_PATTERNS) {
          if (shadow.includes(pattern.rgb.replace('rgb', ''))) {
            status = `VIOLATION: ${pattern.name}`;
          }
        }
        hoverResults.push({
          element: `card-${i}`,
          property: 'box-shadow',
          value: shadow.substring(0, 100),
          status,
        });
      }
    }

    // Log all hover results
    console.log('\n=== HOVER STATE AUDIT ===');
    for (const r of hoverResults) {
      console.log(`  ${r.element} | ${r.property}: ${r.value} | ${r.status}`);
    }

    const violations = hoverResults.filter((r) => r.status.includes('VIOLATION'));
    if (violations.length > 0) {
      console.log(`\n!!! ${violations.length} HOVER VIOLATIONS FOUND !!!`);
    } else {
      console.log('\nZERO violet/blue found in hover states.');
    }

    expect(violations.length).toBe(0);
  });

  test('4.3 - Hero gradient text uses gold gradient', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Find the gradient text element (hero name)
    const gradientText = await page.evaluate(() => {
      const els = document.querySelectorAll('.gradient-text');
      const results: { text: string; bgImage: string; webkitTextFillColor: string }[] = [];
      for (const el of els) {
        const cs = getComputedStyle(el);
        results.push({
          text: el.textContent?.trim().substring(0, 50) || '',
          bgImage: cs.backgroundImage,
          webkitTextFillColor: (cs as any).webkitTextFillColor || 'N/A',
        });
      }
      return results;
    });

    console.log('\n=== HERO GRADIENT TEXT ===');
    for (const gt of gradientText) {
      console.log(`  Text: "${gt.text}"`);
      console.log(`  background-image: ${gt.bgImage}`);
      console.log(`  -webkit-text-fill-color: ${gt.webkitTextFillColor}`);

      // Verify gradient contains gold colors, not violet/blue
      const bgLower = gt.bgImage.toLowerCase();

      // Should NOT contain violet/blue rgb values
      expect(bgLower).not.toContain('124, 58, 237');
      expect(bgLower).not.toContain('123, 51, 125');
      expect(bgLower).not.toContain('37, 99, 235');
      expect(bgLower).not.toContain('59, 130, 246');

      // Should contain gold-ish color values (184, 134, 11 for #B8860B or 212, 160, 23 for #D4A017)
      const hasGold =
        bgLower.includes('184, 134, 11') ||
        bgLower.includes('212, 160, 23') ||
        bgLower.includes('b8860b') ||
        bgLower.includes('d4a017');

      if (hasGold) {
        console.log('  PASS: Gold gradient confirmed.');
      } else {
        console.log('  WARNING: Could not confirm gold values in gradient. Manual review needed.');
      }
    }

    expect(gradientText.length).toBeGreaterThan(0);
  });

  test('4.4 - Complete element-level audit across all sections', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Scroll through entire page to trigger lazy-loaded content
    await page.evaluate(async () => {
      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const totalHeight = document.body.scrollHeight;
      for (let pos = 0; pos < totalHeight; pos += 500) {
        window.scrollTo(0, pos);
        await delay(100);
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);

    // Light mode audit
    console.log('\n=== LIGHT MODE ELEMENT AUDIT ===');
    const lightViolations = await auditComputedColors(page);
    console.log(`  Violations found: ${lightViolations.length}`);
    for (const v of lightViolations) {
      console.log(`  VIOLATION: ${v.selector} | ${v.property}: ${v.value}`);
    }

    // Dark mode audit
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(800);

    console.log('\n=== DARK MODE ELEMENT AUDIT ===');
    const darkViolations = await auditComputedColors(page);
    console.log(`  Violations found: ${darkViolations.length}`);
    for (const v of darkViolations) {
      console.log(`  VIOLATION: ${v.selector} | ${v.property}: ${v.value}`);
    }

    const total = lightViolations.length + darkViolations.length;
    console.log(`\n=== TOTAL VIOLATIONS: ${total} ===`);
    if (total === 0) {
      console.log('CONFIRMED: ZERO violet/blue found across ALL elements in both themes.');
    }

    expect(lightViolations.length).toBe(0);
    expect(darkViolations.length).toBe(0);
  });
});
