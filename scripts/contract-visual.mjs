#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.CONTRACT_BASE_URL ?? "http://127.0.0.1:8080";
const outDir = process.env.CONTRACT_SHOT_DIR ?? path.join(root, "screenshots", "contract");

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844 },
];
const THEMES = ["light", "dark"];
const PAGES = [
  { id: "player", nav: "回合" },
  { id: "sources", nav: "来源" },
  { id: "dock", nav: "壳" },
];

async function waitForServer(url, ms = 60000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status > 0) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`server not up: ${url}`);
}

async function setTheme(page, theme) {
  await page.evaluate((next) => {
    document.documentElement.dataset.theme = next;
  }, theme);
}

const violations = [];
mkdirSync(outDir, { recursive: true });
await waitForServer(base);

const browser = await chromium.launch({ args: ["--no-sandbox"] });
try {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForSelector(".spec-app");
    for (const theme of THEMES) {
      await setTheme(page, theme);
      for (const target of PAGES) {
        const nav =
          vp.width <= 900
            ? page.locator(".mobile-tabs button", { hasText: target.nav })
            : page.locator(".spec-nav-list button", { hasText: target.nav });
        await nav.click({ force: true });
        await page.waitForTimeout(400);
        const shot = path.join(outDir, `${target.id}-${vp.name}-${theme}.png`);
        await page.screenshot({ path: shot, fullPage: true });
        const axe = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
        const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
        if (serious.length) {
          violations.push({
            page: target.id,
            vp: vp.name,
            theme,
            serious: serious.map((v) => ({
              id: v.id,
              nodes: v.nodes.map((n) => n.target),
            })),
          });
        }
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const verdict = { ok: violations.length === 0, outDir, violations };
writeFileSync(path.join(outDir, "verdict.json"), JSON.stringify(verdict, null, 2));
console.log(JSON.stringify(verdict, null, 2));
if (!verdict.ok) process.exit(1);
