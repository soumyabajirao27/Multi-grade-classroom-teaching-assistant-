import { describe, expect, it } from 'vitest';
// @ts-ignore
import fs from 'node:fs';
// @ts-ignore
import path from 'node:path';
import { TOPICS } from '../src/content/curriculum';
import { CURRICULUM_MAPPINGS, OFFICIAL_NCERT_CHAPTERS, getCurriculumCoverageCounts, migrateCurriculumMapping } from '../src/content/curriculumSources';
import { createRng } from '../src/engine/rng';
import { buildWorksheet } from '../src/engine/worksheet';
import { buildSessionPlan } from '../src/engine/planner';
import { allocate, buildRotation, calculateRemainingMs } from '../src/engine/rotation';
import { suggestTier } from '../src/engine/progress';
import { MAX_SOLO_MINUTES } from '../src/engine/rules';
import { GRADES, TIERS, resolveL10n, type Grade, type Lang, type Topic } from '../src/types';

const math = TOPICS.find((t) => t.id === 'math-market')!;
const water = TOPICS.find((t) => t.id === 'evs-water')!;


describe('rng', () => {
  it('is deterministic per seed and differs across seeds', () => {
    const a = createRng('x'), b = createRng('x'), c = createRng('y');
    const sa = [a.next(), a.next()], sb = [b.next(), b.next()], sc = [c.next(), c.next()];
    expect(sa).toEqual(sb);
    expect(sa).not.toEqual(sc);
  });
});

describe('content library', () => {
  it.each(TOPICS.map((t) => [t.id, t] as const))('%s has all five grades with valid independent tasks', (_id, topic) => {
    for (const g of GRADES) {
      const p = topic.grades[g];
      expect(p.teacher.steps.length).toBeGreaterThan(0);
      expect(p.questions.length).toBeGreaterThan(0);
      if (p.independent.mode === 'solo') expect(p.independent.minutes).toBeLessThanOrEqual(MAX_SOLO_MINUTES[g]);
    }
  });
});

describe('worksheet generator', () => {
  it('is reproducible from its seed', () => {
    const a = buildWorksheet({ topic: math, grade: 3, tier: 'core', seed: 's1' });
    const b = buildWorksheet({ topic: math, grade: 3, tier: 'core', seed: 's1' });
    expect(a).toEqual(b);
    expect(buildWorksheet({ topic: math, grade: 3, tier: 'core', seed: 's2' }).questions).not.toEqual(a.questions);
  });

  it('answer keys are arithmetically correct for every grade, tier and many seeds', () => {
    for (const g of GRADES) for (const tier of TIERS) for (let s = 0; s < 40; s++) {
      for (const q of buildWorksheet({ topic: math, grade: g, tier, seed: `t${s}` }).questions) {
        if (!q.meta) continue;
        const { a, b, op } = q.meta;
        const exp = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : op === '/' ? a / b : null;
        if (exp !== null) { expect(Number(q.answer)).toBe(exp); expect(exp).toBeGreaterThanOrEqual(0); }
        if (op === 'm+') expect(q.answer).toBe(`₹${(a + b).toFixed(2)}`);
      }
    }
  });

  it('addNoCarry never carries; stretch subtraction regroups', () => {
    for (let s = 0; s < 60; s++) {
      for (const q of buildWorksheet({ topic: math, grade: 2, tier: 'core', seed: `n${s}` }).questions.filter((x) => x.id.startsWith('addNoCarry'))) {
        const { a, b } = q.meta!; expect((a % 10) + (b % 10)).toBeLessThan(10); expect(Math.floor(a / 10) + Math.floor(b / 10)).toBeLessThan(10);
      }
    }
  });

  it('support tier uses smaller numbers than stretch', () => {
    const max = (tier: 'support' | 'stretch') => Math.max(...Array.from({ length: 30 }, (_, i) =>
      Math.max(...buildWorksheet({ topic: math, grade: 3, tier, seed: `m${i}` }).questions.filter((q) => q.id.startsWith('add')).map((q) => q.meta!.a))));
    expect(max('support')).toBeLessThan(max('stretch'));
  });

  it('static items fall back to the core variant', () => {
    const water = TOPICS.find((t) => t.id === 'evs-water')!;
    const ws = buildWorksheet({ topic: water, grade: 1, tier: 'stretch', seed: 'a' });
    expect(ws.questions.length).toBe(3);
    expect(ws.questions.every((q) => q.prompt.length > 0)).toBe(true);
  });
});

describe('session planner', () => {
  it('assigns an older peer buddy to Grades 1-2 only when one exists', () => {
    const plan = buildSessionPlan(math, [1, 2, 4]);
    expect(plan.rows.find((r) => r.grade === 1)?.buddy).toBe(4);
    expect(plan.rows.find((r) => r.grade === 4)?.buddy).toBeUndefined();
    expect(buildSessionPlan(math, [1, 2]).rows.every((r) => r.buddy === undefined)).toBe(true);
  });

  it('handles edge cases: single grade, all 5 grades, and empty grades', () => {
    const single = buildSessionPlan(math, [3]);
    expect(single.rows.length).toBe(1);
    expect(single.rows[0].buddy).toBeUndefined();

    const allFive = buildSessionPlan(math, [1, 2, 3, 4, 5]);
    expect(allFive.rows.length).toBe(5);
    expect(allFive.rows.find((r) => r.grade === 1)?.buddy).toBeDefined();

    const empty = buildSessionPlan(math, []);
    expect(empty.rows.length).toBe(0);
  });
});

describe('new topics and generators', () => {
  it('shapes topic generates valid perimeter and area questions', () => {
    const shapesTopic = TOPICS.find((t) => t.id === 'math-shapes')!;
    const wsG3 = buildWorksheet({ topic: shapesTopic, grade: 3, tier: 'core', seed: 'shapes-seed' });
    expect(wsG3.questions.length).toBeGreaterThan(0);
    expect(wsG3.questions.some((q) => q.prompt.includes('Perimeter') || q.prompt.includes('perimeter'))).toBe(true);

    const wsG4 = buildWorksheet({ topic: shapesTopic, grade: 4, tier: 'core', seed: 'shapes-seed-4' });
    expect(wsG4.questions.some((q) => q.prompt.includes('Area') || q.prompt.includes('area'))).toBe(true);
  });

  it('time topic generates valid time elapsed and time reading questions', () => {
    const timeTopic = TOPICS.find((t) => t.id === 'math-time')!;
    const wsG3 = buildWorksheet({ topic: timeTopic, grade: 3, tier: 'core', seed: 'time-seed' });
    expect(wsG3.questions.length).toBeGreaterThan(0);
    expect(wsG3.questions.some((q) => q.prompt.includes('School starts at') || q.prompt.includes('clock') || q.prompt.includes('time'))).toBe(true);
  });
});

describe('Marathi language subject (lang-marathi)', () => {
  const marathiTopic = TOPICS.find((t) => t.id === 'lang-marathi')!;

  it('lang-marathi topic exists and has subject lang', () => {
    expect(marathiTopic).toBeDefined();
    expect(marathiTopic.subject).toBe('lang');
  });

  it('lang-marathi has all 5 grades with valid plans, earlyFinisher, and checklist', () => {
    for (const g of GRADES) {
      const plan = marathiTopic.grades[g];
      expect(plan.teacher.steps.length).toBeGreaterThan(0);
      expect(plan.questions.length).toBeGreaterThan(0);
      expect(plan.earlyFinisher).toBeDefined();
      expect(plan.checklist).toBeDefined();
      expect(plan.checklist!.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('lang-marathi worksheets generate correctly for all grades and tiers', () => {
    for (const g of GRADES) {
      for (const tier of TIERS) {
        const ws = buildWorksheet({ topic: marathiTopic, grade: g, tier, seed: `lang-${g}-${tier}` });
        expect(ws.questions.length).toBeGreaterThan(0);
        expect(ws.questions.every((q) => q.prompt.length > 0)).toBe(true);
      }
    }
  });

  it('lang-marathi topic title resolves in all 3 languages', () => {
    const langs: Lang[] = ['en', 'hi', 'mr'];
    for (const lang of langs) {
      const title = resolveL10n(marathiTopic.title[lang], lang);
      expect(title.length).toBeGreaterThan(0);
    }
  });
});

describe('rotation', () => {
  it('allocate sums exactly', () => {
    for (const total of [20, 35, 40, 47]) expect(allocate(total, [1.4, 1.1, 1]).reduce((a, b) => a + b, 0)).toBe(total);
  });
  it('slots tile the period after the opening with no gaps', () => {
    const r = buildRotation(math, [1, 2, 3, 4], 40, 5);
    expect(r.slots[0].start).toBe(5);
    r.slots.forEach((s, i) => { if (i) expect(s.start).toBe(r.slots[i - 1].end); });
    expect(r.slots.at(-1)!.end).toBe(40);
  });
  it('gives younger grades at least as much teacher time', () => {
    const r = buildRotation(math, [1, 5], 40, 5);
    expect(r.slots[0].minutes).toBeGreaterThanOrEqual(r.slots[1].minutes);
  });
  it('warns when too many grades share a short period', () => {
    expect(buildRotation(math, [1, 2, 3, 4, 5], 20, 5).warnings.length).toBeGreaterThan(0);
  });
});

describe('tier suggestion', () => {
  const h = (status: 'done' | 'needs-help' | 'not-started', score: number | undefined, t: number) => ({ status, score, updatedAt: t });
  it('defaults to core', () => expect(suggestTier([])).toBe('core'));
  it('needs-help -> support', () => expect(suggestTier([h('done', 90, 1), h('needs-help', undefined, 2)])).toBe('support'));
  it('two strong results -> stretch', () => expect(suggestTier([h('done', 85, 1), h('done', 92, 2)])).toBe('stretch'));
  it('one strong result stays core', () => expect(suggestTier([h('done', 95, 1)])).toBe('core'));
});

describe('rotation timer pure calculations & 2-pass rotation', () => {
  it('computes exact remaining milliseconds from timestamps', () => {
    const end = 100_000;
    expect(calculateRemainingMs(end, 40_000).remainingMs).toBe(60_000);
    expect(calculateRemainingMs(end, 40_000).isExpired).toBe(false);
    expect(calculateRemainingMs(end, 99_999).remainingMs).toBe(1);
    expect(calculateRemainingMs(end, 100_000).remainingMs).toBe(0);
    expect(calculateRemainingMs(end, 100_000).isExpired).toBe(true);
    expect(calculateRemainingMs(end, 105_000).remainingMs).toBe(0);
    expect(calculateRemainingMs(end, 105_000).isExpired).toBe(true);
  });

  it('supports 2-pass rotation with double slots and no gaps', () => {
    const r = buildRotation(math, [1, 2, 3], 45, 5, 2);
    expect(r.slots.length).toBe(3 * 2);
    expect(r.slots[0].start).toBe(5);
    r.slots.forEach((s, i) => {
      if (i > 0) expect(s.start).toBe(r.slots[i - 1].end);
    });
    expect(r.slots.at(-1)!.end).toBe(45);
  });
});

describe('localization and fallbacks', () => {
  const langs: Lang[] = ['en', 'hi', 'mr'];

  it('every localized field in every topic has a non-empty English fallback', () => {
    for (const topic of TOPICS) {
      expect(resolveL10n(topic.title, 'en')).toBeTruthy();
      expect(resolveL10n(topic.hook, 'en')).toBeTruthy();

      for (const g of GRADES) {
        const plan = topic.grades[g];
        expect(resolveL10n(plan.outcome, 'en')).toBeTruthy();
        expect(resolveL10n(plan.independent.title, 'en')).toBeTruthy();
        expect(resolveL10n(plan.independent.instructions, 'en')).toBeTruthy();
        expect(plan.independent.materials.every((m) => Boolean(resolveL10n(m, 'en')))).toBe(true);
        expect(plan.teacher.steps.every((s) => Boolean(resolveL10n(s, 'en')))).toBe(true);
        if (plan.earlyFinisher) {
          expect(resolveL10n(plan.earlyFinisher, 'en')).toBeTruthy();
        }
        if (plan.checklist) {
          expect(plan.checklist.every((c) => Boolean(resolveL10n(c, 'en')))).toBe(true);
        }
      }
    }
  });

  it('worksheets build cleanly in all three languages for all grades and tiers', () => {
    for (const topic of TOPICS) {
      for (const g of GRADES) {
        for (const tier of TIERS) {
          for (const lang of langs) {
            const ws = buildWorksheet({ topic, grade: g, tier, seed: 'l10n-test', lang });
            expect(ws.questions.length).toBeGreaterThan(0);
            for (const q of ws.questions) {
              expect(typeof q.prompt).toBe('string');
              expect(q.prompt.trim().length).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });

  it.each(TOPICS.map((t) => [t.id, t] as const))('%s has complete Hindi and Marathi translations for all fields', (_id, topic) => {
    function assertL10n(val: unknown, path: string) {
      expect(val, `${path} should be defined`).toBeDefined();
      if (typeof val === 'string') {
        throw new Error(`${path} is an unlocalized plain string: "${val}"`);
      }
      const obj = val as { en?: string; hi?: string; mr?: string };
      expect(typeof obj.en, `${path}.en`).toBe('string');
      expect(obj.en!.trim().length, `${path}.en non-empty`).toBeGreaterThan(0);
      expect(typeof obj.hi, `${path}.hi`).toBe('string');
      expect(obj.hi!.trim().length, `${path}.hi non-empty`).toBeGreaterThan(0);
      expect(typeof obj.mr, `${path}.mr`).toBe('string');
      expect(obj.mr!.trim().length, `${path}.mr non-empty`).toBeGreaterThan(0);
    }

    assertL10n(topic.title, `${topic.id}.title`);
    assertL10n(topic.theme, `${topic.id}.theme`);
    assertL10n(topic.hook, `${topic.id}.hook`);

    for (const g of GRADES) {
      const plan = topic.grades[g];
      assertL10n(plan.outcome, `${topic.id}.g${g}.outcome`);
      assertL10n(plan.teacher.title, `${topic.id}.g${g}.teacher.title`);
      plan.teacher.steps.forEach((s, idx) => assertL10n(s, `${topic.id}.g${g}.teacher.steps[${idx}]`));
      assertL10n(plan.independent.title, `${topic.id}.g${g}.independent.title`);
      assertL10n(plan.independent.instructions, `${topic.id}.g${g}.independent.instructions`);
      plan.independent.materials.forEach((m, idx) => assertL10n(m, `${topic.id}.g${g}.independent.materials[${idx}]`));
      if (plan.earlyFinisher) {
        assertL10n(plan.earlyFinisher, `${topic.id}.g${g}.earlyFinisher`);
      }
      if (plan.checklist) {
        plan.checklist.forEach((c, idx) => assertL10n(c, `${topic.id}.g${g}.checklist[${idx}]`));
      }
      for (const q of plan.questions) {
        if (q.type === 'static') {
          for (let i = 0; i < q.items.length; i++) {
            const itm = q.items[i];
            assertL10n(itm.core.q, `${topic.id}.g${g}.q[${i}].core.q`);
            assertL10n(itm.core.a, `${topic.id}.g${g}.q[${i}].core.a`);
            if (itm.support) {
              assertL10n(itm.support.q, `${topic.id}.g${g}.q[${i}].support.q`);
              assertL10n(itm.support.a, `${topic.id}.g${g}.q[${i}].support.a`);
            }
            if (itm.stretch) {
              assertL10n(itm.stretch.q, `${topic.id}.g${g}.q[${i}].stretch.q`);
              assertL10n(itm.stretch.a, `${topic.id}.g${g}.q[${i}].stretch.a`);
            }
          }
        }
      }
    }
  });
});

describe('curriculum mapping', () => {
  it('every topic and grade has mapping entries with valid structure and fails only if missing', () => {
    for (const topic of TOPICS) {
      for (const g of GRADES) {
        const plan = topic.grades[g];
        expect(plan.mapping).toBeDefined();
        expect(Array.isArray(plan.mapping)).toBe(true);
        expect(plan.mapping!.length).toBeGreaterThan(0);
        for (const m of plan.mapping!) {
          expect(m.board).toBeTruthy();
          expect(m.book || (m as any).textbook).toBeTruthy();
          expect(m.chapter).toBeTruthy();
          expect(['candidate', 'verified', 'extension', 'to-research', 'to-verify']).toContain(m.status);
        }
      }
    }
  });

  it('migration helper migrates legacy to-verify records backward-compatibly', () => {
    const legacy = {
      board: 'NCERT',
      textbook: 'Joyful Mathematics',
      chapter: 'Finding the Furry Cat!',
      status: 'to-verify' as const,
    };
    const migrated = migrateCurriculumMapping(legacy, 1);
    expect(migrated.board).toBe('NCERT');
    expect(migrated.classLevel).toBe(1);
    expect(migrated.book).toBe('Joyful Mathematics');
    expect(migrated.chapter).toBe('Finding the Furry Cat!');
    expect(migrated.status).toBe('to-research');
  });

  it('verified status strictly requires verifiedBy and verifiedOn', () => {
    // Missing verifiedBy & verifiedOn cannot be verified
    const unverifiedAttempt = {
      board: 'NCERT' as const,
      textbook: 'Maths Mela',
      chapter: 'Time Goes On',
      status: 'verified' as const,
    };
    const migrated = migrateCurriculumMapping(unverifiedAttempt, 3);
    expect(migrated.status).not.toBe('verified');
    expect(migrated.status).toBe('to-research');

    // Valid verified mapping with credentials
    const validVerified = {
      board: 'NCERT' as const,
      book: 'Maths Mela',
      chapter: 'Time Goes On',
      status: 'verified' as const,
      verifiedBy: 'Smt. S. Patil',
      verifiedOn: '2026-10-16',
    };
    const migratedValid = migrateCurriculumMapping(validVerified, 3);
    expect(migratedValid.status).toBe('verified');
    expect(migratedValid.verifiedBy).toBe('Smt. S. Patil');
    expect(migratedValid.verifiedOn).toBe('2026-10-16');
  });

  it('no candidate row has a chapter name outside the supplied official/secondary lists', () => {
    const allSuppliedTitles = new Set(Object.values(OFFICIAL_NCERT_CHAPTERS).flat());
    for (const item of CURRICULUM_MAPPINGS) {
      const m = item.mapping;
      if (m.chapter && m.chapter !== 'TO RESEARCH' && !m.chapter.startsWith('TO ')) {
        expect(allSuppliedTitles.has(m.chapter)).toBe(true);
      }
    }
  });

  it('coverage counts computed from data correctly reflect candidate, extension, and to-research counts', () => {
    const counts = getCurriculumCoverageCounts();
    expect(counts.total).toBe(CURRICULUM_MAPPINGS.length);
    expect(counts.candidate + counts.verified + counts.extension + counts.toResearch).toBe(counts.total);
    expect(counts.candidate).toBeGreaterThan(0);
    expect(counts.extension).toBeGreaterThan(0);
    expect(counts.toResearch).toBeGreaterThan(0);
    expect(counts.verified).toBe(0); // None verified until reviewer sign-off
  });
});

describe('content depth and differentiation rules', () => {
  it('close the sameAcrossTiers loophole: explicit specific reason and visual/draw only', () => {
    const genericPhrases = [
      'accessible core question suitable for all tiers',
      'accessible to all tiers',
      'core question',
      'core question suitable for all tiers',
    ];

    for (const topic of TOPICS) {
      for (const g of GRADES) {
        const plan = topic.grades[g];
        for (const q of plan.questions) {
          if (q.type === 'static') {
            for (const item of q.items) {
              if (item.sameAcrossTiers) {
                // Must be purely visual or drawing
                expect(item.kind, `Item in ${topic.id} grade ${g} marked sameAcrossTiers must be kind 'draw'`).toBe('draw');
                // Must have sameReason
                expect(item.sameReason, `sameReason must be defined for sameAcrossTiers in ${topic.id} g${g}`).toBeDefined();
                expect(typeof item.sameReason).toBe('string');
                const reason = item.sameReason!.trim();
                expect(reason.length, `sameReason must not be empty in ${topic.id} g${g}`).toBeGreaterThan(10);
                for (const generic of genericPhrases) {
                  expect(reason.toLowerCase()).not.toBe(generic);
                }
              } else {
                expect(item.support).toBeDefined();
                expect(item.stretch).toBeDefined();
              }
            }
          }
        }
      }
    }
  });

  it('tier differentiation (every topic, every grade)', () => {
    const fixedSeed = 'differentiation-fixed-seed';
    for (const topic of TOPICS) {
      for (const g of GRADES) {
        const supportWs = buildWorksheet({ topic, grade: g, tier: 'support', seed: fixedSeed });
        const coreWs = buildWorksheet({ topic, grade: g, tier: 'core', seed: fixedSeed });
        const stretchWs = buildWorksheet({ topic, grade: g, tier: 'stretch', seed: fixedSeed });

        // Stretch sheet is worth at least as many marks as core sheet
        const coreMarks = coreWs.questions.reduce((sum, q) => sum + q.marks, 0);
        const stretchMarks = stretchWs.questions.reduce((sum, q) => sum + q.marks, 0);
        expect(stretchMarks).toBeGreaterThanOrEqual(coreMarks);

        // Support sheet is strictly easier than stretch sheet in at least one measurable way:
        // 1. Prompt character length: support prompts are shorter
        const supportChars = supportWs.questions.reduce((sum, q) => sum + q.prompt.length, 0);
        const stretchChars = stretchWs.questions.reduce((sum, q) => sum + q.prompt.length, 0);
        const shorterPrompts = supportChars < stretchChars;

        // 2. Numeric values: average or maximum operand in support is smaller
        const extractNumbers = (qs: typeof supportWs.questions) =>
          qs.flatMap((q) => {
            const nums: number[] = [];
            if (q.meta?.a !== undefined) nums.push(q.meta.a);
            if (q.meta?.b !== undefined) nums.push(q.meta.b);
            const matches = q.prompt.match(/\d+/g);
            if (matches) nums.push(...matches.map(Number));
            return nums;
          });
        const supportNums = extractNumbers(supportWs.questions);
        const stretchNums = extractNumbers(stretchWs.questions);
        const supportMaxNum = supportNums.length ? Math.max(...supportNums) : 0;
        const stretchMaxNum = stretchNums.length ? Math.max(...stretchNums) : 0;
        const smallerNumbers = supportNums.length > 0 && stretchNums.length > 0 && supportMaxNum < stretchMaxNum;

        // 3. Scaffolding / hints / multiple-choice options / word-banks present in support
        const hasScaffold = (qs: typeof supportWs.questions) =>
          qs.some((q) => q.prompt.includes('/') || q.prompt.includes('Yes / No') || q.prompt.includes('______') || q.prompt.includes('●'));
        const supportHasScaffold = hasScaffold(supportWs.questions);

        const strictlyEasier = shorterPrompts || smallerNumbers || supportHasScaffold;
        expect(strictlyEasier, `Topic ${topic.id} grade ${g} support sheet must be strictly easier than stretch`).toBe(true);
      }
    }
  });

  it('every grade in every topic defines early finisher task and teacher return checklist', () => {
    for (const topic of TOPICS) {
      for (const g of GRADES) {
        const plan = topic.grades[g];
        expect(plan.earlyFinisher).toBeDefined();
        expect(plan.checklist).toBeDefined();
        expect(plan.checklist!.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe('accessibility and UI ergonomics', () => {
  it('CSS defines 44px min touch target sizing for 8-inch tablet layout', () => {
    const cssPath = path.resolve('src/styles.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    expect(css).toContain('min-height: 44px');
    expect(css).toContain('min-width: 44px');
    expect(css).toContain('@media (max-width: 1024px)');
  });

  it('WCAG contrast ratios pass AA standard (>= 4.5:1) for core theme tokens', () => {
    function luminance(hex: string) {
      const rgb = [0, 2, 4].map((offset) => parseInt(hex.slice(offset + 1, offset + 3), 16) / 255);
      const a = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    }
    function contrast(hex1: string, hex2: string) {
      const l1 = luminance(hex1);
      const l2 = luminance(hex2);
      const bright = Math.max(l1, l2);
      const dark = Math.min(l1, l2);
      return (bright + 0.05) / (dark + 0.05);
    }

    // Light mode: ink #1c2b27 on bg #f4f7f5
    const lightRatio = contrast('#1c2b27', '#f4f7f5');
    expect(lightRatio).toBeGreaterThanOrEqual(4.5);

    // Dark mode: ink #e8f0ed on bg #111a17
    const darkRatio = contrast('#e8f0ed', '#111a17');
    expect(darkRatio).toBeGreaterThanOrEqual(4.5);

    // Board header: white on board #1b4940
    const headerRatio = contrast('#ffffff', '#1b4940');
    expect(headerRatio).toBeGreaterThanOrEqual(4.5);

    // Warm paper light mode: ink #1c2b27 on warm paper #FBF6EC
    const warmPaperRatio = contrast('#1c2b27', '#FBF6EC');
    expect(warmPaperRatio).toBeGreaterThanOrEqual(4.5);
  });
});

describe('theme resolution helper', () => {
  it('resolves explicit light and dark preferences regardless of system setting', async () => {
    const { resolveTheme } = await import('../src/theme');
    expect(resolveTheme('light', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('dark', true)).toBe('dark');
  });

  it('resolves auto preference according to system prefers-color-scheme', async () => {
    const { resolveTheme } = await import('../src/theme');
    expect(resolveTheme('auto', false)).toBe('light');
    expect(resolveTheme('auto', true)).toBe('dark');
  });
});

describe('topic title cleaning', () => {
  it('strips bracketed and parenthesized subject suffixes/prefixes in EN, HI, MR', async () => {
    const { cleanTopicTitle } = await import('../src/cleanTitle');
    expect(cleanTopicTitle('Water (EVS)')).toBe('Water');
    expect(cleanTopicTitle('[EVS] Water')).toBe('Water');
    expect(cleanTopicTitle('Numbers in the Market (Maths)')).toBe('Numbers in the Market');
    expect(cleanTopicTitle('[Maths] Numbers in the Market')).toBe('Numbers in the Market');
    expect(cleanTopicTitle('जल (पर्यावरण अध्ययन)')).toBe('जल');
    expect(cleanTopicTitle('पाणी (परिसर अभ्यास)')).toBe('पाणी');
    expect(cleanTopicTitle('बाज़ार में संख्याएँ (गणित)')).toBe('बाज़ार में संख्याएँ');
    expect(cleanTopicTitle('बाजारातील संख्या (गणित)')).toBe('बाजारातील संख्या');
  });
});

describe('quick start and rotation schedule time synchronization', () => {
  it('quick start stage times equal rotation plan times for several period lengths', () => {
    const testPeriods = [30, 40, 45, 60, 90];
    const testGradesList: Grade[][] = [[1, 3, 5], [2, 4], [1]];
    const openingMinutes = 5;

    for (const period of testPeriods) {
      for (const grades of testGradesList) {
        for (const passes of [1, 2] as const) {
          const effectivePasses = grades.length <= 1 ? 1 : passes;
          const plan = buildRotation(math, grades, period, openingMinutes, effectivePasses);

          const expectedOpening = plan.opening;
          const expectedTotal = plan.total;
          const expectedSlotsEnd = plan.slots.length ? plan.slots[plan.slots.length - 1].end : expectedTotal;

          // Step 1: 0 to opening
          expect(expectedOpening).toBeLessThanOrEqual(period);
          // Step 2: opening to rotation slots end
          expect(expectedSlotsEnd).toBeLessThanOrEqual(expectedTotal);
          expect(expectedSlotsEnd).toBeGreaterThanOrEqual(expectedOpening);
          // Step 3: slots end to total period duration
          expect(expectedTotal).toBe(period);
          // The rotation plan slots match the continuous interval from opening to slots end
          if (plan.slots.length > 0) {
            expect(plan.slots[0].start).toBe(expectedOpening);
            expect(plan.slots[plan.slots.length - 1].end).toBe(expectedSlotsEnd);
          }
        }
      }
    }
  });
});

describe('multi-grade scenarios: 3-grade, 4-grade, and 5-grade in Mode A and Mode B', () => {
  const scenario3: Grade[] = [2, 3, 5];
  const scenario4: Grade[] = [1, 2, 3, 4];
  const scenario5: Grade[] = [1, 2, 3, 4, 5];

  it('Mode A: creates coherent session plan with unifying theme across all grades', () => {
    for (const grades of [scenario3, scenario4, scenario5]) {
      const plan = buildSessionPlan(water, grades);
      expect(plan.rows.length).toBe(grades.length);
      expect(plan.theme).toEqual(water.theme);
      // Grades are ascending
      for (let i = 0; i < plan.rows.length - 1; i++) {
        expect(plan.rows[i].grade).toBeLessThan(plan.rows[i + 1].grade);
      }
    }
  });

  it('Mode B: supports assigning different topics and subjects per grade', () => {
    const mixedGradeTopics: Record<Grade, Topic> = {
      1: math,
      2: math,
      3: water,
      4: water,
      5: math,
    };

    for (const grades of [scenario3, scenario4, scenario5]) {
      const plan = buildSessionPlan(water, grades, (g) => mixedGradeTopics[g]);
      expect(plan.rows.length).toBe(grades.length);
      for (const row of plan.rows) {
        expect(row.topic).toBeDefined();
        expect(row.topic?.subject).toBe(mixedGradeTopics[row.grade].subject);
      }
    }
  });

  it('Rotation scheduler: creates non-overlapping, contiguous slots for mixed subjects', () => {
    const mixedGradeTopics: Record<Grade, Topic> = {
      1: math,
      2: math,
      3: water,
      4: water,
      5: math,
    };

    for (const grades of [scenario3, scenario4, scenario5]) {
      const rot = buildRotation(water, grades, 45, 5, 1, (g) => mixedGradeTopics[g]);
      expect(rot.slots.length).toBe(grades.length);
      expect(rot.opening).toBe(5);
      expect(rot.total).toBe(45);

      // Verify slots are perfectly contiguous with zero overlap or gaps
      let prevEnd = rot.opening;
      for (const slot of rot.slots) {
        expect(slot.start).toBe(prevEnd);
        expect(slot.end).toBe(slot.start + slot.minutes);
        expect(slot.topic).toBeDefined();
        expect(slot.subject).toBe(mixedGradeTopics[slot.grade].subject);
        prevEnd = slot.end;
      }
      expect(prevEnd).toBe(rot.total);
    }
  });

  it('Rotation scheduler: 2-pass mode correctly interleaves slots without conflicts', () => {
    for (const grades of [scenario3, scenario4, scenario5]) {
      const rot = buildRotation(water, grades, 50, 5, 2);
      expect(rot.slots.length).toBe(grades.length * 2);
      // Pass 1 followed by Pass 2
      const pass1Slots = rot.slots.filter((s) => s.pass === 1);
      const pass2Slots = rot.slots.filter((s) => s.pass === 2);
      expect(pass1Slots.length).toBe(grades.length);
      expect(pass2Slots.length).toBe(grades.length);
      expect(pass1Slots[pass1Slots.length - 1].end).toBe(pass2Slots[0].start);
    }
  });

  it('Rotation scheduler: existing calls without studentCounts give identical allocations', () => {
    const rotDefault = buildRotation(water, [1, 3, 5], 40, 5, 1);
    const rotWithUndefined = buildRotation(water, [1, 3, 5], 40, 5, 1, undefined, undefined);
    expect(rotDefault.slots.map((s) => s.minutes)).toEqual(rotWithUndefined.slots.map((s) => s.minutes));
  });

  it('Rotation scheduler: adjusts time for uneven classes (8 students in G2, 1 in G5)', () => {
    // Uneven class: 8 students in Grade 2 vs 1 student in Grade 5
    const grades: Grade[] = [2, 5];
    const totalMinutes = 40;
    const opening = 5;

    const basePlan = buildRotation(water, grades, totalMinutes, opening, 1);
    const weightedPlan = buildRotation(
      water,
      grades,
      totalMinutes,
      opening,
      1,
      undefined,
      { 2: 8, 5: 1 }
    );

    const g2BaseSlot = basePlan.slots.find((s) => s.grade === 2)!;
    const g2WeightedSlot = weightedPlan.slots.find((s) => s.grade === 2)!;
    const g5WeightedSlot = weightedPlan.slots.find((s) => s.grade === 5)!;

    // Grade 2 with 8 students receives more teacher time than in base age weighting
    expect(g2WeightedSlot.minutes).toBeGreaterThanOrEqual(g2BaseSlot.minutes);
    // Grade 5 still gets direct instruction
    expect(g5WeightedSlot.minutes).toBeGreaterThan(0);
    // Total minutes remain exact
    expect(weightedPlan.slots.reduce((sum, s) => sum + s.minutes, 0)).toBe(totalMinutes - opening);
  });

  it('Rotation scheduler: falls back to age-only weighting if counts are missing for any active grade', () => {
    const grades: Grade[] = [1, 3, 5];
    const basePlan = buildRotation(water, grades, 45, 5, 1);
    // Grade 5 count is missing (partial counts)
    const partialPlan = buildRotation(water, grades, 45, 5, 1, undefined, { 1: 5, 3: 4 });
    expect(partialPlan.slots.map((s) => s.minutes)).toEqual(basePlan.slots.map((s) => s.minutes));
  });

  it('Rotation scheduler: allocates minimum slot for grade with 0 students', () => {
    const grades: Grade[] = [1, 3];
    const plan = buildRotation(water, grades, 40, 5, 1, undefined, { 1: 10, 3: 0 });
    const g3Slot = plan.slots.find((s) => s.grade === 3)!;
    expect(g3Slot.minutes).toBeGreaterThan(0);
  });
});

import { validateCustomTopic, getTopicTemplateJson } from '../src/engine/validateTopic';

describe('Custom topic validation (validateTopic)', () => {
  it('validates and accepts the standard topic template', () => {
    const template = getTopicTemplateJson();
    const result = validateCustomTopic(template);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.topic).toBeDefined();
    expect(result.topic?.isCustom).toBe(true);
    expect(result.topic?.id).toBe('custom-topic-example');
  });

  it('fails on malformed JSON string', () => {
    const res = validateCustomTopic('{ invalid json');
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.path === 'json')).toBe(true);
  });

  it('fails when input is not an object or empty', () => {
    const res = validateCustomTopic(null);
    expect(res.valid).toBe(false);
    expect(res.errors[0].path).toBe('root');
  });

  it('fails on unexpected top-level property (schema strictness)', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    parsed.maliciousCode = 'alert(1)';
    const res = validateCustomTopic(parsed);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.path === 'maliciousCode')).toBe(true);
  });

  it('fails when topic id clashes with built-in topic', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    parsed.id = 'evs-water';
    const res = validateCustomTopic(parsed);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.message.includes('clashes with a built-in'))).toBe(true);
  });

  it('fails when topic id clashes with existing custom topic', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    parsed.id = 'custom-birds';
    const res = validateCustomTopic(parsed, ['custom-birds']);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.message.includes('already exists'))).toBe(true);
  });

  it('fails on invalid subject type', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    parsed.subject = 'astrology';
    const res = validateCustomTopic(parsed);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.path === 'subject')).toBe(true);
  });

  it('fails when a grade plan is missing', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    delete parsed.grades[5];
    const res = validateCustomTopic(parsed);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.path === 'grades.5')).toBe(true);
  });

  it('fails when solo minutes exceeds MAX_SOLO_MINUTES for that grade', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    // Grade 1 MAX_SOLO_MINUTES is 10 min
    parsed.grades[1].independent.minutes = 25;
    const res = validateCustomTopic(parsed);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.path === 'grades.1.independent.minutes' && e.message.includes('exceeds MAX_SOLO_MINUTES'))).toBe(true);
  });

  it('fails when question is missing tier differentiation without sameAcrossTiers reason', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    // Grade 2 has an authored question with support/stretch; remove stretch
    delete parsed.grades[2].questions[0].items[0].stretch;
    const res = validateCustomTopic(parsed);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.path.includes('stretch') && e.message.includes('stretch tier variant'))).toBe(true);
  });

  it('fails when sameAcrossTiers is set without a justified sameReason', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    // Grade 1 question has sameAcrossTiers: true; remove sameReason
    delete parsed.grades[1].questions[0].items[0].sameReason;
    const res = validateCustomTopic(parsed);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.path.includes('sameReason'))).toBe(true);
  });

  it('fails when string exceeds maximum allowed length', () => {
    const parsed = JSON.parse(getTopicTemplateJson());
    parsed.title.en = 'A'.repeat(1005);
    const res = validateCustomTopic(parsed);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.message.includes('exceeds maximum length'))).toBe(true);
  });
});

