export type Grade = 1 | 2 | 3 | 4 | 5;
export const GRADES: Grade[] = [1, 2, 3, 4, 5];
export type Tier = 'support' | 'core' | 'stretch';
export const TIERS: Tier[] = ['support', 'core', 'stretch'];
export type Lang = 'en' | 'hi' | 'mr';
export type Subject = 'math' | 'evs';
export type Status = 'not-started' | 'needs-help' | 'done';

export type GenId = 'count' | 'add' | 'addNoCarry' | 'sub' | 'mul' | 'div' | 'fracAdd' | 'money' | 'wordShop' | 'perimeter' | 'area' | 'timeRead' | 'timeElapsed';

/** Localised string map. English is required, hi and mr are optional with fallback to English. */
export type L10n = { en: string; hi?: string; mr?: string };
export type Localizable = string | L10n;

export function resolveL10n(val: Localizable | undefined, lang: Lang): string {
  if (val === undefined || val === null) return '';
  if (typeof val === 'string') return val;
  return val[lang] || val.en || '';
}

/** Curriculum mapping per topic and per grade (Maharashtra / State / NCERT boards). */
export interface CurriculumMapping {
  board: string;
  textbook: string;
  chapter: string;
  status: 'verified' | 'to-verify';
}

/** Generated (template) questions: numbers change every worksheet, difficulty follows grade + tier. */
export interface GenSpec { type: 'gen'; gen: GenId; count: number; digits?: number; den?: number; op?: 'add' | 'sub' | 'mul' }
export interface QA { q: Localizable; a: Localizable }
export interface StaticItem {
  core: QA;
  support?: QA;
  stretch?: QA;
  kind?: 'short' | 'draw';
  sameAcrossTiers?: boolean;
  sameReason?: string;
}
/** Authored questions with optional easier (support) and harder (stretch) variants. */
export interface StaticSpec { type: 'static'; items: StaticItem[] }
export type QSpec = GenSpec | StaticSpec;

export interface Activity { title: Localizable; steps: Localizable[]; minutes: number }
export interface IndependentTask {
  title: Localizable; instructions: Localizable; minutes: number;
  mode: 'solo' | 'pair' | 'group'; materials: Localizable[];
}
export interface GradePlan {
  outcome: Localizable;
  teacher: Activity;
  independent: IndependentTask;
  questions: QSpec[];
  mapping?: CurriculumMapping[];
  earlyFinisher?: Localizable;
  checklist?: Localizable[];
}

export interface Topic {
  id: string; subject: Subject; title: Record<Lang, string>;
  theme: Localizable;          // the single theme shared by all grades
  hook: Localizable;           // whole-class opening
  mapping: string | CurriculumMapping[]; // curriculum mapping note or structured entries
  grades: Record<Grade, GradePlan>;
  reviewed?: Record<Lang, boolean>; // language translation review status
}

export interface Question {
  id: string; prompt: string; answer: string; kind: 'short' | 'draw';
  marks: number; meta?: { a: number; b: number; op: string };
}
export interface Worksheet {
  id: string; topicId: string; grade: Grade; tier: Tier; seed: string;
  title: string; instructions: string; students: string[]; questions: Question[];
  earlyFinisher?: string;
}
