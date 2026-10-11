// Generates printable sample worksheets (with answer keys) into ./samples. Run: npm run samples
import { mkdirSync, writeFileSync } from 'node:fs';
import { TOPICS } from '../src/content/curriculum';
import { buildWorksheet } from '../src/engine/worksheet';
import { GRADES, TIERS } from '../src/types';

mkdirSync('samples', { recursive: true });
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const css = 'body{font:16px/1.5 system-ui,sans-serif;max-width:720px;margin:24px auto;padding:0 16px}.sheet{page-break-after:always;margin-bottom:40px}li{margin:14px 0}.ln{border-bottom:1px solid #666;display:inline-block;min-width:180px}.key{border-top:2px dashed #666;padding-top:6px}';

for (const topic of TOPICS) {
  let html = `<!doctype html><meta charset="utf-8"><title>${esc(topic.title.en)} samples</title><style>${css}</style>`;
  for (const g of GRADES) for (const tier of TIERS) {
    const ws = buildWorksheet({ topic, grade: g, tier, seed: 'sample' });
    html += `<section class="sheet"><h2>Grade ${g} · ${esc(ws.title)} (${tier})</h2><p>Name: <span class="ln"></span> Date: <span class="ln" style="min-width:90px"></span></p><p><b>${esc(ws.instructions)}</b></p><ol>${ws.questions.map((q) => `<li>${esc(q.prompt)}</li>`).join('')}</ol><div class="key"><b>Answer key</b>: ${ws.questions.map((q, i) => `${i + 1}) ${esc(q.answer)}`).join(' &nbsp; ')}</div></section>`;
  }
  writeFileSync(`samples/${topic.id}.html`, html);
  console.log(`samples/${topic.id}.html`);
}
