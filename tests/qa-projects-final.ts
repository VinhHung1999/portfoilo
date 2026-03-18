import { chromium } from 'playwright';

const BASE_URL = 'https://portfolio-dev.hungphu.work';

let passed = 0;
let failed = 0;
const results: string[] = [];

function pass(test: string) { passed++; results.push(`  ✅ ${test}`); }
function fail(test: string, detail: string) { failed++; results.push(`  ❌ ${test}: ${detail}`); }
function warn(test: string) { results.push(`  ⚠️  ${test}`); }

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    // =============================================
    // 1. MODAL CLOSE BEHAVIOR
    // =============================================
    results.push('\n--- MODAL CLOSE BEHAVIOR ---');

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(2000);

    // Open modal
    await page.locator('#projects button:has-text("View Project")').first().click();
    await page.waitForTimeout(1500);

    // Test Escape key close
    const modalBefore = await page.locator('div.fixed.inset-0').count();
    results.push(`  Modal present after open: ${modalBefore > 0 ? 'yes' : 'no'}`);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    const modalAfterEsc = await page.locator('div.fixed.inset-0').count();
    if (modalAfterEsc === 0) {
      pass('Escape key closes modal');
    } else {
      fail('Escape key close', 'Modal still present after Escape');
    }

    // Re-open and test backdrop click
    await page.locator('#projects button:has-text("View Project")').first().click();
    await page.waitForTimeout(1500);

    // Click on backdrop (far edge)
    await page.mouse.click(20, 20);
    await page.waitForTimeout(1000);
    const modalAfterBackdrop = await page.locator('div.fixed.inset-0').count();
    if (modalAfterBackdrop === 0) {
      pass('Backdrop click closes modal');
    } else {
      fail('Backdrop click close', 'Modal still present after backdrop click');

      // Try the actual close button
      const closeBtn = page.locator('div.fixed button:has(svg)').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await page.waitForTimeout(500);
        const afterBtn = await page.locator('div.fixed.inset-0').count();
        if (afterBtn === 0) {
          pass('Close button (X) works');
        } else {
          fail('Close button', 'Modal still present');
        }
      }
    }

    // =============================================
    // 2. LINK REACHABILITY (all remaining)
    // =============================================
    results.push('\n--- LINK REACHABILITY ---');

    const allLinks = [
      { url: 'https://love-scrum.hungphu.work', name: 'Love Memories live' },
      { url: 'https://xteink.hungphu.work', name: 'Xteink live' },
      { url: 'https://movie.hungphu.work', name: 'WebPhim live' },
      { url: 'https://portfolio.hungphu.work', name: 'Portfolio live' },
      { url: 'https://github.com/VinhHung1999/love-memories', name: 'Love Memories GitHub' },
      { url: 'https://github.com/VinhHung1999/xteink', name: 'Xteink GitHub' },
      { url: 'https://github.com/VinhHung1999/voice-everywhere', name: 'VoiceEverywhere GitHub' },
      { url: 'https://github.com/VinhHung1999/movie', name: 'WebPhim GitHub' },
      { url: 'https://github.com/VinhHung1999/hungphucode', name: 'HungPhu Code GitHub' },
      { url: 'https://github.com/VinhHung1999/portfoilo', name: 'Portfolio GitHub' },
      { url: 'https://github.com/VinhHung1999/HungChatGPT', name: 'HungChatGPT GitHub' },
    ];

    for (const { url, name } of allLinks) {
      try {
        const resp = await page.request.get(url, { timeout: 10000, maxRedirects: 3 });
        const status = resp.status();
        if (status >= 200 && status < 400) {
          pass(`${name}: ${status} OK — ${url}`);
        } else {
          fail(`${name}: HTTP ${status}`, url);
        }
      } catch (e: any) {
        fail(`${name}: Unreachable`, `${url} — ${e.message?.slice(0, 50)}`);
      }
    }

    // =============================================
    // 3. MOBILE FILTER - verify "mobile" category
    // =============================================
    results.push('\n--- MOBILE CATEGORY FILTER VERIFICATION ---');

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.evaluate(() => {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await page.waitForTimeout(2000);

    // Click mobile filter
    await page.locator('#projects button').filter({ hasText: /^mobile$/i }).click();
    await page.waitForTimeout(1000);

    const mobileCards = await page.locator('#projects div.cursor-pointer').count();
    const mobileText = await page.textContent('#projects') || '';

    if (mobileCards === 0) {
      // Check if any projects SHOULD be in mobile category
      warn(`"mobile" filter shows 0 cards — may be correct if no projects are tagged mobile`);
      // Check if VoiceEverywhere (macOS native) or Love Memories should be mobile
      if (mobileText.includes('VoiceEverywhere') || mobileText.includes('Love Memories')) {
        warn('VoiceEverywhere or Love Memories might belong in "mobile" category');
      } else {
        pass('"mobile" filter correctly shows 0 cards (no mobile-tagged projects)');
      }
    } else {
      pass(`"mobile" filter shows ${mobileCards} cards`);
    }

    // Verify all filter shows correct count
    await page.locator('#projects button').filter({ hasText: /^all$/i }).click();
    await page.waitForTimeout(500);
    const allCount = await page.locator('#projects div.cursor-pointer').count();
    if (allCount === 7) {
      pass(`"all" filter: ${allCount}/7 cards`);
    } else {
      fail('"all" filter', `Expected 7, got ${allCount}`);
    }

    // Verify web + ai counts add up reasonably
    await page.locator('#projects button').filter({ hasText: /^web$/i }).click();
    await page.waitForTimeout(500);
    const webCount = await page.locator('#projects div.cursor-pointer').count();

    await page.locator('#projects button').filter({ hasText: /^ai$/i }).click();
    await page.waitForTimeout(500);
    const aiCount = await page.locator('#projects div.cursor-pointer').count();

    results.push(`  Filter counts: all=${allCount}, web=${webCount}, mobile=${mobileCards}, ai=${aiCount}`);

    // Check filter button styling (active state)
    await page.locator('#projects button').filter({ hasText: /^ai$/i }).click();
    await page.waitForTimeout(500);
    const aiFilterClasses = await page.locator('#projects button').filter({ hasText: /^ai$/i }).getAttribute('class') || '';
    const allFilterClasses = await page.locator('#projects button').filter({ hasText: /^all$/i }).getAttribute('class') || '';
    if (aiFilterClasses !== allFilterClasses) {
      pass('Active filter has distinct styling from inactive');
    } else {
      warn('Filter active/inactive styling may be the same');
    }

  } catch (e: any) {
    fail('Test crash', e.message?.slice(0, 150));
  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log('  QA FINAL CHECKS: Projects (Sprint 18)');
  console.log('========================================');
  results.forEach(r => console.log(r));
  console.log('\n----------------------------------------');
  console.log(`  TOTAL: ${passed + failed} | ✅ ${passed} passed | ❌ ${failed} failed`);
  console.log('----------------------------------------');
  console.log(failed > 0 ? '\n  STATUS: ISSUES FOUND' : '\n  STATUS: ALL PASSED');
}

main();
