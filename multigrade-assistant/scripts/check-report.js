import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const reportPath = path.resolve(process.cwd(), 'docs/REPORT.md');
if (!fs.existsSync(reportPath)) {
  console.error('Error: docs/REPORT.md not found at', reportPath);
  process.exit(1);
}

const content = fs.readFileSync(reportPath, 'utf8');

const forbiddenChecks = [
  { pattern: /86,000/, name: 'Fabricated UDISE school count "86,000"' },
  { pattern: /15,000/, name: 'Fabricated Maharashtra school count "15,000"' },
  { pattern: /\bUNESCO\b/i, name: 'Unverified citation "UNESCO"' },
  { pattern: /\bNalanda\b/i, name: 'Unverified term "Nalanda"' },
  { pattern: /mean\s+sus\s+score[:\s*|]*\s*\d{2}\.\d/i, name: 'Fabricated mean SUS score' },
  { pattern: /overall\s+mean\s+sus\s+score/i, name: 'Fabricated overall mean SUS score' },
];

let failed = false;
for (const check of forbiddenChecks) {
  if (check.pattern.test(content)) {
    console.error(`FAIL: docs/REPORT.md contains forbidden string/pattern: ${check.name}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('PASS: docs/REPORT.md verified clean: contains no fabricated statistics or SUS scores.');
process.exit(0);
