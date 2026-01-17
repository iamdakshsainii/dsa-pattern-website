// scripts/problems/seed-dp-2d-grid.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 23: Dynamic Programming - 2D/3D Grid (11 core problems)
const questionsData = [
  {
    title: "Unique Paths",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "unique-paths",
    order: 1,
    tags: ["math", "dynamic-programming", "combinatorics"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/unique-paths/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Can only move right or down",
      "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
      "Number of ways to reach (i,j)"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Count grid paths",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Unique Paths II",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "unique-paths-ii",
    order: 2,
    tags: ["array", "dynamic-programming", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/unique-paths-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Same as Unique Paths but with obstacles",
      "If grid[i][j] is obstacle, dp[i][j] = 0",
      "Otherwise dp[i][j] = dp[i-1][j] + dp[i][j-1]"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "With obstacles",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Path Sum",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "minimum-path-sum",
    order: 3,
    tags: ["array", "dynamic-programming", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-path-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find path from top-left to bottom-right with min sum",
      "dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])",
      "Can optimize to O(n) space"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Min cost path",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Triangle",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "triangle",
    order: 4,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/triangle/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Top to bottom path in triangle",
      "Can move to [i+1][j] or [i+1][j+1]",
      "Bottom-up: dp[i][j] = triangle[i][j] + min(dp[i+1][j], dp[i+1][j+1])"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    keyLearning: "Min path in triangle",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Falling Path Sum",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "minimum-falling-path-sum",
    order: 5,
    tags: ["array", "dynamic-programming", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-falling-path-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Fall down choosing adjacent column (j-1, j, j+1)",
      "dp[i][j] = matrix[i][j] + min(dp[i-1][j-1], dp[i-1][j], dp[i-1][j+1])",
      "Answer is min of last row"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    keyLearning: "Falling path in matrix",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cherry Pickup",
    difficulty: "Hard",
    pattern_id: "dp-2d-grid",
    slug: "cherry-pickup",
    order: 6,
    tags: ["array", "dynamic-programming", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/cherry-pickup/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Go from (0,0) to (n-1,n-1) and back",
      "Equivalent to two people going from start to end",
      "3D DP: dp[r1][c1][r2] (c2 = r1+c1-r2)"
    ],
    complexity: { time: "O(n³)", space: "O(n³)" },
    keyLearning: "Two passes maximize",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Dungeon Game",
    difficulty: "Hard",
    pattern_id: "dp-2d-grid",
    slug: "dungeon-game",
    order: 7,
    tags: ["array", "dynamic-programming", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/dungeon-game/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Work backwards from bottom-right",
      "dp[i][j] = min health needed at (i,j)",
      "dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Min initial health",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cherry Pickup II",
    difficulty: "Hard",
    pattern_id: "dp-2d-grid",
    slug: "cherry-pickup-ii",
    order: 8,
    tags: ["array", "dynamic-programming", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/cherry-pickup-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Two robots moving simultaneously from top",
      "3D DP: dp[row][col1][col2]",
      "Each robot can move to 3 adjacent columns"
    ],
    complexity: { time: "O(m*n²)", space: "O(n²)" },
    keyLearning: "Two robots",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Count Square Submatrices with All Ones",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "count-square-submatrices",
    order: 9,
    tags: ["array", "dynamic-programming", "matrix"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/count-square-submatrices-with-all-ones/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "dp[i][j] = side length of largest square ending at (i,j)",
      "If matrix[i][j] = 1: dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1",
      "Sum all dp values for total count"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "DP for counting",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximal Square",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "maximal-square",
    order: 10,
    tags: ["array", "dynamic-programming", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/maximal-square/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Similar to Count Square Submatrices",
      "dp[i][j] = side length of largest square with bottom-right at (i,j)",
      "Return max(dp[i][j])²"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Largest square of 1s",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Range Sum Query 2D - Immutable",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "range-sum-query-2d-dp",  // ✅ Changed to unique slug
    order: 11,
    tags: ["array", "design", "matrix", "prefix-sum"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/range-sum-query-2d-immutable/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Precompute 2D prefix sum",
      "prefix[i][j] = sum of rectangle from (0,0) to (i,j)",
      "Query: prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1]"
    ],
    complexity: { time: "O(1) query", space: "O(m*n)" },
    keyLearning: "2D prefix sum",
    crossReference: {
      pattern: "prefix-sum-kadane",
      problemTitle: "Range Sum Query 2D",
      note: "🔗 Also in Prefix Sum - 2D variant"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Ninja Training",
    difficulty: "Medium",
    pattern_id: "dp-2d-grid",
    slug: "ninja-training",
    isAdditional: true,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Choose one activity per day, max points",
      "Cannot choose same activity on consecutive days",
      "dp[day][last] = max points on 'day' with 'last' activity chosen"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    note: "⭐ Similar: Max points with column constraint",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedDP2DGrid() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting DP - 2D/3D Grid pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'dp-2d-grid' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'dp-2d-grid' })
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
    console.log(`   • Core Problems: 11 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
    console.log(`   • Cross-references: 1 (Range Sum Query 2D → Prefix Sum)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedDP2DGrid()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
