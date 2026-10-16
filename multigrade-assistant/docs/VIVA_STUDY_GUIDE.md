# 📚 VIVA PREPARATION GUIDE
## Multi-Grade Classroom Teaching Assistant
### Complete Tech Stack Reference & Study Material

**Team:** Soumya Bajirao, Tejas Bawane, Abhinav Gunjal  
**Institution:** Department of Computer Engineering / Information Technology  
**Academic Year:** 2025–2026

---

## PART A: COMPLETE TECHNOLOGY STACK

### 1. Frontend Framework & Language

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3.1 | Component-based UI library for building interactive single-page applications |
| **TypeScript** | 5.5.4 | Statically-typed superset of JavaScript; catches bugs at compile time |
| **JSX / TSX** | — | HTML-like syntax inside TypeScript for declarative UI rendering |

**Why React?**
- Component reusability (e.g., `<Sheet>`, `<CircularTimer>`, `<BarChart>` are used across multiple screens)
- Virtual DOM provides efficient re-rendering when timer ticks or student statuses change
- Massive community & ecosystem; well-documented for academic review
- Works entirely client-side — no server needed

**Why TypeScript?**
- Type safety prevents bugs (e.g., `Grade` is `1|2|3|4|5`, not any number)
- Self-documenting code: `interface Topic`, `type Lang = 'en'|'hi'|'mr'`
- `tsc --noEmit` runs as a pre-build gate ensuring zero type errors

---

### 2. Build Tool & Bundler

| Technology | Version | Purpose |
|---|---|---|
| **Vite** | 5.4.2 | Lightning-fast dev server & production bundler using ES modules |
| **@vitejs/plugin-react** | 4.3.1 | React Fast Refresh for instant HMR (Hot Module Replacement) during development |
| **vite-node** | 2.0.5 | Run TypeScript scripts directly (curriculum checks, sample generation) |

**Why Vite (not Webpack or Create React App)?**
- Dev server starts in <300ms (vs 10+ seconds for Webpack)
- Native ES module support — no bundling during development
- Tree-shaking: unused code is removed, keeping the bundle small (~569 kB JS, ~200 kB gzip)
- Built-in TypeScript compilation — no extra `ts-loader` configuration

**Key Vite Config (`vite.config.ts`):**
```typescript
export default defineConfig({
  base: './',          // Relative paths for offline deployment
  plugins: [react(), VitePWA({...})],
  test: { globals: true, environment: 'node' }
});
```

---

### 3. Progressive Web App (PWA)

| Technology | Version | Purpose |
|---|---|---|
| **vite-plugin-pwa** | 0.20.5 | Generates Service Worker & Web App Manifest for offline capability |
| **Workbox** | (bundled) | Google's library for Service Worker caching strategies |

**What is a PWA?**
A Progressive Web App is a website that can be installed on a device like a native app. It works offline, can be added to the home screen, and loads instantly from cache.

**How Offline Works in Our App:**
1. On first visit, the Service Worker **precaches** all HTML, CSS, JS, fonts, and icons
2. On subsequent visits (even without internet), assets are served from the cache
3. The app shows a **🟢 Offline Ready** indicator once caching is complete
4. All data (students, scores, topics) is stored locally in IndexedDB — never sent to a server

**Key PWA Manifest Fields:**
```json
{
  "name": "Multi-Grade Teaching Assistant",
  "short_name": "MultiGrade",
  "display": "standalone",
  "theme_color": "#1e4d45"
}
```

---

### 4. Client-Side Database

| Technology | Version | Purpose |
|---|---|---|
| **IndexedDB** | Browser API | Browser-native NoSQL database for structured local storage |
| **Dexie.js** | 4.0.8 | Elegant wrapper around IndexedDB with promises and type-safe queries |
| **dexie-react-hooks** | 1.1.7 | `useLiveQuery()` hook for reactive database queries in React |

**Why IndexedDB (not localStorage)?**
- localStorage is limited to ~5 MB of string data only
- IndexedDB supports structured objects, indexes, and queries
- Can store thousands of student records, progress history, and custom topics
- Persists across browser sessions and app reinstalls

**Database Schema (v2):**
```
students:     ++id, grade          → { id, name, grade }
records:      ++id, studentId, topicId, [studentId+topicId], updatedAt
                                   → { id, studentId, topicId, status, score, updatedAt }
customTopics: id, subject          → { id, subject, ... full Topic object }
```

**Viva Q: "What happens if the teacher clears browser data?"**  
A: All data lives in IndexedDB. Teachers can **export a JSON backup** at any time and **import it back** to restore. The app prompts for backup before any destructive action.

---

### 5. Typography & Fonts

| Technology | Purpose |
|---|---|
| **@fontsource/baloo-2** | Self-hosted Google Font for headings, numbers, and titles (friendly, rounded) |
| **@fontsource/hind** | Self-hosted Google Font for body text with excellent Devanagari (Hindi/Marathi) support |

**Why Self-Hosted Fonts (not Google CDN)?**
- **Offline-first requirement**: CDN fonts require internet; self-hosted fonts are bundled in the build
- Hind has native Devanagari glyphs — essential for Hindi and Marathi interface
- `line-height: 1.6` ensures Devanagari conjunct characters (e.g., क्ष, ज्ञ) are never clipped

---

### 6. Testing Framework

| Technology | Version | Purpose |
|---|---|---|
| **Vitest** | 2.0.5 | Unit & integration test runner (Vite-native, fast, TypeScript-first) |

**Test Coverage:**
- **80 automated tests** across 10+ `describe` suites
- Tests cover: RNG determinism, worksheet generation, rotation allocation, differentiation invariants, curriculum schema, progress tier recommendation, content integrity, and accessibility contrast

**Key Test Command:**
```bash
npm test          # Runs all 80 tests
npm run validate  # Full gate: typecheck + tests + build
```

**Viva Q: "What do your tests actually verify?"**  
A: For example, we test that:
- Support worksheets are *always* easier than Stretch worksheets (smaller numbers, fewer items)
- Stretch total marks ≥ Core total marks (no unfair penalty for advanced students)
- Rotation time allocation sums exactly to the period length (largest-remainder algorithm)
- RNG seeded worksheets are reproducible (same seed → same questions every time)

---

### 7. Accessibility & Quality Tooling

| Technology | Version | Purpose |
|---|---|---|
| **axe-core** | 4.14.0 | Automated WCAG accessibility auditing engine |
| **Puppeteer** | 25.14.0 | Headless Chrome for automated screenshots and accessibility testing |

**Accessibility Standards Met:**
- **WCAG AA Contrast** (≥ 4.5:1) for all text in both Light and Dark themes
- **44px minimum touch targets** for tablet/phone use
- **`aria-live="polite"`** announces rotation slot changes to screen readers
- **`prefers-reduced-motion`** disables animations for users who need it
- **Keyboard navigation** in the Topic Picker modal (Arrow keys, Enter, Escape)

---

### 8. Deployment & DevOps

| Technology | Purpose |
|---|---|
| **Git** | Version control; 5+ task-level commits with conventional commit messages |
| **GitHub** | Remote repository hosting (soumyabajirao27/Multi-grade-classroom-teaching-assistant-) |
| **Vercel** | Static site hosting with automatic builds on push, CDN, and HTTPS |
| **Render** | Alternative static site deployment (render.yaml blueprint included) |

**Deployment Pipeline:**
```
git push origin main
    ↓
Vercel detects push → runs `npm run build`
    ↓
TypeScript typecheck + Vite production bundle
    ↓
Service Worker precaches all assets
    ↓
Live HTTPS URL updated automatically
```

---

### 9. Design System & Icons

| Technology | Purpose |
|---|---|
| **CSS Custom Properties (CSS Variables)** | Design tokens for colors, spacing, typography, shadows |
| **Inline SVG Icons** (`src/components/icons.tsx`) | Tree-shaken, offline-safe icon library (21 icons, ~1.4 kB gzip) |
| **Light/Dark Theme** | System-preference aware (`prefers-color-scheme`) with manual toggle |

**Design Token Examples:**
```css
--board: #143831;      /* Chalkboard green brand color */
--marigold: #E29000;   /* Primary action accent */
--g1: #A62619;         /* Grade 1 identity color (red) */
--g2: #8C5600;         /* Grade 2 identity color (amber) */
--g3: #16643C;         /* Grade 3 identity color (green) */
```

---

## PART B: ARCHITECTURE & HOW IT WORKS

### System Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                    USER (Teacher)                │
│         Browser / Installed PWA on Tablet        │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              REACT UI LAYER (src/features/)     │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────┐ │
│  │ Planner  │ │Worksheets│ │Rotation│ │Progre│ │
│  │  (M1)    │ │  (M2)    │ │  (M3)  │ │ss(M4)│ │
│  └────┬─────┘ └────┬─────┘ └───┬────┘ └──┬───┘ │
└───────┼────────────┼───────────┼─────────┼──────┘
        │            │           │         │
┌───────▼────────────▼───────────▼─────────▼──────┐
│           PURE ENGINE LAYER (src/engine/)        │
│  planner.ts  worksheet.ts  rotation.ts  rules.ts│
│  progress.ts  rng.ts  validateTopic.ts          │
│  (Zero React dependency — fully unit-testable)   │
└───────┬────────────┬───────────────┬────────────┘
        │            │               │
┌───────▼────────────▼───────────────▼────────────┐
│           DATA & CONTENT LAYER                   │
│  src/content/curriculum.ts  (10 topics, 120 map)│
│  src/content/generators.ts  (13 question gens)  │
│  src/db/db.ts  (IndexedDB via Dexie)            │
│  src/i18n.ts  (EN / HI / MR translations)       │
└─────────────────────────────────────────────────┘
```

**Key Design Principle:**
All teaching logic (planning, worksheet generation, rotation allocation, progress rules) lives in `src/engine/` as **pure TypeScript functions** with zero React dependency. This means:
- An education expert can review the rules without understanding React
- All logic is fully unit-testable in isolation
- The UI is a thin presentation layer on top

---

## PART C: MODULE-WISE EXPLANATION (FOR VIVA Q&A)

### Module 1: Session Planner

**What it does:** Given a topic (e.g., "Water") and selected grades (e.g., G1, G3, G5), it generates:
- A shared **opening hook** (whole-class activity)
- Grade-specific **learning outcomes**
- **Teacher-led activities** per grade
- **Independent tasks** (self-work while teacher is with another grade)
- **Peer buddy** pairing suggestions (G1 paired with G3+)

**Key Algorithm:**
```
For each selected grade:
  1. Look up the grade's plan from the topic's curriculum data
  2. Apply differentiation rules (rules.ts):
     - Solo-task duration fits grade's attention span (G1: 10min, G5: 25min)
     - If G1 or G2 is present, auto-pair with older grade as buddy
  3. Display the "staircase" of difficulty progression
```

---

### Module 2: Worksheet Generator

**What it does:** Generates printable A4 worksheets for each grade, in 3 difficulty tiers:
- **Support** (easier: smaller numbers, visual scaffolding, hints)
- **Core** (grade-level standard)
- **Stretch** (harder: larger numbers, multi-step, higher-order thinking)

**Key Algorithm (Seeded RNG):**
```
seed = hash(topicId + grade + tier)
rng = createRng(seed)
for each question spec in topic.grades[grade].questions:
  if spec.kind === 'gen':
    question = generator(rng, spec.template, tier)  // Parameterised
  else:
    question = spec.variants[tier]  // Authored per tier
```

**Why deterministic seeds?** Same seed → same questions every time. A teacher can regenerate a lost worksheet or print its answer key days later.

**Viva Q: "How do you ensure Support is easier than Stretch?"**  
A: Automated tests verify that for every topic and grade:
- Support number ranges are a strict subset of Core ranges
- Stretch total marks ≥ Core total marks
- Only `kind: 'draw'` tasks are allowed to be `sameAcrossTiers`

---

### Module 3: Rotation Timer

**What it does:** Splits a period (e.g., 40 minutes) into equitable teacher-led slots per grade.

**Key Algorithm (Largest Remainder Method):**
```
1. Calculate ideal time per grade: idealMinutes = (totalMinutes - openingMinutes) × weight[grade] / Σweights
2. Give each grade floor(idealMinutes)
3. Distribute remaining minutes one-by-one to grades with the largest fractional remainder
4. Result: exact integer minutes per grade that sum perfectly to the period
```

**Why largest-remainder (not simple rounding)?**
- Simple rounding can produce totals that are 1–2 minutes short or over
- Largest-remainder guarantees the sum is **exactly** equal to the period length
- It's the same method used in proportional representation elections

**Technical Features:**
- `CircularTimer.tsx`: SVG-based countdown ring that updates every second
- Wake Lock API prevents tablet screen from sleeping during class
- Audio chime plays on slot transitions (Web Audio API)
- Survives background tab sleeping via `Date.now()` delta calculation

---

### Module 4: Progress Tracker

**What it does:** Records per-student mastery status:
- **Not Started** → **Needs Help** → **Done** (with optional score)

**Tier Recommendation Algorithm:**
```
if lastAttempt.status === 'needs_help' → recommend Support
else if lastTwo.allDone && lastTwo.avgScore >= 80 → recommend Stretch
else → recommend Core
```

**Data Visualization:** Custom SVG `<BarChart>` component shows per-grade mastery distribution. CSV export for school reports.

---

## PART D: KEY CONCEPTS TO STUDY

### 1. Progressive Web Apps (PWA)
- **Service Worker**: A JavaScript file that runs in the background, intercepting network requests and serving cached responses
- **Web App Manifest**: JSON file describing the app's name, icons, theme color, and display mode
- **Precaching**: Downloading all critical assets on first visit so the app works offline
- **`display: standalone`**: Makes the PWA look like a native app (no browser chrome)

### 2. IndexedDB
- Browser-native NoSQL database (key-value + indexes)
- Asynchronous API (uses Promises, not blocking)
- Much larger storage limit than localStorage (~unlimited vs ~5MB)
- Structured data: can store objects, arrays, and binary data
- Dexie.js wraps IndexedDB with a cleaner, promise-based API

### 3. React Concepts Used
- **Functional Components** with Hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
- **`useLiveQuery()`** (Dexie hook) for reactive database queries
- **Conditional Rendering**: Different UI based on `running`, `finished`, `cur` state
- **`aria-live="polite"`**: Screen reader announcements for dynamic content changes
- **`ErrorBoundary`**: Catches runtime errors and shows a recovery UI

### 4. TypeScript Concepts Used
- **Union Types**: `type Grade = 1 | 2 | 3 | 4 | 5`
- **Interfaces**: `interface Topic { id: string; subject: Subject; ... }`
- **Generics**: `Table<Student, number>` (Dexie typed tables)
- **Strict Mode**: `"strict": true` in tsconfig.json (catches null, undefined, type mismatches)
- **`noEmit`**: TypeScript is used only for type checking; Vite handles compilation

### 5. CSS Concepts Used
- **CSS Custom Properties (Variables)**: `--board: #143831;` → `color: var(--board);`
- **`prefers-color-scheme` media query**: Automatic light/dark theme detection
- **`prefers-reduced-motion`**: Disables animations for accessibility
- **`@media print`**: Special print stylesheets for A4 worksheet output
- **Flexbox & Grid**: Responsive layouts for 800px–1280px viewports

### 6. Algorithms
- **Seeded PRNG (Pseudo-Random Number Generator)**: Deterministic randomness from a seed
- **Largest Remainder Method**: Fair proportional time allocation
- **Differentiation Rules**: Enforced invariants for educational equity

---

## PART E: EXPECTED VIVA QUESTIONS & ANSWERS

### General / Overview

**Q1: What is the problem your project solves?**  
A: In rural India, a single teacher often handles Grades 1–5 in one classroom. Our app automates 4 key tasks: session planning, worksheet generation, rotation scheduling, and progress tracking — all offline, on a basic Android tablet.

**Q2: Why is offline-first important?**  
A: Rural schools often have no Wi-Fi and spotty 2G/4G. Our app uses a Service Worker (PWA) to cache everything on first load. After that, it works 100% offline — including generating worksheets, running timers, and tracking student progress in IndexedDB.

**Q3: What makes this different from Khan Academy or DIKSHA?**  
A: Those platforms assume one student per device with internet. We handle multi-grade (5 grades, 1 teacher, 1 room) with features no other platform has: shared thematic hooks, rotation scheduling, cross-grade peer buddy pairing, and tiered worksheet generation — all offline.

### Technical

**Q4: Why React + TypeScript instead of plain HTML/JS?**  
A: React's component model lets us reuse complex UI pieces (timer ring, bar chart, worksheet sheet) across modules. TypeScript catches bugs at compile time — critical because wrong worksheet difficulty or incorrect timer math could harm education quality.

**Q5: How does the Service Worker work?**  
A: `vite-plugin-pwa` generates a Workbox-based Service Worker during build. On first visit, it precaches all assets (HTML, JS, CSS, fonts, icons). On subsequent visits, the SW intercepts network requests and serves from cache. If we update the app, the new SW installs in the background and prompts the teacher to refresh.

**Q6: How is data stored?**  
A: Using IndexedDB via Dexie.js. Three tables: `students` (name, grade), `records` (topic, status, score, timestamp), and `customTopics` (teacher-authored content). All data stays on-device. Teachers can export/import JSON backups.

**Q7: What is the largest-remainder algorithm?**  
A: It's a method for dividing a period (e.g., 40 min) among grades proportionally while ensuring integer minutes that sum exactly to the total. Each grade gets floor(ideal time), then remaining minutes go to grades with the highest fractional parts. Same method used in political seat allocation.

**Q8: How do you ensure worksheet quality?**  
A: 80 automated tests verify: (1) Support is always easier than Stretch, (2) Stretch marks ≥ Core marks, (3) same seed produces same questions, (4) all generators produce valid output across all grades and tiers.

**Q9: How does the theme system work?**  
A: CSS custom properties define all colors in `:root` (light) and `[data-theme='dark']`. An inline `<script>` in `index.html` reads the saved preference before React loads, preventing flash-of-unstyled-content. The system also respects `prefers-color-scheme` for auto mode.

**Q10: What is your testing strategy?**  
A: Pure engine logic is unit-tested with Vitest (80 tests). Accessibility is audited with axe-core via Puppeteer across 2 themes × 4 tabs. Contrast ratios are verified programmatically. TypeScript strict mode catches type errors. The `npm run validate` gate runs all checks before every commit.

### Deployment

**Q11: How is the app deployed?**  
A: Pushed to GitHub, connected to Vercel. On every push to `main`, Vercel runs `npm run build` (TypeScript check + Vite production bundle + PWA Service Worker generation) and deploys to a global CDN with HTTPS.

**Q12: What is `vercel.json` for?**  
A: It configures SPA routing (rewrite all paths to `index.html`) and cache headers (no-cache for `sw.js` and `index.html` so updates propagate; immutable caching for hashed asset files).

### Pedagogical

**Q13: How does differentiation work?**  
A: Each topic has 5 grade-specific plans. Within each grade, worksheets come in 3 tiers (Support, Core, Stretch). The app recommends the tier based on the student's last two attempts: consistently scoring 80%+ → Stretch; needs help → Support; else → Core.

**Q14: What is the peer buddy system?**  
A: When Grade 1 or 2 students work independently, the app suggests pairing them with a student from Grade 3+ for peer support. This is educationally proven (Vygotsky's ZPD) and keeps younger students engaged while the teacher works with another grade.

**Q15: Why only Grades 1–5?**  
A: These map to India's NIPUN Bharat / FLN mandate — the tier where single-teacher multi-grade rooms are most common. Grades 6+ have different NCERT textbooks, subject specialists, and cognitive demands. Expansion is planned for v1.1.

---

## PART F: QUICK REFERENCE CHEAT SHEET

### Commands
```bash
npm install          # Install all dependencies
npm run dev          # Start dev server (localhost:5173)
npm test             # Run 80 tests
npm run typecheck    # TypeScript strict check
npm run validate     # Full validation gate
npm run build        # Production build with PWA
```

### File Structure
```
src/
├── components/       # Reusable UI: BarChart, CircularTimer, Sheet, icons, TopicPickerModal
├── content/          # Curriculum data (10 topics) + question generators (13 generators)
├── db/               # IndexedDB via Dexie (students, records, customTopics)
├── engine/           # Pure logic: planner, worksheet, rotation, progress, RNG, rules
├── features/         # Page-level React: Planner, Worksheets, Rotation, Progress
├── i18n.ts           # Trilingual translations (English, Hindi, Marathi)
├── theme.ts          # Light/Dark/Auto theme management
├── types.ts          # TypeScript type definitions
├── styles.css        # Design system tokens + all CSS
└── App.tsx           # Root component with tab routing

tests/                # 80 Vitest tests
docs/                 # REPORT.md, ARCHITECTURE.md, VIVA_NOTES.md, CURRICULUM_MAPPING.md
scripts/              # Build scripts, contrast check, a11y audit, screenshot automation
```

### Bundle Size
| Asset | Raw | Gzip |
|---|---|---|
| JavaScript | 569 kB | 200 kB |
| CSS | 33 kB | 7 kB |
| Total Transfer | — | **~207 kB** |

### Key Numbers to Remember
- **10** built-in multi-grade topics
- **120** curriculum mapping entries
- **13** localized question generators
- **80** automated tests
- **3** languages (English, Hindi, Marathi)
- **3** difficulty tiers (Support, Core, Stretch)
- **5** grades (1–5)
- **4** modules (Planner, Worksheets, Rotation, Progress)
- **0** cloud dependencies (100% offline)
- **0** user accounts needed (privacy-first)
