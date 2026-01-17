// scripts/problems/seed-topological-sort.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 29: Topological Sort & DAG (8 core problems)
const questionsData = [
  {
    title: "Topological Sort (DFS)",
    difficulty: "Medium",
    pattern_id: "topological-sort",
    slug: "topological-sort-dfs",
    order: 1,
    tags: ["graph", "depth-first-search", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/topological-sorting/",
      article: ""
    },
    hints: [
      "Post-order DFS + stack",
      "Visit all neighbors first",
      "Push to stack after processing"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Post-order DFS + stack",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kahn's Algorithm (BFS Topological Sort)",
    difficulty: "Medium",
    pattern_id: "topological-sort",
    slug: "kahns-algorithm",
    order: 2,
    tags: ["graph", "breadth-first-search", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/",
      article: ""
    },
    hints: [
      "In-degree based BFS",
      "Start with nodes having in-degree 0",
      "Reduce in-degree of neighbors"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "In-degree based",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Detect Cycle in Directed Graph (BFS)",
    difficulty: "Medium",
    pattern_id: "topological-sort",
    slug: "detect-cycle-directed-bfs",
    order: 3,
    tags: ["graph", "breadth-first-search", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/detect-cycle-in-a-directed-graph-using-bfs/",
      article: ""
    },
    hints: [
      "Kahn's algorithm variation",
      "If topo sort includes all nodes, no cycle",
      "Otherwise cycle exists"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Kahn's variation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Course Schedule",
    difficulty: "Medium",
    pattern_id: "topological-sort",
    slug: "course-schedule",
    order: 4,
    tags: ["graph", "depth-first-search", "breadth-first-search", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/course-schedule/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Check if topological ordering exists",
      "Use Kahn's or DFS cycle detection",
      "Return true if no cycle"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Check if ordering exists",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Course Schedule II",
    difficulty: "Medium",
    pattern_id: "topological-sort",
    slug: "course-schedule-ii",
    order: 5,
    tags: ["graph", "depth-first-search", "breadth-first-search", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/course-schedule-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Return topological order",
      "Use Kahn's algorithm",
      "Return empty if cycle exists"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Return topological order",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find Eventual Safe States",
    difficulty: "Medium",
    pattern_id: "topological-sort",
    slug: "eventual-safe-states",
    order: 6,
    tags: ["graph", "depth-first-search", "breadth-first-search", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/find-eventual-safe-states/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Reverse graph + topological sort",
      "Safe nodes have no outgoing edges to unsafe nodes",
      "Use Kahn's on reversed graph"
    ],
    complexity: { time: "O(V+E)", space: "O(V)" },
    keyLearning: "Reverse graph + toposort",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Alien Dictionary",
    difficulty: "Hard",
    pattern_id: "topological-sort",
    slug: "alien-dictionary",
    order: 7,
    tags: ["array", "string", "graph", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/alien-dictionary/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Build graph from word order",
      "Compare adjacent words character by character",
      "Apply topological sort to get order"
    ],
    complexity: { time: "O(C)", space: "O(1)" },
    keyLearning: "Build graph from order",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "All Ancestors of a Node in a Directed Acyclic Graph",
    difficulty: "Medium",
    pattern_id: "topological-sort",
    slug: "all-ancestors-node",
    order: 8,
    tags: ["graph", "depth-first-search", "breadth-first-search", "topological-sort"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Reverse traversal from each node",
      "Or topological sort with ancestor tracking",
      "Use sets to store unique ancestors"
    ],
    complexity: { time: "O(V*(V+E))", space: "O(V²)" },
    keyLearning: "Reverse traversal",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedTopologicalSort() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Topological Sort & DAG pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'topological-sort' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'topological-sort' })
      console.log('✅ Cleaned up\n')
    }

    console.log('📥 Inserting core questions...\n')
    const coreResult = await questionsCollection.insertMany(questionsData)
    console.log(`✅ Inserted ${coreResult.insertedCount} core questions\n`)

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
    console.log(`   • Core Problems: 8 (counted in 300)`)
    console.log(`   • Covers DFS and BFS topological sort`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedTopologicalSort()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
