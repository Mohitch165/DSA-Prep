import { useMemo, useState } from 'react';
import { Zap, ExternalLink, RefreshCw } from 'lucide-react';
import { PROBLEMS } from '@/data/problems';
import { Badge } from './ui/badge';
import { cn, leetcodeUrl } from '@/lib/utils';
import type { ProgressMap } from '@/types';
import type { EnergyLevel } from '@/hooks/useADHD';

interface Props {
  progress: ProgressMap;
  energyLevel: EnergyLevel;
  onEnergyChange: (e: EnergyLevel) => void;
}

const ENERGY_CONFIG = {
  low: {
    label: 'Low Energy',
    emoji: '😴',
    tagline: "Even 5 mins counts — here's an easy one:",
    btnClass: 'from-blue-600 to-blue-500 shadow-blue-500/30',
    borderClass: 'border-blue-500/30',
    bgClass: 'bg-blue-500/5',
    textClass: 'text-blue-400',
    pillClass: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
  },
  medium: {
    label: 'Focused',
    emoji: '🧠',
    tagline: "You've got this — here's today's focus:",
    btnClass: 'from-emerald-600 to-emerald-500 shadow-emerald-500/30',
    borderClass: 'border-emerald-500/30',
    bgClass: 'bg-emerald-500/5',
    textClass: 'text-emerald-400',
    pillClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  },
  high: {
    label: 'High Energy',
    emoji: '⚡',
    tagline: "You're on fire — tackle something hard:",
    btnClass: 'from-amber-600 to-orange-500 shadow-amber-500/30',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/5',
    textClass: 'text-amber-400',
    pillClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  },
} as const;

function getNextProblem(progress: ProgressMap, energy: EnergyLevel, skipIds: Set<number>) {
  const notStarted = PROBLEMS.filter(p => {
    const s = progress[p.id]?.status;
    return (!s || s === 'not_started') && !skipIds.has(p.id);
  });
  if (!notStarted.length) return null;

  let candidates = notStarted;
  if (energy === 'low') {
    const easy = notStarted.filter(p => p.difficulty === 'Easy');
    if (easy.length) candidates = easy;
  } else if (energy === 'high') {
    const strong = notStarted.filter(p => p.difficulty === 'Hard' || p.blind75);
    if (strong.length) candidates = strong;
  } else {
    const medium = notStarted.filter(p => p.difficulty === 'Medium');
    if (medium.length) candidates = medium;
  }

  return [...candidates].sort((a, b) => a.week - b.week || b.frequency - a.frequency)[0];
}

export function FocusHero({ progress, energyLevel, onEnergyChange }: Props) {
  const [skippedIds, setSkippedIds] = useState<Set<number>>(new Set());
  const problem = useMemo(
    () => getNextProblem(progress, energyLevel, skippedIds),
    [progress, energyLevel, skippedIds]
  );
  const cfg = ENERGY_CONFIG[energyLevel];

  return (
    <div className={cn('rounded-2xl p-6 border-2 transition-all duration-500', cfg.borderClass, cfg.bgClass)}>
      {/* Energy picker */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-sm text-muted-foreground">How's your energy?</span>
        {(['low', 'medium', 'high'] as EnergyLevel[]).map(e => {
          const c = ENERGY_CONFIG[e];
          return (
            <button
              key={e}
              onClick={() => onEnergyChange(e)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                energyLevel === e
                  ? c.pillClass
                  : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'
              )}
            >
              {c.emoji} {c.label}
            </button>
          );
        })}
      </div>

      {!problem ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-3">🏆</div>
          <div className="text-2xl font-bold text-emerald-400">All problems done!</div>
          <div className="text-sm text-muted-foreground mt-1">You absolute legend.</div>
        </div>
      ) : (
        <>
          <div className={cn('text-xs uppercase tracking-widest mb-2', cfg.textClass)}>
            🎯 {cfg.tagline}
          </div>
          <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
          <div className="flex items-center gap-2 flex-wrap mb-5">
            <Badge variant={problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>
              {problem.difficulty}
            </Badge>
            <span className="text-xs bg-secondary/60 px-2 py-0.5 rounded-full text-foreground/70">
              {problem.pattern}
            </span>
            {problem.blind75 && (
              <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">
                ★ Blind 75
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {problem.phase} · Week {problem.week}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={leetcodeUrl(problem.slug)}
              target="_blank"
              rel="noreferrer"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white',
                'bg-gradient-to-r shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200',
                cfg.btnClass
              )}
            >
              <Zap className="w-4 h-4" />
              Start Now
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <button
              onClick={() => setSkippedIds(prev => new Set([...prev, problem.id]))}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground bg-secondary/40 hover:bg-secondary transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Not feeling it
            </button>
          </div>
          {skippedIds.size > 0 && (
            <button
              onClick={() => setSkippedIds(new Set())}
              className="mt-3 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              ↺ Reset skipped ({skippedIds.size})
            </button>
          )}
        </>
      )}
    </div>
  );
}
