# Multi-Grade Teaching Assistant

Offline-first web/tablet app for rural single- and two-teacher schools where one teacher handles Grades 1-5 at once.

| Module | What it does |
|---|---|
| **M1 Session planner** | One shared theme per topic; grade-wise teacher-led and independent activities (same theme, different difficulty). Adds peer-buddy suggestions and rule checks. |
| **M2 Worksheet generator** | Printable, self-learning worksheets per grade. Template questions regenerate from a seed; answer keys included. Optional grouping by level (support / core / stretch) inside a grade. |
| **M3 Rotation scheduler** | Splits the period into a whole-class opening plus one teacher slot per grade, with a countdown timer, beep/vibration, wake-lock and a Demo mode. Warns when a grade would be unsupervised too long. |
| **M4 Progress tracker** | Per-child status (not started / needs help / done) with optional score; per-grade summary; level suggestion for the next worksheet; JSON export/import backup. |

UI languages: English, Hindi, Marathi (`src/i18n.ts`). Worksheets, teacher steps, and generator word problems are localized across all three languages with English fallback.
> **Note on Translations:** Classroom-level Hindi and Marathi translations are provided. Field deployments should have these reviewed and refined with a native-speaking primary school teacher from the target district.

## Packaging & Submission Hygiene

> **IMPORTANT:** Always share or archive this repository **WITHOUT** `node_modules`.
> Use `git archive` or create a zip archive excluding `node_modules/` and `dist/`:
> ```bash
> git archive --format=zip --output=multigrade-teaching-assistant.zip HEAD
> ```
> A `.gitattributes` file is included in the project root with `node_modules/ export-ignore` and `dist/ export-ignore` to ensure clean distribution.

## Run

```bash
npm install        # or npm ci
npm run dev        # http://localhost:5173 (dev server)
npm test           # engine unit & integration tests (46 tests)
npm run typecheck  # TypeScript check (tsc --noEmit)
npm run check:report # verifies docs/REPORT.md integrity (no fabricated stats)
npm run validate   # complete validation gate (check:report + typecheck + test + build)
npm run build      # production build (PWA, precached by Service Worker for offline use)
npm run samples    # regenerate printable sample worksheets in ./samples
```

## Deploy on Render

A `render.yaml` specification is included in the project root:
1. Push this repository to GitHub/GitLab.
2. In the Render Dashboard, click **New > Blueprint** and select your repository (or choose **New > Static Site**).
3. Configuration:
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`
   - **Routes:** Rewrite `/*` -> `/index.html` (SPA routing)
   - **Headers:** No-cache headers are set for `/sw.js`, `/index.html`, and `/manifest.webmanifest`.

### Post-Deploy Offline Verification Checklist
1. **Initial Online Load:** Open the live URL once in Chrome or Safari with active internet to download and register the Service Worker.
2. **Install App:** Tap the **📲 Install App** button (on Android Chrome / Desktop) or **Share > Add to Home Screen** (on iOS Safari).
3. **Go Offline:** Switch your tablet/device to Airplane Mode (or disable Wi-Fi and Cellular). Look for the **🟢 Offline Ready** indicator in the header.
4. **Offline Test:** Open the installed app from your home screen. Confirm:
   - All 4 tabs (Planner, Worksheets, Rotation, Progress) render instantly.
   - Worksheets generate and print properly offline.
   - Rotation timer runs and beeps offline.
   - Student roster and mastery status persist in local IndexedDB.

## Differentiation rules (all in `src/engine`, constants in `rules.ts`)

1. **Same theme, different level**: each topic has one theme; each grade has its own outcome, activity and question spec.
2. **Independence**: solo tasks must fit the grade's attention span (G1 10 min ... G5 25 min); enforced by tests and planner warnings.
3. **Peer buddy**: Grades 1-2 are paired with a grade at least two levels higher when present.
4. **Teacher time**: split by weight (younger grades get more), exact to the minute using largest-remainder allocation.
5. **Unsupervised limit**: warns when a grade works alone longer than its limit.
6. **Tiers**: support uses the lower half of number ranges, scaffolded options, and hints; stretch uses full ranges, regrouping and higher-order tasks. Measurable test guarantees support is strictly easier and stretch total marks >= core marks.
7. **Next level**: last attempt "needs help" -> support; last two "done" with score >= 80 -> stretch; else core.
8. **Early Finishers**: each grade provides a designated challenge task so fast learners remain constructively engaged.
9. **Two-Pass Rotation**: periods >= 35 min can optionally execute a second pass to avoid younger grades being left unsupervised.
10. **sameAcrossTiers Restriction**: non-drawing questions MUST provide authored Support and Stretch variants. Only 12 non-verbal visual/drawing tasks are marked `sameAcrossTiers: true`, each with an explicit pedagogical justification.

## Topics Included (9 Complete Multi-Grade Units)

All 9 topics are fully translated into English, Hindi, and Marathi across all 5 grades. All Hindi and Marathi translations are marked in the system as **needs native-speaker teacher review**:

1. **Water (EVS - `evs-water`)**: Sources, clean water habits, evaporation, water cycle, and village water auditing.
2. **Numbers in the Market (Maths - `math-market`)**: Counting, 2-digit add/sub, place-value bills, multiplication ledgers, and money/fractions.
3. **Shapes & Patterns (Maths - `math-shapes`)**: 2D shape identification, symmetry, perimeter calculations, area, and compound shapes.
4. **My Body & Health (EVS - `evs-body`)**: Body parts, balanced food groups, digestion, organ systems, and disease prevention.
5. **Plants Around Us (EVS - `evs-plants`)**: Plant parts, plant types, photosynthesis, seed dispersal, and food chains.
6. **Time & Calendar (Maths - `math-time`)**: Days/months, reading clock faces, elapsed time word problems, 24-hour clocks, and schedules.
7. **Our Neighbourhood (EVS - `evs-neighbourhood`)**: Spatial near/far, cardinal directions, classroom sketch maps, map symbols/legends, and distance scales.
8. **Fractions & Sharing (Maths - `math-fractions`)**: Equal parts, halves/quarters, fractions of collections, equivalent fractions, and mixed numbers.
9. **Animals & Their Habitats (EVS - `evs-animals`)**: Animal sounds/homes, domestic vs wild, herbivore/carnivore diets, adaptations, and forest food webs.

## Structure

```
src/components/ Welcome 3-step guide, ErrorBoundary, ReloadPrompt, BarChart, CircularTimer, Sheet
src/engine/     rng, rules, planner, worksheet, rotation, progress (pure TypeScript, zero React)
src/content/    curriculum library (9 topics with curriculum mapping), generators (13 localized generators)
src/db/         IndexedDB (Dexie): students, records, undo stack, schema v1 validation
src/features/   Planner, Worksheets (with Quick Start A4, Print Pack & PDF fallback), Rotation, Progress (CSV export)
src/i18n.ts     en / hi / mr translations (trilingual interface)
tests/          46 automated unit & integration tests
docs/           REPORT.md, CURRICULUM_MAPPING.md, EVALUATION.md, ARCHITECTURE.md, DEMO_SCRIPT.md
samples/        regenerated printable HTML worksheets for curriculum topics
render.yaml     Render Blueprint static site deployment spec with PWA cache headers
```

## Production & Verification Status

- **Automated Tests:** 46/46 passing (`npm test`)
- **PWA Production Build:** Zero TypeScript errors, service worker precached (`npm run build`)
- **Validation Gate:** `npm run validate` runs report check, typecheck, tests, and build.
- **Field Usability & SUS Evaluation:** Evaluation protocol defined in `docs/EVALUATION.md`; empirical trial data: `[TO VERIFY - pending field trial deployment]`
- **Textbook Mapping:** Structural mappings established in `docs/CURRICULUM_MAPPING.md`; Maharashtra State Board textbook chapter verification: `[TO VERIFY]`
- **Language Review:** Hindi/Marathi translations authored with Maharashtra classroom terminology; native-speaker primary teacher review: `[TO VERIFY]`


