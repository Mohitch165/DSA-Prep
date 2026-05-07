import { useState, useCallback, useEffect } from 'react';
import type { ProgressMap, Status } from '@/types';

const KEY = 'dsa_progress_v1';

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress));
  }, [progress]);

  const setStatus = useCallback((id: number, status: Status) => {
    setProgress(prev => {
      const existing = prev[id] || { status: 'not_started' as Status, solvedDate: null, notes: '' };
      const next = { ...existing, status };
      if (status === 'solved' && !existing.solvedDate) next.solvedDate = new Date().toISOString();
      if (status === 'not_started') next.solvedDate = null;
      return { ...prev, [id]: next };
    });
  }, []);

  const setNotes = useCallback((id: number, notes: string) => {
    setProgress(prev => {
      const existing = prev[id] || { status: 'not_started' as Status, solvedDate: null, notes: '' };
      return { ...prev, [id]: { ...existing, notes } };
    });
  }, []);

  const getStatus = useCallback((id: number): Status => progress[id]?.status || 'not_started', [progress]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [progress]);

  return { progress, getStatus, setStatus, setNotes, exportData };
}
