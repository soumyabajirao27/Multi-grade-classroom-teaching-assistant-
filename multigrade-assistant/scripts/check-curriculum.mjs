import fs from 'node:fs';
import path from 'node:path';
import { CURRICULUM_MAPPINGS, OFFICIAL_NCERT_CHAPTERS, getCurriculumCoverageCounts } from '../src/content/curriculumSources.ts';

const docPath = path.resolve(process.cwd(), 'docs/CURRICULUM_MAPPING.md');

console.log(`Checking ${CURRICULUM_MAPPINGS.length} curriculum mapping entries...`);

let hasError = false;

// Validation rules:
// 1. If status is 'verified', it MUST have verifiedBy and verifiedOn.
// 2. Any entry with a chapter name (not 'TO RESEARCH') from NCERT books must be present in the supplied official/secondary lists.
const allSuppliedTitles = new Set(Object.values(OFFICIAL_NCERT_CHAPTERS).flat());

for (const entry of CURRICULUM_MAPPINGS) {
  const m = entry.mapping;
  if (m.status === 'verified') {
    if (!m.verifiedBy || !m.verifiedOn) {
      console.error(
        `FAIL: Entry for topic "${entry.topicId}" Grade ${entry.grade} (${m.board}) is marked 'verified' but lacks mandatory fields: ` +
        `verifiedBy: ${m.verifiedBy}, verifiedOn: ${m.verifiedOn}`
      );
      hasError = true;
    }
  }

  // Check chapter title validity: no invented chapters
  if (m.chapter && m.chapter !== 'TO RESEARCH' && !m.chapter.startsWith('TO ')) {
    if (!allSuppliedTitles.has(m.chapter)) {
      console.error(
        `FAIL: Entry for topic "${entry.topicId}" Grade ${entry.grade} has unverified/invented chapter title "${m.chapter}" not in supplied chapter lists!`
      );
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

// Compute coverage counts dynamically from data
const counts = getCurriculumCoverageCounts();

// Generate the updated Markdown table for docs/CURRICULUM_MAPPING.md
const tableHeader = `| Topic ID | Subject | Grade | Board | Textbook | Status | Chapter | Match Type | Source URL / Portal | Source Type | Checked On | Verified By | Verified On | Notes |
|---|---|:---:|---|---|:---:|---|:---:|---|:---:|:---:|:---:|:---:|---|
`;

const rows = CURRICULUM_MAPPINGS.map((s) => {
  const m = s.mapping;
  const chapterText = m.chapterNo ? `Ch ${m.chapterNo}: ${m.chapter}` : m.chapter;
  const sourceLink = m.source.startsWith('http') ? `[Link](${m.source})` : m.source;
  return `| \`${s.topicId}\` | ${s.subject.toUpperCase()} | ${s.grade} | ${m.board} | ${m.book} | \`${m.status}\` | ${chapterText} | ${m.matchType} | ${sourceLink} | ${m.sourceType} | ${m.checkedOn} | ${m.verifiedBy || '—'} | ${m.verifiedOn || '—'} | ${m.note || '—'} |`;
}).join('\n');

const verificationProcedure = `## How to Verify the Mapping Procedure

To maintain complete academic and pedagogical integrity, all curriculum alignments follow a strict verification protocol:
1. **Source the Official Textbook:** Retrieve the official physical textbook or download the official authorized PDF from the state or national portal ([NCERT e-Textbooks](https://ncert.nic.in/textbook.php) / [eBalbharati](https://ebalbharati.in)).
2. **Confirm Chapter and Page Number:** Cross-check the exact chapter number, title, and page range in the printed or digital table of contents.
3. **Compare Learning Outcomes:** Open the unit and confirm that the stated learning outcome and pedagogical activities in the app align with the textbook's competencies (not just a keyword match).
4. **Record Reviewer Sign-off:** Record the reviewer's full name (\`verifiedBy\`), date (\`verifiedOn\`), and any contextual pedagogical notes.
5. **Update Status:** Only after steps 1–4 are complete may the entry status be transitioned from \`'candidate'\` or \`'to-research'\` to \`'verified'\`.

> **Enforcement Rule:** A strict automated test (\`npm test\`) and validation gate (\`npm run validate\`) enforce that status \`'verified'\` will immediately fail if \`verifiedBy\` or \`verifiedOn\` is missing, and will fail if any chapter name outside official verified lists is detected.

### Current Curriculum Coverage Summary (Computed from Data)
- **Candidate Mappings (Title Match):** ${counts.candidate}
- **Verified Mappings:** ${counts.verified}
- **Extension Content (Multi-Grade Custom):** ${counts.extension}
- **To Research (Class 5 & Unresearched State Classes):** ${counts.toResearch}
- **Total Mappings Evaluated:** ${counts.total}
`;

// Read existing docs/CURRICULUM_MAPPING.md to preserve pedagogical notes section
let docContent = fs.readFileSync(docPath, 'utf8');

const markerStart = '## Maharashtra State Board (Balbharati) & NCERT Mapping Table';
const splitStart = docContent.indexOf(markerStart);
const splitEnd = docContent.indexOf('## Remaining `sameAcrossTiers` Items', splitStart);

const introHeader = `# Curriculum Mapping

This document details the alignment of each topic and grade level with official state (Balbharati) and national (NCERT) textbooks.

> **Instruction for Reviewers & Evaluators:**
> To ensure complete integrity, entries are classified as:
> - \`candidate\`: Matches chapter titles in current official/secondary NCERT lists; learning outcomes pending line-by-line review.
> - \`extension\`: Cohesive multi-grade curriculum designed by our engine where no single direct textbook chapter exists.
> - \`to-research\`: Classes and state board textbooks where official chapter lists are pending physical textbook inspection.
> - \`verified\`: Confirmed against physical/official PDFs with reviewer sign-off and verification date recorded.

---

${verificationProcedure}

---

## Maharashtra State Board (Balbharati) & NCERT Mapping Table
`;

if (splitStart !== -1 && splitEnd !== -1) {
  const after = docContent.slice(splitEnd);
  
  const updatedDoc = `${introHeader}

${tableHeader}${rows}

---

${after}`;
  
  fs.writeFileSync(docPath, updatedDoc, 'utf8');
  console.log('SUCCESS: Generated docs/CURRICULUM_MAPPING.md from src/content/curriculumSources.ts');
} else {
  // If markers not matched, write full document
  const updatedDoc = `${introHeader}

${tableHeader}${rows}
`;
  fs.writeFileSync(docPath, updatedDoc, 'utf8');
  console.log('SUCCESS: Written docs/CURRICULUM_MAPPING.md');
}

console.log('PASS: All curriculum sources conform to verification schema.');
process.exit(0);
