import { useState, useCallback, useEffect } from 'react';
import { getAttachmentCounts } from './lib/attachments';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Problems } from './components/Problems';
import { Roadmap } from './components/Roadmap';
import { Patterns } from './components/Patterns';
import { Companies } from './components/Companies';
import { Guide } from './components/Guide';
import { NotesModal } from './components/NotesModal';
import { Celebration } from './components/Celebration';
import { useProgress } from './hooks/useProgress';
import { useADHD } from './hooks/useADHD';
import { PROBLEMS } from './data/problems';
import type { FilterState, Tab, Status } from './types';

const initialFilters: FilterState = {
  search: '', company: '', difficulty: new Set(), pattern: '',
  status: new Set(), minFrequency: 1, phase: '', blind75Only: false, week: null,
  sortBy: 'id', sortDir: 'asc',
};

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [notesId, setNotesId] = useState<number | null>(null);
  const [celebrationProblem, setCelebrationProblem] = useState<{ id: number; title: string } | null>(null);
  const { progress, getStatus, setStatus: rawSetStatus, setNotes, exportData } = useProgress();
  const { energyLevel, setEnergyLevel, welcomeBack, dismissWelcomeBack } = useADHD();
  const [attachmentCounts, setAttachmentCounts] = useState<Map<number, number>>(new Map());

  const refreshAttachments = useCallback(() => {
    getAttachmentCounts().then(setAttachmentCounts).catch(console.error);
  }, []);

  useEffect(() => { refreshAttachments(); }, [refreshAttachments]);

  const setStatus = useCallback((id: number, status: Status) => {
    const prevStatus = getStatus(id);
    rawSetStatus(id, status);
    if (status === 'solved' && prevStatus !== 'solved') {
      const problem = PROBLEMS.find(p => p.id === id);
      if (problem) setCelebrationProblem({ id, title: problem.title });
    }
  }, [rawSetStatus, getStatus]);

  const updateFilters = useCallback((fn: (prev: FilterState) => FilterState) => setFilters(fn), []);

  return (
    <div className="min-h-screen text-foreground">
      <Header tab={tab} setTab={setTab} progress={progress} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {tab === 'dashboard' && (
          <Dashboard
            progress={progress}
            setTab={setTab}
            setFilters={updateFilters}
            exportData={exportData}
            energyLevel={energyLevel}
            onEnergyChange={setEnergyLevel}
            welcomeBack={welcomeBack}
            onDismissWelcome={dismissWelcomeBack}
          />
        )}
        {tab === 'problems' && (
          <Problems
            filters={filters} setFilters={updateFilters}
            progress={progress} getStatus={getStatus} setStatus={setStatus}
            openNotes={setNotesId}
            attachmentCounts={attachmentCounts}
          />
        )}
        {tab === 'roadmap' && (
          <Roadmap progress={progress} setTab={setTab} setFilters={updateFilters} getStatus={getStatus} />
        )}
        {tab === 'patterns' && (
          <Patterns progress={progress} setTab={setTab} setFilters={updateFilters} />
        )}
        {tab === 'companies' && (
          <Companies progress={progress} setTab={setTab} setFilters={updateFilters} />
        )}
        {tab === 'guide' && (
          <Guide progress={progress} />
        )}
      </main>
      <NotesModal problemId={notesId} onClose={() => setNotesId(null)} progress={progress} setNotes={setNotes} onAttachmentsChange={refreshAttachments} />
      {celebrationProblem && (
        <Celebration
          problemTitle={celebrationProblem.title}
          onDismiss={() => setCelebrationProblem(null)}
        />
      )}
    </div>
  );
}
