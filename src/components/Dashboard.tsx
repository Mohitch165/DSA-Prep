import { useMemo } from 'react';
import { Trophy, TrendingUp, Star, Loader2, Target, Flame, RotateCw, Download, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { FocusHero } from './FocusHero';
import { computeStats, calcStreak } from '@/lib/stats';
import { PROBLEMS } from '@/data/problems';
import { cn } from '@/lib/utils';
import type { ProgressMap, FilterState, Tab } from '@/types';
import type { EnergyLevel } from '@/hooks/useADHD';

interface Props {
  progress: ProgressMap;
  setTab: (t: Tab) => void;
  setFilters: (fn: (prev: FilterState) => FilterState) => void;
  exportData: () => void;
  energyLevel: EnergyLevel;
  onEnergyChange: (e: EnergyLevel) => void;
  welcomeBack: boolean;
  onDismissWelcome: () => void;
}

const DAILY_GOAL = 3;

export function Dashboard({ progress, setTab, setFilters, exportData, energyLevel, onEnergyChange, welcomeBack, onDismissWelcome }: Props) {
  const stats = useMemo(() => computeStats(PROBLEMS, progress), [progress]);
  const completion = stats.total ? Math.round((stats.solved + stats.reviewed) / stats.total * 100) : 0;
  const streak = useMemo(() => calcStreak(progress), [progress]);
  const blind75Pct = stats.blind75.total ? Math.round(stats.blind75.solved / stats.blind75.total * 100) : 0;

  const todaySolved = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return Object.values(progress).filter(p => p.solvedDate?.slice(0, 10) === today).length;
  }, [progress]);

  const thisWeek = useMemo(() => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    return Object.values(progress).filter(p => p.solvedDate && new Date(p.solvedDate) >= weekAgo).length;
  }, [progress]);

  return (
    <div className="animate-fade-in space-y-5">

      {/* Welcome back banner — shame-free, dismissable */}
      {welcomeBack && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">👋</span>
            <div>
              <span className="font-semibold">Welcome back!</span>
              <span className="text-muted-foreground text-sm ml-2">
                No guilt — every session is a fresh start.
              </span>
            </div>
          </div>
          <button
            onClick={onDismissWelcome}
            className="text-muted-foreground hover:text-foreground ml-4 flex-shrink-0 transition-colors"
            aria-label="Dismiss welcome message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ADHD Focus Hero — the ONE thing to do right now */}
      <FocusHero
        progress={progress}
        energyLevel={energyLevel}
        onEnergyChange={onEnergyChange}
      />

      {/* Today's progress + streak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Today</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{todaySolved}</span>
                  <span className="text-sm text-muted-foreground">solved today</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: DAILY_GOAL }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all text-sm',
                      todaySolved > i
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 scale-110'
                        : 'bg-secondary/40 border-border/50 text-muted-foreground/30'
                    )}
                  >
                    {todaySolved > i ? '✓' : i + 1}
                  </div>
                ))}
                <span className="text-xs text-muted-foreground ml-1">daily goal</span>
              </div>
            </div>
            {todaySolved >= DAILY_GOAL && (
              <div className="mt-3 text-xs text-emerald-400 font-medium">
                Daily goal crushed! Keep going or take a well-earned break.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak — shame-free at 0 */}
        <Card className={cn(streak > 0 ? 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20' : '')}>
          <CardContent className="p-5 flex items-center gap-4 h-full">
            <div className={cn('text-4xl', streak === 0 && 'opacity-30')}>
              {streak > 0 ? '🔥' : '💤'}
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Streak</div>
              <div className={cn('text-3xl font-bold', streak > 0 ? 'text-amber-400' : 'text-muted-foreground/40')}>
                {streak}{streak > 0 ? ' days' : ''}
              </div>
              {streak === 0 && (
                <div className="text-xs text-muted-foreground mt-0.5">Start one today!</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Trophy className="w-4 h-4" />} label="Total Solved" value={`${stats.solved + stats.reviewed} / ${stats.total}`} accent="primary">
          <Progress value={completion} className="mt-3" />
          <div className="text-xs text-muted-foreground mt-2">{completion}% complete</div>
        </StatCard>
        <StatCard icon={<TrendingUp className="w-4 h-4" />} label="This Week" value={thisWeek} accent="emerald">
          <div className="text-xs text-muted-foreground mt-1">solved in last 7 days</div>
        </StatCard>
        <StatCard icon={<Star className="w-4 h-4" />} label="Blind 75" value={`${stats.blind75.solved} / ${stats.blind75.total}`} accent="amber">
          <Progress value={blind75Pct} className="mt-3" indicatorClassName="bg-amber-400 from-amber-500 to-amber-300" />
        </StatCard>
        <StatCard icon={<Loader2 className="w-4 h-4" />} label="In Progress" value={stats.in_progress} accent="blue">
          <div className="text-xs text-muted-foreground mt-1">currently working on</div>
        </StatCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Difficulty Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <DonutChart easy={stats.easy.solved} medium={stats.medium.solved} hard={stats.hard.solved} total={stats.total} />
              <div className="flex-1 space-y-3">
                {([['Easy', stats.easy, '#22c55e'], ['Medium', stats.medium, '#eab308'], ['Hard', stats.hard, '#ef4444']] as const).map(([label, d, color]) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color }}>{label}</span>
                      <span>{d.solved}/{d.total}</span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary mt-1.5">
                      <div className="h-full transition-all duration-700" style={{ width: `${d.total ? d.solved / d.total * 100 : 0}%`, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Phase Progress</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(stats.byPhase).map(([phase, d]) => (
              <div key={phase}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{phase}</span>
                  <span className="text-muted-foreground">{d.solved}/{d.total}</span>
                </div>
                <Progress value={d.total ? d.solved / d.total * 100 : 0} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Top Patterns Progress</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {Object.entries(stats.byPattern)
                .sort((a, b) => b[1].total - a[1].total).slice(0, 12)
                .map(([pattern, d]) => (
                  <div key={pattern}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground/90">{pattern}</span>
                      <span className="text-muted-foreground text-xs">{d.solved}/{d.total}</span>
                    </div>
                    <Progress value={d.total ? d.solved / d.total * 100 : 0} className="h-1.5" indicatorClassName="from-cyan-500 to-blue-500" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Last 7 Days Activity</CardTitle></CardHeader>
          <CardContent>
            <ActivityGrid weeklyActivity={stats.weeklyActivity} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions — large tap targets for ADHD */}
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <QuickAction icon={<Target className="w-5 h-5" />} label="Next Blind 75" desc="unsolved must-knows" onClick={() => {
              setFilters(f => ({ ...f, blind75Only: true, status: new Set(['not_started']) }));
              setTab('problems');
            }} />
            <QuickAction icon={<Flame className="w-5 h-5" />} label="High Frequency" desc="most-asked problems" onClick={() => {
              setFilters(f => ({ ...f, minFrequency: 5 }));
              setTab('problems');
            }} />
            <QuickAction icon={<RotateCw className="w-5 h-5" />} label="Review Solved" desc="reinforce memory" onClick={() => {
              setFilters(f => ({ ...f, status: new Set(['solved']) }));
              setTab('problems');
            }} />
            <QuickAction icon={<Download className="w-5 h-5" />} label="Export Progress" desc="JSON backup" onClick={exportData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, accent, children }: {
  icon: React.ReactNode; label: string; value: React.ReactNode;
  accent: 'primary' | 'emerald' | 'amber' | 'blue'; children?: React.ReactNode;
}) {
  const accentMap = {
    primary: 'from-primary/30 to-primary/5 border-primary/30 glow-primary',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
  };
  const iconColorMap = {
    primary: 'text-primary', emerald: 'text-emerald-400', amber: 'text-amber-400', blue: 'text-blue-400',
  };
  return (
    <Card className={cn('bg-gradient-to-br', accentMap[accent])}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className={iconColorMap[accent]}>{icon}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
        <div className="text-3xl font-bold">{value}</div>
        {children}
      </CardContent>
    </Card>
  );
}

function DonutChart({ easy, medium, hard, total }: { easy: number; medium: number; hard: number; total: number }) {
  const r = 50, c = 2 * Math.PI * r, stroke = 18;
  const easyPct = total ? easy / total : 0;
  const medPct = total ? medium / total : 0;
  const hardPct = total ? hard / total : 0;
  const solved = easy + medium + hard;
  return (
    <div className="relative">
      <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#22c55e" strokeWidth={stroke}
          strokeDasharray={`${easyPct * c} ${c}`} strokeDashoffset="0" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#eab308" strokeWidth={stroke}
          strokeDasharray={`${medPct * c} ${c}`} strokeDashoffset={-easyPct * c} />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#ef4444" strokeWidth={stroke}
          strokeDasharray={`${hardPct * c} ${c}`} strokeDashoffset={-(easyPct + medPct) * c} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">{solved}</div>
        <div className="text-xs text-muted-foreground">solved</div>
      </div>
    </div>
  );
}

function ActivityGrid({ weeklyActivity }: { weeklyActivity: Record<string, number> }) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const colors = ['bg-secondary', 'bg-emerald-900/60', 'bg-emerald-700', 'bg-emerald-600', 'bg-emerald-500', 'bg-emerald-400'];
  return (
    <>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6 - i));
          const key = d.toISOString().slice(0, 10);
          const count = weeklyActivity[key] || 0;
          const intensity = Math.min(count, 5);
          return (
            <div key={i} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">{days[d.getDay()]}</div>
              <div className={cn('aspect-square rounded flex items-center justify-center text-xs font-bold', colors[intensity])}>{count || ''}</div>
              <div className="text-xs text-muted-foreground/60 mt-1">{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground mt-4 flex items-center gap-2 justify-center">
        <span>Less</span>
        {colors.map((c, i) => <div key={i} className={cn('w-3 h-3 rounded', c)} />)}
        <span>More</span>
      </div>
    </>
  );
}

function QuickAction({ icon, label, desc, onClick }: { icon: React.ReactNode; label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-4 text-left bg-secondary/40 hover:bg-secondary border border-border hover:border-primary/40 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="text-primary mb-2">{icon}</div>
      <div className="font-medium text-sm">{label}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}
