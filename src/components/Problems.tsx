import { useMemo, useState } from 'react';
import { ExternalLink, FileText, ArrowUpDown, Paperclip, ChevronDown, ChevronUp, Focus, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { PROBLEMS, COMPANIES } from '@/data/problems';
import { cn, leetcodeUrl } from '@/lib/utils';
import type { Difficulty, FilterState, ProgressMap, Status } from '@/types';

interface Props {
  filters: FilterState;
  setFilters: (fn: (prev: FilterState) => FilterState) => void;
  progress: ProgressMap;
  getStatus: (id: number) => Status;
  setStatus: (id: number, s: Status) => void;
  openNotes: (id: number) => void;
  attachmentCounts?: Map<number, number>;
}

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const STATUSES: Status[] = ['not_started', 'in_progress', 'solved', 'reviewed'];
const STATUS_LABEL: Record<Status, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  solved: 'Solved',
  reviewed: 'Reviewed',
};
const STATUS_COLOR: Record<Status, string> = {
  not_started: 'bg-secondary/60 text-muted-foreground border-border',
  in_progress: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
  solved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  reviewed: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
};

export function Problems({ filters, setFilters, progress, getStatus, setStatus, openNotes, attachmentCounts }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);

  const allCompanies = useMemo(() => COMPANIES.map(c => c.name).sort(), []);
  const allPatterns = useMemo(() => [...new Set(PROBLEMS.map(p => p.pattern))].sort(), []);

  const filtered = useMemo(() => {
    let arr = PROBLEMS.filter(p => {
      if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.company && !p.companies.includes(filters.company)) return false;
      if (filters.pattern && p.pattern !== filters.pattern) return false;
      if (filters.phase && p.phase !== filters.phase) return false;
      if (filters.difficulty.size && !filters.difficulty.has(p.difficulty)) return false;
      if (filters.status.size && !filters.status.has(getStatus(p.id))) return false;
      if (p.frequency < filters.minFrequency) return false;
      if (filters.blind75Only && !p.blind75) return false;
      if (filters.week !== null && p.week !== filters.week) return false;
      return true;
    });
    arr.sort((a, b) => {
      let av: number | string, bv: number | string;
      switch (filters.sortBy) {
        case 'title': av = a.title; bv = b.title; break;
        case 'difficulty': av = ['Easy', 'Medium', 'Hard'].indexOf(a.difficulty); bv = ['Easy', 'Medium', 'Hard'].indexOf(b.difficulty); break;
        case 'frequency': av = a.frequency; bv = b.frequency; break;
        case 'pattern': av = a.pattern; bv = b.pattern; break;
        case 'companies': av = a.companies.length; bv = b.companies.length; break;
        default: av = a.id; bv = b.id;
      }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return filters.sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filters, progress, getStatus]);

  const toggleSet = <T,>(set: Set<T>, val: T): Set<T> => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val); else next.add(val);
    return next;
  };

  const reset = () => setFilters(() => ({
    search: '', company: '', difficulty: new Set(), pattern: '',
    status: new Set(), minFrequency: 1, phase: '', blind75Only: false, week: null,
    sortBy: 'id', sortDir: 'asc',
  }));

  const focusProblem = filtered[focusIndex] ?? null;
  const focusStatus = focusProblem ? getStatus(focusProblem.id) : 'not_started';

  // ── Focus Mode — one problem at a time, no overwhelm ──────────────────────
  if (focusMode && focusProblem) {
    return (
      <div className="animate-fade-in space-y-4 max-w-2xl mx-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-primary">Focus Mode</span>
            <span className="text-sm text-muted-foreground">{focusIndex + 1} / {filtered.length}</span>
          </div>
          <button
            onClick={() => setFocusMode(false)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" /> Exit Focus
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500"
            style={{ width: `${filtered.length ? ((focusIndex + 1) / filtered.length) * 100 : 0}%` }}
          />
        </div>

        {/* Problem card */}
        <div className="focus-problem-card rounded-2xl p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant={focusProblem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>
                  {focusProblem.difficulty}
                </Badge>
                {focusProblem.blind75 && (
                  <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">★ Blind 75</span>
                )}
                <span className="text-xs text-muted-foreground">
                  {focusProblem.phase} · Week {focusProblem.week}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{focusProblem.title}</h2>
              <div className="text-sm text-muted-foreground mb-2">{focusProblem.pattern}</div>
              <FreqStars n={focusProblem.frequency} />
            </div>
            <a
              href={leetcodeUrl(focusProblem.slug)}
              target="_blank"
              rel="noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-all text-sm font-medium"
            >
              Open LeetCode
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Big status buttons — no tiny dropdown */}
          <div className="mb-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Mark as:</div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(focusProblem.id, s)}
                  className={cn(
                    'px-5 py-2.5 rounded-xl text-sm font-medium border transition-all',
                    focusStatus === s
                      ? `${STATUS_COLOR[s]} scale-105 shadow-md`
                      : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {STATUS_LABEL[s]}{focusStatus === s ? ' ✓' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <button
            onClick={() => openNotes(focusProblem.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground bg-secondary/40 hover:bg-secondary transition-all"
          >
            <FileText className="w-4 h-4" />
            Notes & Attachments
            {(progress[focusProblem.id]?.notes || (attachmentCounts?.get(focusProblem.id) ?? 0) > 0) && (
              <span className="w-1.5 h-1.5 bg-primary rounded-full inline-block" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setFocusIndex(i => Math.max(0, i - 1))}
            disabled={focusIndex === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary/40 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          <span className="text-xs text-muted-foreground">{focusIndex + 1} of {filtered.length}</span>
          <button
            onClick={() => setFocusIndex(i => Math.min(filtered.length - 1, i + 1))}
            disabled={focusIndex >= filtered.length - 1}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary/40 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  // ── Normal list view ───────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          {/* Primary row — always visible: search + status + focus mode */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex-1 min-w-48">
              <Input
                placeholder="Search problems…"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => setFilters(f => ({ ...f, status: toggleSet(f.status, s) }))}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    filters.status.has(s)
                      ? STATUS_COLOR[s]
                      : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setFocusMode(true); setFocusIndex(0); }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-all whitespace-nowrap"
            >
              <Focus className="w-3.5 h-3.5" />
              Focus Mode
            </button>
          </div>

          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showAdvanced ? 'Hide' : 'More'} filters
          </button>

          {showAdvanced && (
            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select value={filters.company} onChange={e => setFilters(f => ({ ...f, company: e.target.value }))}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="">All Companies</option>
                  {allCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filters.pattern} onChange={e => setFilters(f => ({ ...f, pattern: e.target.value }))}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="">All Patterns</option>
                  {allPatterns.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={filters.phase} onChange={e => setFilters(f => ({ ...f, phase: e.target.value }))}
                  className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
                  <option value="">All Phases</option>
                  <option value="Phase 0">Phase 0</option>
                  <option value="Month 1">Month 1</option>
                  <option value="Month 2">Month 2</option>
                  <option value="Month 3">Month 3</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground">Difficulty:</span>
                {DIFFICULTIES.map(d => (
                  <button key={d} onClick={() => setFilters(f => ({ ...f, difficulty: toggleSet(f.difficulty, d) }))}
                    className={cn('px-3 py-1 rounded-full text-xs border transition',
                      filters.difficulty.has(d)
                        ? d === 'Easy' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                        : d === 'Medium' ? 'border-amber-500/40 bg-amber-500/15 text-amber-400'
                        : 'border-red-500/40 bg-red-500/15 text-red-400'
                        : 'bg-secondary text-muted-foreground border-transparent'
                    )}>{d}</button>
                ))}
                <span className="text-xs text-muted-foreground ml-3">Min Freq:</span>
                <input type="range" min={1} max={5} value={filters.minFrequency}
                  onChange={e => setFilters(f => ({ ...f, minFrequency: +e.target.value }))} className="w-28 accent-primary" />
                <span className="text-xs">{filters.minFrequency}+</span>
                <label className="ml-3 text-xs flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" checked={filters.blind75Only} className="accent-primary"
                    onChange={e => setFilters(f => ({ ...f, blind75Only: e.target.checked }))} />
                  Blind 75 only
                </label>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">{filtered.length}</span> of {PROBLEMS.length} problems
            </div>
            <Button variant="ghost" size="sm" onClick={reset} className="text-xs">Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left">
                <SortableTh sortBy={filters.sortBy} sortDir={filters.sortDir} col="id" setSort={setFilters}>#</SortableTh>
                <SortableTh sortBy={filters.sortBy} sortDir={filters.sortDir} col="title" setSort={setFilters}>Title</SortableTh>
                <SortableTh sortBy={filters.sortBy} sortDir={filters.sortDir} col="difficulty" setSort={setFilters}>Diff.</SortableTh>
                <SortableTh sortBy={filters.sortBy} sortDir={filters.sortDir} col="pattern" setSort={setFilters}>Pattern</SortableTh>
                <th className="px-4 py-3">Companies</th>
                <SortableTh sortBy={filters.sortBy} sortDir={filters.sortDir} col="frequency" setSort={setFilters}>Freq.</SortableTh>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const status = getStatus(p.id);
                const dv = p.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
                return (
                  <tr key={p.id} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{p.id}</td>
                    <td className="px-4 py-3">
                      <a href={leetcodeUrl(p.slug)} target="_blank" rel="noreferrer" className="font-medium hover:text-primary">{p.title}</a>
                      {p.blind75 && <span className="ml-2 text-amber-400 text-xs">★B75</span>}
                      <div className="text-xs text-muted-foreground">{p.phase} · Week {p.week}</div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={dv}>{p.difficulty}</Badge></td>
                    <td className="px-4 py-3 text-foreground/80">{p.pattern}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {p.companies.slice(0, 3).join(', ')}{p.companies.length > 3 ? ` +${p.companies.length - 3}` : ''}
                    </td>
                    <td className="px-4 py-3"><FreqStars n={p.frequency} /></td>
                    <td className="px-4 py-3">
                      <select value={status} onChange={e => setStatus(p.id, e.target.value as Status)}
                        className={cn('h-7 rounded border bg-transparent px-2 text-xs',
                          status === 'solved' ? 'border-emerald-500/40 text-emerald-400'
                          : status === 'in_progress' ? 'border-blue-500/40 text-blue-400'
                          : status === 'reviewed' ? 'border-purple-500/40 text-purple-400'
                          : 'border-input text-muted-foreground')}>
                        {STATUSES.map(s => <option key={s} value={s} className="bg-card">{STATUS_LABEL[s]}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <a href={leetcodeUrl(p.slug)} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" title="Open on LeetCode">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button onClick={() => openNotes(p.id)} className="text-muted-foreground hover:text-foreground relative" title="Notes & attachments">
                          <FileText className="w-4 h-4" />
                          {progress[p.id]?.notes && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />}
                        </button>
                        {attachmentCounts && (attachmentCounts.get(p.id) || 0) > 0 && (
                          <button onClick={() => openNotes(p.id)} className="text-amber-400 hover:text-amber-300 flex items-center gap-0.5" title={`${attachmentCounts.get(p.id)} attachment(s)`}>
                            <Paperclip className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{attachmentCounts.get(p.id)}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No problems match your filters.</div>
        )}
      </Card>
    </div>
  );
}

function SortableTh({ children, col, sortBy, sortDir, setSort }: any) {
  return (
    <th className="px-4 py-3 cursor-pointer hover:text-foreground select-none" onClick={() => {
      setSort((f: FilterState) => ({
        ...f, sortBy: col,
        sortDir: f.sortBy === col && f.sortDir === 'asc' ? 'desc' : 'asc',
      }));
    }}>
      <span className="inline-flex items-center gap-1">
        {children}{sortBy === col && <ArrowUpDown className="w-3 h-3" />}
      </span>
    </th>
  );
}

function FreqStars({ n }: { n: number }) {
  return (
    <span className="text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? 'text-amber-400' : 'text-muted-foreground/30'}>★</span>
      ))}
    </span>
  );
}
