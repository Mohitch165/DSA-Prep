import { useEffect, useState } from 'react';
import { Rocket, Flame } from 'lucide-react';
import { cn, daysBetween } from '@/lib/utils';
import { calcStreak } from '@/lib/stats';
import type { ProgressMap, Tab } from '@/types';

const PREP_START = new Date('2026-06-01');
const PREP_END = new Date('2026-08-31');

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'problems', label: 'Problems', icon: '📋' },
  { id: 'roadmap', label: 'Roadmap', icon: '🗓️' },
  { id: 'patterns', label: 'Patterns', icon: '🎯' },
  { id: 'companies', label: 'Companies', icon: '🏢' },
  { id: 'guide', label: 'Guide', icon: '📖' },
];

interface Props { tab: Tab; setTab: (t: Tab) => void; progress: ProgressMap; }

export function Header({ tab, setTab, progress }: Props) {
  const [today, setToday] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const days = daysBetween(today, PREP_START);
  const inMain = today >= PREP_START && today <= PREP_END;
  const streak = calcStreak(progress);

  return (
    <header className="sticky top-0 z-40 glass border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center glow-primary">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">DSA Mastery Tracker</h1>
            <p className="text-xs text-muted-foreground">
              {inMain ? 'Main prep in progress' : days > 0 ? 'Prerequisites phase' : 'Plan complete'} · {today.toDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{inMain ? 'Day' : 'Until Main'}</div>
            <div className={cn('text-2xl font-bold', inMain ? 'text-emerald-400' : 'text-primary')}>
              {inMain ? daysBetween(PREP_START, today) : days > 0 ? days : '✓'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Streak</div>
            <div className="text-2xl font-bold text-amber-400 flex items-center gap-1 justify-end">
              <Flame className="w-5 h-5" />{streak}
            </div>
          </div>
        </div>
      </div>
      <nav className="max-w-7xl mx-auto px-6 pb-3 flex gap-2 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              tab === t.id
                ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30'
                : 'hover:bg-secondary text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="mr-1.5">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
