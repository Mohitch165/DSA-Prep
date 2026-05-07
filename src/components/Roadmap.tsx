import { useRef, useMemo, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ExternalLink, Target, Clock, Calendar, TrendingUp, BookOpen, CheckSquare, GraduationCap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { computeStats } from '@/lib/stats';
import { PROBLEMS, ROADMAP } from '@/data/problems';
import { PLAN_SUMMARY, PHASE_DETAILS, WEEK_DETAILS } from '@/data/roadmap-details';
import { cn } from '@/lib/utils';
import type { ProgressMap, FilterState, Tab } from '@/types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TODO_KEY = 'dsa_roadmap_todos_v1';

interface Props {
  progress: ProgressMap;
  setTab: (t: Tab) => void;
  setFilters: (fn: (prev: FilterState) => FilterState) => void;
  getStatus: (id: number) => string;
}

const FRESH_FILTERS: FilterState = {
  search: '', company: '', difficulty: new Set(), pattern: '',
  status: new Set(), minFrequency: 1, phase: '', blind75Only: false, week: null,
  sortBy: 'id', sortDir: 'asc',
};

export function Roadmap({ progress, setTab, setFilters, getStatus }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [todoChecks, setTodoChecks] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(TODO_KEY) || '{}'); }
    catch { return {}; }
  });
  const stats = useMemo(() => computeStats(PROBLEMS, progress), [progress]);

  const toggleWeek = (key: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const toggleTodo = (key: string) => {
    setTodoChecks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(TODO_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Auto-expand first incomplete week (until user manually expands something)
  const autoExpandKey = useMemo(() => {
    for (const phase of ROADMAP) {
      for (const w of phase.weeks) {
        const wkProblems = PROBLEMS.filter(p => p.phase === phase.phase && p.week === w.week);
        const wkSolved = wkProblems.filter(p => ['solved', 'reviewed'].includes(getStatus(p.id))).length;
        if (wkSolved < wkProblems.length) return `${phase.phase}|${w.week}`;
      }
    }
    return `${ROADMAP[0].phase}|${ROADMAP[0].weeks[0].week}`;
  }, [progress, getStatus]);

  const isExpanded = (key: string) => expanded.has(key) || (expanded.size === 0 && key === autoExpandKey);

  const viewWeekProblems = (phase: string, week: number) => {
    setFilters(() => ({ ...FRESH_FILTERS, phase, week }));
    setTab('problems');
  };

  const viewPhaseProblems = (phase: string) => {
    setFilters(() => ({ ...FRESH_FILTERS, phase }));
    setTab('problems');
  };

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>('.phase-card').forEach((el) => {
      gsap.from(el, {
        opacity: 0, y: 60, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
    gsap.utils.toArray<HTMLElement>('.progress-fill').forEach((el) => {
      const target = el.dataset.target || '0';
      gsap.fromTo(el, { width: '0%' },
        { width: `${target}%`, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' } });
    });
  }, { scope: container });

  return (
    <div ref={container} className="animate-fade-in space-y-6">
      {/* PLAN SUMMARY */}
      <Card className="overflow-hidden border-primary/30 glow-primary">
        <div className="bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold gradient-text">Your 17-Week Roadmap</h2>
              <p className="text-sm text-muted-foreground mt-1">{PLAN_SUMMARY.duration}</p>
            </div>
            <div className="flex gap-3">
              <SummaryStat icon={<Target className="w-4 h-4" />} label="Total target" value={PLAN_SUMMARY.totalProblems} />
              <SummaryStat icon={<TrendingUp className="w-4 h-4" />} label="Solved" value={`${stats.solved + stats.reviewed} / ${stats.total}`} />
              <SummaryStat icon={<Clock className="w-4 h-4" />} label="Phases" value="4" />
            </div>
          </div>
        </div>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Guiding philosophy</div>
            <ul className="space-y-1.5 text-sm">
              {PLAN_SUMMARY.philosophy.map((p, i) => (
                <li key={i} className="flex gap-2"><span className="text-primary mt-0.5">▸</span><span>{p}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Weekly contract</div>
            <ul className="space-y-1.5 text-sm">
              {PLAN_SUMMARY.weeklyContract.map((p, i) => (
                <li key={i} className="flex gap-2"><span className="text-primary mt-0.5">▸</span><span>{p}</span></li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* PHASE TIMELINE STRIP */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-2">
            {ROADMAP.map(phase => {
              const pStat = stats.byPhase[phase.phase] || { total: 0, solved: 0 };
              const pct = pStat.total ? Math.round(pStat.solved / pStat.total * 100) : 0;
              return (
                <button key={phase.phase} onClick={() => viewPhaseProblems(phase.phase)}
                  className="text-left p-3 rounded-lg bg-secondary/40 hover:bg-secondary border border-border hover:border-primary/40 transition-all">
                  <div className="text-xs text-muted-foreground">{PHASE_DETAILS[phase.phase]?.dateRange}</div>
                  <div className="font-semibold mt-0.5">{phase.phase}</div>
                  <div className="text-xs text-muted-foreground mt-1">{pStat.solved}/{pStat.total} · {pct}%</div>
                  <Progress value={pct} className="h-1 mt-2" />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* PHASES */}
      {ROADMAP.map((phase) => {
        const detail = PHASE_DETAILS[phase.phase];
        const pStat = stats.byPhase[phase.phase] || { total: 0, solved: 0 };
        const pct = pStat.total ? Math.round(pStat.solved / pStat.total * 100) : 0;
        return (
          <Card key={phase.phase} className="phase-card overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-primary/15 via-blue-500/8 to-transparent border-b">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{phase.phase}</h2>
                    <Badge variant="secondary" className="text-xs">{detail?.dateRange}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{detail?.description}</p>
                </div>
                <div className="text-3xl font-bold gradient-text">{pct}%</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">
                <InfoChip icon={<Target className="w-4 h-4" />} label="Goal" value={detail?.goal || ''} />
                <InfoChip icon={<TrendingUp className="w-4 h-4" />} label="Target" value={detail?.problemTarget || ''} />
                <InfoChip icon={<Clock className="w-4 h-4" />} label="Daily commitment" value={detail?.dailyCommitment || ''} />
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary mt-4">
                <div className="progress-fill h-full rounded-full bg-gradient-to-r from-primary to-blue-500" data-target={pct} style={{ width: '0%' }} />
              </div>
              <div className="text-xs text-muted-foreground mt-2">{pStat.solved} / {pStat.total} problems · {pct}% complete</div>
            </div>

            {/* WEEKS */}
            <CardContent className="p-4 space-y-3">
              {phase.weeks.map(w => {
                const wkProblems = PROBLEMS.filter(p => p.phase === phase.phase && p.week === w.week);
                const wkSolved = wkProblems.filter(p => ['solved', 'reviewed'].includes(getStatus(p.id))).length;
                const wkPct = wkProblems.length ? Math.round(wkSolved / wkProblems.length * 100) : 0;
                const key = `${phase.phase}|${w.week}`;
                const open = isExpanded(key);
                const wd = WEEK_DETAILS[phase.phase]?.[w.week];

                // Compute todo progress for this week (excluding ***-headers and ✓-subitems)
                const realTodoIdxs = wd?.todos
                  .map((t, i) => ({ t, i }))
                  .filter(x => !x.t.startsWith('***') && !x.t.trim().startsWith('✓'))
                  .map(x => x.i) || [];
                const todosTotal = realTodoIdxs.length;
                const todosDone = realTodoIdxs.filter(i => todoChecks[`${phase.phase}|${w.week}|${i}`]).length;

                return (
                  <div key={w.week} className="bg-secondary/20 border border-border/60 rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                    <button onClick={() => toggleWeek(key)}
                      className="w-full p-4 flex items-center gap-4 text-left hover:bg-secondary/30 transition-colors">
                      <div className="text-muted-foreground transition-transform" style={{ transform: open ? 'rotate(0)' : 'rotate(-90deg)' }}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">Week {w.week} · {w.dates}</span>
                          {wkPct === 100 && <Badge variant="easy" className="text-xs">✓ Problems Done</Badge>}
                          {todosTotal > 0 && todosDone === todosTotal && <Badge variant="easy" className="text-xs">✓ Plan Done</Badge>}
                        </div>
                        <h3 className="font-semibold mt-0.5">{w.title}</h3>
                      </div>
                      <div className="hidden md:flex flex-col items-end gap-1">
                        {todosTotal > 0 && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckSquare className="w-3 h-3" />{todosDone}/{todosTotal} todos
                          </div>
                        )}
                        <div className="text-sm font-bold text-emerald-400 whitespace-nowrap">{wkSolved}/{wkProblems.length} problems</div>
                      </div>
                      <div className="w-32 hidden lg:block">
                        <Progress value={wkPct} className="h-1.5" indicatorClassName="from-emerald-500 to-emerald-300" />
                      </div>
                    </button>

                    {open && wd && (
                      <div className="px-5 pb-5 pt-2 space-y-5 animate-fade-in border-t border-border/40">
                        {/* SUMMARY */}
                        <p className="text-sm text-foreground/85 leading-relaxed italic mt-3">{wd.summary}</p>

                        {/* TOPICS */}
                        <div className="flex flex-wrap gap-1.5">
                          {w.topics.map(t => <span key={t} className="text-xs px-2 py-0.5 bg-secondary rounded">{t}</span>)}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* CONCEPTS WITH INLINE RESOURCES */}
                          <Section icon={<BookOpen className="w-4 h-4" />} title="Key concepts">
                            <ul className="space-y-3 text-sm">
                              {wd.concepts.map((c, i) => {
                                const links = wd.conceptLinks?.[i];
                                return (
                                  <li key={i}>
                                    <div className="flex gap-2">
                                      <span className="text-primary mt-1.5 text-xs">●</span>
                                      <span className="flex-1">{c}</span>
                                    </div>
                                    {links && links.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 ml-5 mt-1.5">
                                        {links.map((r, j) => (
                                          <a key={j} href={r.url} target="_blank" rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-xs bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary px-2 py-0.5 rounded-full transition-colors">
                                            <GraduationCap className="w-3 h-3" />
                                            <span className="leading-none">{r.label}</span>
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </Section>

                          {/* TODOS — INTERACTIVE CHECKBOXES */}
                          <Section
                            icon={<CheckSquare className="w-4 h-4" />}
                            title="This week's plan"
                            badge={todosTotal > 0 ? `${todosDone}/${todosTotal}` : undefined}
                          >
                            <ul className="space-y-0.5 text-sm">
                              {wd.todos.map((t, i) => {
                                const todoKey = `${phase.phase}|${w.week}|${i}`;
                                const isCheckpoint = t.startsWith('***');
                                const isSubItem = !isCheckpoint && t.trim().startsWith('✓');

                                if (isCheckpoint) {
                                  return (
                                    <li key={i} className="mt-3 mb-1 font-semibold text-amber-400 text-xs uppercase tracking-wider">
                                      {t.replace(/^\*\*\* /, '')}
                                    </li>
                                  );
                                }

                                if (isSubItem) {
                                  return (
                                    <li key={i} className="flex gap-2 ml-4 text-foreground/70 py-0.5">
                                      <span className="text-emerald-400 mt-0.5">✓</span>
                                      <span className="flex-1">{t.replace(/^\s*✓\s*/, '')}</span>
                                    </li>
                                  );
                                }

                                const isChecked = !!todoChecks[todoKey];
                                return (
                                  <li key={i}>
                                    <button onClick={() => toggleTodo(todoKey)}
                                      className="flex items-start gap-2 w-full text-left p-1.5 rounded-md hover:bg-secondary/50 transition-colors">
                                      <div className={cn('w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                                        isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-input bg-transparent group-hover:border-primary')}>
                                        {isChecked && <span className="text-white text-xs leading-none">✓</span>}
                                      </div>
                                      <span className={cn('flex-1 transition-colors', isChecked && 'line-through text-muted-foreground')}>{t}</span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                            {todosTotal > 0 && (
                              <Progress value={todosTotal ? todosDone / todosTotal * 100 : 0}
                                className="h-1 mt-3"
                                indicatorClassName={todosDone === todosTotal ? 'bg-emerald-500 from-emerald-500 to-emerald-400' : ''} />
                            )}
                          </Section>
                        </div>

                        {/* GENERAL RESOURCES */}
                        <Section icon={<ExternalLink className="w-4 h-4" />} title="Additional study resources">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                            {wd.resources.map((r, i) => (
                              <a key={i} href={r.url} target="_blank" rel="noreferrer"
                                className="text-sm text-primary hover:text-primary/80 hover:underline flex items-center gap-1.5">
                                <ExternalLink className="w-3 h-3 flex-shrink-0" /> {r.label}
                              </a>
                            ))}
                          </div>
                        </Section>

                        {/* CTA */}
                        <div className="flex flex-wrap gap-2 pt-2 items-center">
                          <Button onClick={() => viewWeekProblems(phase.phase, w.week)} size="sm">
                            View {wkProblems.length} problems →
                          </Button>
                          {wd.problemTarget && (
                            <span className="text-xs text-muted-foreground self-center ml-2">
                              <Calendar className="w-3 h-3 inline mr-1" />Target: {wd.problemTarget}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function SummaryStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-secondary/40 border border-border/50 rounded-lg px-3 py-2 min-w-[110px]">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </div>
  );
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-secondary/40 border border-border/50 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">{icon}{label}</div>
      <div className="text-sm mt-1">{value}</div>
    </div>
  );
}

function Section({ icon, title, badge, children }: { icon: React.ReactNode; title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          {icon}{title}
        </div>
        {badge && <span className="text-xs text-muted-foreground font-mono">{badge}</span>}
      </div>
      {children}
    </div>
  );
}
