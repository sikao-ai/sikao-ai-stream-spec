import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = "/workspace/screenshots/youtry.png";

await mkdir("/workspace/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.locator(".spec-nav-list button", { hasText: "四密" }).click();
await page.waitForFunction(() => document.querySelector(".spec-page h1")?.textContent?.includes("密度区分场景"));
await page.getByRole("tab", { name: "讲题流" }).click();
await page.waitForSelector(".sk-youtry");
await page.waitForFunction(() => {
  const el = document.querySelector(".sk-youtry");
  return Boolean(el && el.textContent?.includes("到你了") && el.textContent?.includes("下一空自己选"));
});
const card = page.locator(".sk-youtry");
await card.screenshot({ path: OUT });
const text = await card.innerText();
console.log(JSON.stringify({ out: OUT, text: text.replace(/\s+/g, " ").trim() }, null, 2));
await browser.close();
