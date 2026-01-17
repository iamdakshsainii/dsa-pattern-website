// scripts/problems/seed-binary-search-2d.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 9: Binary Search - 2D Matrix (6 core problems)
const questionsData = [
  {
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    pattern_id: "binary-search-2d",
    slug: "search-2d-matrix",
    order: 1,
    tags: ["array", "binary-search", "matrix"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/search-a-2d-matrix/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Matrix is fully sorted (treat as 1D array)",
      "Binary search with row = mid / cols, col = mid % cols",
      "Search space is [0, m*n - 1]"
    ],
    complexity: { time: "O(log(m*n))", space: "O(1)" },
    keyLearning: "Treat as 1D sorted",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Search a 2D Matrix II",
    difficulty: "Medium",
    pattern_id: "binary-search-2d",
    slug: "search-2d-matrix-ii",
    order: 2,
    tags: ["array", "binary-search", "matrix", "divide-and-conquer"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/search-a-2d-matrix-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Row-wise and column-wise sorted",
      "Start from top-right or bottom-left",
      "Staircase search: eliminate row or column each step"
    ],
    complexity: { time: "O(m+n)", space: "O(1)" },
    keyLearning: "Staircase search",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Row with Maximum Number of 1s",
    difficulty: "Easy",
    pattern_id: "binary-search-2d",
    slug: "row-max-ones",
    order: 3,
    tags: ["array", "binary-search", "matrix"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-the-row-with-maximum-number-1s/",
      article: ""
    },
    hints: [
      "Each row sorted: 0s followed by 1s",
      "Binary search on each row to find first 1",
      "Count 1s = n - firstIndex",
      "Track row with max 1s"
    ],
    complexity: { time: "O(m log n)", space: "O(1)" },
    keyLearning: "BS on each row",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find a Peak Element II",
    difficulty: "Hard",
    pattern_id: "binary-search-2d",
    slug: "find-peak-element-ii",
    order: 4,
    tags: ["array", "binary-search", "matrix", "divide-and-conquer"],
    companies: ["Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/find-a-peak-element-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Peak is greater than all 4 neighbors",
      "Binary search on rows/columns",
      "Find max in middle column, check if peak",
      "If not, move to side with larger neighbor"
    ],
    complexity: { time: "O(m log n) or O(n log m)", space: "O(1)" },
    keyLearning: "BS on rows and columns",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kth Smallest Element in a Sorted Matrix",
    difficulty: "Medium",
    pattern_id: "binary-search-2d",
    slug: "kth-smallest-sorted-matrix",
    order: 5,
    tags: ["array", "binary-search", "matrix", "heap"],
    companies: ["Amazon", "Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on value range [matrix[0][0], matrix[n-1][n-1]]",
      "Count elements <= mid using staircase approach",
      "Find smallest value with count >= k"
    ],
    complexity: { time: "O(n log(max-min))", space: "O(1)" },
    keyLearning: "BS on value + count",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Median in a Row-wise Sorted Matrix",
    difficulty: "Hard",
    pattern_id: "binary-search-2d",
    slug: "median-row-sorted-matrix",
    order: 6,
    tags: ["array", "binary-search", "matrix"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-median-row-wise-sorted-matrix/",
      article: ""
    },
    hints: [
      "Binary search on value range [min, max]",
      "Count elements <= mid in all rows (BS per row)",
      "Median position = (m*n + 1) / 2",
      "Find smallest value with count >= median position"
    ],
    complexity: { time: "O(m * log n * log(max-min))", space: "O(1)" },
    keyLearning: "BS on value range",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedBinarySearch2D() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Binary Search 2D pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'binary-search-2d' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'binary-search-2d' })
      console.log('✅ Cleaned up\n')
    }

    console.log('📥 Inserting core questions...\n')
    const result = await questionsCollection.insertMany(questionsData)
    console.log(`✅ Inserted ${result.insertedCount} core questions\n`)

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
    console.log(`   • Core Problems: 6 (counted in 300)`)
    console.log(`   • Pattern: 2D matrix binary search`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedBinarySearch2D()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
