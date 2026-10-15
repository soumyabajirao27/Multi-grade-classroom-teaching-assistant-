#!/usr/bin/env node
/**
 * Capture screenshots of all 4 tabs × 3 resolutions × 2 themes × 3 languages
 * using puppeteer. Run from the project root while `npm run dev` is serving.
 *
 * Usage:  node scripts/screenshots.mjs
 */
import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = 'http://localhost:5173/';
const OUT  = join(import.meta.dirname, '..', 'docs', 'screens');

const VIEWPORTS = [
  { w: 1280, h: 800,  label: '1280x800'  },
  { w: 1024, h: 768,  label: '1024x768'  },
  { w: 800,  h: 1280, label: '800x1280'  },
];

const THEMES = ['dark', 'light'];
const LANGS  = ['en', 'hi', 'mr'];

const TABS = [
  { id: 'plan' },
  { id: 'ws'   },
  { id: 'rot'  },
  { id: 'prog' },
];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: null,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

for (const vp of VIEWPORTS) {
  for (const theme of THEMES) {
    for (const lang of LANGS) {
      // Only capture hi/mr at 1280x800 (matching the requested coverage)
      if (lang !== 'en' && vp.label !== '1280x800') continue;

      // Use emulateMediaFeatures for prefers-color-scheme instead of just data-theme
      const page = await browser.newPage();
      await page.setViewport({ width: vp.w, height: vp.h });
      
      // Set the preferred color scheme at browser level
      await page.emulateMediaFeatures([
        { name: 'prefers-color-scheme', value: theme },
      ]);

      // Set localStorage values before navigation
      // We use page.evaluateOnNewDocument so they're set before the app reads them
      await page.evaluateOnNewDocument((t, l) => {
        localStorage.setItem('theme', JSON.stringify(t));
        localStorage.setItem('lang', JSON.stringify(l));
        // Also set grades to [1,3,5] for consistent screenshots
        localStorage.setItem('grades', JSON.stringify([1,3,5]));
      }, theme, lang);

      // Navigate
      await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1500));

      // Verify theme is set
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
      }, theme);
      await new Promise(r => setTimeout(r, 300));

      for (const tab of TABS) {
        // Click the tab
        const clicked = await page.evaluate((tabId) => {
          const el = document.querySelector(`[data-tab="${tabId}"]`);
          if (el) { el.click(); return true; }
          return false;
        }, tab.id);

        if (!clicked) {
          console.warn(`  ⚠ Could not find tab "${tab.id}" – skipping`);
          continue;
        }

        await new Promise(r => setTimeout(r, 600));

        const fname = `${vp.label}_${theme}_${lang}_tab-${tab.id}.png`;
        await page.screenshot({ path: join(OUT, fname), fullPage: false });
        console.log(`  ✓ ${fname}`);
      }
      
      await page.close();
    }
  }
}

await browser.close();
console.log('\nDone – screenshots in docs/screens/');
