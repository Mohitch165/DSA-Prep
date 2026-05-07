import { useEffect } from 'react';

const PARTICLES = [
  { left: '8%',  color: '#22c55e', delay: '0s',    dur: '0.9s'  },
  { left: '20%', color: '#3b82f6', delay: '0.1s',  dur: '1.1s'  },
  { left: '33%', color: '#a855f7', delay: '0.05s', dur: '0.85s' },
  { left: '47%', color: '#f59e0b', delay: '0.15s', dur: '1.0s'  },
  { left: '60%', color: '#ef4444', delay: '0.2s',  dur: '0.75s' },
  { left: '73%', color: '#22c55e', delay: '0.08s', dur: '1.05s' },
  { left: '85%', color: '#06b6d4', delay: '0.25s', dur: '0.95s' },
  { left: '14%', color: '#f97316', delay: '0.12s', dur: '1.15s' },
  { left: '55%', color: '#8b5cf6', delay: '0.18s', dur: '0.8s'  },
  { left: '40%', color: '#ec4899', delay: '0.22s', dur: '1.02s' },
  { left: '68%', color: '#14b8a6', delay: '0.06s', dur: '0.88s' },
  { left: '92%', color: '#eab308', delay: '0.16s', dur: '0.92s' },
  { left: '25%', color: '#60a5fa', delay: '0.28s', dur: '0.78s' },
  { left: '78%', color: '#f472b6', delay: '0.03s', dur: '1.08s' },
];

interface Props {
  problemTitle: string;
  onDismiss: () => void;
}

export function Celebration({ problemTitle, onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3400);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onDismiss}
      role="dialog"
      aria-label="Problem solved celebration"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Card */}
      <div className="relative z-10 bg-card border-2 border-emerald-500/60 rounded-2xl p-10 text-center shadow-2xl animate-celebration max-w-sm mx-4 pointer-events-none">
        <div className="text-6xl mb-4 select-none">🎉</div>
        <div className="text-3xl font-bold text-emerald-400 mb-2">Nailed it!</div>
        <div className="text-foreground/80 font-medium text-sm">{problemTitle}</div>
        <div className="text-xs text-muted-foreground/60 mt-5">tap anywhere to dismiss</div>
      </div>

      {/* Confetti particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute top-0 w-2 h-3 rounded-sm animate-confetti-fall pointer-events-none"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}
