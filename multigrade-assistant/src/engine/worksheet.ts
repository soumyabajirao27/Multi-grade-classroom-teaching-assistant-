import { generate } from '../content/generators';
import { createRng } from './rng';
import { resolveL10n, type Grade, type Lang, type Question, type Tier, type Topic, type Worksheet } from '../types';

export interface WorksheetInput { topic: Topic; grade: Grade; tier: Tier; seed: string; students?: string[]; lang?: Lang }

/** Deterministic: same (topic, grade, tier, seed) always returns the same worksheet and answer key. */
export function buildWorksheet({ topic, grade, tier, seed, students = [], lang = 'en' }: WorksheetInput): Worksheet {
  const plan = topic.grades[grade];
  const rng = createRng(`${seed}|${topic.id}|${grade}|${tier}`);
  const questions: Question[] = [];
  for (const spec of plan.questions) {
    if (spec.type === 'gen') {
      questions.push(...generate(spec, tier, rng, questions.length, lang));
    } else {
      for (const it of spec.items) {
        const v = it[tier] ?? it.core; // fall back to the core variant
        questions.push({
          id: `s-${questions.length}`,
          prompt: resolveL10n(v.q, lang),
          answer: resolveL10n(v.a, lang),
          kind: it.kind ?? 'short',
          marks: 1,
        });
      }
    }
  }
  return {
    id: `${topic.id}-g${grade}-${tier}-${seed}`,
    topicId: topic.id,
    grade,
    tier,
    seed,
    students,
    title: resolveL10n(plan.independent.title, lang),
    instructions: resolveL10n(plan.independent.instructions, lang),
    questions,
    earlyFinisher: plan.earlyFinisher ? resolveL10n(plan.earlyFinisher, lang) : undefined,
  };
}
