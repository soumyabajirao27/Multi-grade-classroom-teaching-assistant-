# Viva & Oral Defense Notes: Curriculum Mapping & Alignment

### Core Question: "How do you know this is mapped to NCERT or any State Board?"

#### Honest, Defensible Answer:
1. **Original Content Built on Foundational Outcomes:**
   All learning outcomes, teacher activities, and practice tasks in the app are **original content** authored specifically for multi-grade classrooms. We do **not** copy text, exercises, illustrations, or stories from NCERT or Balbharati textbooks.
   
2. **Title-Match Candidates vs. Verified Sign-offs:**
   Where current official chapter catalogs are available (such as NCERT Class 1 & 2 *Joyful Mathematics*, Class 3 *Maths Mela*, and Class 3–4 *Our Wondrous World*), topics are mapped as **`candidate`** title matches. They are explicitly marked in both code and UI with a note: *"matched by chapter title only; learning outcome not yet compared"*.

3. **No Fabricated Textbook Information:**
   Where textbooks have not been verified with the physical book in hand—including NCERT Class 5, foundational Class 1–2 EVS, and Maharashtra State Board (*Balbharati*) textbooks—entries are strictly marked **`status: 'to-research'`** with chapter titles labeled `TO RESEARCH`. We never invent chapter names, numbers, page ranges, or edition years.

4. **Multi-Grade Extension Content:**
   In cases where a multi-grade topic does not have a 1-to-1 chapter counterpart in the national textbook for that specific grade, it is classified as **`status: 'extension'`** (e.g. multi-grade village water auditing or village market calculations designed to keep younger and older cohorts synchronously engaged).

5. **Visible Verification Protocol & Status Badges:**
   Every single grade card in the Planner displays a visible status badge (`Candidate`, `Extension`, `To Research`, or `Verified by <Name>`). Furthermore, the app provides a full **Curriculum Coverage Matrix** modal and CSV export with real-time computed statistics:
   - **Candidate Mappings:** 20
   - **Verified Mappings:** 0 (requires manual reviewer sign-off with `verifiedBy` and `verifiedOn`)
   - **Extension Content:** 6
   - **To Research:** 94
   - **Total Evaluated Entries:** 120

6. **The Verification Protocol (What is needed for 'Verified'):**
   Transitioning any entry to `'verified'` requires an educator or researcher to:
   - Obtain the physical or authorized digital PDF from *ncert.nic.in* or *ebalbharati.in*.
   - Verify the exact chapter number, title, and page range.
   - Compare the pedagogical learning outcomes.
   - Record the reviewer's name (`verifiedBy`) and date (`verifiedOn`).
   Automated unit tests enforce that missing any of these fields causes build and test failures immediately.

---

### Common Scope Questions

#### Q: "Why only Grades 1–5? Why not Grades 6–8?"
**Defensible Answer:**
Grades 1–5 map to the NIPUN Bharat / FLN (Foundational Literacy & Numeracy) mandate for primary classrooms — the tier where single-teacher multi-grade rooms are most common in rural India. Grades 6–9 require a separate curriculum mapping exercise (different NCERT textbook series, different cognitive task design, and a different subject-specialist review). These are deferred to v1.1 to keep v1.0 well-scoped and demoed on a single, realistic use-case.

#### Q: "Why is there no Marathi language subject (reading/writing) topic?"
**Defensible Answer:**
The app translates its *interface* into Marathi (UI strings, activity instructions, word-problem generators) — but Marathi as a *curriculum subject area* (reading comprehension, grammar, script-level scaffolding) requires a fundamentally different content type: text passages, fill-in-the-blank sentences, and dictation. Designing and verifying those with a native Marathi primary teacher is planned for v1.1. In v1.0, the `Subject` union is `'math' | 'evs'`; adding `'lang'` requires new generators and reviewed content that cannot be invented.

#### Q: "Can teachers add their own topics or custom questions?"
**Defensible Answer:**
Not in v1.0. The topic list is authored and fully tested; freeform teacher input would bypass tier-differentiation and curriculum-mapping guarantees enforced by the test suite. A custom topic builder storing teacher-authored topics in IndexedDB is the first v1.1 milestone. The `Topic` and `GradePlan` TypeScript interfaces are designed to accommodate it.

#### Q: "How many automated tests exist and what do they cover?"
**Defensible Answer:**
62 Vitest tests across 10 `describe` suites: RNG determinism, content library integrity, worksheet arithmetic, session planner edge cases, shape and time generators, curriculum mapping schema and coverage counts, content differentiation rules, accessibility/contrast, theme resolution, topic title cleaning, rotation timing, and multi-grade Mode A + Mode B scenarios.
