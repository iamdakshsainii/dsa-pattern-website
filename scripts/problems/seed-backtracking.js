// scripts/problems/seed-backtracking.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 15: Backtracking - Constraint Satisfaction (12 core problems)
const questionsData = [
  {
    title: "Word Search",
    difficulty: "Medium",
    pattern_id: "backtracking",
    slug: "word-search",
    order: 1,
    tags: ["array", "backtracking", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/word-search/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Try all cells as starting point",
      "Use DFS in 4 directions",
      "Mark visited cells, backtrack after exploring"
    ],
    complexity: { time: "O(m*n*4^L)", space: "O(L)" },
    keyLearning: "2D grid DFS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Word Search II",
    difficulty: "Hard",
    pattern_id: "backtracking",
    slug: "word-search-ii",
    order: 2,
    tags: ["array", "string", "backtracking", "trie"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Airbnb"],
    links: {
      leetcode: "https://leetcode.com/problems/word-search-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Build Trie from word list",
      "DFS with Trie traversal",
      "Remove found words from Trie to optimize"
    ],
    complexity: { time: "O(m*n*4^L)", space: "O(total chars)" },
    keyLearning: "Trie + DFS optimization",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "N-Queens",
    difficulty: "Hard",
    pattern_id: "backtracking",
    slug: "n-queens",
    order: 3,
    tags: ["array", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/n-queens/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Place one queen per row",
      "Check column, diagonal, anti-diagonal conflicts",
      "Use sets to track attacked positions"
    ],
    complexity: { time: "O(n!)", space: "O(n)" },
    keyLearning: "Place without conflicts",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "N-Queens II",
    difficulty: "Hard",
    pattern_id: "backtracking",
    slug: "n-queens-ii",
    order: 4,
    tags: ["backtracking"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/n-queens-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Same as N-Queens but only count solutions",
      "No need to build board configuration",
      "Just increment counter when valid placement found"
    ],
    complexity: { time: "O(n!)", space: "O(n)" },
    keyLearning: "Count solutions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sudoku Solver",
    difficulty: "Hard",
    pattern_id: "backtracking",
    slug: "sudoku-solver",
    order: 5,
    tags: ["array", "backtracking", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Uber"],
    links: {
      leetcode: "https://leetcode.com/problems/sudoku-solver/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Try numbers 1-9 in empty cells",
      "Check row, column, 3x3 box constraints",
      "Backtrack if no valid number found"
    ],
    complexity: { time: "O(9^(empty cells))", space: "O(1)" },
    keyLearning: "Fill with constraints",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Rat in a Maze",
    difficulty: "Medium",
    pattern_id: "backtracking",
    slug: "rat-in-a-maze",
    order: 6,
    tags: ["array", "backtracking", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",
      article: ""
    },
    hints: [
      "Try 4 directions: Down, Left, Right, Up (DLRU)",
      "Mark visited cells to avoid cycles",
      "Backtrack when hitting wall or visited cell"
    ],
    complexity: { time: "O(4^(m*n))", space: "O(m*n)" },
    keyLearning: "All paths in maze",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "M-Coloring Problem",
    difficulty: "Medium",
    pattern_id: "backtracking",
    slug: "m-coloring-problem",
    order: 7,
    tags: ["graph", "backtracking"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/m-coloring-problem/1",
      article: ""
    },
    hints: [
      "Assign colors to vertices one by one",
      "Check if adjacent vertices have same color",
      "Backtrack if no valid color found"
    ],
    complexity: { time: "O(m^V)", space: "O(V)" },
    keyLearning: "Graph coloring",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Word Break II",
    difficulty: "Hard",
    pattern_id: "backtracking",
    slug: "word-break-ii",
    order: 8,
    tags: ["hash-table", "string", "dynamic-programming", "backtracking", "trie"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/word-break-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Generate all valid segmentations",
      "Try all prefixes in dictionary",
      "Recursively segment suffix and combine"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    keyLearning: "All segmentations",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Beautiful Arrangement",
    difficulty: "Medium",
    pattern_id: "backtracking",
    slug: "beautiful-arrangement",
    order: 9,
    tags: ["array", "dynamic-programming", "backtracking", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/beautiful-arrangement/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "num divisible by pos OR pos divisible by num",
      "Try all permutations with constraint",
      "Use visited array to track used numbers"
    ],
    complexity: { time: "O(k)", space: "O(n)" },
    keyLearning: "Divisibility constraint",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Split String into Max Number of Unique Substrings",
    difficulty: "Medium",
    pattern_id: "backtracking",
    slug: "split-string-max-unique",
    order: 10,
    tags: ["hash-table", "string", "backtracking"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/split-a-string-into-the-max-number-of-unique-substrings/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Try all possible split positions",
      "Track unique substrings in set",
      "Backtrack and remove when exploring alternatives"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    keyLearning: "Maximize unique splits",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Palindrome Partitioning II",
    difficulty: "Hard",
    pattern_id: "backtracking",
    slug: "palindrome-partitioning-ii",
    order: 11,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/palindrome-partitioning-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find minimum cuts for palindrome partitioning",
      "Precompute palindrome checks",
      "Use DP: dp[i] = min cuts for s[0..i]"
    ],
    complexity: { time: "O(n^2)", space: "O(n^2)" },
    keyLearning: "Min cuts (DP + backtrack)",
    crossReference: {
      pattern: "dp-1d",
      problemTitle: "Palindrome Partitioning II",
      note: "🔗 Also in DP 1D - DP optimization approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Restore IP Addresses",
    difficulty: "Medium",
    pattern_id: "backtracking",
    slug: "restore-ip-addresses",
    order: 12,
    tags: ["string", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/restore-ip-addresses/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Need exactly 4 parts",
      "Each part: 0-255, no leading zeros (except '0')",
      "Try all valid partition points"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    keyLearning: "Valid IP formation",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Expression Add Operators",
    difficulty: "Hard",
    pattern_id: "backtracking",
    slug: "expression-add-operators",
    isAdditional: true,
    tags: ["math", "string", "backtracking"],
    companies: ["Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/expression-add-operators/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Try +, -, * operators between digits",
      "Handle multiplication precedence",
      "Track previous operand for multiplication"
    ],
    complexity: { time: "O(4^n)", space: "O(n)" },
    note: "❌ Removed: Very niche, rarely asked",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedBacktracking() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Backtracking pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'backtracking' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'backtracking' })
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
    console.log(`   • Core Problems: 12 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
    console.log(`   • Cross-references: 1 (Palindrome Partitioning II → DP 1D)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedBacktracking()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
