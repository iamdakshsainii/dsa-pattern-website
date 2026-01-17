// scripts/problems/seed-dp-subsequences.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 24: Dynamic Programming - Subsequences (11 core problems)
const questionsData = [
  {
    title: "Subset Sum Problem",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "subset-sum",
    order: 1,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/subset-sum-problem/1",
      article: ""
    },
    hints: [
      "Check if subset with given sum exists",
      "dp[i][j] = can make sum j using first i elements",
      "dp[i][j] = dp[i-1][j] || dp[i-1][j-arr[i]]"
    ],
    complexity: { time: "O(n*sum)", space: "O(sum)" },
    keyLearning: "Check if sum exists",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "partition-equal-subset-sum",
    order: 2,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/partition-equal-subset-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Can partition into two equal sum subsets",
      "Total sum must be even",
      "Problem reduces to: find subset with sum = total/2"
    ],
    complexity: { time: "O(n*sum)", space: "O(sum)" },
    keyLearning: "Two equal partitions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Subset Sum Difference",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "minimum-subset-sum-difference",
    order: 3,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/minimum-sum-partition/1",
      article: ""
    },
    hints: [
      "Partition into two subsets minimizing |sum1 - sum2|",
      "Find all possible sums using subset sum DP",
      "For each sum ≤ total/2, diff = total - 2*sum"
    ],
    complexity: { time: "O(n*sum)", space: "O(sum)" },
    keyLearning: "Minimize difference",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Count Subsets with Sum K",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "count-subsets-sum-k",
    order: 4,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/perfect-sum-problem/1",
      article: ""
    },
    hints: [
      "Count number of subsets with exact sum K",
      "dp[i][j] = count of subsets with sum j using first i elements",
      "dp[i][j] = dp[i-1][j] + dp[i-1][j-arr[i]]"
    ],
    complexity: { time: "O(n*sum)", space: "O(sum)" },
    keyLearning: "Count exact sum",
    crossReference: {
      pattern: "recursion-subsets",
      problemTitle: "Perfect Sum Problem",
      note: "🔗 Also in Recursion - backtracking approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Target Sum",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "target-sum",
    order: 5,
    tags: ["array", "dynamic-programming", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/target-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Assign + or - to each element to reach target",
      "Converts to: count subsets with sum = (total + target) / 2",
      "sum1 - sum2 = target, sum1 + sum2 = total"
    ],
    complexity: { time: "O(n*sum)", space: "O(sum)" },
    keyLearning: "Assign +/- to reach target",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "0/1 Knapsack Problem",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "01-knapsack",
    order: 6,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem/1",
      article: ""
    },
    hints: [
      "Maximize value with weight constraint",
      "dp[i][w] = max value with first i items and weight limit w",
      "dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]])"
    ],
    complexity: { time: "O(n*W)", space: "O(W)" },
    keyLearning: "Classic knapsack",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Unbounded Knapsack",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "unbounded-knapsack",
    order: 7,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/knapsack-with-duplicate-items/1",
      article: ""
    },
    hints: [
      "Can use each item unlimited times",
      "dp[w] = max value with weight limit w",
      "For each item: dp[w] = max(dp[w], value[i] + dp[w-weight[i]])"
    ],
    complexity: { time: "O(n*W)", space: "O(W)" },
    keyLearning: "Unlimited items",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Rod Cutting Problem",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "rod-cutting",
    order: 8,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/rod-cutting/1",
      article: ""
    },
    hints: [
      "Cut rod to maximize profit",
      "Unbounded knapsack variant",
      "dp[i] = max profit with rod of length i"
    ],
    complexity: { time: "O(n²)", space: "O(n)" },
    keyLearning: "Max profit cutting",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Partition Array for Maximum Sum",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "partition-array-max-sum",
    order: 9,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/partition-array-for-maximum-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Partition into subarrays of length ≤ k",
      "Change all elements in subarray to max",
      "dp[i] = max sum for arr[0...i]"
    ],
    complexity: { time: "O(n*k)", space: "O(n)" },
    keyLearning: "Partition with value change",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Ones and Zeroes",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "ones-and-zeroes",
    order: 10,
    tags: ["array", "string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/ones-and-zeroes/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "0/1 Knapsack with two constraints (0s and 1s)",
      "dp[i][j] = max strings with i zeros and j ones",
      "Count 0s and 1s in each string"
    ],
    complexity: { time: "O(l*m*n)", space: "O(m*n)" },
    keyLearning: "2D knapsack constraint",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Perfect Sum Problem (Count)",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "perfect-sum-count",
    order: 11,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/perfect-sum-problem/1",
      article: ""
    },
    hints: [
      "Count subsets with exact sum",
      "Same as Count Subsets with Sum K (#4)",
      "Handle zeros carefully"
    ],
    complexity: { time: "O(n*sum)", space: "O(sum)" },
    keyLearning: "Count subsets exact sum",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Count Partitions with Given Difference",
    difficulty: "Medium",
    pattern_id: "dp-subsequences",
    slug: "count-partitions-difference",
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
      "Partition into two subsets with difference D",
      "sum1 - sum2 = D, sum1 + sum2 = total",
      "Reduces to count subsets with sum = (total + D) / 2"
    ],
    complexity: { time: "O(n*sum)", space: "O(sum)" },
    note: "⭐ Similar: Partition variant",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedDPSubsequences() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting DP - Subsequences pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'dp-subsequences' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'dp-subsequences' })
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
    console.log(`   • Cross-references: 1 (Perfect Sum → Recursion Subsets)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedDPSubsequences()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  