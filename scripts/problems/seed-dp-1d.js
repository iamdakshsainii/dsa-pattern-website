// scripts/problems/seed-dp-1d.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 22: Dynamic Programming - 1D (15 core problems)
const questionsData = [
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    pattern_id: "dp-1d",
    slug: "climbing-stairs",
    order: 1,
    tags: ["math", "dynamic-programming", "memoization"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/climbing-stairs/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "To reach step n, you can come from n-1 or n-2",
      "dp[i] = dp[i-1] + dp[i-2]",
      "This is Fibonacci sequence"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Classic Fibonacci DP",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "House Robber",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "house-robber",
    order: 2,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/house-robber/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Cannot rob adjacent houses",
      "dp[i] = max(dp[i-1], dp[i-2] + nums[i])",
      "Either skip current or rob current + skip previous"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Non-adjacent max sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "House Robber II",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "house-robber-ii",
    order: 3,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/house-robber-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Houses arranged in circle - first and last are adjacent",
      "Run House Robber twice: [0...n-2] and [1...n-1]",
      "Take maximum of both results"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Circular array variant",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Decode Ways",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "decode-ways",
    order: 4,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/decode-ways/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "dp[i] = ways to decode s[0...i]",
      "Single digit (1-9): add dp[i-1]",
      "Two digits (10-26): add dp[i-2]"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Count decodings",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "coin-change",
    order: 5,
    tags: ["array", "dynamic-programming", "breadth-first-search"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/coin-change/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "dp[i] = min coins to make amount i",
      "For each coin, dp[i] = min(dp[i], dp[i-coin] + 1)",
      "Initialize with infinity except dp[0] = 0"
    ],
    complexity: { time: "O(n * amount)", space: "O(amount)" },
    keyLearning: "Min coins for target",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Coin Change II",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "coin-change-ii",
    order: 6,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/coin-change-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count ways to make sum (unbounded knapsack)",
      "dp[i] = number of ways to make amount i",
      "For each coin, dp[i] += dp[i-coin]"
    ],
    complexity: { time: "O(n * amount)", space: "O(amount)" },
    keyLearning: "Count ways to make sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Perfect Squares",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "perfect-squares",
    order: 7,
    tags: ["math", "dynamic-programming", "breadth-first-search"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/perfect-squares/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "dp[i] = min perfect squares to sum to i",
      "For each i, try all squares j² <= i",
      "dp[i] = min(dp[i], dp[i-j²] + 1)"
    ],
    complexity: { time: "O(n * √n)", space: "O(n)" },
    keyLearning: "Min squares to sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Word Break (DP)",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "word-break-dp",
    order: 8,
    tags: ["hash-table", "string", "dynamic-programming", "trie"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/word-break/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "dp[i] = can segment s[0...i]",
      "For each position, check all prefixes in dictionary",
      "dp[i] = true if any dp[j] && s[j...i] in dict"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    keyLearning: "String segmentation",
    crossReference: {
      pattern: "recursion-subsets",
      problemTitle: "Word Break",
      note: "🔗 Also in Recursion - backtracking approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "longest-increasing-subsequence",
    order: 9,
    tags: ["array", "binary-search", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-increasing-subsequence/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "dp[i] = length of LIS ending at i",
      "For each i, check all j < i where nums[j] < nums[i]",
      "dp[i] = max(dp[i], dp[j] + 1)",
      "Optimal: O(n log n) with binary search + patience sorting"
    ],
    complexity: { time: "O(n²) or O(n log n)", space: "O(n)" },
    keyLearning: "LIS using DP/Binary Search",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Divisible Subset",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "longest-divisible-subset",
    order: 10,
    tags: ["array", "math", "dynamic-programming", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/largest-divisible-subset/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort array first",
      "Similar to LIS but with divisibility condition",
      "dp[i] = length of longest divisible subset ending at i"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    keyLearning: "LIS with divisibility",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Delete and Earn",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "delete-and-earn",
    order: 11,
    tags: ["array", "hash-table", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/delete-and-earn/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Transform to House Robber problem",
      "Count frequency of each number",
      "Can't take num and num±1 together"
    ],
    complexity: { time: "O(n + max)", space: "O(max)" },
    keyLearning: "Constraint sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Counting Bits",
    difficulty: "Easy",
    pattern_id: "dp-1d",
    slug: "counting-bits",
    order: 12,
    tags: ["dynamic-programming", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/counting-bits/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "dp[i] = count of 1s in binary of i",
      "dp[i] = dp[i >> 1] + (i & 1)",
      "Or dp[i] = dp[i & (i-1)] + 1"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Count bits [0,n]",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Min Cost Climbing Stairs",
    difficulty: "Easy",
    pattern_id: "dp-1d",
    slug: "min-cost-climbing-stairs",
    order: 13,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/min-cost-climbing-stairs/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Can start from step 0 or 1",
      "dp[i] = min cost to reach step i",
      "dp[i] = cost[i] + min(dp[i-1], dp[i-2])"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Step costs",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Frog Jump (Min Cost)",
    difficulty: "Easy",
    pattern_id: "dp-1d",
    slug: "frog-jump-min-cost",
    order: 14,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/geek-jump/1",
      article: ""
    },
    hints: [
      "Frog can jump 1 or 2 steps",
      "Cost is height difference",
      "dp[i] = min cost to reach stone i"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Min cost with jumps",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Palindrome Partitioning II (DP)",
    difficulty: "Hard",
    pattern_id: "dp-1d",
    slug: "palindrome-partitioning-ii-dp",
    order: 15,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/palindrome-partitioning-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "dp[i] = min cuts for s[0...i]",
      "Precompute isPalindrome[i][j]",
      "If s[j...i] is palindrome, dp[i] = min(dp[i], dp[j-1] + 1)"
    ],
    complexity: { time: "O(n²)", space: "O(n²)" },
    keyLearning: "Min cuts for palindrome",
    crossReference: {
      pattern: "backtracking",
      problemTitle: "Palindrome Partitioning II",
      note: "🔗 Also in Backtracking - backtracking approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Frog Jump K Distances",
    difficulty: "Medium",
    pattern_id: "dp-1d",
    slug: "frog-jump-k-distances",
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
      "Generalization of Frog Jump",
      "Frog can jump 1 to K steps",
      "dp[i] = min of all previous K positions"
    ],
    complexity: { time: "O(n*k)", space: "O(n)" },
    note: "⭐ Similar: Generalized jumps",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedDP1D() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting DP - 1D pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'dp-1d' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'dp-1d' })
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
    console.log(`   • Cross-references: 2 (Word Break → Recursion, Palindrome Partitioning II → Backtracking)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedDP1D()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
