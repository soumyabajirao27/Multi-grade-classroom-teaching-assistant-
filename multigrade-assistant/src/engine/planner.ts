import { MAX_SOLO_MINUTES } from './rules';
import type { Grade, GradePlan, Localizable, Topic } from '../types';

export interface PlanRow {
  grade: Grade;
  plan: GradePlan;
  buddy?: Grade;
  topic?: Topic;
}

export interface SessionPlan {
  theme: Localizable;
  hook: Localizable;
  rows: PlanRow[];
  warnings: string[];
}

/**
 * Builds session plan for either Mode A (single topic for all grades)
 * or Mode B (optional getTopicForGrade function returning distinct topic per grade).
 */
export function buildSessionPlan(
  topic: Topic,
  grades: Grade[],
  getTopicForGrade?: (g: Grade) => Topic
): SessionPlan {
  const gs = [...grades].sort((a, b) => a - b);
  const warnings: string[] = [];
  const rows: PlanRow[] = gs.map((grade) => {
    const t = getTopicForGrade ? getTopicForGrade(grade) : topic;
    const plan = t.grades[grade];
    if (plan.independent.mode === 'solo' && plan.independent.minutes > MAX_SOLO_MINUTES[grade]) {
      warnings.push(`Grade ${grade}: solo task is ${plan.independent.minutes} min, above the ${MAX_SOLO_MINUTES[grade]} min limit.`);
    }
    const buddy = grade <= 2 ? [...gs].reverse().find((h) => h >= grade + 2) : undefined;
    return { grade, plan, buddy, topic: t };
  });
  return { theme: topic.theme, hook: topic.hook, rows, warnings };
}

