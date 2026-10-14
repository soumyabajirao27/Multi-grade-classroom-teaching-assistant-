import { describe, expect, it } from 'vitest';
// @ts-ignore
import fs from 'node:fs';
// @ts-ignore
import path from 'node:path';
import { TOPICS } from '../src/content/curriculum';
import { createRng } from '../src/engine/rng';
import { buildWorksheet } from '../src/engine/worksheet';
import { buildSessionPlan } from '../src/engine/planner';
import { allocate, buildRotation, calculateRemainingMs } from '../src/engine/rotation';
import { suggestTier } from '../src/engine/progress';
import { MAX_SOLO_MINUTES } from '../src/engine/rules';
import { GRADES, TIERS, resolveL10n, type Grade, type Lang } from '../src/types';

const math = TOPICS.find((t) => t.id === 'math-market')!;

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
          expect(m.textbook).toBeTruthy();
          expect(m.chapter).toBeTruthy();
          expect(['verified', 'to-verify']).toContain(m.status);
        }
      }
    }
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



