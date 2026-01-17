// scripts/problems/seed-binary-search-answer.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 8: Binary Search - Answer Space (12 core problems)
const questionsData = [
  {
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    pattern_id: "binary-search-answer",
    slug: "koko-eating-bananas",
    order: 1,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/koko-eating-bananas/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on eating speed [1, max(piles)]",
      "For each speed, check if can finish in h hours",
      "Minimize the speed"
    ],
    complexity: { time: "O(n log(max))", space: "O(1)" },
    keyLearning: "Minimize eating rate",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Number of Days to Make M Bouquets",
    difficulty: "Medium",
    pattern_id: "binary-search-answer",
    slug: "min-days-bouquets",
    order: 2,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on days [min(bloomDay), max(bloomDay)]",
      "Check if can make m bouquets with k adjacent flowers",
      "Find minimum days"
    ],
    complexity: { time: "O(n log(max))", space: "O(1)" },
    keyLearning: "Feasibility function",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Smallest Divisor Given a Threshold",
    difficulty: "Medium",
    pattern_id: "binary-search-answer",
    slug: "smallest-divisor",
    order: 3,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on divisor [1, max(nums)]",
      "For each divisor, calculate sum of ceil(nums[i]/divisor)",
      "Find smallest where sum <= threshold"
    ],
    complexity: { time: "O(n log(max))", space: "O(1)" },
    keyLearning: "Minimize divisor",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Capacity To Ship Packages Within D Days",
    difficulty: "Medium",
    pattern_id: "binary-search-answer",
    slug: "ship-packages",
    order: 4,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on capacity [max(weights), sum(weights)]",
      "Check if can ship all in D days with given capacity",
      "Minimize capacity"
    ],
    complexity: { time: "O(n log(sum))", space: "O(1)" },
    keyLearning: "Minimize capacity",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Aggressive Cows",
    difficulty: "Hard",
    pattern_id: "binary-search-answer",
    slug: "aggressive-cows",
    order: 5,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/aggressive-cows-problem-binary-search/",
      article: ""
    },
    hints: [
      "Binary search on minimum distance [1, max-min position]",
      "Check if can place C cows with at least dist apart",
      "Maximize minimum distance"
    ],
    complexity: { time: "O(n log n + n log(max-min))", space: "O(1)" },
    keyLearning: "Maximize min distance",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Book Allocation Problem",
    difficulty: "Hard",
    pattern_id: "binary-search-answer",
    slug: "book-allocation",
    order: 6,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/allocate-minimum-number-pages/",
      article: ""
    },
    hints: [
      "Binary search on pages [max(arr), sum(arr)]",
      "Check if can allocate to M students with max pages",
      "Minimize maximum pages per student"
    ],
    complexity: { time: "O(n log(sum))", space: "O(1)" },
    keyLearning: "Minimize max pages",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Split Array Largest Sum",
    difficulty: "Hard",
    pattern_id: "binary-search-answer",
    slug: "split-array-largest-sum",
    order: 7,
    tags: ["array", "binary-search", "dynamic-programming"],
    companies: ["Amazon", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/split-array-largest-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Similar to book allocation",
      "Binary search on largest sum [max(nums), sum(nums)]",
      "Check if can split into m subarrays with max sum"
    ],
    complexity: { time: "O(n log(sum))", space: "O(1)" },
    keyLearning: "Minimize largest sum",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Painter's Partition Problem",
    difficulty: "Hard",
    pattern_id: "binary-search-answer",
    slug: "painters-partition",
    order: 8,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/painters-partition-problem/",
      article: ""
    },
    hints: [
      "Similar to book allocation",
      "Binary search on time [max(boards), sum(boards)]",
      "Minimize maximum time per painter"
    ],
    complexity: { time: "O(n log(sum))", space: "O(1)" },
    keyLearning: "Similar to book allocation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    pattern_id: "binary-search-answer",
    slug: "median-two-sorted",
    order: 9,
    tags: ["array", "binary-search", "divide-and-conquer"],
    companies: ["Amazon", "Google", "Facebook", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on smaller array",
      "Partition both arrays into two halves",
      "Ensure left half <= right half across both arrays"
    ],
    complexity: { time: "O(log(min(m,n)))", space: "O(1)" },
    keyLearning: "Partition technique",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kth Missing Positive Number",
    difficulty: "Medium",
    pattern_id: "binary-search-answer",
    slug: "kth-missing-positive",
    order: 10,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/kth-missing-positive-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Missing count at index i = arr[i] - (i+1)",
      "Binary search to find position where missing >= k",
      "Answer = k + number of elements in left portion"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Missing count",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Nth Root of a Number",
    difficulty: "Medium",
    pattern_id: "binary-search-answer",
    slug: "nth-root",
    order: 11,
    tags: ["math", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/n-th-root-number/",
      article: ""
    },
    hints: [
      "Binary search on answer [1, m]",
      "Check if mid^n == m",
      "Return mid if found, else -1"
    ],
    complexity: { time: "O(log m * log n)", space: "O(1)" },
    keyLearning: "Power check",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximum Candies Allocated to K Children",
    difficulty: "Medium",
    pattern_id: "binary-search-answer",
    slug: "max-candies",
    order: 12,
    tags: ["array", "binary-search"],
    companies: ["Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-candies-allocated-to-k-children/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on candies per child [1, max(candies)]",
      "Check if can distribute to k children with mid candies each",
      "Maximize candies per child"
    ],
    complexity: { time: "O(n log(max))", space: "O(1)" },
    keyLearning: "Maximize per child",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedBinarySearchAnswer() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Binary Search Answer Space pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'binary-search-answer' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'binary-search-answer' })
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
    console.log(`   • Core Problems: 12 (counted in 300)`)
    console.log(`   • Pattern: Binary search on answer range, not array indices`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedBinarySearchAnswer()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
