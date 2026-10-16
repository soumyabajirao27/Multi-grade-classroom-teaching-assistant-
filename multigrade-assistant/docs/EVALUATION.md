# Evaluation plan

## A. Usability test: 3 mock multi-grade scenarios
Participants: 3-5 teachers or education students. Think-aloud, one scenario each, tablet or laptop. Record time on task, errors, and a 1-5 ease rating per task. Finish with the SUS questionnaire.

| # | Scenario | Tasks | Success criterion |
|---|---|---|---|
| S1 | **Two-grade school (G1 + G4), 30-min period**, topic: Water | Pick topic and grades; read the plan; find the peer buddy; print worksheets | Done in under 3 min without help |
| S2 | **Three grades (G2, G3, G5), 40-min period**, topic: Numbers in the Market | Build the rotation; start the timer in Demo mode; explain whose turn it is when the beep sounds | Teacher states the current grade correctly at every beep |
| S3 | **Five grades (G1-G5), 45-min period, 12 children** | Add children; mark 3 as "needs help"; regenerate worksheets; check that level-wise sheets appear; export backup | Support-level sheets appear for the 3 children; backup downloads |

Metrics: task completion rate, time on task, error count, ease rating (1-5), SUS score (target >= 68).

## B. Worksheet-quality review (teacher / education reviewer)
Give the reviewer the printed samples (`samples/`, one per grade and tier). Score each item 1-5:

| Criterion | Question |
|---|---|
| Curriculum fit | Does the item match the grade's learning outcome? |
| Difficulty ladder | Is Grade n+1 clearly harder than Grade n; support easier than stretch? |
| Language clarity | Could the child read it without help? |
| Independence | Can the child do it with no teacher input? |
| Correctness | Is the answer key right? |
| Engagement | Does it use familiar village context? |

Report mean per criterion and list every item scored <= 2 with the fix made. Re-run after fixes.

## C. Automated checks
`npm test` enforces 46 automated unit test specifications across the teaching engine and accessibility contract:
1. Deterministic RNG reproducibility across seeds.
2. Answer-key arithmetic correctness over 480 generated sheets.
3. Regrouping & difficulty tier invariant (support operands < stretch operands).
4. Peer-buddy assignment logic and edge cases.
5. Rotation slot largest-remainder tiling and equitable weighting.
6. Pure timestamp-based rotation timer countdown calculations.
7. Two-pass rotation scheduling for extended periods.
8. Trilingual fallback integrity: all localized fields provide non-empty English fallbacks.
9. Cross-language worksheet compilation across all 5 grades, 3 tiers, and 3 languages (English, Hindi, Marathi).
10. Complete trilingual coverage for all 10 topics and generator frames in English, Hindi, and Marathi.
11. Curriculum mapping structural presence and validity across 120 NCERT and Maharashtra State Board records.
12. Strict `sameAcrossTiers` enforcement: every static item without variants must be `kind: 'draw'` and have a non-generic pedagogical `sameReason`.
13. Tier differentiation invariant across every topic and grade: support sheet strictly easier than stretch (shorter prompts, smaller numbers, or visual scaffolding present) and stretch marks >= core marks.
14. Early finisher and teacher return checklist presence for all grades.
15. Student mastery tier progression recommendations.
16. Accessibility & contrast contract: WCAG AA luminance ratios (> 4.5:1) for both light and dark modes, and CSS rules enforcing >= 44 px touch targets on mobile/tablet viewports.
17. Custom topic validation engine tests: pure schema checking, 10+ failure modes, tier differentiation enforcement, bounded string/file size, and backup round-trip compatibility.

## D. Research & Evaluation Integrity Policy
In strict compliance with project honesty rules:
- No usability metrics, completion times, error counts, or SUS scores are fabricated. Sections A and B represent structured protocols and instruments designed for field trials; all numeric metrics remain explicitly **TO VERIFY** until live classroom trials with ZP teachers are conducted.
- Native speaker review of Hindi and Marathi translations is tracked explicitly in code via `reviewed: { en: true, hi: false, mr: false }` and surfaced via prominent UI warning badges until formal bilingual educator sign-off is completed.


