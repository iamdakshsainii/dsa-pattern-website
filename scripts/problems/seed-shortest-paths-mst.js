// scripts/problems/seed-shortest-paths-mst.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 30: Shortest Paths & MST (20 core problems)
const questionsData = [
  {
    title: "Shortest Path in Unweighted Graph",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "shortest-path-unweighted",
    order: 1,
    tags: ["graph", "breadth-first-search"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/shortest-path-unweighted-graph/",
      article: ""
    },
    hints: [
      "BFS gives shortest path",
      "All edges have weight 1",
      "Track distance while traversing"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "BFS gives shortest",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Shortest Path in DAG",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "shortest-path-dag",
    order: 2,
    tags: ["graph", "dynamic-programming", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/shortest-path-for-directed-acyclic-graphs/",
      article: ""
    },
    hints: [
      "Topological sort + relaxation",
      "Process nodes in topological order",
      "Relax all outgoing edges"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Topological + relaxation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Dijkstra's Algorithm",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "dijkstra-algorithm",
    order: 3,
    tags: ["graph", "shortest-path", "heap"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/",
      article: ""
    },
    hints: [
      "Priority queue weighted shortest path",
      "Greedy: always pick minimum distance",
      "No negative weights allowed"
    ],
    complexity: { time: "O((V+E) log V)", space: "O(V)" },
    keyLearning: "Priority queue weighted",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Shortest Path in Binary Matrix",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "shortest-path-binary-matrix",
    order: 4,
    tags: ["array", "breadth-first-search", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "0-1 BFS or Dijkstra",
      "8 directions movement",
      "BFS from (0,0) to (n-1,n-1)"
    ],
    complexity: { time: "O(n²)", space: "O(n²)" },
    keyLearning: "0-1 BFS or Dijkstra",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Path with Minimum Effort",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "path-minimum-effort",
    order: 5,
    tags: ["array", "binary-search", "depth-first-search", "breadth-first-search", "union-find", "heap", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/path-with-minimum-effort/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on answer or Dijkstra",
      "Minimize maximum absolute difference",
      "Use priority queue with effort as key"
    ],
    complexity: { time: "O(m*n log(m*n))", space: "O(m*n)" },
    keyLearning: "Binary search or Dijkstra",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "cheapest-flights-k-stops",
    order: 6,
    tags: ["graph", "dynamic-programming", "depth-first-search", "breadth-first-search", "heap", "shortest-path"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Modified Dijkstra with stops constraint",
      "Track (cost, stops) in priority queue",
      "Or use BFS with K levels"
    ],
    complexity: { time: "O(E + V log V)", space: "O(V)" },
    keyLearning: "Modified Dijkstra",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Network Delay Time",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "network-delay-time",
    order: 7,
    tags: ["graph", "depth-first-search", "breadth-first-search", "heap", "shortest-path"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/network-delay-time/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Single source shortest path",
      "Dijkstra from source node",
      "Return max distance to reach all nodes"
    ],
    complexity: { time: "O((V+E) log V)", space: "O(V+E)" },
    keyLearning: "Single source shortest",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Number of Ways to Arrive at Destination",
    difficulty: "Hard",
    pattern_id: "shortest-paths",
    slug: "ways-arrive-destination",
    order: 8,
    tags: ["graph", "dynamic-programming", "shortest-path"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count shortest paths",
      "Dijkstra + DP counting",
      "When updating distance, add ways"
    ],
    complexity: { time: "O((V+E) log V)", space: "O(V+E)" },
    keyLearning: "Count shortest paths",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Bellman-Ford Algorithm",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "bellman-ford",
    order: 9,
    tags: ["graph", "dynamic-programming", "shortest-path"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/",
      article: ""
    },
    hints: [
      "Handles negative weights",
      "Relax all edges V-1 times",
      "Detect negative cycles"
    ],
    complexity: { time: "O(V*E)", space: "O(V)" },
    keyLearning: "Handle negative weights",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Floyd-Warshall Algorithm",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "floyd-warshall",
    order: 10,
    tags: ["graph", "dynamic-programming", "shortest-path"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/",
      article: ""
    },
    hints: [
      "All-pairs shortest path",
      "3 nested loops: intermediate, source, destination",
      "dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j])"
    ],
    complexity: { time: "O(V³)", space: "O(V²)" },
    keyLearning: "All-pairs shortest",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "city-smallest-neighbors",
    order: 11,
    tags: ["graph", "dynamic-programming", "shortest-path"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Floyd-Warshall + threshold check",
      "Count reachable cities for each city",
      "Return city with minimum count"
    ],
    complexity: { time: "O(V³)", space: "O(V²)" },
    keyLearning: "Floyd + threshold",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Prim's Algorithm (MST)",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "prims-algorithm",
    order: 12,
    tags: ["graph", "minimum-spanning-tree", "heap"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/",
      article: ""
    },
    hints: [
      "Greedy MST with heap",
      "Start from any node",
      "Always pick minimum weight edge to unvisited"
    ],
    complexity: { time: "O(E log V)", space: "O(V+E)" },
    keyLearning: "Greedy MST with heap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kruskal's Algorithm (MST)",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "kruskals-algorithm",
    order: 13,
    tags: ["graph", "minimum-spanning-tree", "union-find"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/",
      article: ""
    },
    hints: [
      "Sort edges + union-find",
      "Pick smallest edge not creating cycle",
      "Use DSU for cycle detection"
    ],
    complexity: { time: "O(E log E)", space: "O(V)" },
    keyLearning: "Sort edges + union-find",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Disjoint Set Union (DSU / Union-Find)",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "disjoint-set-union",
    order: 14,
    tags: ["union-find"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/union-find/",
      article: ""
    },
    hints: [
      "Path compression + union by rank",
      "Find: compress path to root",
      "Union: attach smaller to larger"
    ],
    complexity: { time: "O(α(n))", space: "O(n)" },
    keyLearning: "Path compression + rank",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Number of Operations to Make Network Connected",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "operations-network-connected",
    order: 15,
    tags: ["graph", "depth-first-search", "breadth-first-search", "union-find"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-operations-to-make-network-connected/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Union-find to count components",
      "Need components-1 cables to connect",
      "Check if enough extra cables available"
    ],
    complexity: { time: "O(E)", space: "O(V)" },
    keyLearning: "Union-find components",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Most Stones Removed with Same Row or Column",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "most-stones-removed",
    order: 16,
    tags: ["graph", "depth-first-search", "union-find"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Union-find on row and column",
      "Treat rows and columns as nodes",
      "Answer = total stones - number of components"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Union-find on row/col",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Accounts Merge",
    difficulty: "Medium",
    pattern_id: "shortest-paths",
    slug: "accounts-merge",
    order: 17,
    tags: ["array", "string", "depth-first-search", "breadth-first-search", "union-find"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/accounts-merge/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Union-find for grouping",
      "Map emails to account index",
      "Merge accounts with common emails"
    ],
    complexity: { time: "O(N*K log(N*K))", space: "O(N*K)" },
    keyLearning: "Union-find grouping",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Swim in Rising Water",
    difficulty: "Hard",
    pattern_id: "shortest-paths",
    slug: "swim-rising-water",
    order: 18,
    tags: ["array", "binary-search", "depth-first-search", "breadth-first-search", "union-find", "heap", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/swim-in-rising-water/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on time + BFS",
      "Or Dijkstra with max elevation as cost",
      "Or Union-Find incrementally"
    ],
    complexity: { time: "O(n² log n)", space: "O(n²)" },
    keyLearning: "Binary search + BFS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Critical Connections in a Network (Bridges)",
    difficulty: "Hard",
    pattern_id: "shortest-paths",
    slug: "critical-connections",
    order: 19,
    tags: ["graph", "depth-first-search", "biconnected-component"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/critical-connections-in-a-network/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Tarjan's algorithm for bridges",
      "Track discovery time and low value",
      "Edge is bridge if low[v] > disc[u]"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Tarjan's algorithm",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Articulation Points",
    difficulty: "Hard",
    pattern_id: "shortest-paths",
    slug: "articulation-points",
    order: 20,
    tags: ["graph", "depth-first-search", "biconnected-component"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/",
      article: ""
    },
    hints: [
      "Tarjan's algorithm for vertices",
      "Root is AP if > 1 children in DFS tree",
      "Non-root is AP if low[v] >= disc[u]"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Tarjan's for vertices",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Number of Islands II",
    difficulty: "Hard",
    pattern_id: "shortest-paths",
    slug: "number-islands-ii",
    isAdditional: true,
    tags: ["array", "union-find"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-islands-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Dynamic connectivity with Union-Find",
      "Add islands one by one",
      "Update component count after each union"
    ],
    complexity: { time: "O(k*α(mn))", space: "O(mn)" },
    note: "⭐ Dynamic connectivity",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kosaraju's Algorithm (Strongly Connected Components)",
    difficulty: "Hard",
    pattern_id: "shortest-paths",
    slug: "kosarajus-algorithm",
    isAdditional: true,
    tags: ["graph", "depth-first-search"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/strongly-connected-components/",
      article: ""
    },
    hints: [
      "Two-pass DFS algorithm",
      "First pass: compute finish times",
      "Second pass: DFS on transposed graph"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    note: "⭐ Strongly connected components",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedShortestPathsMST() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Shortest Paths & MST pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'shortest-paths' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'shortest-paths' })
      console.log('✅ Cleaned up\n')
    }

    console.log('📥 Inserting core questions...\n')
    const coreResult = await questionsCollection.insertMany(questionsData)
    console.log(`✅ Inserted ${coreResult.insertedCount} core questions\n`)

    console.log('📥 Inserting additional practice problems...\n')
    const additionalResult = await questionsCollection.insertMany(additionalProblems)
    console.log(`✅ Inserted ${additionalResult.insertedCount} additional problems\n`)

    const byDifficulty = {}
    questionsData.forEach(q => {
      byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1
    })

    console.log('📈 Core Questions by Difficulty:')
    Object.entries(byDifficulty).forEach(([diff, count]) => {
      const emoji = diff === 'Easy' ? '🟢' : diff === 'Medium' ? '🟡' : '🔴'
      console.log(`   ${emoji} ${diff}: ${count} questions`)
    })

    console.log('\n✨ Seed successful!')
    console.log('\n📋 Summary:')
    console.log(`   • Core Problems: 20 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
    console.log(`   • Covers: Dijkstra, Bellman-Ford, Floyd-Warshall, MST, Union-Find, Tarjan's`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedShortestPathsMST()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
