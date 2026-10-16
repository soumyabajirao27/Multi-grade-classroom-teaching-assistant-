import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SCREENS_DIR = join(process.cwd(), 'docs', 'screens');
const BEFORE_DIR = join(SCREENS_DIR, 'before');
const AFTER_DIR = join(SCREENS_DIR, 'after');

const files = readdirSync(BEFORE_DIR).filter(f => f.endsWith('.png'));

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Multi-Grade Teaching Assistant – Visual Polish Before vs After</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 24px;
      background: #111a17;
      color: #e5ede9;
    }
    h1 {
      margin-top: 0;
      color: #f5a623;
    }
    .grid {
      display: flex;
      flex-direction: column;
      gap: 32px;
      max-width: 1500px;
      margin: 0 auto;
    }
    .pair-card {
      background: #18221f;
      border: 1px solid #273732;
      border-radius: 12px;
      padding: 16px;
    }
    .pair-title {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 12px;
      color: #9db3aa;
    }
    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .col h3 {
      margin: 0 0 8px 0;
      font-size: 0.95rem;
    }
    .col.before h3 { color: #ff8a75; }
    .col.after h3 { color: #59d999; }
    img {
      width: 100%;
      height: auto;
      border: 1px solid #364b44;
      border-radius: 6px;
      background: #fff;
    }
  </style>
</head>
<body>
  <h1>Visual Polish Comparison: Before vs After</h1>
  <p>Comparing identical tabs, viewport sizes, color themes, and languages. All functional layout order, controls, and content are strictly preserved.</p>
  <div class="grid">
    ${files.map(file => `
      <div class="pair-card">
        <div class="pair-title">${file}</div>
        <div class="columns">
          <div class="col before">
            <h3>Before</h3>
            <img src="./before/${file}" alt="Before: ${file}" loading="lazy" />
          </div>
          <div class="col after">
            <h3>After</h3>
            <img src="./after/${file}" alt="After: ${file}" loading="lazy" />
          </div>
        </div>
      </div>
    `).join('\n')}
  </div>
</body>
</html>
`;

writeFileSync(join(SCREENS_DIR, 'compare.html'), html, 'utf-8');
console.log(`Generated docs/screens/compare.html with ${files.length} comparison pairs.`);
