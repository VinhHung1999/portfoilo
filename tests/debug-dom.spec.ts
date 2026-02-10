import { test } from "@playwright/test";

test("Debug DOM structure", async ({ page }) => {
  await page.goto("http://localhost:2000", { waitUntil: "networkidle" });

  // Wait for page to fully load
  await page.waitForTimeout(3000);

  // Check if skills section exists
  const skillsSection = await page.locator("#skills").count();
  console.log(`#skills section count: ${skillsSection}`);

  // Get the inner HTML of the skills section
  if (skillsSection > 0) {
    const html = await page.locator("#skills").innerHTML();
    console.log(`Skills section HTML (first 3000 chars):\n${html.substring(0, 3000)}`);
  } else {
    // List all section IDs
    const sections = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("section")).map(s => ({
        id: s.id,
        class: s.className.substring(0, 100),
      }));
    });
    console.log("All sections:", JSON.stringify(sections, null, 2));
  }

  // Check experience section
  const expSection = await page.locator("#experience").count();
  console.log(`#experience section count: ${expSection}`);

  if (expSection > 0) {
    const expHtml = await page.locator("#experience").innerHTML();
    console.log(`Experience section HTML (first 3000 chars):\n${expHtml.substring(0, 3000)}`);
  }

  // Full page URL and title
  console.log(`URL: ${page.url()}`);
  console.log(`Title: ${await page.title()}`);

  // Check for any errors
  const errors: string[] = [];
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.waitForTimeout(1000);
  if (errors.length) console.log(`Console errors: ${errors.join("\n")}`);
});
