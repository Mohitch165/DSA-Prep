import { useMemo, useState } from 'react';
import { ChevronDown, Layers } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { computeStats } from '@/lib/stats';
import { PROBLEMS } from '@/data/problems';
import { cn } from '@/lib/utils';
import type { ProgressMap, FilterState, Tab } from '@/types';

const FRESH: FilterState = {
  search: '', company: '', difficulty: new Set(), pattern: '',
  status: new Set(), minFrequency: 1, phase: '', blind75Only: false, week: null,
  sortBy: 'id', sortDir: 'asc',
};

const DS_TIERS: Record<string, { color: string; items: string[] }> = {
  'Tier 1 — Must Master': {
    color: 'text-emerald-400',
    items: ['Array & 2D Array', 'Strings', 'Hashing (Map/Set)', 'Linked List (Singly/Doubly/Circular)', 'Stack & Queue & Deque', 'Binary Tree & BST'],
  },
  'Tier 2 — High Frequency': {
    color: 'text-amber-400',
    items: ['Heap (Min/Max)', 'Graph (Adj List/Matrix)', 'Trie', 'Disjoint Set / Union-Find'],
  },
  'Tier 3 — Advanced': {
    color: 'text-red-400',
    items: ['Segment Tree', 'Fenwick Tree (BIT)', 'Monotonic Stack/Queue'],
  },
};

const ALGORITHMS = [
  'Searching (Linear/Binary/Ternary)', 'Sorting (Merge/Quick/Heap/Counting/Radix)',
  'Bitwise', 'Mathematical (GCD/Sieve/Modular)', 'Greedy', 'Dynamic Programming',
  'Divide and Conquer', 'Backtracking',
  'Graph (BFS/DFS/Dijkstra/Bellman-Ford/Floyd-Warshall/Kruskal/Prim/Topo/SCC)',
];

const PATTERN_TABLE = [
  { num: 1, name: 'Two Pointers', examples: 'Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water' },
  { num: 2, name: 'Sliding Window', examples: 'Longest Substring Without Repeating, Min Window Substring' },
  { num: 3, name: 'Prefix Sum', examples: 'Subarray Sum Equals K, Range Sum, Product of Array Except Self' },
  { num: 4, name: 'Fast & Slow Pointers', examples: 'Linked List Cycle, Find Middle, Happy Number' },
  { num: 5, name: 'Top K (Heap)', examples: 'Kth Largest, Top K Frequent, Merge K Sorted Lists' },
  { num: 6, name: "Kadane's Algorithm", examples: 'Max Subarray, Max Product Subarray, Best Time to Buy/Sell' },
  { num: 7, name: 'LL In-place Reversal', examples: 'Reverse Linked List, Reverse K Group, Palindrome LL' },
  { num: 8, name: 'Monotonic Stack', examples: 'Next Greater Element, Daily Temperatures, Largest Rectangle' },
  { num: 9, name: 'Overlapping Intervals', examples: 'Merge Intervals, Insert Interval, Meeting Rooms II' },
  { num: 10, name: 'Backtracking', examples: 'Subsets, Permutations, N-Queens, Combination Sum, Word Search' },
  { num: 11, name: 'Modified Binary Search', examples: 'Search in Rotated, Find Min in Rotated, Koko Eating Bananas' },
  { num: 12, name: 'Tree Traversal', examples: 'Level Order, Zigzag, Vertical Order, Serialize/Deserialize' },
  { num: 13, name: 'Graph BFS/DFS', examples: 'Number of Islands, Clone Graph, Course Schedule' },
  { num: 14, name: 'Union-Find', examples: 'Connected Components, Redundant Connection, Accounts Merge' },
  { num: 15, name: 'Dynamic Programming', examples: 'See 20 DP sub-patterns below' },
];

const DP_PATTERNS = [
  ['1D DP / Fibonacci', 'Climbing Stairs, House Robber, Jump Game'],
  ['Grid / 2D DP', 'Unique Paths, Minimum Path Sum, Dungeon Game'],
  ['0/1 Knapsack', '0/1 Knapsack, Subset Sum, Partition Equal Subset'],
  ['Unbounded Knapsack', 'Coin Change, Rod Cutting, Integer Break'],
  ['LCS', 'LCS, Edit Distance, Longest Palindromic Subsequence'],
  ['Longest Common Substring', 'Longest Common Substring, Max Repeated Subarray'],
  ['Palindromic Subsequence', 'LPS, Count Palindromic Substrings, Palindrome Partitioning II'],
  ['Stock Series', 'Best Time I-VI (all 6 variants)'],
  ['Interval DP', 'Burst Balloons, Stone Merge, Matrix Chain'],
  ['String DP', 'Word Break, Wildcard Matching, RegEx Matching'],
  ['DP on Trees', 'Diameter of Tree, House Robber III, Binary Tree Cameras'],
  ['Bitmask DP', 'TSP, Shortest Path Visiting All Nodes'],
  ['Digit DP', 'Count Numbers with Unique Digits'],
  ['DP + Monotonic Deque', 'Sliding Window Maximum, Constrained Subseq Sum'],
  ['State Machine DP', 'Best Time with Cooldown, Best Time K Transactions'],
  ['Counting DP', 'Unique BSTs, Decode Ways, Distinct Subsequences'],
  ['Optimization DP', 'Min Cost to Cut Stick, Min Cost to Make Array Equal'],
  ['Probability DP', 'Knight Probability in Chessboard, Soup Servings'],
  ['DP + Binary Search', 'LIS O(n log n), Russian Doll Envelopes'],
  ['Topo Sort + DP', 'Course Schedule III, Parallel Courses II'],
];

interface Props {
  progress: ProgressMap;
  setTab: (t: Tab) => void;
  setFilters: (fn: (prev: FilterState) => FilterState) => void;
}

export function Patterns({ progress, setTab, setFilters }: Props) {
  const [showMap, setShowMap] = useState(false);
  const stats = useMemo(() => computeStats(PROBLEMS, progress), [progress]);
  const sorted = Object.entries(stats.byPattern).sort((a, b) => b[1].total - a[1].total);

  const filterByPattern = (name: string) => {
    setFilters(() => ({ ...FRESH, pattern: name }));
    setTab('problems');
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* MASTER TOPIC MAP */}
      <Card>
        <button onClick={() => setShowMap(!showMap)} className="w-full p-5 text-left hover:bg-secondary/30 transition-colors flex items-center gap-3">
          <Layers className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <h2 className="font-semibold">Master Topic Map</h2>
            <p className="text-sm text-muted-foreground">All DS, algorithms, 15 core patterns + 20 DP sub-patterns</p>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', showMap && 'rotate-180')} />
        </button>
        {showMap && (
          <div className="border-t border-border p-5 space-y-6 animate-fade-in">
            {/* DS Tiers */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Data Structures (18 categories)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(DS_TIERS).map(([tier, { color, items }]) => (
                  <div key={tier} className="bg-secondary/30 border border-border/50 rounded-lg p-3">
                    <div className={cn('text-sm font-semibold mb-2', color)}>{tier}</div>
                    <ul className="space-y-1 text-sm text-foreground/80">
                      {items.map(i => <li key={i}>• {i}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithms */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Algorithms (9 categories)</h3>
              <div className="flex flex-wrap gap-2">
                {ALGORITHMS.map(a => <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>)}
              </div>
            </div>

            {/* 15 Core Patterns */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">15 Core LeetCode Patterns <span className="text-foreground/60 normal-case font-normal">(click to filter problems)</span></h3>
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="text-left py-2 px-3 w-10">#</th>
                      <th className="text-left py-2 px-3">Pattern</th>
                      <th className="text-left py-2 px-3">Key Examples</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PATTERN_TABLE.map(p => (
                      <tr key={p.num} className="border-t border-border/40 hover:bg-secondary/30 cursor-pointer transition-colors"
                        onClick={() => filterByPattern(p.name)}>
                        <td className="py-2 px-3 text-muted-foreground">{p.num}</td>
                        <td className="py-2 px-3 font-medium">{p.name}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{p.examples}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 20 DP Sub-Patterns */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">20 DP Sub-Patterns</h3>
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="text-left py-2 px-3 w-10">#</th>
                      <th className="text-left py-2 px-3">Pattern</th>
                      <th className="text-left py-2 px-3">Key Problems</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DP_PATTERNS.map(([name, ex], i) => (
                      <tr key={i} className="border-t border-border/40">
                        <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
                        <td className="py-2 px-3 font-medium">{name}</td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">{ex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* PATTERN PROGRESS CARDS */}
      <div>
        <h2 className="font-semibold mb-3 text-foreground/90">Your Pattern Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(([pattern, d]) => {
            const pct = d.total ? Math.round(d.solved / d.total * 100) : 0;
            return (
              <Card key={pattern} className="cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                onClick={() => filterByPattern(pattern)}>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{pattern}</h3>
                    <span className={cn('text-2xl font-bold', pct === 100 ? 'text-emerald-400' : pct >= 50 ? 'text-primary' : 'text-muted-foreground')}>
                      {pct}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">{d.solved} / {d.total} solved</div>
                  <Progress value={pct} indicatorClassName="from-cyan-500 to-blue-500" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
