import type { Grade, Status, Tier } from '../types';

export interface HistoryItem { status: Status; score?: number; updatedAt: number }

/**
 * Tier rule: last attempt "needs help" -> support; last two attempts done with score >= 80 -> stretch; else core.
 */
export function suggestTier(history: HistoryItem[]): Tier {
  const h = [...history].sort((a, b) => a.updatedAt - b.updatedAt);
  const last = h[h.length - 1];
  if (!last) return 'core';
  if (last.status === 'needs-help') return 'support';
  const two = h.slice(-2);
  if (two.length === 2 && two.every((r) => r.status === 'done' && (r.score ?? 0) >= 80)) return 'stretch';
  return 'core';
}

export interface GradeSummary { grade: Grade; total: number; done: number; needsHelp: number; notStarted: number }

export function summarize(students: { id: number; grade: Grade }[], latest: Map<number, Status>, grades: Grade[]): GradeSummary[] {
  return grades.map((grade) => {
    const list = students.filter((s) => s.grade === grade);
    const st = list.map((s) => latest.get(s.id) ?? 'not-started');
    return {
      grade, total: list.length,
      done: st.filter((x) => x === 'done').length,
      needsHelp: st.filter((x) => x === 'needs-help').length,
      notStarted: st.filter((x) => x === 'not-started').length,
    };
  });
}
