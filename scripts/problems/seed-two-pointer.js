// scripts/problems/seed-two-pointers.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 1: Two Pointers (16 core problems)
const questionsData = [
  {
    questionId: "two-sum-ii-sorted",
    title: "Two Sum II - Input Array Is Sorted",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "two-sum-ii-sorted",
    order: 1,
    tags: ["array", "two-pointers", "binary-search"],
    companies: ["Amazon", "Facebook", "Microsoft", "Apple", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Array is sorted - use that property",
      "Two pointers from both ends",
      "If sum too small, move left pointer right",
      "Return indices are 1-indexed"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Classic opposite-direction pointers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "remove-duplicates-sorted",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "remove-duplicates-sorted",
    order: 2,
    tags: ["array", "two-pointers"],
    companies: ["Facebook", "Microsoft", "Amazon", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sorted array means duplicates are adjacent",
      "Slow pointer for unique position",
      "Fast pointer scans array",
      "First element always unique"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Same-direction slow-fast pointer",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "move-zeroes",
    order: 3,
    tags: ["array", "two-pointers"],
    companies: ["Facebook", "Amazon", "Microsoft", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/move-zeroes/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Partition array technique",
      "Slow pointer for non-zero position",
      "Swap when non-zero found",
      "Single pass sufficient"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Two-pointer partition technique",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "squares-sorted-array",
    title: "Squares of Sorted Array",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "squares-sorted-array",
    order: 4,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Facebook", "Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/squares-of-a-sorted-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Largest squares at ends due to negatives",
      "Compare from both ends",
      "Fill result from right to left",
      "Merge from both ends"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Merge from both ends",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "valid-palindrome",
    order: 5,
    tags: ["two-pointers", "string"],
    companies: ["Facebook", "Microsoft", "Amazon", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/valid-palindrome/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Only consider alphanumeric",
      "Case-insensitive comparison",
      "Two pointers from both ends",
      "Skip non-alphanumeric"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Left-right comparison",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "remove-element",
    title: "Remove Element",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "remove-element",
    order: 6,
    tags: ["array", "two-pointers"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-element/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track position for valid elements",
      "Overwrite as you find valid elements",
      "Return count of valid elements",
      "Maintain relative order"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "In-place removal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "sort-colors",
    title: "Sort Colors (Dutch National Flag)",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "sort-colors",
    order: 7,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Microsoft", "Amazon", "Facebook", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/sort-colors/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Three sections: 0s, 1s, 2s",
      "Three pointers divide array",
      "Don't increment mid after swapping with high",
      "One pass is sufficient"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Three-way partitioning",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "container-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "container-most-water",
    order: 8,
    tags: ["array", "two-pointers", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/container-with-most-water/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Start with maximum width",
      "Area limited by shorter line",
      "Move shorter line inward",
      "Greedy pointer movement"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Greedy pointer movement",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "3sum",
    order: 9,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Amazon", "Facebook", "Microsoft", "Apple", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/3sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort array first",
      "Fix one element, two pointers for rest",
      "Skip duplicates at all positions",
      "Early termination when first > 0"
    ],
    complexity: { time: "O(n²)", space: "O(1)" },
    keyLearning: "Fix one + two pointers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "3sum-closest",
    title: "3Sum Closest",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "3sum-closest",
    order: 10,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Bloomberg", "Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/3sum-closest/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Same structure as 3Sum",
      "Track minimum distance from target",
      "Return early if exact match",
      "Use absolute difference"
    ],
    complexity: { time: "O(n²)", space: "O(1)" },
    keyLearning: "Minimize distance",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "4sum",
    title: "4Sum",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "4sum",
    order: 11,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Amazon", "Facebook", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/4sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Extend 3Sum with extra loop",
      "Handle overflow carefully",
      "Skip duplicates at all levels",
      "Can generalize to KSum"
    ],
    complexity: { time: "O(n³)", space: "O(1)" },
    keyLearning: "Nested two pointers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    pattern_id: "two-pointers",
    slug: "trapping-rain-water",
    order: 12,
    tags: ["array", "two-pointers", "stack", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/trapping-rain-water/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Water depends on min of max heights",
      "Process side with smaller max",
      "Running max sufficient",
      "Max height tracking both sides"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Max height tracking both sides",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "boats-save-people",
    title: "Boats to Save People",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "boats-save-people",
    order: 13,
    tags: ["array", "two-pointers", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/boats-to-save-people/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "At most 2 people per boat",
      "Pair lightest with heaviest",
      "Sort to enable greedy",
      "Greedy pairing"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Greedy pairing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "partition-labels",
    title: "Partition Labels",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "partition-labels",
    order: 14,
    tags: ["hash-table", "two-pointers", "string", "greedy"],
    companies: ["Amazon", "Google", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/partition-labels/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Know where each character last appears",
      "Track maximum last occurrence",
      "Cut when reaching partition end",
      "Last occurrence tracking"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Last occurrence tracking",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "backspace-string-compare",
    title: "Backspace String Compare",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "backspace-string-compare",
    order: 15,
    tags: ["two-pointers", "string", "stack"],
    companies: ["Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/backspace-string-compare/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Process from right to left",
      "Count backspaces to skip characters",
      "Compare next valid characters",
      "Process from end"
    ],
    complexity: { time: "O(n + m)", space: "O(1)" },
    keyLearning: "Process from end",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    questionId: "valid-palindrome-ii",
    title: "Valid Palindrome II",
    difficulty: "Easy",
    pattern_id: "two-pointers",
    slug: "valid-palindrome-ii",
    order: 16,
    tags: ["two-pointers", "string", "greedy"],
    companies: ["Facebook", "Microsoft", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/valid-palindrome-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "At most one deletion allowed",
      "Handle first mismatch",
      "Try skipping left or right",
      "One deletion allowed"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "One deletion allowed",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional practice problems (not counted in 300)
const additionalProblems = [
  {
    title: "Triplet Sum Smaller Than Target",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "triplet-sum-smaller",
    isAdditional: true,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/3sum-smaller/",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/count-triplets-with-sum-smaller-that-a-given-value/",
      article: ""
    },
    note: "⭐ Counting variant of 3Sum",
    complexity: { time: "O(n²)", space: "O(1)" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Window Sort",
    difficulty: "Medium",
    pattern_id: "two-pointers",
    slug: "minimum-window-sort",
    isAdditional: true,
    tags: ["array", "two-pointers", "sorting"],
    companies: ["Google", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/minimum-length-unsorted-subarray-sorting-which-makes-the-complete-array-sorted/",
      article: ""
    },
    note: "⭐ Find unsorted portion that needs sorting",
    complexity: { time: "O(n)", space: "O(1)" },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedTwoPointers() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Two Pointers pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'two-pointers' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'two-pointers' })
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
    console.log(`   • Core Problems: 16 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
    console.log(`   • Pattern: Two Pointers`)
    console.log(`   • Core Concept: Use two pointers for O(n) traversal`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedTwoPointers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
