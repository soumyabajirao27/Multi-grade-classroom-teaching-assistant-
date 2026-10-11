import { MAX_UNSUPERVISED, MIN_SLOT_MINUTES, TEACHER_WEIGHT } from './rules';
import type { Grade, Topic } from '../types';

export interface Slot {
  index: number;
  grade: Grade;
  start: number;
  end: number;
  minutes: number;
  pass?: number;
}

export interface RotationPlan {
  total: number;
  opening: number;
  passes: 1 | 2;
  slots: Slot[];
  warnings: string[];
}

/** Pure time-calculation helper for timer: computes remaining ms and whether slot is finished based on start/end timestamps. */
export function calculateRemainingMs(targetEndTime: number, now: number): { remainingMs: number; isExpired: boolean } {
  const diff = targetEndTime - now;
  return {
    remainingMs: Math.max(0, diff),
    isExpired: diff <= 0,
  };
}

/** Split minutes by weight using the largest-remainder method so the sum is exact. */
export function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum <= 0) return weights.map(() => 0);
  const raw = weights.map((w) => (total * w) / sum);
  const out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => ({ i, f: r - Math.floor(r) })).sort((a, b) => b.f - a.f);
  for (const { i } of order) {
    if (left <= 0) break;
    out[i]++;
    left--;
  }
  return out;
}

/**
 * Teacher passes over the grades (youngest first), after a whole-class opening.
 * Allows 1 or 2 passes (revisiting each grade when the period is long).
 * Warns when any grade would be unsupervised longer than its limit.
 */
export function buildRotation(
  topic: Topic,
  grades: Grade[],
  totalMinutes: number,
  openingMinutes = 5,
  passes: 1 | 2 = 1
): RotationPlan {
  const gs = [...grades].sort((a, b) => a - b);
  const totalSlotsCount = gs.length * passes;
  const opening = Math.min(openingMinutes, Math.max(0, totalMinutes - totalSlotsCount));
  const avail = Math.max(0, totalMinutes - opening);
  const warnings: string[] = [];

  if (!gs.length) {
    return { total: totalMinutes, opening, passes, slots: [], warnings };
  }

  // Build weights for each slot
  const weights: number[] = [];
  for (let p = 1; p <= passes; p++) {
    for (const g of gs) {
      weights.push(TEACHER_WEIGHT[g]);
    }
  }

  const mins = allocate(avail, weights);
  let cursor = opening;
  const slots: Slot[] = [];

  let slotIdx = 0;
  for (let p = 1; p <= passes; p++) {
    for (const grade of gs) {
      const minutes = mins[slotIdx];
      slots.push({
        index: slotIdx,
        grade,
        start: cursor,
        end: cursor + minutes,
        minutes,
        pass: p,
      });
      cursor += minutes;
      slotIdx++;
    }
  }

  // Check warnings
  for (const s of slots) {
    if (s.minutes < MIN_SLOT_MINUTES) {
      warnings.push(
        `Grade ${s.grade}${passes === 2 ? ` (Pass ${s.pass})` : ''} gets only ${s.minutes} min with the teacher. Reduce grades or lengthen period.`
      );
    }
  }

  for (const g of gs) {
    const gradeSlots = slots.filter((s) => s.grade === g);
    let longestAlone = 0;
    if (gradeSlots.length === 1) {
      longestAlone = Math.max(gradeSlots[0].start - opening, totalMinutes - gradeSlots[0].end);
    } else if (gradeSlots.length >= 2) {
      const beforeFirst = gradeSlots[0].start - opening;
      const between = gradeSlots[1].start - gradeSlots[0].end;
      const afterSecond = totalMinutes - gradeSlots[1].end;
      longestAlone = Math.max(beforeFirst, between, afterSecond);
    }

    if (longestAlone > MAX_UNSUPERVISED[g]) {
      warnings.push(
        `Grade ${g} works alone for up to ${longestAlone} min (limit ${MAX_UNSUPERVISED[g]}). Add an early-finisher task or a peer buddy.`
      );
    }

    const task = topic.grades[g].independent.minutes;
    if (longestAlone > task + 10) {
      warnings.push(`Grade ${g}: independent task (${task} min) is much shorter than the ${longestAlone} min gap.`);
    }
  }

  return { total: totalMinutes, opening, passes, slots, warnings };
}
