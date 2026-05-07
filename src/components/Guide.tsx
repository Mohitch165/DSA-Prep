import { useState } from 'react';
import { Calendar, Sun, Moon, Mic, Target, CheckSquare, ListChecks, Wrench, ExternalLink, BookOpen, Youtube, Layers, Building2, Rss, Monitor, ChevronDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { computeStats } from '@/lib/stats';
import { PROBLEMS } from '@/data/problems';
import { cn } from '@/lib/utils';
import type { ProgressMap } from '@/types';

const CHECKLIST_KEY = 'dsa_checklists_v1';

const PATTERN_MASTERY = [
  'Two Pointers — code template from memory',
  'Sliding Window — code template from memory',
  'Prefix Sum — code template from memory',
  'Fast & Slow Pointers — code template from memory',
  'Top K Elements (Heap) — code template from memory',
  "Kadane's Algorithm — code template from memory",
  'LL In-place Reversal — code template from memory',
  'Monotonic Stack — code template from memory',
  'Overlapping Intervals — code template from memory',
  'Backtracking — code template from memory',
  'Modified Binary Search — code template from memory',
  'Tree Traversal (BFS + DFS, all orders) — from memory',
  'Graph BFS / DFS — code template from memory',
  'Union-Find (path compression + rank) — from memory',
  'DP — at least 10 of 20 sub-patterns from memory',
];

const TEMPLATE_IMPL = [
  'MinHeap class implemented in JS',
  'Trie class implemented in JS',
  'UnionFind class implemented in JS',
  'BFS template (with index pointer for O(1) dequeue)',
  'DFS iterative template',
  'Backtracking template (choose / explore / unchoose)',
  "Topological Sort (Kahn's BFS)",
];

const REVIEW_CHECKPOINTS = [
  'All Blind 75 problems solved',
  'All LeetCode Top Interview 150 solved',
  'AlgoMaster 300 attempted',
  '2 LeetCode timed contests in Month 2',
  '8+ mock interviews in Month 3',
  '10 STAR behavioral answers prepared',
  'Recited all 15 pattern templates blank (final week)',
];

const STEPS = [
  { n: 1, title: 'Clarify (2-3 min)', desc: 'Ask about input constraints, edge cases, expected output. "Can there be duplicates?" "What\'s the size range?" "Can it be negative?"' },
  { n: 2, title: 'Brute force (1-2 min)', desc: 'State the naive solution verbally: "The O(n²) approach would be...". Explain why it\'s not optimal.' },
  { n: 3, title: 'Optimize (3-5 min)', desc: 'Identify the pattern: "This looks like a [pattern] problem because…". Discuss optimal approach + complexity before coding.' },
  { n: 4, title: 'Code (15-20 min)', desc: 'Write clean, readable code. Narrate as you go. Use meaningful variable names.' },
  { n: 5, title: 'Test (5 min)', desc: 'Walk through with given example. Check edge cases: empty, single element, duplicates, negative numbers.' },
  { n: 6, title: 'Complexity (2 min)', desc: 'State time + space complexity clearly. "This runs in O(n log n) with O(n) extra space for the heap."' },
];

const RULES = [
  'Attempt before hints — minimum 20 min real effort on every problem',
  "Understand, don't memorize — if you can explain WHY, you own it",
  'Re-solve after 3 days — spaced repetition is the most important habit',
  'Time every problem — Easy ≤15min, Medium ≤30min, Hard ≤45min',
  'Verbalize your approach — practice out loud before typing, every time',
  "One concept per day — don't try graphs and DP on the same day",
];

// ── Resource data (from curated GitHub starred repos) ──────────────────────

const LEARNING_RESOURCES = [
  { name: 'hello-algo', url: 'https://www.hello-algo.com/', desc: 'Animated DSA book — visual, beginner-friendly, 12+ languages including JS/TS. Run code in-browser.', badge: 'Book' },
  { name: 'DSA.js (JavaScript)', url: 'https://github.com/amejiarosario/dsa.js-data-structures-algorithms-javascript', desc: 'DSA in JavaScript with Big-O analysis, linear/non-linear structures, sorting, and algorithmic toolbox.', badge: 'JS' },
  { name: 'Awesome LeetCode Resources', url: 'https://github.com/ashishps1/awesome-leetcode-resources', desc: 'Mega-curated list: patterns, articles, playlists, courses, books, extensions — bookmark this first.', badge: 'Meta' },
  { name: 'AlgoMaster', url: 'https://algomaster.io/', desc: 'AlgoMaster 300 problem sheet + animated algorithm visualizations built into the platform.', badge: 'Sheet' },
];

const PROBLEM_SHEETS = [
  { name: 'Blind 75', url: 'https://www.techinterviewhandbook.org/grind75', desc: 'Must-solve 75 problems covering all patterns — the baseline every interviewer expects.' },
  { name: 'NeetCode 150', url: 'https://neetcode.io/practice', desc: 'NeetCode\'s curated 150 with video explanations for each problem — excellent quality.' },
  { name: 'Grind 75', url: 'https://www.techinterviewhandbook.org/grind75', desc: 'Time-boxed version of Blind 75 — adjusts automatically to available weeks.' },
  { name: 'Striver SDE Sheet', url: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', desc: 'Comprehensive 450-problem sheet with concept explanations for each topic.' },
  { name: 'AlgoMaster 300', url: 'https://algomaster.io/practice', desc: '300 curated problems with pattern classification and a smooth difficulty curve.' },
  { name: 'LeetCode Top 100 Liked', url: 'https://leetcode.com/problem-list/top-100-liked-questions/', desc: 'Community top-100 liked problems — high signal for what interviewers actually ask.' },
  { name: 'Top Interview 150', url: 'https://leetcode.com/problem-list/top-interview-questions/', desc: "LeetCode's official interview preparation list — covers all core topics." },
];

const PATTERN_ARTICLES = [
  { name: '14 Coding Interview Patterns', url: 'https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed', desc: 'HackerNoon mega-guide on how to identify and apply the right pattern.' },
  { name: 'Sliding Window Templates', url: 'https://leetcode.com/discuss/general-discussion/657507', desc: '4 variants: fixed size, variable size shrink-on-condition, two strings.' },
  { name: 'Binary Search (3 Templates)', url: 'https://leetcode.com/discuss/general-discussion/786126', desc: 'Three templates that cover every binary search variant — pick one and master it.' },
  { name: 'Dynamic Programming Patterns (23)', url: 'https://leetcode.com/discuss/general-discussion/458695', desc: 'Full DP taxonomy: Fibonacci, Knapsack, LCS, Matrix, Interval, Bitmask, Tree DP.' },
  { name: 'Graph for Beginners', url: 'https://leetcode.com/discuss/general-discussion/655708', desc: 'BFS/DFS graph problems grouped by pattern with clean solution templates.' },
  { name: 'Backtracking Templates', url: 'https://leetcode.com/discuss/general-discussion/680706', desc: 'Choose / explore / unchoose framework with 5 template variants.' },
  { name: 'Monotonic Stack Guide', url: 'https://leetcode.com/discuss/general-discussion/2347639', desc: 'Next Greater / Smaller templates with annotated examples.' },
  { name: 'Tree Traversal (All Orders)', url: 'https://leetcode.com/discuss/general-discussion/1072548', desc: 'All tree traversal orders iterative + recursive, with problem patterns.' },
];

const YOUTUBE_CHANNELS = [
  { name: 'NeetCode', url: 'https://www.youtube.com/@NeetCode', desc: 'Clean, concise LeetCode solutions with pattern explanations — the gold standard.', extra: '1M+ subs' },
  { name: 'Abdul Bari Algorithms', url: 'https://www.youtube.com/@abdul_bari', desc: 'Deep theoretical + visual algorithm explanations — great for fundamentals.', extra: '700K+ subs' },
  { name: 'William Fiset', url: 'https://www.youtube.com/@WilliamFiset-videos', desc: 'Data structures from scratch — graphs, trees, heaps with animations.', extra: '300K+ subs' },
  { name: 'Tushar Roy', url: 'https://www.youtube.com/@tusharroy2525', desc: 'DP problems explained step-by-step using tabulation approach.', extra: '500K+ subs' },
  { name: 'Back To Back SWE', url: 'https://www.youtube.com/@BackToBackSWE', desc: 'FAANG interview problems with whiteboard-style walkthroughs.', extra: '300K+ subs' },
];

const COMPANY_TOOLS = [
  { name: 'CodeJeet', url: 'https://github.com/ayush-that/codejeet', desc: '17,000+ company-wise LC questions · 660+ companies · 16-chapter system design · 2,700+ blog articles.', badge: 'App' },
  { name: 'LCGrind', url: 'https://lcgrind.zackozack.xyz/', desc: 'Company-wise LC + Grind 75, NeetCode 150, Striver SDE sheets with built-in progress tracking.', badge: 'App' },
  { name: 'Company-Wise LeetCode (Farneet)', url: 'https://company-wise-leetcode-farneet.netlify.app/', desc: '100+ companies with timeline filtering: 30d / 3m / 6m / 1y.', badge: 'App' },
  { name: 'Company-Wise DSA (Nishant)', url: 'https://github.com/nishant-Tiwari24/company-wise-dsa', desc: '35+ companies with problem links + pattern hints per company. Includes "50 Tricks to Identify DSA Patterns" guide.', badge: 'GitHub' },
  { name: 'LeetCode Company CSV Data', url: 'https://github.com/snehasishroy/leetcode-companywise-interview-questions', desc: 'Raw CSV data: company-wise LC questions sorted by recency. Snapshot Feb 2026.', badge: 'Data' },
  { name: 'Company-Wise Projects (Portfolio)', url: 'https://github.com/nishant-Tiwari24/company-wise-projects', desc: '80+ companies × 3 AI/ML project ideas each — build portfolio projects that match your target company.', badge: 'Portfolio' },
];

const ENGINEERING_BLOGS = [
  { name: 'Netflix Tech Blog', url: 'https://netflixtechblog.com/', desc: 'Microservices, streaming at scale, chaos engineering, ML recommendations.' },
  { name: 'Uber Engineering', url: 'https://eng.uber.com/', desc: 'SOA architecture, push platform, geospatial indexing, real-time data systems.' },
  { name: 'Airbnb Engineering', url: 'https://medium.com/airbnb-engineering', desc: 'Payments infrastructure, knowledge retrieval, frontend architecture at scale.' },
  { name: 'Discord Engineering', url: 'https://discord.com/blog/', desc: 'Billions of messages, MongoDB to Cassandra migration, scaling voice/video.' },
  { name: 'Dropbox Tech', url: 'https://dropbox.tech/', desc: 'File sync at scale, distributed storage, Python to Go migration story.' },
  { name: 'Twitter/X Engineering', url: 'https://blog.x.com/engineering/en_us', desc: 'Timeline ranking, distributed systems, ad serving at massive scale.' },
  { name: 'Hotstar Engineering', url: 'https://blog.hotstar.com/', desc: 'Live streaming for billions — Cricket World Cup scale challenges.' },
];

const VIZ_AND_TOOLS = [
  { name: 'VisuAlgo', url: 'https://visualgo.net/', desc: 'Interactive DSA visualizations — sorting, graph traversal, tree ops, DP tables.' },
  { name: 'USFCA Algorithm Visualizer', url: 'https://www.cs.usfca.edu/~galles/visualization/Algorithms.html', desc: 'Classic visualizer — trees, heaps, sorting, hashing with step-by-step animation.' },
  { name: 'LeetHub v2 (Chrome)', url: 'https://chromewebstore.google.com/detail/leethub-v2/mhanfgfagplhgemhjfeolkkdidbakocm', desc: 'Auto-pushes accepted solutions to GitHub. Builds your DSA repo silently in the background.' },
  { name: 'LeetCode Timer (Chrome)', url: 'https://chromewebstore.google.com/detail/leetcode-timer/gfkgelnlcnomnahkfmhemgpahgmibofd', desc: 'Overlay timer on every problem. Train to hit Easy≤15m / Medium≤30m / Hard≤45m.' },
  { name: 'Video Solutions (Chrome)', url: 'https://chromewebstore.google.com/detail/video-solutions-for-leetc/diognjkjkidhbnibmbadlnfofikjljco', desc: 'Adds NeetCode and Kevin Naughton Jr. video buttons to every LC problem page.' },
  { name: 'LeetCode VS Code Extension', url: 'https://marketplace.visualstudio.com/items?itemName=LeetCode.vscode-leetcode', desc: 'Solve LeetCode problems directly in VS Code with test case runner.' },
];

const RESOURCE_GROUPS = [
  { id: 'learning', icon: <BookOpen className="w-4 h-4" />, title: 'Learning Resources', subtitle: '4 essential resources to build your DSA foundation', items: LEARNING_RESOURCES, defaultOpen: true },
  { id: 'sheets', icon: <Layers className="w-4 h-4" />, title: 'Problem Sheets', subtitle: '7 curated problem lists — start with Blind 75, then NeetCode 150', items: PROBLEM_SHEETS, defaultOpen: true },
  { id: 'patterns', icon: <Target className="w-4 h-4" />, title: 'Pattern Articles & Templates', subtitle: 'Must-read LeetCode Discuss articles with reusable code templates', items: PATTERN_ARTICLES, defaultOpen: false },
  { id: 'youtube', icon: <Youtube className="w-4 h-4" />, title: 'YouTube Channels', subtitle: 'Learn by watching — these channels explain patterns visually', items: YOUTUBE_CHANNELS, defaultOpen: false },
  { id: 'company', icon: <Building2 className="w-4 h-4" />, title: 'Company-Wise Tools', subtitle: 'Filter problems by company and timeline — use in Month 3', items: COMPANY_TOOLS, defaultOpen: false },
  { id: 'blogs', icon: <Rss className="w-4 h-4" />, title: 'Engineering Blogs (System Design)', subtitle: 'Read real-world architecture decisions from top tech companies', items: ENGINEERING_BLOGS, defaultOpen: false },
  { id: 'tools', icon: <Monitor className="w-4 h-4" />, title: 'Visualization Tools & Extensions', subtitle: 'See algorithms move + automate your practice workflow', items: VIZ_AND_TOOLS, defaultOpen: false },
];

interface Props { progress: ProgressMap; }

export function Guide({ progress }: Props) {
  const [checks, setChecks] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}'); }
    catch { return {}; }
  });

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(RESOURCE_GROUPS.filter(g => g.defaultOpen).map(g => g.id))
  );

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggle = (key: string) => {
    setChecks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const stats = computeStats(PROBLEMS, progress);
  const solvedTotal = stats.solved + stats.reviewed;
  const completionPct = stats.total ? Math.round(solvedTotal / stats.total * 100) : 0;

  const phaseTargets = [
    { phase: 'Phase 0', range: 'May 7–31', target: '40–50', actual: (stats.byPhase['Phase 0'] || { solved: 0 }).solved },
    { phase: 'Month 1', range: 'June', target: '100–120', actual: (stats.byPhase['Month 1'] || { solved: 0 }).solved },
    { phase: 'Month 2', range: 'July', target: '130–160', actual: (stats.byPhase['Month 2'] || { solved: 0 }).solved },
    { phase: 'Month 3', range: 'August', target: '100–120', actual: (stats.byPhase['Month 3'] || { solved: 0 }).solved },
  ];

  const checklistProgress = (items: string[], prefix: string) => {
    const done = items.filter((_, i) => checks[`${prefix}_${i}`]).length;
    return { done, total: items.length, pct: Math.round(done / items.length * 100) };
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* DAILY SCHEDULE */}
      <section>
        <SectionHeader icon={<Calendar />} title="Daily Schedule Template"
          subtitle="The repeatable rhythm that compounds across 17 weeks." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold">Weekday — 3 hours total</h3>
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-3 mb-1.5">Session 1 — Morning (60 min)</div>
              <ul className="text-sm space-y-1 text-foreground/80 ml-1">
                <li>• 15 min — Review yesterday's problems (re-read solution)</li>
                <li>• 30 min — Learn new concept (hello-algo / AlgoMaster)</li>
                <li>• 15 min — Read pattern article / template</li>
              </ul>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-4 mb-1.5">Session 2 — Evening (2 hours)</div>
              <ul className="text-sm space-y-1 text-foreground/80 ml-1">
                <li>• Solve 2–3 problems on current week's topic</li>
                <li>• Easy ≤15min · Medium ≤30min · Hard ≤45min</li>
                <li>• Note pattern + key insight after each</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold">Weekend — 5 hours total</h3>
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-3 mb-1.5">Morning (2.5h)</div>
              <ul className="text-sm space-y-1 text-foreground/80 ml-1">
                <li>• 4–5 problems on current week's topics</li>
                <li>• At least 1 hard problem</li>
              </ul>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-4 mb-1.5">Afternoon (1.5h)</div>
              <ul className="text-sm space-y-1 text-foreground/80 ml-1">
                <li>• Week 5+: 1 mock interview (Pramp / Interviewing.io)</li>
                <li>• OR: 1 timed LeetCode contest (75 min)</li>
              </ul>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mt-4 mb-1.5">Evening (1h)</div>
              <ul className="text-sm space-y-1 text-foreground/80 ml-1">
                <li>• Review weekend solutions</li>
                <li>• Update tracker (this app)</li>
                <li>• Write / update pattern templates</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary" />The Six Rules</h3>
            <ol className="space-y-2 text-sm">
              {RULES.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-primary font-bold w-5">{i + 1}.</span>
                  <span className="flex-1">{r}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* MOCK INTERVIEW PROTOCOL */}
      <section>
        <SectionHeader icon={<Mic />} title="Mock Interview Protocol"
          subtitle="Treat mocks as real — they're the highest-leverage practice you can do." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Schedule</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><span className="text-muted-foreground w-32 flex-shrink-0">Week 1–4 (June)</span><span>0 mocks — focus on learning</span></li>
                <li className="flex gap-2"><span className="text-muted-foreground w-32 flex-shrink-0">Week 5–8 (July)</span><span>1 mock/week starting Week 6</span></li>
                <li className="flex gap-2"><span className="text-muted-foreground w-32 flex-shrink-0">Week 9–12 (Aug)</span><span>2 mocks/week → daily in final week</span></li>
              </ul>
              <h3 className="font-semibold mt-5 mb-3">Platforms</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.pramp.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" />Pramp</a> — Free peer-to-peer</li>
                <li><a href="https://interviewing.io/" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" />Interviewing.io</a> — Anonymous mocks with engineers</li>
                <li>LeetCode Mock Contests — timed solo practice</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">The 6-Step Framework</h3>
              <div className="space-y-3">
                {STEPS.map(s => (
                  <div key={s.n} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">{s.n}</div>
                    <div>
                      <div className="font-medium text-sm">{s.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PROGRESS TRACKER */}
      <section>
        <SectionHeader icon={<ListChecks />} title="Progress Tracker"
          subtitle="The four metrics that tell you whether you're on track." />

        {/* Problem count targets */}
        <Card className="mb-4">
          <CardContent className="p-5">
            <h3 className="font-semibold mb-3">Problem Count Targets</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">Phase</th>
                    <th className="text-left py-2">Period</th>
                    <th className="text-left py-2">Target</th>
                    <th className="text-left py-2">Actual</th>
                    <th className="text-left py-2 w-32">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {phaseTargets.map(p => {
                    const lower = parseInt(p.target);
                    const pct = Math.min(100, Math.round((p.actual / lower) * 100));
                    return (
                      <tr key={p.phase} className="border-t border-border/40">
                        <td className="py-2.5 font-medium">{p.phase}</td>
                        <td className="py-2.5 text-muted-foreground">{p.range}</td>
                        <td className="py-2.5">{p.target}</td>
                        <td className={cn('py-2.5 font-bold', p.actual >= lower ? 'text-emerald-400' : '')}>{p.actual}</td>
                        <td className="py-2.5"><Progress value={pct} className="h-1.5" /></td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-border bg-secondary/30">
                    <td className="py-3 font-bold">TOTAL</td>
                    <td className="py-3 text-muted-foreground">17 weeks</td>
                    <td className="py-3 font-bold">370–450</td>
                    <td className={cn('py-3 font-bold text-lg', solvedTotal >= 370 ? 'text-emerald-400' : 'text-primary')}>{solvedTotal}</td>
                    <td className="py-3"><Progress value={completionPct} className="h-2" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Mastery Checklist */}
        <ChecklistCard
          icon={<CheckSquare className="w-4 h-4 text-primary" />}
          title="Pattern Mastery Checklist"
          subtitle="Can you write each template from memory? Tick when yes."
          items={PATTERN_MASTERY}
          prefix="pattern"
          checks={checks}
          toggle={toggle}
          progress={checklistProgress(PATTERN_MASTERY, 'pattern')}
        />

        {/* Template Implementations */}
        <ChecklistCard
          icon={<Wrench className="w-4 h-4 text-cyan-400" />}
          title="Template Implementations (JS)"
          subtitle="Code these reusable utility classes once and reuse forever."
          items={TEMPLATE_IMPL}
          prefix="impl"
          checks={checks}
          toggle={toggle}
          progress={checklistProgress(TEMPLATE_IMPL, 'impl')}
        />

        {/* Review Checkpoints */}
        <ChecklistCard
          icon={<Target className="w-4 h-4 text-amber-400" />}
          title="Major Review Checkpoints"
          subtitle="The big milestones that must clear before interview season."
          items={REVIEW_CHECKPOINTS}
          prefix="review"
          checks={checks}
          toggle={toggle}
          progress={checklistProgress(REVIEW_CHECKPOINTS, 'review')}
        />
      </section>

      {/* RESOURCES */}
      <section>
        <SectionHeader icon={<BookOpen />} title="Resources"
          subtitle="Curated from 13 top-starred DSA repos — everything you need, nothing you don't." />
        <div className="space-y-2">
          {RESOURCE_GROUPS.map(group => {
            const isOpen = expandedGroups.has(group.id);
            return (
              <div key={group.id} className="border border-border/50 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-card hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{group.icon}</div>
                    <div>
                      <div className="font-semibold text-sm">{group.title}</div>
                      <div className="text-xs text-muted-foreground">{group.subtitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className="text-xs text-muted-foreground">{group.items.length}</span>
                    <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
                  </div>
                </button>
                {isOpen && (
                  <div className="bg-card/50 border-t border-border/30 divide-y divide-border/20">
                    {group.items.map((item) => (
                      <ResourceItem key={item.name} {...item} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary flex-shrink-0">
        <div className="w-4 h-4">{icon}</div>
      </div>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function ChecklistCard({
  icon, title, subtitle, items, prefix, checks, toggle, progress,
}: {
  icon: React.ReactNode; title: string; subtitle: string;
  items: string[]; prefix: string;
  checks: Record<string, boolean>; toggle: (key: string) => void;
  progress: { done: number; total: number; pct: number };
}) {
  return (
    <Card className="mb-4">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3 gap-4">
          <div className="flex items-start gap-2 flex-1">
            {icon}
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <div className={cn('text-lg font-bold', progress.pct === 100 ? 'text-emerald-400' : 'text-foreground')}>
              {progress.done}/{progress.total}
            </div>
            <div className="text-xs text-muted-foreground">{progress.pct}%</div>
          </div>
        </div>
        <Progress value={progress.pct} className="h-1.5 mb-4" indicatorClassName={progress.pct === 100 ? 'bg-emerald-500 from-emerald-500 to-emerald-400' : ''} />
        <ul className="space-y-1.5">
          {items.map((item, i) => {
            const key = `${prefix}_${i}`;
            const done = !!checks[key];
            return (
              <li key={key}>
                <button onClick={() => toggle(key)}
                  className={cn('flex items-start gap-3 w-full text-left p-2 rounded-md transition-colors',
                    done ? 'bg-emerald-500/5' : 'hover:bg-secondary/50')}>
                  <div className={cn('w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors',
                    done ? 'bg-emerald-500 border-emerald-500' : 'border-input bg-transparent')}>
                    {done && <span className="text-white text-xs leading-none">✓</span>}
                  </div>
                  <span className={cn('text-sm flex-1', done && 'line-through text-muted-foreground')}>{item}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function ResourceItem({ name, url, desc, badge, extra }: {
  name: string; url: string; desc: string; badge?: string; extra?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/40 transition-colors group"
    >
      <ExternalLink className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm group-hover:text-primary transition-colors">{name}</span>
          {badge && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary/70 font-medium">{badge}</span>
          )}
          {extra && (
            <span className="text-xs text-muted-foreground/60">{extra}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </a>
  );
}
