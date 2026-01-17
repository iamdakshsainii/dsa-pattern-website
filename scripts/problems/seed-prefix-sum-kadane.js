// scripts/problems/seed-prefix-sum-kadane.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 11: Prefix Sum & Kadane's Algorithm (11 core problems)
const questionsData = [
  {
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Easy",
    pattern_id: "prefix-sum",
    slug: "maximum-subarray",
    order: 1,
    tags: ["array", "divide-and-conquer", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-subarray/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track current sum, reset when negative",
      "Keep track of maximum sum seen so far",
      "currentSum = Math.max(num, currentSum + num)"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Classic max sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    pattern_id: "prefix-sum",
    slug: "maximum-product-subarray",
    order: 2,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-product-subarray/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track both max and min (negative * negative = positive)",
      "Update max and min at each step",
      "Handle zeros by resetting"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Track min and max",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximum Sum Circular Subarray",
    difficulty: "Hard",
    pattern_id: "prefix-sum",
    slug: "max-sum-circular-subarray",
    order: 3,
    tags: ["array", "divide-and-conquer", "dynamic-programming"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-sum-circular-subarray/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Case 1: Max subarray doesn't wrap (normal Kadane)",
      "Case 2: Max subarray wraps = total - min subarray",
      "Answer = max(case1, case2)"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Total - min subarray",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    pattern_id: "prefix-sum",
    slug: "subarray-sum-equals-k",
    order: 4,
    tags: ["array", "hash-table", "prefix-sum"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/subarray-sum-equals-k/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use prefix sum + HashMap",
      "If prefixSum - k exists in map, found subarray",
      "Store frequency of each prefix sum"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Prefix + HashMap",
    crossReference: {
      pattern: "sliding-window",
      problemTitle: "Subarray Sum Equals K",
      note: "🔗 Also in Sliding Window - can use window for positive numbers only"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Subarray Sums Divisible by K",
    difficulty: "Medium",
    pattern_id: "prefix-sum",
    slug: "subarray-sums-divisible-k",
    order: 5,
    tags: ["array", "hash-table", "prefix-sum"],
    companies: ["Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/subarray-sums-divisible-by-k/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use modulo arithmetic",
      "If (prefixSum % k) seen before, found subarray",
      "Handle negative remainders: ((sum % k) + k) % k"
    ],
    complexity: { time: "O(n)", space: "O(k)" },
    keyLearning: "Modulo arithmetic",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Continuous Subarray Sum",
    difficulty: "Medium",
    pattern_id: "prefix-sum",
    slug: "continuous-subarray-sum",
    order: 6,
    tags: ["array", "hash-table", "math", "prefix-sum"],
    companies: ["Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/continuous-subarray-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Similar to divisible by K, but need length >= 2",
      "Store index of each remainder",
      "If same remainder seen before and gap >= 2, return true"
    ],
    complexity: { time: "O(n)", space: "O(k)" },
    keyLearning: "Multiple of K",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Contiguous Array",
    difficulty: "Medium",
    pattern_id: "prefix-sum",
    slug: "contiguous-array",
    order: 7,
    tags: ["array", "hash-table", "prefix-sum"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/contiguous-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Treat 0 as -1, find subarray sum = 0",
      "Use prefix sum + HashMap",
      "Store first index of each prefix sum"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Treat 0 as -1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find Pivot Index",
    difficulty: "Easy",
    pattern_id: "prefix-sum",
    slug: "find-pivot-index",
    order: 8,
    tags: ["array", "prefix-sum"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/find-pivot-index/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Left sum = right sum at pivot",
      "leftSum = prefix sum, rightSum = total - leftSum - nums[i]",
      "Find first index where leftSum == rightSum"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Left sum = right sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    pattern_id: "prefix-sum",
    slug: "product-except-self",
    order: 9,
    tags: ["array", "prefix-sum"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/product-of-array-except-self/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Result[i] = prefix product * suffix product",
      "First pass: calculate prefix products",
      "Second pass: calculate suffix products and multiply"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Prefix * suffix",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Range Sum Query - Immutable",
    difficulty: "Easy",
    pattern_id: "prefix-sum",
    slug: "range-sum-query",
    order: 10,
    tags: ["array", "design", "prefix-sum"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/range-sum-query-immutable/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Precompute prefix sums in constructor",
      "Query in O(1): sum[left, right] = prefix[right+1] - prefix[left]",
      "prefix[0] = 0 for easier calculation"
    ],
    complexity: { time: "O(1) query, O(n) init", space: "O(n)" },
    keyLearning: "Basic prefix sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Range Sum Query 2D - Immutable",
    difficulty: "Medium",
    pattern_id: "prefix-sum",
    slug: "range-sum-query-2d",
    order: 11,
    tags: ["array", "design", "matrix", "prefix-sum"],
    companies: ["Amazon", "Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/range-sum-query-2d-immutable/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "2D prefix sum: prefix[i][j] = sum of rectangle from (0,0) to (i-1,j-1)",
      "prefix[i][j] = matrix[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]",
      "Query: use inclusion-exclusion principle"
    ],
    complexity: { time: "O(1) query, O(m*n) init", space: "O(m*n)" },
    keyLearning: "2D prefix sum",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems (not counted in 300)
const additionalProblems = [
  {
    title: "Largest Subarray with 0 Sum",
    difficulty: "Medium",
    pattern_id: "prefix-sum",
    slug: "largest-subarray-zero-sum",
    isAdditional: true,
    tags: ["array", "hash-table", "prefix-sum"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-the-largest-subarray-with-0-sum/",
      article: ""
    },
    hints: [
      "Similar to Contiguous Array",
      "Use prefix sum + HashMap",
      "If prefixSum seen before, found subarray with sum 0"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    note: "⭐ Similar: Prefix HashMap technique",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedPrefixSumKadane() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Prefix Sum & Kadane pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'prefix-sum' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'prefix-sum' })
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
    console.log(`   • Cross-references: 1 (Subarray Sum → also in Sliding Window)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedPrefixSumKadane()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
