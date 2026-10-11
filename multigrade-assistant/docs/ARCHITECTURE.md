# Architecture

**Principle:** all teaching logic is pure TypeScript in `src/engine` (no React, no storage), so it is unit-tested and reviewable by an education expert. UI and storage are thin layers.

```
 content/curriculum.ts ──► engine/planner ─────┐
 content/generators.ts ──► engine/worksheet ───┤
                           engine/rotation ────┼──► features/* (React) ──► screen / print
 db/db.ts (IndexedDB) ──► engine/progress ─────┘
```

- **Data model**: `Topic -> GradePlan (outcome, teacher activity, independent task, question specs, mapping, earlyFinisher, checklist)`. 9 core topics covering Grades 1–5 in Mathematics and Environmental Studies. Question specs are either `gen` (template, parameterised by digits/denominator and tier) or `static` (authored, with support/stretch variants or `sameAcrossTiers` rule). Strings support `Localizable = Record<Lang, string> | string` with complete English, Hindi, and Marathi translations across all 9 topics and generators. Translation review status is explicitly tracked via `reviewed: Record<Lang, boolean>` with a visible UI warning badge.
- **Differentiation Invariant**: Across every topic and grade, support sheets are strictly easier than stretch sheets (shorter prompts, smaller numbers, or visual scaffolding present), and stretch total marks >= core total marks.
- **`sameAcrossTiers` Contract**: Strictly restricted to drawing/illustration tasks (`kind: 'draw'`) where open-ended visualization naturally differentiates across developmental levels without stigma. Each of the 12 items across the curriculum requires an explicit, non-generic pedagogical `sameReason`.
- **Curriculum mapping**: Each grade and topic includes `mapping: CurriculumMapping[]` tracking Board, Textbook, Chapter, and verification status (`verified` | `to-verify`).
- **Reproducibility**: Worksheets derive from `createRng(seed|topic|grade|tier)`, so a printed sheet can be regenerated and its answer key re-checked.
- **Print Pack & Quick Start**: Includes an A4 printable Teacher Quick Start Guide (3-step whole-class hook, rotational teaching, and progress review) in English, Hindi, and Marathi.
- **Rotation Engine**: Pure timestamp calculations (`calculateRemainingMs(targetEndTime, now)`) survive background tab sleeping and mobile screen locks without duplicate beeps. Supports 1-pass and 2-pass largest-remainder allocations for periods >= 35 min.
- **Storage & Reporting**: Dexie tables `students` and `records` (`[studentId+topicId]` index). One record per child/topic/day; new days append history for the tier rule. In-memory undo stack for accidental status toggles. JSON backup includes schema version validation (`version: 1`). Class progress report can be exported as standard CSV (`Date,Topic,Grade,Student,Status,Score`).
- **Offline & Lifecycle**: `vite-plugin-pwa` precaches the application shell and assets. An offline-ready status indicator (`🟢 Offline Ready`) appears in the header once the Service Worker caches the app. No network calls at runtime.
- **Privacy**: No accounts, no servers, no analytics; data never leaves the device except via teacher-initiated CSV export or JSON backup.
- **Accessibility**: 44 px minimum touch targets on tablets and coarse pointers (`@media (max-width: 1024px), (pointer: coarse)`), WCAG AA color contrast (> 4.5:1) in both light and dark modes, ARIA live region (`aria-live="polite"`) announcing rotation slot transitions, reduced-motion overrides, and an automated accessibility test suite.
- **Fault Tolerance**: Top-level `ErrorBoundary` with localized guidance and local-data reset fallback.

## Extension points
New topics (data only in `curriculum.ts`), new generators (`generators.ts`), new pedagogical rules (`rules.ts`), new languages (`i18n.ts`), cloud sync (replace `db.ts` exports).


