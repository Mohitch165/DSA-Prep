export interface Resource { label: string; url: string; }
export interface WeekDetail {
  summary: string;
  concepts: string[];
  conceptLinks?: Record<number, Resource[]>;
  todos: string[];
  resources: Resource[];
  problemTarget?: string;
}
export interface PhaseDetail {
  dateRange: string;
  goal: string;
  problemTarget: string;
  dailyCommitment: string;
  description: string;
}

export const PLAN_SUMMARY = {
  totalProblems: '370–450',
  duration: '17 weeks · May 7 → Aug 31, 2026',
  philosophy: [
    'Pattern over memorization — recognize the shape before coding.',
    'Spaced repetition — re-solve every problem 3 days after first attempt.',
    'Verbalize before typing — practice explaining the approach out loud.',
    'Time every problem — Easy ≤15min, Medium ≤30min, Hard ≤45min.',
  ],
  weeklyContract: [
    'Weekday: 2.5–3 hrs (warmup → learn → solve → review)',
    'Weekend: 4–5 hrs deep focus (mocks + harder problems)',
    'No skipping pattern templates — write each one from memory before moving on',
  ],
};

export const PHASE_DETAILS: Record<string, PhaseDetail> = {
  'Phase 0': {
    dateRange: 'May 7 – May 31',
    goal: 'Set up environment, solidify fundamentals, avoid a cold-start on June 1.',
    problemTarget: '40–50 problems',
    dailyCommitment: '1.5–2 hrs/day',
    description: 'These 25 days are about removing friction. By June 1 your tooling, language, and basic patterns should already be familiar — every minute on June 1 should go to learning, not setup.',
  },
  'Month 1': {
    dateRange: 'June 1 – June 30',
    goal: 'Master patterns 1–10. Complete Blind 75. Build instinctive pattern recognition.',
    problemTarget: '100–120 problems',
    dailyCommitment: '2.5–3 hrs/day',
    description: 'The foundation month. Most interviews test these 10 patterns. By end of June, you should be able to name the pattern within 30 seconds of reading any easy/medium problem.',
  },
  'Month 2': {
    dateRange: 'July 1 – July 31',
    goal: 'Master patterns 11–15. Complete Top Interview 150. Build graph + DP muscle.',
    problemTarget: '130–160 problems',
    dailyCommitment: '3–3.5 hrs/day',
    description: 'The hardest month — graphs and DP have the steepest learning curves. Daily reps with templates matter more than raw volume.',
  },
  'Month 3': {
    dateRange: 'Aug 1 – Aug 31',
    goal: 'Advanced topics + mock interviews + targeted company prep.',
    problemTarget: '100–120 problems + 8+ mock interviews',
    dailyCommitment: '3–4 hrs/day',
    description: 'Game time. Volume drops, intensity rises. Half your time is now interviews-as-practice — Pramp, Interviewing.io, LeetCode contests. Not learning new patterns; executing under pressure.',
  },
};

// Keyed by phase, then week number
export const WEEK_DETAILS: Record<string, Record<number, WeekDetail>> = {
  'Phase 0': {
    1: {
      summary: 'Tooling, language setup, Big-O fluency. Don\'t grind problems yet — just warm up.',
      concepts: [
        'Big-O notation: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!)',
        'Space vs time tradeoffs — know when to trade memory for speed',
        'JS-specific costs: Map/Set are O(1), Array.shift is O(n), spread copies the array',
      ],
      conceptLinks: {
        0: [
          { label: "AlgoMaster — Algorithmic Complexity", url: "https://blog.algomaster.io/p/57bd4963-462f-4294-a972-4012691fc729" },
          { label: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" },
        ],
        2: [
          { label: "MDN — Array methods", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" },
          { label: "MDN — Map vs Object", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map" },
        ],
      },
      todos: [
        'Sign up at LeetCode',
        'Install LeetHub v2 Chrome extension (auto-pushes solutions to GitHub)',
        'Install LeetCode Timer extension',
        'Set up Node.js + VS Code with LeetCode extension',
        'Solve 10 easy problems (any topic) just to warm up reflexes',
      ],
      resources: [
        { label: 'AlgoMaster — Algorithmic Complexity', url: 'https://blog.algomaster.io/p/57bd4963-462f-4294-a972-4012691fc729' },
        { label: 'Big-O Cheat Sheet', url: 'https://www.bigocheatsheet.com/' },
        { label: 'hello-algo (Ch 1–2)', url: 'https://www.hello-algo.com/' },
      ],
      problemTarget: '10 easy warmups',
    },
    2: {
      summary: 'Build pattern muscle memory for the most common interview substrate.',
      concepts: [
        'HashMap internals: hashing, collision handling, load factor',
        'Array operations: push/pop O(1), shift/unshift O(n) — use index pointer for queues',
        'JS strings are immutable — concat creates new strings, expensive in tight loops',
        'Set.has is O(1) — prefer over Array.includes inside loops',
      ],
      conceptLinks: {
        0: [
          { label: "basecs — Hash Tables", url: "https://medium.com/basecs/taking-hash-tables-off-the-shelf-139cbf4752f0" },
        ],
        3: [
          { label: "MDN — Set", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set" },
        ],
      },
      todos: [
        'Read 15 LeetCode patterns overview (skim, don\'t solve)',
        '5 easy/medium array problems',
        '5 easy/medium string problems',
        '5 easy/medium hashmap problems',
      ],
      resources: [
        { label: '15 LeetCode Patterns', url: 'https://blog.algomaster.io/p/15-leetcode-patterns' },
        { label: 'hello-algo — Hash Tables', url: 'https://www.hello-algo.com/' },
      ],
      problemTarget: '15 problems',
    },
    3: {
      summary: 'Implement classics from scratch — understand them, don\'t just call .sort().',
      concepts: [
        'Recursion: call stack, base case, recursive case, common pitfalls',
        'Merge sort O(n log n) — stable, predictable',
        'Quick sort O(n log n) avg, O(n²) worst — pivot choice matters',
        'Binary search: half-open vs half-closed intervals, invariants',
      ],
      conceptLinks: {
        0: [
          { label: "Recursion Master Guide", url: "https://leetcode.com/discuss/study-guide/1733447/become-master-in-recursion" },
        ],
        3: [
          { label: "Ultimate Binary Search Template", url: "https://leetcode.com/discuss/study-guide/786126/Python-Powerful-Ultimate-Binary-Search-Template.-Solved-many-problems" },
        ],
      },
      todos: [
        'Implement merge sort + quick sort from scratch (no Array.sort())',
        'Study Ultimate Binary Search Template',
        '5 recursion problems',
        '5 binary search problems',
      ],
      resources: [
        { label: 'Sorting Algorithms guide', url: 'https://medium.com/jl-codes/understanding-sorting-algorithms-af6222995c8' },
        { label: 'Ultimate Binary Search Template', url: 'https://leetcode.com/discuss/study-guide/786126/Python-Powerful-Ultimate-Binary-Search-Template.-Solved-many-problems' },
        { label: 'Recursion Master Guide', url: 'https://leetcode.com/discuss/study-guide/1733447/become-master-in-recursion' },
      ],
      problemTarget: '10 problems',
    },
    4: {
      summary: 'Final prep before main phase. Tracking system + read-ahead on Blind 75.',
      concepts: [
        'Spaced repetition: re-solve at days 1, 3, 7, 21',
        'Pattern recognition vs memorization',
        'Why the 80/20 rule applies to LeetCode patterns',
      ],
      conceptLinks: {
        0: [
          { label: "Spaced Repetition (Wikipedia)", url: "https://en.wikipedia.org/wiki/Spaced_repetition" },
        ],
        1: [
          { label: "15 LeetCode Patterns", url: "https://blog.algomaster.io/p/15-leetcode-patterns" },
        ],
      },
      todos: [
        'Read full Blind 75 list (don\'t solve all yet)',
        'Solve 5 easy Blind 75 problems',
        'This tracker IS your tracking system — bookmark it',
        'Set up Notion/Anki for pattern templates (or use Notes feature here)',
      ],
      resources: [
        { label: 'Blind 75 list', url: 'https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions' },
        { label: 'AlgoMaster 300 (curated by pattern)', url: 'https://algomaster.io/practice/dsa-patterns' },
      ],
      problemTarget: '5 Blind 75 problems',
    },
  },

  'Month 1': {
    1: {
      summary: 'Foundation patterns. Most array/string problems collapse to one of these 4.',
      concepts: [
        'Two Pointers: converging (3Sum), parallel (Move Zeros), fast/slow (cycle detection)',
        'Sliding Window: fixed size (Maximum Average), variable size (Longest Substring Without Repeating)',
        'Prefix Sum: running totals for O(1) range queries — pairs well with hashmap for "subarray sum equals K"',
        'Kadane\'s: max subarray with single pass — generalizes to many "best contiguous" variants',
      ],
      conceptLinks: {
        0: [
          { label: "AlgoMaster — Two Pointers (video)", url: "https://www.youtube.com/watch?v=QzZ7nmouLTI&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
          { label: "Two Pointers — 100-day guide", url: "https://leetcode.com/discuss/study-guide/1688903/Solved-all-two-pointers-problems-in-100-days" },
        ],
        1: [
          { label: "AlgoMaster — Sliding Window (video)", url: "https://www.youtube.com/watch?v=y2d0VHdvfdc&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
          { label: "Sliding Window Cheatsheet Template", url: "https://leetcode.com/problems/frequency-of-the-most-frequent-element/solutions/1175088/C++-Maximum-Sliding-Window-Cheatsheet-Template/" },
        ],
        2: [
          { label: "AlgoMaster — Prefix Sum (video)", url: "https://www.youtube.com/watch?v=yuws7YK0Yng&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
        ],
        3: [
          { label: "AlgoMaster — Kadane's Algorithm (video)", url: "https://www.youtube.com/watch?v=NUWAXbSlsws&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
        ],
      },
      todos: [
        'Watch AlgoMaster Two Pointers + Sliding Window videos',
        'Solve 25 problems (8+ from Blind 75)',
        'Weekend: write each pattern template from memory',
        'Solve 1 timed mini-contest (45 min)',
      ],
      resources: [
        { label: 'AlgoMaster — Two Pointers', url: 'https://www.youtube.com/watch?v=QzZ7nmouLTI&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'AlgoMaster — Sliding Window', url: 'https://www.youtube.com/watch?v=y2d0VHdvfdc&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'Sliding Window Cheatsheet Template', url: 'https://leetcode.com/problems/frequency-of-the-most-frequent-element/solutions/1175088/C++-Maximum-Sliding-Window-Cheatsheet-Template/' },
        { label: 'Two Pointers — 100-day guide', url: 'https://leetcode.com/discuss/study-guide/1688903/Solved-all-two-pointers-problems-in-100-days' },
      ],
      problemTarget: '25 problems',
    },
    2: {
      summary: 'Pointer manipulation is a distinct skill — no algorithms, just careful next-pointer surgery.',
      concepts: [
        'Floyd\'s cycle detection (tortoise and hare) — also finds cycle start',
        'In-place reversal: prev / curr / next pattern',
        'Dummy head trick — eliminates "what if head changes" edge cases',
        'LRU Cache pattern: HashMap + Doubly Linked List for O(1) get/put',
      ],
      conceptLinks: {
        0: [
          { label: "AlgoMaster — Fast & Slow Pointers", url: "https://www.youtube.com/watch?v=b139yf7Ik-E&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
        ],
        1: [
          { label: "AlgoMaster — LL In-place Reversal", url: "https://www.youtube.com/watch?v=auoTGovuo9A&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
        ],
        3: [
          { label: "LRU Cache — implementation discussion", url: "https://leetcode.com/problems/lru-cache/solutions/45911/Java-Hashtable-+-Double-linked-list-(with-a-touch-of-pseudo-nodes)/" },
        ],
      },
      todos: [
        'Watch AlgoMaster Linked List + Fast/Slow + Reversal videos',
        'Solve 20 problems',
        'Weekend: implement reverseList + Floyd cycle detection from memory',
      ],
      resources: [
        { label: 'AlgoMaster — Linked List', url: 'https://www.youtube.com/watch?v=FbHf0ii0WDg&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'AlgoMaster — Fast & Slow Pointers', url: 'https://www.youtube.com/watch?v=b139yf7Ik-E&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'AlgoMaster — LL In-place Reversal', url: 'https://www.youtube.com/watch?v=auoTGovuo9A&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
      ],
      problemTarget: '20 problems',
    },
    3: {
      summary: 'Monotonic stack solves "next greater/smaller" problems in O(n) instead of O(n²).',
      concepts: [
        'LIFO operations, parentheses matching, expression evaluation',
        'Monotonic increasing stack: pop while top > current → "next smaller"',
        'Monotonic decreasing stack: pop while top < current → "next greater"',
        'Use cases: Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water (alt)',
        'Sliding Window Maximum: monotonic deque',
      ],
      conceptLinks: {
        1: [
          { label: "AlgoMaster — Monotonic Stack", url: "https://www.youtube.com/watch?v=DtJVwbbicjQ&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
          { label: "Monotonic Stack Template Guide", url: "https://leetcode.com/discuss/study-guide/2347639/A-comprehensive-guide-and-template-for-monotonic-stack-based-problems" },
        ],
        4: [
          { label: "Sliding Window Max — discussion", url: "https://leetcode.com/problems/sliding-window-maximum/solutions/65901/9ms-Java-O(n)-solution-using-deque/" },
        ],
      },
      todos: [
        'Watch AlgoMaster Stack + Monotonic Stack videos',
        'Solve 20 problems',
        'Weekend: write monotonic stack template from memory + apply to Largest Rectangle',
      ],
      resources: [
        { label: 'AlgoMaster — Stacks', url: 'https://www.youtube.com/watch?v=XcaAZ6wNkYM&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'AlgoMaster — Monotonic Stack', url: 'https://www.youtube.com/watch?v=DtJVwbbicjQ&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'Monotonic Stack Template Guide', url: 'https://leetcode.com/discuss/study-guide/2347639/A-comprehensive-guide-and-template-for-monotonic-stack-based-problems' },
      ],
      problemTarget: '20 problems',
    },
    4: {
      summary: 'BFS for level-by-level, DFS for path/sum problems. BST has the inorder=sorted invariant. Intervals = sort by start.',
      concepts: [
        'Tree traversals: inorder / preorder / postorder + level-order BFS',
        'BST property: left < node < right (inorder gives sorted sequence)',
        'LCA: divergence point in BST, climbing for general tree',
        'Serialize/Deserialize: use BFS or preorder with null markers',
        'Interval merge: sort by start, then merge overlapping',
      ],
      conceptLinks: {
        0: [
          { label: "Tree Iterative Traversal", url: "https://medium.com/leetcode-patterns/leetcode-pattern-0-iterative-traversals-on-trees-d373568eb0ec" },
          { label: "Tree Patterns Master Guide", url: "https://leetcode.com/discuss/study-guide/1820334/Become-Master-in-Tree" },
        ],
        1: [
          { label: "AlgoMaster — BST", url: "https://www.youtube.com/watch?v=PoJYBTSM0IU&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
        ],
        2: [
          { label: "LCA — comprehensive tutorial", url: "https://cp-algorithms.com/graph/lca.html" },
        ],
        3: [
          { label: "Serialize/Deserialize discussion", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/solutions/74253/Easy-to-understand-Java-Solution/" },
        ],
        4: [
          { label: "Overlapping Intervals Pattern", url: "https://blog.algomaster.io/p/812e72f7-eced-4256-a4c1-00606ae50679" },
        ],
      },
      todos: [
        'Watch AlgoMaster Binary Tree + BST videos',
        'Solve 25 problems (heavy on Blind 75 trees)',
        'Weekend: implement all 4 tree traversals iteratively',
        '*** End-of-month checklist:',
        '   ✓ Complete remaining Blind 75 problems (~75 total)',
        '   ✓ 1 timed LeetCode weekly contest',
        '   ✓ Write all 10 pattern templates from memory (no notes)',
      ],
      resources: [
        { label: 'AlgoMaster — Binary Tree', url: 'https://www.youtube.com/watch?v=p85ohoV6Z4E&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'AlgoMaster — BST', url: 'https://www.youtube.com/watch?v=PoJYBTSM0IU&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'Tree Patterns Master Guide', url: 'https://leetcode.com/discuss/study-guide/1820334/Become-Master-in-Tree' },
        { label: 'Tree Iterative Traversal', url: 'https://medium.com/leetcode-patterns/leetcode-pattern-0-iterative-traversals-on-trees-d373568eb0ec' },
        { label: 'Overlapping Intervals Pattern', url: 'https://blog.algomaster.io/p/812e72f7-eced-4256-a4c1-00606ae50679' },
      ],
      problemTarget: '25 problems',
    },
  },

  'Month 2': {
    5: {
      summary: 'Binary search on answer space is the highest-leverage optimization. Heap = sorted-on-demand. JS has no built-in heap.',
      concepts: [
        'Binary search on answer: define feasible(mid), search monotonic answer space',
        'Use cases: Koko Eating Bananas, Capacity to Ship, Split Array Largest Sum',
        'JS has no built-in heap — implement MinHeap class (in your templates) or sort each iteration',
        'Top K: heap of size K (not N) → O(n log k)',
        'Two-heap trick: max-heap (lower half) + min-heap (upper half) → O(1) median',
      ],
      conceptLinks: {
        0: [
          { label: "Ultimate Binary Search Template", url: "https://leetcode.com/discuss/study-guide/786126/Python-Powerful-Ultimate-Binary-Search-Template.-Solved-many-problems" },
        ],
        2: [
          { label: "basecs — Heaps", url: "https://medium.com/basecs/learning-to-love-heaps-cef2b273a238" },
        ],
        3: [
          { label: "AlgoMaster — Top K (video)", url: "https://www.youtube.com/watch?v=6_v6OoxvMOE&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2" },
        ],
        4: [
          { label: "Find Median from Stream — two-heap pattern", url: "https://leetcode.com/problems/find-median-from-data-stream/solutions/74047/JavaPython-two-heap-solution-O(log-n)-add-O(1)-find/" },
        ],
      },
      todos: [
        'Implement MinHeap class from your JS template',
        'Solve 25 problems',
        'Weekend: solve Find Median from Data Stream blind (it\'s the canonical 2-heap problem)',
      ],
      resources: [
        { label: 'Ultimate Binary Search Template', url: 'https://leetcode.com/discuss/study-guide/786126/Python-Powerful-Ultimate-Binary-Search-Template.-Solved-many-problems' },
        { label: 'AlgoMaster — Top K', url: 'https://www.youtube.com/watch?v=6_v6OoxvMOE&list=PLK63NuByH5o9odyBT7nfYkHZyvGQ5oVp2' },
        { label: 'Heap Patterns — 23 problems', url: 'https://leetcode.com/discuss/general-discussion/1127238/master-heap-by-solving-23-questions-in-4-patterns-category' },
      ],
      problemTarget: '25 problems',
    },
    6: {
      summary: 'Hardest topic so far. BFS = shortest unweighted, Dijkstra = weighted, Topo = ordering, UF = components.',
      concepts: [
        'Adjacency list (Map<node, node[]>) vs matrix — list for sparse graphs',
        'BFS for shortest path in unweighted graphs; DFS for paths/components/cycle detection',
        'Topological sort: Kahn\'s BFS (in-degree) or DFS post-order — both O(V+E)',
        'Union-Find with path compression + rank — O(α(n)) ≈ O(1) per op',
        'Dijkstra: priority queue, never revisit settled nodes, doesn\'t handle negative weights',
        'Cycle detection: 3 colors (white/gray/black) for directed; UF for undirected',
      ],
      conceptLinks: {
        1: [
          { label: "Graph BFS/DFS Patterns Part 1", url: "https://medium.com/leetcode-patterns/leetcode-pattern-1-bfs-dfs-25-of-the-problems-part-1-519450a84353" },
          { label: "Graph BFS/DFS Patterns Part 2", url: "https://medium.com/leetcode-patterns/leetcode-pattern-2-dfs-bfs-25-of-the-problems-part-2-a5b269597f52" },
        ],
        2: [
          { label: "Topological Sort (CP-Algorithms)", url: "https://cp-algorithms.com/graph/topological-sort.html" },
        ],
        3: [
          { label: "Union-Find Complete Guide (DSU)", url: "https://leetcode.com/discuss/general-discussion/1072418/Disjoint-Set-Union-(DSU)Union-Find-A-Complete-Guide" },
        ],
        4: [
          { label: "Dijkstra Guide (LeetCode)", url: "https://leetcode.com/discuss/study-guide/1059477/A-guide-to-Dijkstras-Algorithm" },
        ],
        5: [
          { label: "Cycle Detection (3-color DFS)", url: "https://www.geeksforgeeks.org/detect-cycle-direct-graph-using-colors/" },
        ],
      },
      todos: [
        'Read all 4 graph guides',
        'Implement UnionFind class + Dijkstra from your templates',
        'Solve 30 problems',
        'Weekend: solve Course Schedule + Alien Dictionary blind',
      ],
      resources: [
        { label: 'AlgoMaster — Master Graph Algorithms', url: 'https://blog.algomaster.io/p/master-graph-algorithms-for-coding' },
        { label: 'Union-Find Complete Guide', url: 'https://leetcode.com/discuss/general-discussion/1072418/Disjoint-Set-Union-(DSU)Union-Find-A-Complete-Guide' },
        { label: 'Dijkstra Guide', url: 'https://leetcode.com/discuss/study-guide/1059477/A-guide-to-Dijkstra\'s-Algorithm' },
        { label: 'Graph BFS/DFS Patterns Part 1', url: 'https://medium.com/leetcode-patterns/leetcode-pattern-1-bfs-dfs-25-of-the-problems-part-1-519450a84353' },
        { label: 'Graph BFS/DFS Patterns Part 2', url: 'https://medium.com/leetcode-patterns/leetcode-pattern-2-dfs-bfs-25-of-the-problems-part-2-a5b269597f52' },
      ],
      problemTarget: '30 problems',
    },
    7: {
      summary: 'DP is just memoized recursion. Define state, find transition, base case.',
      concepts: [
        'Memoization (top-down) vs tabulation (bottom-up) — same time, different stack',
        'State: dp[i] = "answer when considering first i items"',
        'Transition: dp[i] = f(dp[i-1], dp[i-2], ...)',
        'Base case is critical — wrong base = silent off-by-one',
        'Knapsack: 0/1 (each item once) vs unbounded (unlimited count)',
        'LCS/LIS family — 2D state vs 1D + binary search optimization',
        'Stock series: state machine (held / not held / cooldown)',
      ],
      conceptLinks: {
        0: [
          { label: "DP Patterns Master Guide", url: "https://leetcode.com/discuss/study-guide/458695/Dynamic-Programming-Patterns" },
          { label: "20 DP Patterns blog", url: "https://blog.algomaster.io/p/20-patterns-to-master-dynamic-programming" },
        ],
        4: [
          { label: "Knapsack — complete guide", url: "https://leetcode.com/discuss/study-guide/1200320/Thief-with-a-knapsack-a-series-of-crash-courses." },
        ],
        6: [
          { label: "Stock Series Patterns", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/solutions/108870/most-consistent-ways-of-dealing-with-the-series-of-stock-problems/" },
        ],
      },
      todos: [
        'Read DP Patterns Master Guide',
        'Watch Tushar Roy DP playlist (selectively)',
        'Solve 30 problems — at least 4 from each sub-pattern',
        'Weekend: solve all 6 Best Time to Buy/Sell Stock variants in one sitting',
      ],
      resources: [
        { label: 'DP Patterns Master Guide', url: 'https://leetcode.com/discuss/study-guide/458695/Dynamic-Programming-Patterns' },
        { label: '20 DP Patterns blog', url: 'https://blog.algomaster.io/p/20-patterns-to-master-dynamic-programming' },
        { label: 'Tushar Roy DP Playlist', url: 'https://www.youtube.com/playlist?list=PLrmLmBdmIlpsHaNTPP_jHHDx_os9ItYXr' },
        { label: 'Stock Series Patterns', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/solutions/108870/most-consistent-ways-of-dealing-with-the-series-of-stock-problems/' },
      ],
      problemTarget: '30 problems',
    },
    8: {
      summary: 'Backtracking = DFS with state. Greedy = local optimal → global optimal (when it works). Trie = prefix-indexed strings.',
      concepts: [
        'Backtracking template: choose / explore / unchoose',
        'Pruning: detect impossibility early to avoid wasted recursion',
        'Greedy works when local optimal == global optimal (interval scheduling, coin change with canonical denominations)',
        'Trie: O(L) prefix lookup, autocomplete, word search II',
      ],
      conceptLinks: {
        0: [
          { label: "General Backtracking Template", url: "https://leetcode.com/problems/permutations/solutions/18239/A-general-approach-to-backtracking-questions-in-Java-(Subsets-Permutations-Combination-Sum-Palindrome-Partioning)/" },
          { label: "AlgoMaster — Backtracking Pattern", url: "https://blog.algomaster.io/p/81d42ca2-600c-4252-aa33-a56462090048" },
        ],
        2: [
          { label: "Greedy Algorithms (freeCodeCamp)", url: "https://www.freecodecamp.org/news/greedy-algorithms/" },
        ],
        3: [
          { label: "basecs — Tries", url: "https://medium.com/basecs/trying-to-understand-tries-3ec6bede0014" },
        ],
      },
      todos: [
        'Read backtracking general template',
        'Implement Trie class from your templates',
        'Solve 25 problems (heavy on Subsets/Permutations/Combinations)',
        '*** End-of-month checklist:',
        '   ✓ All Top Interview 150 problems done',
        '   ✓ 2 LeetCode timed contests',
        '   ✓ Pull snehasishroy CSVs for top 3 target companies',
        '   ✓ 2 Pramp mock interviews',
      ],
      resources: [
        { label: 'Backtracking Pattern blog', url: 'https://blog.algomaster.io/p/81d42ca2-600c-4252-aa33-a56462090048' },
        { label: 'General Backtracking Template', url: 'https://leetcode.com/problems/permutations/solutions/18239/A-general-approach-to-backtracking-questions-in-Java-(Subsets-Permutations-Combination-Sum-Palindrome-Partioning)/' },
        { label: 'Tries overview', url: 'https://medium.com/basecs/trying-to-understand-tries-3ec6bede0014' },
        { label: 'Greedy overview', url: 'https://www.freecodecamp.org/news/greedy-algorithms/' },
      ],
      problemTarget: '25 problems',
    },
  },

  'Month 3': {
    9: {
      summary: 'The hard problems. Interval DP, bitmask DP, DP on trees. Floyd-Warshall, Bellman-Ford, SCC.',
      concepts: [
        'Interval DP: dp[i][j] = answer for interval [i,j] — Burst Balloons, Stone Merge',
        'DP on Trees: post-order traversal accumulating subtree state — Binary Tree Cameras, House Robber III',
        'Bitmask DP: subsets-as-bitmasks for n ≤ 20 — TSP, Shortest Path Visiting All Nodes',
        'Floyd-Warshall: all-pairs shortest path O(V³)',
        'Bellman-Ford: handles negative weights, detects negative cycles',
      ],
      conceptLinks: {
        0: [
          { label: "20 DP Patterns — Interval DP section", url: "https://blog.algomaster.io/p/20-patterns-to-master-dynamic-programming" },
        ],
        1: [
          { label: "DP on Trees (Codeforces)", url: "https://codeforces.com/blog/entry/20935" },
        ],
        2: [
          { label: "Bitmask DP (CP-Algorithms)", url: "https://cp-algorithms.com/algebra/all-submasks.html" },
        ],
        3: [
          { label: "Floyd-Warshall (CP-Algorithms)", url: "https://cp-algorithms.com/graph/all-pair-shortest-path-floyd-warshall.html" },
        ],
        4: [
          { label: "Bellman-Ford (CP-Algorithms)", url: "https://cp-algorithms.com/graph/bellman_ford.html" },
        ],
      },
      todos: [
        'Solve 25 problems — at least 5 hard',
        'Weekend: solve Burst Balloons + Russian Doll Envelopes back-to-back',
        '1 mock interview',
      ],
      resources: [
        { label: '20 DP Patterns blog (sub-patterns 9, 11, 12)', url: 'https://blog.algomaster.io/p/20-patterns-to-master-dynamic-programming' },
      ],
      problemTarget: '25 problems',
    },
    10: {
      summary: 'Range queries and bit tricks. Segment tree / BIT for updates + queries. KMP for string search.',
      concepts: [
        'Segment Tree: range query + point update O(log n)',
        'Fenwick Tree (BIT): prefix sum + update O(log n) — simpler than segment tree',
        'Bit tricks: x & (x-1) clears lowest set bit, x ^ x = 0, n & 1 = parity',
        'XOR for "find unique" problems',
        'KMP: failure function, O(n+m) string match',
      ],
      conceptLinks: {
        0: [
          { label: "Segment Tree (CP-Algorithms)", url: "https://cp-algorithms.com/data_structures/segment_tree.html" },
        ],
        1: [
          { label: "Fenwick Tree / BIT (CP-Algorithms)", url: "https://cp-algorithms.com/data_structures/fenwick.html" },
        ],
        2: [
          { label: "AlgoMaster — Bit Manipulation", url: "https://blog.algomaster.io/p/c650df76-f978-46ee-a572-eb13c354905d" },
          { label: "Bit Manipulation Patterns", url: "https://leetcode.com/discuss/study-guide/4282051/all-types-of-patterns-for-bits-manipulations-and-how-to-use-it" },
        ],
        4: [
          { label: "KMP Prefix Function (CP-Algorithms)", url: "https://cp-algorithms.com/string/prefix-function.html" },
        ],
      },
      todos: [
        'Solve 20 problems',
        'Implement segment tree + BIT from scratch',
        '1 mock interview',
      ],
      resources: [
        { label: 'Bit Manipulation Patterns', url: 'https://leetcode.com/discuss/study-guide/4282051/all-types-of-patterns-for-bits-manipulations-and-how-to-use-it' },
        { label: 'Bit Manipulation Techniques', url: 'https://blog.algomaster.io/p/c650df76-f978-46ee-a572-eb13c354905d' },
      ],
      problemTarget: '20 problems',
    },
    11: {
      summary: 'Targeted prep using fresh company-specific problem lists. 3 problems/day per target company.',
      concepts: [
        'Google: Backtracking + DP + Graphs + math puzzles. Hard problems, elegant solutions.',
        'Meta: Recursion + Graphs + Bit Manipulation. Speed matters; clean recursion expected.',
        'Amazon: Sliding Window + Heap + BFS/DFS + DP. Always verbalize approach first.',
      ],
      todos: [
        'Days 1–2: Google sprint',
        'Days 3–4: Meta sprint',
        'Day 5: Amazon sprint',
        'Day 6: 1 full mock interview + debrief',
        'Day 7: Re-solve 5 hardest from this week',
      ],
      resources: [
        { label: 'snehasishroy company CSVs (Feb 2026)', url: 'https://github.com/snehasishroy/leetcode-companywise-interview-questions' },
        { label: 'codejeet — 17k+ company-tagged problems', url: 'https://github.com/ayush-that/codejeet' },
        { label: 'Pramp — peer mock interviews', url: 'https://www.pramp.com/' },
        { label: 'Interviewing.io — anonymous mocks with engineers', url: 'https://interviewing.io/' },
      ],
      problemTarget: '25 problems + 1 mock',
    },
    12: {
      summary: 'Last week. Bloomberg / Microsoft / Uber / LinkedIn sprints + 3 timed contests + behavioral prep.',
      concepts: [
        'Bloomberg: Arrays + DP + Graphs + Monotonic Stack. Real financial data structures.',
        'Microsoft: Binary Search + Trees + Greedy + DP. Mid-difficulty, readable code.',
        'Uber: Graphs + BFS/DFS + Dijkstra. Geo problems, routing.',
        'LinkedIn: Two Pointers + Sliding Window + Graph. Social-graph traversal.',
      ],
      todos: [
        'Day 1: Bloomberg sprint (liquidslr CSV)',
        'Day 2: Microsoft sprint',
        'Day 3: Uber sprint',
        'Day 4: LinkedIn sprint',
        'Days 5–6: 3 timed mock contests (45–90 min each)',
        'Days 7–10: Re-solve weakest 20 problems, prepare 10 STAR behavioral answers, complexity review',
        '*** Final checklist:',
        '   ✓ Recite all 15 pattern templates blank',
        '   ✓ Verbal walk-through practice',
        '   ✓ 10 STAR behavioral answers prepared',
        '   ✓ Time/space complexity for every pattern memorized',
      ],
      resources: [
        { label: 'liquidslr — 100+ company CSVs', url: 'https://github.com/liquidslr/interview-company-wise-problems' },
        { label: 'lcgrind — company + topic sheets', url: 'https://github.com/zaCKoZAck0/lcgrind' },
      ],
      problemTarget: '15 problems + 3 mocks',
    },
  },
};
