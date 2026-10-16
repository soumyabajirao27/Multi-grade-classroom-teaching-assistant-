import fs from 'node:fs';
import path from 'node:path';
import { CURRICULUM_SOURCES } from '../src/content/curriculumSources.ts';

const docPath = path.resolve(process.cwd(), 'docs/CURRICULUM_MAPPING.md');

console.log(`Checking ${CURRICULUM_SOURCES.length} curriculum source entries...`);

let hasError = false;

// Validation rules:
// If status is 'verified', it MUST have:
// 1. sourceUrl
// 2. chapterNo
// 3. editionYear
for (const entry of CURRICULUM_SOURCES) {
  if (entry.status === 'verified') {
    if (!entry.sourceUrl || !entry.chapterNo || !entry.editionYear) {
      console.error(
        `FAIL: Entry for topic "${entry.topicId}" Grade ${entry.grade} (${entry.board}) is marked 'verified' but lacks mandatory fields: ` +
        `sourceUrl: ${entry.sourceUrl}, chapterNo: ${entry.chapterNo}, editionYear: ${entry.editionYear}`
      );
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

// Generate the updated Markdown table for docs/CURRICULUM_MAPPING.md
const tableHeader = `| Topic ID | Subject | Grade | Board | Textbook | Status | Chapter / Notes | Edition | Source |
|---|---|:---:|---|---|:---:|---|:---:|---|
`;

const rows = CURRICULUM_SOURCES.map((s) => {
  const chapterOrNotes = s.chapterNo !== undefined && s.chapterTitle
    ? `Ch ${s.chapterNo}: ${s.chapterTitle}`
    : (s.notes || 'Pending Review');
  const edition = s.editionYear ? String(s.editionYear) : '—';
  const source = s.status === 'verified' && s.sourceUrl ? `[Link](${s.sourceUrl})` : '— (ebalbharati)';
  return `| \`${s.topicId}\` | ${s.subject.toUpperCase()} | ${s.grade} | ${s.board} | ${s.textbook} | \`${s.status}\` | ${chapterOrNotes} | ${edition} | ${source} |`;
}).join('\n');

// Read existing docs/CURRICULUM_MAPPING.md to preserve pedagogical notes section
let docContent = fs.readFileSync(docPath, 'utf8');

const markerStart = '## Maharashtra State Board (Balbharati) & NCERT Mapping Table';
const markerEnd = '---';

const splitStart = docContent.indexOf(markerStart);
const splitEnd = docContent.indexOf('## Remaining `sameAcrossTiers` Items', splitStart);

if (splitStart !== -1 && splitEnd !== -1) {
  const before = docContent.slice(0, splitStart + markerStart.length);
  const after = docContent.slice(splitEnd);
  
  const updatedDoc = `${before}

${tableHeader}${rows}

---

${after}`;
  
  fs.writeFileSync(docPath, updatedDoc, 'utf8');
  console.log('SUCCESS: Generated docs/CURRICULUM_MAPPING.md from src/content/curriculumSources.ts');
} else {
  console.log('NOTICE: Mapping table markers not found; table checked without full doc rewrite.');
}

console.log('PASS: All curriculum sources conform to verification schema.');
process.exit(0);
