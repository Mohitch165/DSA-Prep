import type { Problem, ProgressMap, Stats, Status } from '@/types';

const isDone = (s: Status) => s === 'solved' || s === 'reviewed';

export function computeStats(problems: Problem[], progress: ProgressMap): Stats {
  const stats: Stats = {
    total: problems.length,
    solved: 0, in_progress: 0, reviewed: 0, not_started: 0,
    easy: { total: 0, solved: 0 },
    medium: { total: 0, solved: 0 },
    hard: { total: 0, solved: 0 },
    blind75: { total: 0, solved: 0 },
    byPattern: {}, byCompany: {},
    byPhase: { 'Phase 0': { total: 0, solved: 0 }, 'Month 1': { total: 0, solved: 0 }, 'Month 2': { total: 0, solved: 0 }, 'Month 3': { total: 0, solved: 0 } },
    weeklyActivity: {},
  };

  for (const p of problems) {
    const s = (progress[p.id]?.status || 'not_started') as Status;
    stats[s]++;
    const dKey = p.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
    stats[dKey].total++;
    if (isDone(s)) stats[dKey].solved++;
    if (p.blind75) {
      stats.blind75.total++;
      if (isDone(s)) stats.blind75.solved++;
    }
    if (!stats.byPattern[p.pattern]) stats.byPattern[p.pattern] = { total: 0, solved: 0 };
    stats.byPattern[p.pattern].total++;
    if (isDone(s)) stats.byPattern[p.pattern].solved++;
    for (const c of p.companies) {
      if (!stats.byCompany[c]) stats.byCompany[c] = { total: 0, solved: 0 };
      stats.byCompany[c].total++;
      if (isDone(s)) stats.byCompany[c].solved++;
    }
    if (stats.byPhase[p.phase]) {
      stats.byPhase[p.phase].total++;
      if (isDone(s)) stats.byPhase[p.phase].solved++;
    }
    const sd = progress[p.id]?.solvedDate;
    if (sd) {
      const day = sd.slice(0, 10);
      stats.weeklyActivity[day] = (stats.weeklyActivity[day] || 0) + 1;
    }
  }
  return stats;
}

export function calcStreak(progress: ProgressMap): number {
  const dates = new Set(
    Object.values(progress).filter(p => p.solvedDate).map(p => (p.solvedDate as string).slice(0, 10))
  );
  if (!dates.size) return 0;
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (dates.has(key)) { streak++; cursor.setDate(cursor.getDate() - 1); }
    else if (i === 0) { cursor.setDate(cursor.getDate() - 1); }
    else break;
  }
  return streak;
}
