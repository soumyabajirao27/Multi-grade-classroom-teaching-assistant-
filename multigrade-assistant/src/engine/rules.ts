import type { Grade } from '../types';

/** Pedagogical constants. Every rule in the engine reads from here so reviewers can tune them in one place. */
export const MAX_SOLO_MINUTES: Record<Grade, number> = { 1: 10, 2: 12, 3: 15, 4: 20, 5: 25 };
/** Longest stretch a grade can reasonably work without the teacher. */
export const MAX_UNSUPERVISED: Record<Grade, number> = { 1: 12, 2: 15, 3: 20, 4: 25, 5: 30 };
/** Younger grades get a larger share of direct teaching time. */
export const TEACHER_WEIGHT: Record<Grade, number> = { 1: 1.4, 2: 1.25, 3: 1.1, 4: 1, 5: 1 };
export const MIN_SLOT_MINUTES = 5;
