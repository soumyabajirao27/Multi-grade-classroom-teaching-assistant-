# Multi-Grade Classroom Teaching Assistant
## Engineering Project Report & System Documentation

**Project Team:**
- **Soumya Bajirao** (Candidate C)
- **Tejas Bawane** (Candidate C)
- **Abhinav Gunjal** (Candidate B)

**Institution:** Department of Computer Engineering / Information Technology  
**Academic Year:** 2025–2026  

---

## Executive Summary

Across primary schools in rural and semi-urban India, a single educator is routinely tasked with instructing students from multiple grades (Classes 1 through 5) simultaneously within a single physical classroom. Mainstream educational technology solutions assume single-grade, one-to-one computing environments with continuous high-speed internet connectivity. 

The **Multi-Grade Classroom Teaching Assistant** is an offline-first Progressive Web Application (PWA) engineered specifically to address this pedagogical challenge. The system automates four core operational workflows:
1. **Thematic Session Planning:** Synthesizes a shared cross-grade opening hook while differentiating grade-level learning outcomes, teacher-led instruction, and peer-buddy assignments.
2. **Deterministic Tiered Worksheets:** Algorithmic question generation seeded for exact reproducibility, automatically generating Support, Core, and Stretch difficulty tiers across 9 primary school curriculum topics.
3. **Equitable Rotation Scheduling:** Distributes teacher-led instruction time using a largest-remainder allocation algorithm, featuring a synchronized circular timer, audio transitions, and mobile screen wake-lock.
4. **Offline Mastery Tracking:** Leverages IndexedDB (Dexie) for local persistence, student mastery progression, automated tier recommendation, and SVG data visualization without requiring cloud connectivity or logins.

---

## Chapter 1: Introduction & Problem Definition

### 1.1 The Multi-Grade Reality in India
In multi-grade classrooms (multi-level teaching environments), a single teacher manages students of varying developmental stages, cognitive abilities, and grade levels. Rather than teaching five separate 40-minute periods for five distinct grades, the teacher must conduct a single 40-to-50-minute period during which all grades are actively engaged.

Key data and context highlighting the magnitude of this reality:
- **UDISE+ Data:** [insert verified count of single-teacher / multi-grade schools across India from official dataset; TO VERIFY]
- **State Concentration:** [insert verified statistics on multi-grade primary schools in Maharashtra; TO VERIFY]
- **National Education Policy (NEP) 2020:** Specifically acknowledges multi-grade, multi-level instruction as an instructional reality requiring tailored pedagogical resources, continuous foundational literacy and numeracy (FLN), and context-sensitive tools. [insert official document reference; TO VERIFY]
- **Instructional Time Overhead:** [insert verified research citation on classroom management overhead in multi-grade settings; TO VERIFY]

### 1.2 Core Pedagogical Challenges
1. **Cognitive Overload on Teachers:** Designing 5 simultaneous lesson plans and 15 differentiated worksheets (3 tiers × 5 grades) manually requires hours of daily preparation.
2. **Neglect of Younger Grades:** In unmanaged rotations, older grades (4 and 5) often absorb teacher attention, while Grades 1 and 2 sit idle without structured peer collaboration.
3. **Infrastructure Constraints:** Rural schools frequently experience erratic electricity and zero or unreliable cellular internet. Cloud-reliant or login-heavy platforms fail completely in these environments.

---

## Chapter 2: Literature Survey & Market Gap Analysis

### 2.1 Evaluation of Existing Ed-Tech Platforms
A comparative review of prominent educational tools confirms a structural neglect of multi-grade pedagogy:

> *Draft matrix: verify every cell against official documentation and live accounts before final submission.*

| Dimension | DIKSHA (Govt of India) | Khan Academy | Google Classroom | Pratham PraDigi | Multi-Grade Teaching Assistant (Ours) |
|---|:---:|:---:|:---:|:---:|:---:|
| **Classroom Topology** | Single Grade / Individual | Individual Student | Single Cohort | Group Kiosks | **Multi-Grade (Grades 1–5 in 1 room)** |
| **Shared Thematic Hook** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Yes (Unifying village theme)** |
| **Teacher Rotation Scheduler** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Yes (Timed largest-remainder)** |
| **Cross-Grade Peer Buddying** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Yes (Pedagogical pairing rules)** |
| **Offline-First (Zero Cloud)** | Partial (pre-downloaded) | ❌ No | ❌ No | Partial | ✅ **100% Offline PWA (IndexedDB)** |
| **Print-Ready Worksheets** | PDFs only | ❌ Online quizzes | ❌ Digital forms | ❌ App-only | ✅ **Formatted A4 HTML with Answer Keys** |
| **Trilingual UI (EN, HI, MR)** | ✅ Yes | ❌ English/Hindi only | ❌ Regional gaps | ✅ Yes | ✅ **English, Hindi, Marathi** |
| **Zero Account / Login** | ❌ Requires login | ❌ Requires account | ❌ Google Workspace | ❌ Community login | ✅ **No authentication required** |

---

## Chapter 3: Requirements & User Persona

### 3.1 Primary User Persona
- **Persona:** Smt. Sunita Patil, Primary Teacher
- **Setting:** Zilla Parishad Primary School, Satara District, Maharashtra
- **Classroom Profile:** 14 students across Grades 1, 2, 4, and 5 in one classroom room.
- **Hardware:** Personal Android smartphone (entry-to-mid range) or school-allotted tablet; no Wi-Fi, spotty 2G/4G connectivity.
- **Daily Goal:** Deliver a 45-minute lesson on *Water* where Grade 1 learns uses/sources, Grade 4 learns the water cycle, and students remain engaged without behavioral disruption.

### 3.2 Functional Requirements
1. **Module 1 (Planner):** Generate a single cohesive plan linking all present grades to one theme, with distinct learning outcomes, teacher activities, independent tasks, and peer-buddy linkages.
2. **Module 2 (Worksheet Generator):** Dynamically generate printable, tiered exercises (Support, Core, Stretch) with reproducible seeds and automated answer keys.
3. **Module 3 (Rotation Timer):** Formulate an equitable timetable dividing total period duration into teacher-led and self-work blocks with audible chime cues and screen lock management.
4. **Module 4 (Progress Tracking):** Record individual student competency status per topic, generate visual mastery summaries, recommend tier progression, and support full offline JSON backup/restore.

### 3.3 Non-Functional Requirements
- **Offline Reliability:** Instant execution from Service Worker cache; zero cloud network calls.
- **Ergonomics & Touch Targets:** Touch targets ≥ 42px for rapid interaction on mobile screens.
- **Trilingual Accessibility:** Full translation strings for English, Hindi, and Marathi.
- **Performance:** Sub-second worksheet generation and bundle size under 350 kB gzipped.

---

## Chapter 4: System Architecture & Differentiation Engine

### 4.1 System Architecture
The application is structured into decoupled core layers:
```
+--------------------------------------------------------------+
|                        User Interface                        |
|  [Planner.tsx]  [Worksheets.tsx]  [Rotation.tsx]  [Progress] |
|   Components: [Welcome] [BarChart] [CircularTimer]           |
+--------------------------------------------------------------+
                                |
+--------------------------------------------------------------+
|                     Pedagogical Engine                       |
|   rules.ts  <--->  planner.ts  <--->  worksheet.ts           |
|         |                  |                 |               |
|   rotation.ts         progress.ts          rng.ts            |
+--------------------------------------------------------------+
                                |
+--------------------------------------------------------------+
|                  Content & Generators                        |
|    curriculum.ts (9 Topics)  <--->  generators.ts (13 gens)  |
+--------------------------------------------------------------+
                                |
+--------------------------------------------------------------+
|                      Persistence Layer                       |
|          IndexedDB (Dexie.js: Students, Records)             |
|          LocalStorage (UI preferences, active topic)         |
+--------------------------------------------------------------+
```

### 4.2 The 7 Differentiation Rules (`engine/rules.ts`)
1. **R1: Single Theme** — Unifies all grades under an overarching familiar concept (e.g., "The Village Fair" or "The Village Neem Tree") to foster an inclusive classroom community.
2. **R2: Differentiated Outcomes** — Maps each grade to its specific NCERT curriculum standard.
3. **R3: Non-Interfering Tasks** — Ensures independent groups engage in quiet activities (drawing, pairing, counters) while the teacher instructs another grade directly.
4. **R4: Peer Buddy Rule** — Pairs Grades 1 and 2 students with older buddies (Grades 4 or 5) whenever both age cohorts are selected.
5. **R5: Tiered Practice** — Provides Support (simplified bounds/scaffolded hints), Core (standard grade syllabus), and Stretch (regrouping, compound operations).
6. **R6: Equitable Rotation Time** — Distributes direct instruction minutes with priority weight assigned to younger grades (Grade 1 receives greater teacher time than Grade 5).
7. **R7: Guardrail Warnings** — Automatically flags impossible scheduling setups (e.g., more than 4 grades in a 20-minute period or excessive solo minutes for 6-year-olds).

---

## Chapter 5: Curriculum Content & Generators

### 5.1 Authored Topics (7 Complete Multi-Grade Modules)
1. **Water (EVS - `evs-water`):** Theme: *Water in our village*. Covers water sources (G1), hygiene (G2), evaporation (G3), water cycle (G4), and conservation/litres calculation (G5).
2. **Numbers in the Market (Math - `math-market`):** Theme: *Village Shop*. Covers counting (G1), 2-digit add/sub (G2), 3-digit bills (G3), multiplication & multi-step budgets (G4), and fractions & decimals (G5).
3. **Shapes & Patterns (Math - `math-shapes`):** Theme: *Rangoli & Village Crafts*. Covers 2D shapes (G1), symmetry & sides (G2), perimeter (G3), area (G4), and complex compound shapes (G5).
4. **My Body & Health (EVS - `evs-body`):** Theme: *Staying Healthy*. Covers body parts (G1), food groups (G2), digestion & teeth (G3), organ systems (G4), and disease prevention (G5).
5. **Plants Around Us (EVS - `evs-plants`):** Theme: *The Neem Tree in our School*. Covers plant parts (G1), types of plants (G2), photosynthesis (G3), seed dispersal (G4), and ecosystems/food chains (G5).
6. **Time & Calendar (Math - `math-time`):** Theme: *The Village Fair is Next Week*. Covers days/months (G1), clock face reading (G2), AM/PM & duration (G3), 24-hour clocks (G4), and railway timetable word problems (G5).
7. **Our Neighbourhood (EVS - `evs-neighbourhood`):** Theme: *Map of our Village*. Covers spatial orientation (G1), cardinal directions (G2), classroom sketch mapping (G3), map legends/symbols (G4), and scale calculations (G5).
8. **Fractions & Sharing (Maths - `math-fractions`):** Theme: *Sharing at the Village Fair*. Covers equal parts (G1), halves/quarters (G2), fractions of collections (G3), equivalent fractions (G4), and mixed numbers (G5).
9. **Animals & Their Habitats (EVS - `evs-animals`):** Theme: *Forest and Farm Animals*. Covers animal sounds/homes (G1), domestic vs wild (G2), herbivore/carnivore diets (G3), adaptations (G4), and forest food webs (G5).

### 5.2 Algorithmic Problem Generators (`generators.ts`)
Thirteen custom generators create infinite, non-repeating question instances based on deterministic Linear Congruential RNG:
- `count`, `addNoCarry`, `add`, `sub`, `mul`, `div`
- `fracAdd`, `money`, `wordShop`
### 5.3 Curriculum Alignment & Verification Methodology
To ensure complete academic and pedagogical integrity, curriculum mapping is conducted with strict empirical transparency:
- **Title and Outcome Matching:** Topics are matched by chapter title and developmental learning outcomes to current NCERT primary textbooks (*Joyful Mathematics*, *Maths Mela*, *Our Wondrous World*) where an official chapter exists.
- **Extension Content:** Where no direct single textbook chapter exists in the primary syllabus for a multi-grade unit, content is formally designated as `extension` (pedagogically designed by the engine for multi-grade progression).
- **Secondary Source Disclosure:** Secondary chapter catalogs were utilized for newly revised editions (e.g., NCERT Class 3 and Class 4 books) and are explicitly recorded as `sourceType: 'secondary'` with date of inspection.
- **Pending Review (No Invented Data):** Class 5 textbooks and Maharashtra State Board (*Balbharati*) textbooks have not yet been verified against physical copies and are strictly marked `status: 'to-research'` with chapter titles marked `TO RESEARCH`. No chapter names, numbers, or page counts are invented.
- **Automated Summary Counts (Computed from System Data):**
  - Candidate Mappings (Title Match): 20
  - Verified Mappings (Full Sign-off): 0 (strictly requires verifiedBy & verifiedOn)
  - Extension Content: 6
  - To Research (Class 5 & Unresearched State Classes): 94
  - Total Evaluated Entries: 120

---

## Chapter 6: Implementation Details

### 6.1 Frontend Stack & Technology Rationale
- **React 18 & TypeScript:** Strict type checking across curriculum specifications, avoiding runtime discrepancies during offline classroom delivery.
- **Pure Modern CSS (styles.css):** Zero runtime CSS-in-JS overhead; responsive grid system, high-contrast print media styles, and Google Web Fonts (`Inter` and `Noto Sans Devanagari`).
- **Dexie.js (IndexedDB wrapper):** Asynchronous client-side transactional storage for student records and mastery status.
- **Vite & vite-plugin-pwa:** Generates service worker precaching `index.html`, JavaScript chunks, CSS, and web application manifest for full offline capability.

### 6.2 Key Custom Components
1. **`Welcome.tsx`:** 4-step modal onboarding guiding teachers through the Planner, Worksheets, Rotation, and Progress tabs on first launch.
2. **`BarChart.tsx`:** Pure SVG/CSS stacked bar chart rendering real-time mastery distributions (Done, Needs Help, Not Started) across active grades.
3. **`CircularTimer.tsx`:** Animated SVG ring (`stroke-dashoffset`) providing visual time countdown during noisy classroom rotations.

---

## Chapter 7: Verification & Automated Testing

### 7.1 Test Strategy & Test Suite (`tests/engine.test.ts`)
The project enforces a 62-case automated Vitest suite validating core engine contracts:
- **RNG Determinism:** Confirms identical seeds yield identical question sets; distinct seeds yield varied outputs.
- **Curriculum Integrity:** Validates that all 7 topics possess valid plans, positive teacher steps, and bounded solo minutes across all 5 grades.
- **Arithmetic Accuracy (480-Sheet Stress Test):** Programmatically verifies that all generated addition, subtraction, multiplication, and division answer keys are mathematically exact and non-negative.
- **Regrouping Constraints:** Ensures `addNoCarry` never carries across digits, while stretch subtraction forces regrouping.
- **Tier Invariant:** Confirms support tier operands remain strictly smaller than stretch tier operands.
- **Planner Edge Cases:** Verifies peer-buddy assignment rules for single-grade, empty-grade, and 5-grade selections.
- **Rotation Math:** Confirms the largest-remainder allocation tiles the period without dead time.
- **Curriculum Mapping Integrity:** Confirms all mapping entries conform to the `CurriculumMapping` schema; verified status strictly requires `verifiedBy` + `verifiedOn`; candidate chapter names must appear in the official/secondary supplied title lists.
- **Coverage Counts:** Coverage totals (candidate, extension, to-research, verified) are computed from live data and their sum equals the total entries count.
- **Mode A / Mode B Scenarios:** 3-grade, 4-grade, and 5-grade scenario plans and rotation schedules verified for correctness and contiguity.
- **Student-Count Weighted Rotation:** Confirms weighted allocation gives larger cohorts proportionally more teacher time while guaranteeing all grades get > 0 minutes.

### 7.2 Build Verification
```bash
> tsc --noEmit && vite build
✓ 55 modules transformed.
dist/index.html                   0.65 kB │ gzip:   0.37 kB
dist/assets/index-CY_eORll.css    9.15 kB │ gzip:   2.88 kB
dist/assets/index-TbtIDicj.js   305.65 kB │ gzip: 102.25 kB
✓ built in 6.36s
```

---

## Chapter 8: Evaluation & Field Usability Protocol

> [!NOTE]
> In strict accordance with engineering and academic integrity, no experimental user trial data, SUS scores, or reviewer ratings have been fabricated. The protocols and scorecards below serve as blank templates for execution during upcoming district field trials in rural schools.

### 8.1 Usability Testing Protocol (3 Scenarios)
The field usability trials are structured around three authentic multi-grade teaching scenarios described in `docs/EVALUATION.md`. The data collection template is as follows:

| Scenario | Participant Group | Task Description | Completion Rate | Mean Time on Task | Mean Ease (1–5) | Status |
|---|---|---|:---:|:---:|:---:|:---:|
| **S1: 2-Grade School (G1+G4)** | [TO VERIFY] | Select Water; review peer-buddy plan; print worksheets | [TO VERIFY] | [TO VERIFY] | [TO VERIFY] | Pending field trial |
| **S2: 3-Grade School (G2,G3,G5)** | [TO VERIFY] | Configure 40-min rotation; run Demo timer; identify turns on chime | [TO VERIFY] | [TO VERIFY] | [TO VERIFY] | Pending field trial |
| **S3: 5-Grade School (12 Kids)** | [TO VERIFY] | Add student roster; flag support needs; generate tier sheets; export backup | [TO VERIFY] | [TO VERIFY] | [TO VERIFY] | Pending field trial |

### 8.2 System Usability Scale (SUS) Assessment Template
Upon completing the three scenarios, participants (target: 5 primary educators / trainee teachers) will be administered the standard 10-item System Usability Scale (Brooke, 1996):

| Participant ID | Role / School Context | Raw Score / 100 | Adjective Rating |
|---|---|:---:|:---:|
| Participant 1 | Primary Teacher (Zilla Parishad School) | [TO VERIFY] | [TO VERIFY] |
| Participant 2 | Primary Teacher (Multi-Grade Setting) | [TO VERIFY] | [TO VERIFY] |
| Participant 3 | Teacher Trainee (D.El.Ed / B.Ed) | [TO VERIFY] | [TO VERIFY] |
| Participant 4 | Teacher Trainee (D.El.Ed / B.Ed) | [TO VERIFY] | [TO VERIFY] |
| Participant 5 | Education Field Officer / Volunteer | [TO VERIFY] | [TO VERIFY] |
| **Mean SUS Score** | **Target benchmark: ≥ 68.0** | **[TO VERIFY]** | **[TO VERIFY]** |

### 8.3 Worksheet Pedagogical Quality Review Template
Printed sample worksheets across all 5 grades and 3 tiers will be reviewed by an external primary educator against the 6 evaluation criteria specified in `docs/EVALUATION.md`:
- **Curriculum Fit (1–5):** [TO VERIFY]
- **Difficulty Ladder (1–5):** [TO VERIFY]
- **Language Clarity (1–5):** [TO VERIFY]
- **Independence (1–5):** [TO VERIFY]
- **Correctness (1–5):** [TO VERIFY]
- **Village Context Engagement (1–5):** [TO VERIFY]
- **Mean Overall Reviewer Score:** [TO VERIFY]

---

## Chapter 8B: Implementation Notes & Technical Enhancements

This section outlines technical enhancements and differentiation features implemented across the application:

1. **Trilingual Content Localization (`src/content/curriculum.ts`, `src/types.ts`):**
   - Extended Topic and GradePlan data models with `L10n` / `Localizable` (`Record<Lang, string> | string`), ensuring backward-compatible English fallbacks (`resolveL10n`).
   - Authored complete Marathi and Hindi translations for `evs-water` and `math-market` (outcomes, hooks, teacher steps, independent tasks, materials, questions, answers).
   - Localized word problem generator templates (`NAMES`, `ITEMS`, `SHAPES`).
   - Added Devanagari web font support (`Noto Sans Devanagari`) for both screen and print media stylesheets.

2. **Curriculum Mapping Structure (`docs/CURRICULUM_MAPPING.md`):**
   - Integrated structured curriculum mapping entries (`board`, `textbook`, `chapter`, `status: 'to-verify' | 'verified'`) across all topics and grades.
   - Preserved honest research integrity: all entries marked `to-verify` until verified against physical Maharashtra State Bureau textbooks. Fails tests only if a mapping entry is missing entirely.

3. **First-Time Help & Onboarding (`src/components/Welcome.tsx`):**
   - Created a keyboard-accessible (`Escape` key, focus trapping, `aria-modal`) 3-step walkthrough (Plan, Print, Rotate).
   - Localized into English, Hindi, and Marathi; state persisted in `localStorage`.

4. **Reliability, Resilience & Accessibility:**
   - **React Error Boundary (`src/components/ErrorBoundary.tsx`):** Displays a localized recovery screen with a "Reset Local Data" escape hatch.
   - **Timestamp-Based Rotation Engine (`src/engine/rotation.ts`, `Rotation.tsx`):** Calculates remaining time via pure timestamp comparison (`calculateRemainingMs(targetEndTime, now)`), surviving background tab sleeping and mobile screen locks without double-beeps.
   - **PWA Service Worker Updates (`ReloadPrompt.tsx`):** Prompts teachers when a new version is deployed.
   - **PWA Installation Prompts:** Custom install prompt with explicit iOS Safari instructions (Share > Add to Home Screen).
   - **Accessibility & Low-Motion:** Adheres to 42px touch targets, `aria-live="polite"` timer announcements, and `prefers-reduced-motion` overrides.

5. **Advanced Differentiation Engine:**
   - **Early-Finisher Tasks:** Dedicated extension activities rendered on worksheets and in rotation views.
   - **Two-Pass Rotation:** Optional 2-pass scheduling for longer periods (>= 35 min) to prevent younger grades exceeding unsupervised thresholds.
   - **Teacher Return Checklist:** Context-aware prompts for teachers when revisiting each grade cohort.
   - **Authored Question Tier Rules:** Strict requirement that all static items provide support and stretch variants or declare `sameAcrossTiers: true` with an explicit reason.

6. **Expanded Curriculum Library (9 Units):**
   - Added `math-fractions` (*Fractions & Sharing*) and `evs-animals` (*Animals & Habitats*), both spanning all 5 grades.

7. **Progress Tracker Enhancements (`src/features/Progress.tsx`, `src/db/db.ts`):**
   - Per-student 5-record mastery history drill-down.
   - Grade-level CSV export for record-keeping.
   - One-click undo for status changes.
   - Schema version validation (`version: 1`) on backup imports.

8. **Print Pack & PDF Export:**
   - One-click "Print Pack" rendering lesson rotation schedule and all grade worksheets consecutively with clean page breaks.


---

## Chapter 9: Scope & Out-of-Scope (v1.0)

### 9.1 In Scope
- **Grades 1–5** (Classes 1–5 primary), subjects: Mathematics and EVS (Environmental Studies)
- **9 authored multi-grade topic units** (see Chapter 5) with trilingual content (EN/HI/MR) marked for native-speaker review
- **Offline-first PWA** for Android/desktop tablets (8-inch+); no cloud, no accounts, no analytics
- **Four functional modules**: Session Planner (M1), Worksheet Generator (M2), Rotation Timer (M3), Progress Tracker (M4)
- **Curriculum alignment**: title-match candidate mappings against NCERT Class 1–4 chapter catalogs; all unverified entries marked `to-research`

### 9.2 Explicitly Out of Scope (v1.0)
1. **Grades 6–9 (Upper Primary):** No content, curriculum mapping, or UX for Classes 6–9. The `Grade` TypeScript union type is bounded to `1|2|3|4|5`; extending it to 6–9 is a deliberate v1.1 decision requiring separate curriculum mapping work.
2. **Marathi as a Teaching Subject:** Marathi as a *curriculum subject area* (reading, writing, grammar, poetry) is not modelled in v1.0. The three UI language strings (EN / HI / MR) translate the *interface* only. A dedicated Marathi-language topic with reading-comprehension templates is planned for v1.1.
3. **Custom Teacher-Authored Topics:** Teachers cannot yet define their own topic, questions, or activities. A custom topic builder (stored in IndexedDB) is a v1.1 feature.
4. **Real-Time Multi-Device Sync:** IndexedDB persistence is strictly device-local. Multi-device sync requires manual JSON export/import; Bluetooth/Wi-Fi P2P sync is a future enhancement.
5. **Camera / OCR Worksheet Marking:** Optical character recognition for printed worksheet answers is architecturally deferred.
6. **Empirical Field-Trial Data:** The evaluation protocol in `docs/EVALUATION.md` defines the SUS and pedagogical quality scorecards; all evaluation cells remain `[TO VERIFY]` until the district trial is executed.

### 9.3 Limitations & Known Constraints
1. **Acoustic Noise Bleed Across Grade Stations:** When 3 to 5 grades share a single physical classroom room without partitions, oral reading or partner math practice in independent groups can generate acoustic noise that competes with direct teacher instruction. The app mitigates this with non-verbal tasks (sketches, manipulative counters, written worksheets), but physical layout arrangements remain vital.
2. **Draft Language Translations:** While core UI controls and common prompts are fully translated into Marathi and Hindi, several advanced extension tasks and narrative problem items carry draft translations awaiting formal editorial review by native language educators. The app displays explicit translation review warnings where applicable.
3. **Screen Wake-Lock Hardware & Browser Limits:** The Screen Wake Lock API is supported on modern mobile Chromium browsers (Chrome, Edge) but is unavailable or restricted in older Android WebViews, low-end browsers, or devices with aggressive OS battery saver policies. In such cases, the rotation timer displays a non-intrusive notification reminding teachers to adjust their display timeout manually.
4. **Fixed Pedagogical Weights vs. Adaptive Cohort Sizes:** Baseline rotation time allocation uses age-weighted pedagogy (Grade 1 receives greater teacher touchpoints than Grade 5). While student-count adaptive weighting now incorporates roster size (`TEACHER_WEIGHT[g] * (1 + 0.1 * min(count, 15))`), extreme cohort imbalances in real schools (e.g., 18 first graders and 2 fifth graders) still require manual teacher adjustments via the override controls.
5. **Cross-Device Synchronization:** IndexedDB storage is strictly local to the teacher's individual tablet or laptop. Synchronizing student rosters or records across multiple devices requires manual JSON backup/restore or local wireless synchronization.

### 9.4 Future Enhancements (v1.1+)
- Marathi language subject area with reading-comprehension activity templates and level-differentiated writing prompts (Grades 1–5)
- Custom topic builder: teacher-authored topic and question sets stored in IndexedDB
- Grades 6–9 expansion (Upper Primary; requires separate NCERT/State Board curriculum mapping)
- Browser Web Speech API audio read-aloud for worksheet instructions in Marathi and Hindi
- Adding camera-based optical paper-checking for printed worksheets using local WebAssembly
- Offline peer-to-peer classroom sync via local Wi-Fi or WebRTC data channels for two-teacher schools
- Expanding curriculum repository to 20 topics covering Upper Primary (Classes 6–8)

---

## Chapter 10: Conclusion

The **Multi-Grade Classroom Teaching Assistant** demonstrates how thoughtful software engineering can directly alleviate systemic pedagogical challenges in resource-constrained environments. By combining pedagogical rules, algorithmic differentiation, accessible UI aesthetics, and strict offline-first guarantees, the platform equips single-teacher schools with tools to deliver equitable, organized, and effective multi-grade education.

---

## Appendix
- **Appendix A:** Automated Unit Test Log (62 passing tests across 10 describe suites)
- **Appendix B:** Sample Differentiated Worksheets (`samples/evs-water.html`, `samples/math-market.html`)
- **Appendix C:** System Usability Scale (SUS) Raw Response Scorecards
