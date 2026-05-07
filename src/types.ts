export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Status = 'not_started' | 'in_progress' | 'solved' | 'reviewed';
export type Tab = 'dashboard' | 'problems' | 'roadmap' | 'patterns' | 'companies' | 'guide';

export interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  pattern: string;
  companies: string[];
  frequency: number;
  phase: string;
  week: number;
  topic: string;
  blind75?: boolean;
}

export interface ProgressEntry {
  status: Status;
  solvedDate: string | null;
  notes: string;
}

export type ProgressMap = Record<number, ProgressEntry>;

export interface Pattern {
  id: string;
  name: string;
  category: 'Core' | 'Foundation' | 'Advanced';
}

export interface Company {
  name: string;
  tier: 1 | 2 | 3 | 4;
  primary: string[];
}

export interface RoadmapWeek {
  week: number;
  dates: string;
  title: string;
  topics: string[];
}

export interface RoadmapPhase {
  phase: string;
  weeks: RoadmapWeek[];
}

export interface DiffStat { total: number; solved: number; }
export interface PhaseStat { total: number; solved: number; }

export interface Stats {
  total: number;
  solved: number;
  in_progress: number;
  reviewed: number;
  not_started: number;
  easy: DiffStat;
  medium: DiffStat;
  hard: DiffStat;
  blind75: DiffStat;
  byPattern: Record<string, DiffStat>;
  byCompany: Record<string, DiffStat>;
  byPhase: Record<string, PhaseStat>;
  weeklyActivity: Record<string, number>;
}

export interface FilterState {
  search: string;
  company: string;
  difficulty: Set<Difficulty>;
  pattern: string;
  status: Set<Status>;
  minFrequency: number;
  phase: string;
  blind75Only: boolean;
  week: number | null;
  sortBy: 'id' | 'title' | 'difficulty' | 'frequency' | 'pattern' | 'companies';
  sortDir: 'asc' | 'desc';
}
