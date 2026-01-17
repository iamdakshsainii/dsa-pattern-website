// scripts/seed-patterns.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI not found in .env.local')
}

const patterns = [
  {
    name: "Two Pointers",
    slug: "two-pointers",
    description: "Use two pointers to traverse array/string in O(n) instead of O(n²). Perfect for sorted arrays, palindromes, and pair sum problems.",
    difficulty: "Easy",
    icon: "👆",
    color: "#3B82F6",
    order: 1,
    part: "Array Fundamentals",
    when_to_use: "Sorted arrays, palindrome problems, pair/triplet sum, partitioning arrays",
    time_complexity: "O(n)",
    space_complexity: "O(1)",
    key_points: [
      "Two pointers can move opposite directions or same direction",
      "Often eliminates need for nested loops",
      "Works best on sorted data"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sliding Window",
    slug: "sliding-window",
    description: "Maintain dynamic window that expands/contracts to find optimal subarray. Essential for contiguous subarray optimization problems.",
    difficulty: "Easy",
    icon: "🪟",
    color: "#10B981",
    order: 2,
    part: "Array Fundamentals",
    when_to_use: "Contiguous subarray problems, substring optimization, 'at most K' constraints, maximum/minimum in subarray",
    time_complexity: "O(n)",
    space_complexity: "O(k)",
    key_points: [
      "Window can be fixed or variable size",
      "Expand when condition not met, shrink when met",
      "Often uses HashMap for frequency tracking"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Fast & Slow Pointers",
    slug: "fast-slow-pointers",
    description: "Two pointers at different speeds for cycle detection and middle finding. Floyd's cycle detection algorithm foundation.",
    difficulty: "Easy",
    icon: "🐇",
    color: "#8B5CF6",
    order: 3,
    part: "Array Fundamentals",
    when_to_use: "Linked list cycles, finding middle element, cycle in sequences, distance-based problems",
    time_complexity: "O(n)",
    space_complexity: "O(1)",
    key_points: [
      "Fast pointer moves 2x speed of slow pointer",
      "Detects cycles in O(1) space",
      "Works on implicit linked lists (arrays)"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Merge Intervals",
    slug: "merge-intervals",
    description: "Sort intervals by start time, then merge based on overlap. Essential for scheduling and range problems.",
    difficulty: "Medium",
    icon: "📊",
    color: "#F59E0B",
    order: 4,
    part: "Array Fundamentals",
    when_to_use: "Interval overlap detection, scheduling problems, range merging, meeting room allocation",
    time_complexity: "O(n log n)",
    space_complexity: "O(n)",
    key_points: [
      "Sort by start time first",
      "Merge when current.start <= previous.end",
      "Greedy approach for optimization"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Cyclic Sort",
    slug: "cyclic-sort",
    description: "For numbers in range [1,n], place each at correct index in O(n). Perfect for finding missing/duplicate numbers.",
    difficulty: "Easy",
    icon: "🔄",
    color: "#EF4444",
    order: 5,
    part: "Array Fundamentals",
    when_to_use: "Finding missing numbers, finding duplicates, array in range [1,n] or [0,n], in-place sorting needed",
    time_complexity: "O(n)",
    space_complexity: "O(1)",
    key_points: [
      "Place element at index = value - 1",
      "Works only on specific range arrays",
      "In-place modification required"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "In-place LinkedList Reversal",
    slug: "linkedlist-reversal",
    description: "Reverse linked list or portions without extra space using three-pointer technique.",
    difficulty: "Medium",
    icon: "🔗",
    color: "#06B6D4",
    order: 6,
    part: "Search & Sort",
    when_to_use: "List reversal problems, reordering lists, K-group operations, palindrome checks",
    time_complexity: "O(n)",
    space_complexity: "O(1)",
    key_points: [
      "Use prev, current, next pointers",
      "Reverse in segments for K-group",
      "Foundation for complex list manipulation"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Binary Search (1D)",
    slug: "binary-search-1d",
    description: "Divide search space in half for O(log n) operations. Works on sorted arrays and monotonic functions.",
    difficulty: "Medium",
    icon: "🔍",
    color: "#EC4899",
    order: 7,
    part: "Search & Sort",
    when_to_use: "Sorted arrays, finding boundaries, rotated sorted arrays, peak finding",
    time_complexity: "O(log n)",
    space_complexity: "O(1)",
    key_points: [
      "Array must be sorted or have monotonic property",
      "Lower/upper bound for range queries",
      "Handle rotated arrays by identifying sorted half"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Binary Search (Answer Space)",
    slug: "binary-search-answer",
    description: "Binary search on answer range, not array indices. Perfect for optimization problems with feasibility function.",
    difficulty: "Medium",
    icon: "🎯",
    color: "#14B8A6",
    order: 8,
    part: "Search & Sort",
    when_to_use: "Minimize maximum or maximize minimum, feasibility function exists, optimization problems, resource allocation",
    time_complexity: "O(n log(max-min))",
    space_complexity: "O(1)",
    key_points: [
      "Search on value range, not indices",
      "Need feasibility check function",
      "Classic: minimize max or maximize min"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Binary Search (2D)",
    slug: "binary-search-2d",
    description: "Apply binary search on matrix - treat as 1D or use staircase search for row-column sorted matrices.",
    difficulty: "Medium",
    icon: "🗺️",
    color: "#A855F7",
    order: 9,
    part: "Search & Sort",
    when_to_use: "Fully sorted matrix, row-wise and column-wise sorted, finding Kth smallest, peak in 2D",
    time_complexity: "O(log(m*n)) or O(m+n)",
    space_complexity: "O(1)",
    key_points: [
      "Fully sorted: treat as 1D array",
      "Row-col sorted: staircase from top-right",
      "Kth smallest uses binary search on value"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Stack & Monotonic Stack",
    slug: "stack",
    description: "LIFO structure; monotonic stack maintains increasing/decreasing order for next greater/smaller element problems.",
    difficulty: "Medium",
    icon: "📚",
    color: "#F97316",
    order: 10,
    part: "Data Structures",
    when_to_use: "Next greater/smaller element, parentheses matching, expression evaluation, histogram problems",
    time_complexity: "O(n)",
    space_complexity: "O(n)",
    key_points: [
      "Monotonic stack: maintain order while pushing",
      "Pop elements that don't maintain order",
      "Each element pushed/popped once = O(n)"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Prefix Sum & Kadane",
    slug: "prefix-sum",
    description: "Precompute cumulative sums for range queries; Kadane's algorithm for maximum subarray in O(n).",
    difficulty: "Easy",
    icon: "➕",
    color: "#84CC16",
    order: 11,
    part: "Data Structures",
    when_to_use: "Range sum queries, subarray sum problems, optimization in O(n), maximum/minimum subarray",
    time_complexity: "O(n)",
    space_complexity: "O(n)",
    key_points: [
      "Prefix sum enables O(1) range queries",
      "Kadane's: track max ending here vs start fresh",
      "Use HashMap for subarray sum = K"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Hash Maps",
    slug: "hash-maps",
    description: "O(1) lookup for frequency, pairing, and grouping problems. Foundation for many optimization techniques.",
    difficulty: "Easy",
    icon: "🗂️",
    color: "#06B6D4",
    order: 12,
    part: "Data Structures",
    when_to_use: "Counting frequencies, anagram problems, two sum variants, grouping elements",
    time_complexity: "O(n)",
    space_complexity: "O(n)",
    key_points: [
      "Trade space for time optimization",
      "Perfect for complement/pair finding",
      "Sorting key for grouping anagrams"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Recursion - Subsets & Combinations",
    slug: "recursion-subsets",
    description: "Explore all possibilities using include/exclude decisions. Foundation for backtracking and DP.",
    difficulty: "Medium",
    icon: "🌳",
    color: "#8B5CF6",
    order: 13,
    part: "Recursion & Advanced",
    when_to_use: "Generating subsets, combination sum problems, counting ways, decision trees",
    time_complexity: "O(2^n)",
    space_complexity: "O(n)",
    key_points: [
      "Include/exclude pattern for each element",
      "Handle duplicates by sorting + skipping",
      "Build solutions incrementally"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Recursion - Permutations",
    slug: "recursion-permutations",
    description: "Generate all arrangements by swapping and backtracking. Classic factorial time complexity.",
    difficulty: "Medium",
    icon: "🔀",
    color: "#F59E0B",
    order: 14,
    part: "Recursion & Advanced",
    when_to_use: "All orderings, arrangement problems, sequence generation, lexicographic problems",
    time_complexity: "O(n!)",
    space_complexity: "O(n)",
    key_points: [
      "Swap-based or choose-based approach",
      "Backtrack by un-swapping",
      "Handle duplicates carefully"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Backtracking",
    slug: "backtracking",
    description: "Solve puzzles with constraints using backtracking. Essential for grid problems and constraint satisfaction.",
    difficulty: "Hard",
    icon: "🎲",
    color: "#EF4444",
    order: 15,
    part: "Recursion & Advanced",
    when_to_use: "Grid problems, puzzles (Sudoku, N-Queens), constraint-based searches, path finding with obstacles",
    time_complexity: "Exponential",
    space_complexity: "O(n)",
    key_points: [
      "Try all possibilities, backtrack on failure",
      "Prune invalid paths early",
      "DFS on state space"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bit Manipulation",
    slug: "bit-manipulation",
    description: "Use bitwise operators for efficient operations. Perfect for set operations and finding unique elements.",
    difficulty: "Medium",
    icon: "💡",
    color: "#10B981",
    order: 16,
    part: "Recursion & Advanced",
    when_to_use: "Set operations, finding unique elements, power of 2 checks, XOR properties, space optimization",
    time_complexity: "O(1)",
    space_complexity: "O(1)",
    key_points: [
      "XOR: same elements cancel out",
      "n & (n-1): removes last set bit",
      "Bit masks for subsets"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Heaps & Priority Queue",
    slug: "heaps",
    description: "Maintain partial order for efficient min/max access. Essential for top K and streaming data problems.",
    difficulty: "Medium",
    icon: "⛰️",
    color: "#EC4899",
    order: 17,
    part: "Optimization",
    when_to_use: "Kth largest/smallest, top K elements, merging K sorted lists, median finding, task scheduling",
    time_complexity: "O(n log k)",
    space_complexity: "O(k)",
    key_points: [
      "Min heap for Kth largest, max heap for Kth smallest",
      "Two heaps for median",
      "K-way merge with heap"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Greedy Algorithms",
    slug: "greedy",
    description: "Make locally optimal choice at each step. Works when local optimal leads to global optimal.",
    difficulty: "Medium",
    icon: "🎁",
    color: "#14B8A6",
    order: 18,
    part: "Optimization",
    when_to_use: "Activity selection, interval scheduling, optimization where local = global, sorting + greedy choice",
    time_complexity: "O(n log n)",
    space_complexity: "O(1)",
    key_points: [
      "Sort first, then make greedy choice",
      "Prove correctness before implementing",
      "Not all problems have greedy solution"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Tree Traversals",
    slug: "tree-traversals",
    description: "Master DFS (pre/in/post) and BFS traversals. Foundation for all tree problems.",
    difficulty: "Easy",
    icon: "🌲",
    color: "#059669",
    order: 19,
    part: "Trees",
    when_to_use: "Foundation for all tree problems, level-order operations, tree property checks, path finding",
    time_complexity: "O(n)",
    space_complexity: "O(h)",
    key_points: [
      "DFS: Pre/In/Post order variations",
      "BFS: Level order with queue",
      "Height vs depth understanding"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Tree - Advanced",
    slug: "tree-advanced",
    description: "Complex tree manipulations including LCA, construction, serialization, and distance-based problems.",
    difficulty: "Hard",
    icon: "🎄",
    color: "#DC2626",
    order: 20,
    part: "Trees",
    when_to_use: "LCA problems, tree construction, serialization, distance-based problems",
    time_complexity: "O(n)",
    space_complexity: "O(n)",
    key_points: [
      "LCA: find split point",
      "Construction: use pre/in or in/post",
      "Serialize: encode tree structure"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Binary Search Trees",
    slug: "bst",
    description: "BST property: left < root < right. Enables O(h) search, insert, delete operations.",
    difficulty: "Medium",
    icon: "🔑",
    color: "#7C3AED",
    order: 21,
    part: "Trees",
    when_to_use: "Search/insert/delete in BST, BST validation, Kth smallest/largest, range queries",
    time_complexity: "O(h)",
    space_complexity: "O(h)",
    key_points: [
      "Inorder traversal gives sorted order",
      "Validate using range [min, max]",
      "Balance important for O(log n)"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "DP - 1D",
    slug: "dp-1d",
    description: "Break into subproblems, store results. Foundation for all dynamic programming patterns.",
    difficulty: "Medium",
    icon: "📈",
    color: "#2563EB",
    order: 22,
    part: "Dynamic Programming",
    when_to_use: "Optimization problems, counting ways, decision making, Fibonacci-like patterns",
    time_complexity: "O(n)",
    space_complexity: "O(n)",
    key_points: [
      "Define state: dp[i] = answer for first i elements",
      "Recurrence: relate dp[i] to previous states",
      "Base case + iteration or memoization"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "DP - 2D Grid",
    slug: "dp-2d-grid",
    description: "DP on grids for path counting and optimization. Classic min/max path sum problems.",
    difficulty: "Medium",
    icon: "🗺️",
    color: "#16A34A",
    order: 23,
    part: "Dynamic Programming",
    when_to_use: "Grid traversal, path counting, matrix optimization, 2D state problems",
    time_complexity: "O(m*n)",
    space_complexity: "O(m*n)",
    key_points: [
      "State: dp[i][j] = answer at cell (i,j)",
      "Transitions: from top/left cells",
      "Space optimize to O(n) using 1D array"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "DP - Subsequences",
    slug: "dp-subsequences",
    description: "DP on subsequences, subset sums, knapsack. Essential for optimization and counting problems.",
    difficulty: "Hard",
    icon: "🎒",
    color: "#EA580C",
    order: 24,
    part: "Dynamic Programming",
    when_to_use: "Subset sum problems, partition problems, knapsack variations, count subsets",
    time_complexity: "O(n*sum)",
    space_complexity: "O(sum)",
    key_points: [
      "Include/exclude each element",
      "0/1 knapsack vs unbounded",
      "Target sum variations"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "DP - Strings",
    slug: "dp-strings",
    description: "DP on two strings for pattern matching, edit distance, and subsequence problems.",
    difficulty: "Hard",
    icon: "📝",
    color: "#DB2777",
    order: 25,
    part: "Dynamic Programming",
    when_to_use: "String matching, edit operations, subsequence problems, palindrome problems",
    time_complexity: "O(m*n)",
    space_complexity: "O(m*n)",
    key_points: [
      "State: dp[i][j] on two strings",
      "LCS: longest common subsequence",
      "Edit distance: insert/delete/replace"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "DP - Stocks",
    slug: "dp-stocks",
    description: "State machine DP for stock trading with transaction limits, cooldown, and fees.",
    difficulty: "Medium",
    icon: "📊",
    color: "#0891B2",
    order: 26,
    part: "Dynamic Programming",
    when_to_use: "Stock trading problems, transaction limits, cooldown periods, transaction fees",
    time_complexity: "O(n)",
    space_complexity: "O(1)",
    key_points: [
      "States: bought/sold/cooldown",
      "Track transactions remaining",
      "Space optimize to O(1)"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "DP - LIS & MCM",
    slug: "dp-lis-mcm",
    description: "Longest Increasing Subsequence and Matrix Chain Multiplication. Advanced DP techniques.",
    difficulty: "Hard",
    icon: "📐",
    color: "#7C3AED",
    order: 27,
    part: "Dynamic Programming",
    when_to_use: "Sequence optimization, optimal partitioning, interval DP, game theory DP",
    time_complexity: "O(n log n) for LIS",
    space_complexity: "O(n)",
    key_points: [
      "LIS: O(n²) DP or O(n log n) binary search",
      "MCM: partition DP with range",
      "Burst balloons: choose last to burst"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Graph BFS/DFS & Islands",
    slug: "graph-bfs-dfs",
    description: "Graph traversal using BFS and DFS. Foundation for connected components and island problems.",
    difficulty: "Medium",
    icon: "🌐",
    color: "#EF4444",
    order: 28,
    part: "Graphs",
    when_to_use: "Connected components, island problems, flood fill, cycle detection, bipartite checking",
    time_complexity: "O(V+E)",
    space_complexity: "O(V)",
    key_points: [
      "BFS: queue for level order",
      "DFS: recursion or stack",
      "Track visited to avoid cycles"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Topological Sort & DAG",
    slug: "topological-sort",
    description: "Ordering vertices in Directed Acyclic Graph for task scheduling and dependency resolution.",
    difficulty: "Medium",
    icon: "📋",
    color: "#F59E0B",
    order: 29,
    part: "Graphs",
    when_to_use: "Task scheduling, course prerequisites, dependency resolution, build systems",
    time_complexity: "O(V+E)",
    space_complexity: "O(V)",
    key_points: [
      "DFS: post-order + stack",
      "BFS (Kahn's): in-degree based",
      "Detect cycle if topo order impossible"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Shortest Paths & MST",
    slug: "shortest-paths",
    description: "Finding shortest paths and minimum spanning trees using Dijkstra, Bellman-Ford, Floyd-Warshall, Prim's, Kruskal's.",
    difficulty: "Hard",
    icon: "🛤️",
    color: "#10B981",
    order: 30,
    part: "Graphs",
    when_to_use: "Weighted graphs, distance calculations, network design, all-pairs shortest path",
    time_complexity: "Varies",
    space_complexity: "O(V+E)",
    key_points: [
      "Dijkstra: non-negative weights",
      "Bellman-Ford: negative weights allowed",
      "MST: Prim's or Kruskal's with Union-Find"
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedPatterns() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')

    console.log('🌱 Starting pattern seeding...\n')

    // Drop existing patterns first for re-seeding
    await db.collection('patterns').deleteMany({})
    console.log('🗑️  Cleared existing patterns\n')

    // Insert all patterns
    const result = await db.collection('patterns').insertMany(patterns)

    console.log(`✅ Successfully seeded ${result.insertedCount} patterns!\n`)

    // Display summary
    console.log('📊 Patterns by Difficulty:')
    const byDifficulty = {}
    patterns.forEach(p => {
      byDifficulty[p.difficulty] = (byDifficulty[p.difficulty] || 0) + 1
    })

    Object.entries(byDifficulty).forEach(([diff, count]) => {
      console.log(`   ${diff}: ${count} patterns`)
    })

    console.log('\n✨ Database is ready!')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('\n👋 Database connection closed')
  }
}

seedPatterns()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
