// scripts/problems/seed-dp-lis-mcm.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 27: Dynamic Programming - LIS & MCM (10 core problems)
const questionsData = [
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    pattern_id: "dp-lis-mcm",
    slug: "longest-increasing-subsequence-lis",
    order: 1,
    tags: ["array", "binary-search", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-increasing-subsequence/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "O(n²) DP: dp[i] = longest ending at i",
      "O(n log n) Binary Search with patience sorting",
      "Maintain increasing sequence, replace when possible"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "O(n log n) Binary Search",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Number of Longest Increasing Subsequence",
    difficulty: "Medium",
    pattern_id: "dp-lis-mcm",
    slug: "number-of-lis",
    order: 2,
    tags: ["array", "binary-search", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-longest-increasing-subsequence/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track both length and count",
      "dp[i] = LIS length ending at i",
      "count[i] = number of LIS ending at i"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    keyLearning: "Count all LIS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Bitonic Subsequence",
    difficulty: "Medium",
    pattern_id: "dp-lis-mcm",
    slug: "longest-bitonic-subsequence",
    order: 3,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/longest-bitonic-subsequence-dp-15/",
      article: ""
    },
    hints: [
      "Increasing then decreasing",
      "Compute LIS from left: lis[i]",
      "Compute LIS from right (LDS): lds[i]",
      "Answer = max(lis[i] + lds[i] - 1)"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    keyLearning: "Increasing then decreasing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Matrix Chain Multiplication",
    difficulty: "Hard",
    pattern_id: "dp-lis-mcm",
    slug: "matrix-chain-multiplication",
    order: 4,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/",
      article: ""
    },
    hints: [
      "Optimal parenthesization",
      "dp[i][j] = min cost to multiply matrices i to j",
      "Try all partition points k: dp[i][k] + dp[k+1][j] + cost"
    ],
    complexity: { time: "O(n³)", space: "O(n²)" },
    keyLearning: "Optimal parenthesization",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Cost to Cut a Stick",
    difficulty: "Hard",
    pattern_id: "dp-lis-mcm",
    slug: "min-cost-cut-stick",
    order: 5,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "MCM variant with cuts",
      "Sort cuts, add 0 and n at ends",
      "dp[i][j] = min cost to cut between cuts[i] and cuts[j]"
    ],
    complexity: { time: "O(n³)", space: "O(n²)" },
    keyLearning: "MCM variant",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Burst Balloons",
    difficulty: "Hard",
    pattern_id: "dp-lis-mcm",
    slug: "burst-balloons",
    order: 6,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/burst-balloons/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Think which balloon to burst LAST",
      "Add 1 at both ends",
      "dp[i][j] = max coins bursting (i,j)"
    ],
    complexity: { time: "O(n³)", space: "O(n²)" },
    keyLearning: "Maximize coins",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Palindrome Partitioning II",
    difficulty: "Hard",
    pattern_id: "dp-lis-mcm",
    slug: "palindrome-partitioning-ii-mcm",
    order: 7,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/palindrome-partitioning-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Min cuts for palindrome partitions",
      "Precompute palindrome table",
      "dp[i] = min cuts for s[0:i]"
    ],
    complexity: { time: "O(n²)", space: "O(n²)" },
    keyLearning: "Min cuts (also in Pattern 22)",
    crossReference: {
      pattern: "dp-1d",
      problemTitle: "Palindrome Partitioning II",
      note: "🔗 Also in DP 1D - different approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Partition Array for Maximum Sum",
    difficulty: "Medium",
    pattern_id: "dp-lis-mcm",
    slug: "partition-array-max-sum-mcm",
    order: 8,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/partition-array-for-maximum-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Partition with value change",
      "dp[i] = max sum for arr[0:i]",
      "Try all partition sizes up to k"
    ],
    complexity: { time: "O(n*k)", space: "O(n)" },
    keyLearning: "Partition with change",
    crossReference: {
      pattern: "dp-subsequences",
      problemTitle: "Partition Array for Maximum Sum",
      note: "🔗 Also in DP Subsequences"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Super Egg Drop",
    difficulty: "Hard",
    pattern_id: "dp-lis-mcm",
    slug: "super-egg-drop",
    order: 9,
    tags: ["math", "binary-search", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/super-egg-drop/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Min trials to find critical floor",
      "dp[k][m] = max floors with k eggs and m moves",
      "Or binary search on answer"
    ],
    complexity: { time: "O(k*n)", space: "O(k*n)" },
    keyLearning: "Min trials",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Printing Longest Increasing Subsequence",
    difficulty: "Medium",
    pattern_id: "dp-lis-mcm",
    slug: "printing-lis",
    order: 10,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/construction-of-longest-monotonically-increasing-subsequence-n-log-n/",
      article: ""
    },
    hints: [
      "Track parent array during LIS",
      "parent[i] = index of previous element",
      "Backtrack from max length index"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    keyLearning: "Backtrack LIS",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedDPLISMCM() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting DP - LIS & MCM pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'dp-lis-mcm' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'dp-lis-mcm' })
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
    console.log(`   • Core Problems: 10 (counted in 300)`)
    console.log(`   • Cross-references: 2 (Palindrome Partitioning II, Partition Array)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedDPLISMCM()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
