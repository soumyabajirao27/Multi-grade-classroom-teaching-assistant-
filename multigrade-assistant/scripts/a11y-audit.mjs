#!/usr/bin/env node
/**
 * Run axe-core accessibility audit on all 4 tabs using puppeteer.
 * Uses raw axe-core injection instead of @axe-core/puppeteer for compatibility.
 *
 * Usage: node scripts/a11y-audit.mjs
 */
import puppeteer from 'puppeteer';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeCorePath = require.resolve('axe-core');
const axeSource = readFileSync(axeCorePath, 'utf-8');

const BASE = 'http://localhost:5173/';
const TABS = ['plan', 'ws', 'rot', 'prog'];
const THEMES = ['dark', 'light'];

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

let totalViolations = 0;
const allResults = [];

// Pre-set welcome_seen so popup dialog doesn't block audits
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('welcome_seen', JSON.stringify(true));
});

for (const theme of THEMES) {
  for (const tab of TABS) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }]);
    await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluate((t) => {
      document.documentElement.setAttribute('data-theme', t);
    }, theme);

    // Click the tab
    await page.evaluate((tabId) => {
      const el = document.querySelector(`[data-tab="${tabId}"]`);
      if (el) el.click();
    }, tab);
    await new Promise(r => setTimeout(r, 1000));

  // Inject axe-core and run
  await page.evaluate(axeSource);
  const results = await page.evaluate(() => {
    return window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
      },
    });
  });

  const critical = results.violations.filter(v => v.impact === 'critical');
  const serious = results.violations.filter(v => v.impact === 'serious');
  const moderate = results.violations.filter(v => v.impact === 'moderate');
  const minor = results.violations.filter(v => v.impact === 'minor');

    console.log(`\n=== Theme: ${theme} | Tab: ${tab} ===`);
    console.log(`  Critical: ${critical.length}, Serious: ${serious.length}, Moderate: ${moderate.length}, Minor: ${minor.length}`);
    
    for (const v of [...critical, ...serious]) {
      console.log(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
      for (const node of v.nodes.slice(0, 3)) {
        console.log(`    → ${node.target.join(' > ')}`);
        console.log(`      ${node.failureSummary?.split('\n')[0] || ''}`);
      }
    }
    
    totalViolations += results.violations.length;
    allResults.push({ theme, tab, violations: results.violations.length, critical: critical.length, serious: serious.length });
  }
}

console.log(`\n=== Summary ===`);
for (const r of allResults) {
  console.log(`  [${r.theme}] ${r.tab}: ${r.violations} violations (${r.critical} critical, ${r.serious} serious)`);
}
console.log(`  Total: ${totalViolations} violations across ${THEMES.length} themes × ${TABS.length} tabs`);

await browser.close();
process.exit(allResults.some(r => r.critical > 0 || r.serious > 0) ? 1 : 0);

