import { MAX_SOLO_MINUTES } from './rules';
import type { Grade, GradePlan, Localizable, Topic } from '../types';

export interface PlanRow { grade: Grade; plan: GradePlan; buddy?: Grade }
export interface SessionPlan { theme: Localizable; hook: Localizable; rows: PlanRow[]; warnings: string[] }

/**
 * Same theme for every grade; difficulty differs by grade.
 * Rules: (1) independent tasks must fit the grade's solo attention span,
 * (2) Grades 1-2 are paired with an older peer buddy when one is present (>= 2 grades above).
 */
export function buildSessionPlan(topic: Topic, grades: Grade[]): SessionPlan {
  const gs = [...grades].sort((a, b) => a - b);
  const warnings: string[] = [];
  const rows: PlanRow[] = gs.map((grade) => {
    const plan = topic.grades[grade];
    if (plan.independent.mode === 'solo' && plan.independent.minutes > MAX_SOLO_MINUTES[grade]) {
      warnings.push(`Grade ${grade}: solo task is ${plan.independent.minutes} min, above the ${MAX_SOLO_MINUTES[grade]} min limit.`);
    }
    const buddy = grade <= 2 ? [...gs].reverse().find((h) => h >= grade + 2) : undefined;
    return { grade, plan, buddy };
  });
  return { theme: topic.theme, hook: topic.hook, rows, warnings };
}
