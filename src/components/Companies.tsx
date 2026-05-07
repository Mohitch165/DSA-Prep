import { useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { computeStats } from '@/lib/stats';
import { PROBLEMS, COMPANIES } from '@/data/problems';
import type { ProgressMap, FilterState, Tab } from '@/types';

const FRESH: FilterState = {
  search: '', company: '', difficulty: new Set(), pattern: '',
  status: new Set(), minFrequency: 1, phase: '', blind75Only: false, week: null,
  sortBy: 'id', sortDir: 'asc',
};

const TIER_INFO: Record<number, { name: string; tagline: string; color: string }> = {
  1: {
    name: 'Tier 1 — FAANG / Dream',
    tagline: 'Hardest problems · 4–5 round process · expects clean fast solutions + clear communication.',
    color: 'border-emerald-500/40',
  },
  2: {
    name: 'Tier 2 — High-Value Tech',
    tagline: 'Medium-to-hard · domain-specific patterns (geo, finance, social graph) · pattern recognition matters.',
    color: 'border-amber-500/40',
  },
  3: {
    name: 'Tier 3 — Other Tech & Finance',
    tagline: 'Mostly medium · classic patterns · quant firms (Two Sigma, Citadel) heavy on math/probability.',
    color: 'border-blue-500/40',
  },
  4: {
    name: 'Tier 4 — Indian Product',
    tagline: 'Mix of easy/medium · company-specific repos · less system design, more DSA volume.',
    color: 'border-purple-500/40',
  },
};

interface Props {
  progress: ProgressMap;
  setTab: (t: Tab) => void;
  setFilters: (fn: (prev: FilterState) => FilterState) => void;
}

export function Companies({ progress, setTab, setFilters }: Props) {
  const stats = useMemo(() => computeStats(PROBLEMS, progress), [progress]);

  const filterByCompany = (name: string) => {
    setFilters(() => ({ ...FRESH, company: name }));
    setTab('problems');
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* COMPANY-SPECIFIC PATTERN GUIDE */}
      <Card>
        <CardContent className="p-5">
          <h2 className="font-semibold mb-1">Company-Specific Pattern Guide</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Each company has a distinct interview style. Match your prep to your top 3 targets — pull their last_3_months CSVs in Month 3.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(t => (
              <div key={t} className={`bg-secondary/30 rounded-lg p-3 border ${TIER_INFO[t].color}`}>
                <div className="font-semibold text-sm">{TIER_INFO[t].name}</div>
                <div className="text-xs text-muted-foreground mt-1">{TIER_INFO[t].tagline}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* COMPANY GRID BY TIER */}
      {[1, 2, 3, 4].map(tier => (
        <div key={tier}>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground/90">{TIER_INFO[tier].name}</h2>
            <Badge variant="outline" className="text-xs">{COMPANIES.filter(c => c.tier === tier).length} companies</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {COMPANIES.filter(c => c.tier === tier).map(c => {
              const d = stats.byCompany[c.name] || { total: 0, solved: 0 };
              const pct = d.total ? Math.round(d.solved / d.total * 100) : 0;
              return (
                <Card key={c.name} className="cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                  onClick={() => filterByCompany(c.name)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{c.name}</h3>
                      <span className="text-xs font-bold text-primary">{pct}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{d.solved}/{d.total} problems</div>
                    <Progress value={pct} className="h-1 mb-2" />
                    <div className="flex flex-wrap gap-1">
                      {c.primary.slice(0, 2).map(p => (
                        <span key={p} className="text-xs px-1.5 py-0.5 bg-secondary rounded">{p}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
