// scripts/problems/seed-graph-bfs-dfs.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 28: Graph BFS/DFS & Islands (15 core problems)
const questionsData = [
  {
    title: "BFS Traversal of Graph",
    difficulty: "Easy",
    pattern_id: "graph-bfs-dfs",
    slug: "bfs-traversal",
    order: 1,
    tags: ["graph", "breadth-first-search"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/",
      article: ""
    },
    hints: [
      "Queue-based level order traversal",
      "Mark visited to avoid cycles",
      "Process all neighbors level by level"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Queue-based level order",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "DFS Traversal of Graph",
    difficulty: "Easy",
    pattern_id: "graph-bfs-dfs",
    slug: "dfs-traversal",
    order: 2,
    tags: ["graph", "depth-first-search"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/",
      article: ""
    },
    hints: [
      "Recursion or stack traversal",
      "Go deep before going wide",
      "Mark visited to avoid cycles"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Recursion/stack traversal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Number of Provinces",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "number-of-provinces",
    order: 3,
    tags: ["graph", "depth-first-search", "breadth-first-search", "union-find"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-provinces/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Connected components in graph",
      "DFS/BFS from each unvisited node",
      "Count number of DFS/BFS calls"
    ],
    complexity: { time: "O(V²)", space: "O(V)" },
    keyLearning: "Connected components",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Number of Islands",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "number-of-islands",
    order: 4,
    tags: ["array", "depth-first-search", "breadth-first-search", "union-find", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-islands/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "2D grid components",
      "DFS/BFS in 4 directions",
      "Mark visited or modify grid"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: "2D grid components",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Flood Fill",
    difficulty: "Easy",
    pattern_id: "graph-bfs-dfs",
    slug: "flood-fill",
    order: 5,
    tags: ["array", "depth-first-search", "breadth-first-search", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/flood-fill/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "DFS/BFS color change",
      "Start from given pixel",
      "Change all connected same-colored pixels"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: "DFS/BFS color change",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Rotting Oranges",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "rotting-oranges",
    order: 6,
    tags: ["array", "breadth-first-search", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/rotting-oranges/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Multi-source BFS",
      "Add all rotten oranges to queue initially",
      "Track time for each level"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: "Multi-source BFS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Detect Cycle in Undirected Graph (BFS)",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "detect-cycle-undirected-bfs",
    order: 7,
    tags: ["graph", "breadth-first-search", "union-find"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/detect-cycle-in-an-undirected-graph-using-bfs/",
      article: ""
    },
    hints: [
      "Parent tracking BFS",
      "If visited neighbor is not parent, cycle exists",
      "Store parent in queue"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Parent tracking BFS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Detect Cycle in Undirected Graph (DFS)",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "detect-cycle-undirected-dfs",
    order: 8,
    tags: ["graph", "depth-first-search", "union-find"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/detect-cycle-undirected-graph/",
      article: ""
    },
    hints: [
      "Visited + parent DFS",
      "If neighbor visited and not parent, cycle",
      "Pass parent in recursion"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Visited + parent DFS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Detect Cycle in Directed Graph (DFS)",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "detect-cycle-directed-dfs",
    order: 9,
    tags: ["graph", "depth-first-search"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/",
      article: ""
    },
    hints: [
      "Recursion stack approach",
      "Track visited and recursion stack",
      "If neighbor in recursion stack, cycle exists"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Recursion stack",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "01 Matrix (Distance to Nearest 0)",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "01-matrix",
    order: 10,
    tags: ["array", "dynamic-programming", "breadth-first-search", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/01-matrix/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Multi-source BFS from all 0s",
      "Add all 0 cells to queue initially",
      "Calculate distance level by level"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: "Multi-source BFS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Surrounded Regions",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "surrounded-regions",
    order: 11,
    tags: ["array", "depth-first-search", "breadth-first-search", "union-find", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/surrounded-regions/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "DFS/BFS from boundary",
      "Mark boundary-connected O's as safe",
      "Flip remaining O's to X's"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: "DFS/BFS from boundary",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Number of Enclaves",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "number-of-enclaves",
    order: 12,
    tags: ["array", "depth-first-search", "breadth-first-search", "union-find", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-enclaves/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Similar to Surrounded Regions",
      "Mark boundary-connected cells",
      "Count remaining unreachable cells"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: "Count unreachable cells",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Is Graph Bipartite? (DFS)",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "is-graph-bipartite-dfs",
    order: 13,
    tags: ["graph", "depth-first-search", "breadth-first-search"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/is-graph-bipartite/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Two-coloring DFS",
      "Try to color graph with 2 colors",
      "If neighbor has same color, not bipartite"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Two-coloring DFS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Is Graph Bipartite? (BFS)",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "is-graph-bipartite-bfs",
    order: 14,
    tags: ["graph", "breadth-first-search", "depth-first-search"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/is-graph-bipartite/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Two-coloring BFS",
      "Alternate colors level by level",
      "Check if any conflict occurs"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Two-coloring BFS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Clone Graph",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "clone-graph",
    order: 15,
    tags: ["hash-table", "depth-first-search", "breadth-first-search", "graph"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/clone-graph/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Deep copy with HashMap",
      "Map original node to cloned node",
      "DFS/BFS to traverse and clone"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Deep copy with HashMap",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Word Ladder",
    difficulty: "Hard",
    pattern_id: "graph-bfs-dfs",
    slug: "word-ladder",
    isAdditional: true,
    tags: ["hash-table", "string", "breadth-first-search"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/word-ladder/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "BFS shortest path in word graph",
      "Each word is a node",
      "Edge exists if one character different"
    ],
    complexity: { time: "O(M²*N)", space: "O(M*N)" },
    note: "⭐ BFS shortest path",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Number of Distinct Islands",
    difficulty: "Medium",
    pattern_id: "graph-bfs-dfs",
    slug: "number-distinct-islands",
    isAdditional: true,
    tags: ["hash-table", "depth-first-search", "breadth-first-search"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-distinct-islands/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Serialize island shapes",
      "Use set to track unique shapes",
      "Normalize starting point"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    note: "⭐ Serialize shapes",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedGraphBFSDFS() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Graph BFS/DFS & Islands pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'graph-bfs-dfs' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'graph-bfs-dfs' })
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
    console.log(`   • Core Problems: 15 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedGraphBFSDFS()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
