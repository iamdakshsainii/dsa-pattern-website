// scripts/problems/seed-binary-search-1d.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 7: Binary Search - 1D Arrays (15 core problems)
const questionsData = [
  {
    title: "Binary Search",
    difficulty: "Easy",
    pattern_id: "binary-search-1d",
    slug: "binary-search",
    order: 1,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/binary-search/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Classic divide and conquer",
      "mid = left + (right - left) // 2",
      "Compare target with mid, adjust bounds"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Classic implementation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Lower Bound (First >= target)",
    difficulty: "Easy",
    pattern_id: "binary-search-1d",
    slug: "lower-bound",
    order: 2,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/lower_bound-in-cpp/",
      article: ""
    },
    hints: [
      "Find first element >= target",
      "When arr[mid] >= target, go left (could be answer)",
      "When arr[mid] < target, go right"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Find first >= target",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Upper Bound (First > target)",
    difficulty: "Easy",
    pattern_id: "binary-search-1d",
    slug: "upper-bound",
    order: 3,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/upper_bound-in-cpp/",
      article: ""
    },
    hints: [
      "Find first element > target",
      "When arr[mid] > target, go left",
      "When arr[mid] <= target, go right"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Find first > target",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Search Insert Position",
    difficulty: "Easy",
    pattern_id: "binary-search-1d",
    slug: "search-insert-position",
    order: 4,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/search-insert-position/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "If target found, return index",
      "If not found, return where it should be inserted",
      "Same as lower bound"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Insert index in sorted",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find First and Last Position of Element",
    difficulty: "Medium",
    pattern_id: "binary-search-1d",
    slug: "first-last-position",
    order: 5,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use lower bound to find first occurrence",
      "Use upper bound - 1 to find last occurrence",
      "Two binary searches"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Find range boundaries",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    pattern_id: "binary-search-1d",
    slug: "search-rotated-sorted",
    order: 6,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "One half is always sorted",
      "Check which half is sorted",
      "Check if target lies in sorted half"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Identify sorted half",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    pattern_id: "binary-search-1d",
    slug: "find-min-rotated",
    order: 7,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Minimum is at rotation pivot",
      "Compare mid with right",
      "If arr[mid] > arr[right], min is in right half"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Find rotation pivot",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Single Element in Sorted Array",
    difficulty: "Medium",
    pattern_id: "binary-search-1d",
    slug: "single-element-sorted",
    order: 8,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/single-element-in-a-sorted-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "All elements appear twice except one",
      "Use even-odd index properties",
      "Before single: pairs start at even index",
      "After single: pairs start at odd index"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Even-odd index properties",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find Peak Element",
    difficulty: "Medium",
    pattern_id: "binary-search-1d",
    slug: "find-peak-element",
    order: 9,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/find-peak-element/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Peak is greater than neighbors",
      "If arr[mid] < arr[mid+1], peak is on right",
      "Otherwise peak is on left or mid itself"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Greater than neighbors",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Peak Index in a Mountain Array",
    difficulty: "Easy",
    pattern_id: "binary-search-1d",
    slug: "peak-mountain-array",
    order: 10,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/peak-index-in-a-mountain-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Mountain: increases then decreases",
      "If arr[mid] < arr[mid+1], we're ascending",
      "Otherwise we're descending or at peak"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Single peak",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sqrt(x) using Binary Search",
    difficulty: "Medium",
    pattern_id: "binary-search-1d",
    slug: "sqrt-x",
    order: 11,
    tags: ["math", "binary-search"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/sqrtx/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Binary search on answer [1, x]",
      "Check if mid * mid == x",
      "Return largest mid where mid * mid <= x"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Integer square root",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Count Occurrences in Sorted Array",
    difficulty: "Easy",
    pattern_id: "binary-search-1d",
    slug: "count-occurrences",
    order: 12,
    tags: ["array", "binary-search"],
    companies: ["Amazon"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/count-number-of-occurrences-or-frequency-in-a-sorted-array/",
      article: ""
    },
    hints: [
      "Find first occurrence using lower bound",
      "Find last occurrence using upper bound - 1",
      "Count = last - first + 1"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Last - first + 1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Floor and Ceiling in Sorted Array",
    difficulty: "Easy",
    pattern_id: "binary-search-1d",
    slug: "floor-ceiling",
    order: 13,
    tags: ["array", "binary-search"],
    companies: ["Amazon"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/ceiling-in-a-sorted-array/",
      article: ""
    },
    hints: [
      "Floor: largest element <= target",
      "Ceiling: smallest element >= target",
      "Ceiling is same as lower bound"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Largest <= and smallest >=",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Search in Infinite Sorted Array",
    difficulty: "Medium",
    pattern_id: "binary-search-1d",
    slug: "search-infinite-array",
    order: 14,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-position-element-sorted-array-infinite-numbers/",
      article: ""
    },
    hints: [
      "Can't find array length",
      "Start with range [0, 1], double until target in range",
      "Then apply binary search"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Exponential search + BS",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Count Number of Rotations",
    difficulty: "Easy",
    pattern_id: "binary-search-1d",
    slug: "count-rotations",
    order: 15,
    tags: ["array", "binary-search"],
    companies: ["Amazon"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-rotation-count-rotated-sorted-array/",
      article: ""
    },
    hints: [
      "Number of rotations = index of minimum element",
      "Find minimum using binary search",
      "Compare mid with right boundary"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Min element index",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems (not counted in 300)
const additionalProblems = [
  {
    title: "Search in Rotated Sorted Array II",
    difficulty: "Medium",
    pattern_id: "binary-search-1d",
    slug: "search-rotated-ii",
    isAdditional: true,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Same as search rotated, but with duplicates",
      "When arr[left] == arr[mid] == arr[right], can't determine which half",
      "Increment left, decrement right to skip duplicates"
    ],
    complexity: { time: "O(log n) avg, O(n) worst", space: "O(1)" },
    note: "⭐ Similar: Handles duplicates, worst case O(n)",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find Minimum in Rotated Sorted Array II",
    difficulty: "Hard",
    pattern_id: "binary-search-1d",
    slug: "find-min-rotated-ii",
    isAdditional: true,
    tags: ["array", "binary-search"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Same as find min, but with duplicates",
      "When arr[mid] == arr[right], can't determine",
      "Decrement right to skip duplicate"
    ],
    complexity: { time: "O(log n) avg, O(n) worst", space: "O(1)" },
    note: "⭐ Similar: Handles duplicates",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedBinarySearch1D() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Binary Search 1D pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'binary-search' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'binary-search' })
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
    console.log(`   • Additional Problems: ${additionalProblems.length} (handle duplicates)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedBinarySearch1D()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
