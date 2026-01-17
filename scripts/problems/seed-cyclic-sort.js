// scripts/seed-cyclic-sort.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI not found in .env.local')
}

// Pattern 5: Cyclic Sort (9 core problems)
const questionsData = [
  {
    title: "Cyclic Sort Implementation",
    difficulty: "Easy",
    pattern_id: "cyclic-sort",
    slug: "cyclic-sort-implementation",
    order: 1,
    tags: ["array", "sorting"],
    companies: [],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/sort-an-array-which-contain-1-to-n-values-in-on-using-cycle-sort/",
      article: ""
    },
    hints: [
      "Place each number at index = number - 1",
      "Swap until current position has correct element",
      "Works only when array contains [1, n] range"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Place at index-1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Missing Number",
    difficulty: "Easy",
    pattern_id: "cyclic-sort",
    slug: "missing-number",
    order: 2,
    tags: ["array", "math", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/missing-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Array has n numbers from [0, n] with one missing",
      "Place each number at its index",
      "The index without correct number is missing"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "[0, n] with one missing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find All Numbers Disappeared in an Array",
    difficulty: "Easy",
    pattern_id: "cyclic-sort",
    slug: "find-all-numbers-disappeared",
    order: 3,
    tags: ["array", "hash-table"],
    companies: ["Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Numbers in range [1, n], some missing",
      "Use cyclic sort to place numbers",
      "Indices without correct numbers are missing"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Multiple missing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find All Duplicates in an Array",
    difficulty: "Medium",
    pattern_id: "cyclic-sort",
    slug: "find-all-duplicates",
    order: 4,
    tags: ["array", "hash-table"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Numbers in [1, n], each appears once or twice",
      "During cyclic sort, if number already at correct position, it's duplicate",
      "Mark negatives or use separate check after sorting"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Multiple duplicates",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find the Corrupt Pair (Set Mismatch)",
    difficulty: "Easy",
    pattern_id: "cyclic-sort",
    slug: "set-mismatch",
    order: 5,
    tags: ["array", "hash-table", "math"],
    companies: ["Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/set-mismatch/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "One number appears twice, one is missing",
      "Use cyclic sort",
      "Duplicate is at wrong position, missing is the correct value"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "One missing + one duplicate",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "First Missing Positive",
    difficulty: "Hard",
    pattern_id: "cyclic-sort",
    slug: "first-missing-positive",
    order: 6,
    tags: ["array", "hash-table"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/first-missing-positive/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find smallest missing positive integer",
      "Ignore negative and out-of-range numbers",
      "Place positive numbers in range [1, n] at correct indices",
      "First index without correct number + 1 is answer"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Smallest missing positive",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find First K Missing Positive Numbers",
    difficulty: "Hard",
    pattern_id: "cyclic-sort",
    slug: "first-k-missing-positive",
    order: 7,
    tags: ["array", "hash-table"],
    companies: [],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-first-k-natural-numbers-missing-given-array/",
      article: ""
    },
    hints: [
      "Extension of First Missing Positive",
      "After cyclic sort, collect K missing numbers",
      "Check indices [0 to n-1] then continue from n+1"
    ],
    complexity: { time: "O(n + k)", space: "O(k)" },
    keyLearning: "First K missing numbers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kth Missing Positive Number",
    difficulty: "Easy",
    pattern_id: "cyclic-sort",
    slug: "kth-missing-positive-number",
    order: 8,
    tags: ["array", "binary-search"],
    companies: ["Facebook", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/kth-missing-positive-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Array is sorted, find Kth missing positive",
      "Can use binary search for O(log n)",
      "Or linear scan: missing count at index i = arr[i] - (i+1)"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Binary search variant",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find the Duplicate Number",
    difficulty: "Medium",
    pattern_id: "cyclic-sort",
    slug: "find-duplicate-number-cyclic",
    order: 9,
    tags: ["array", "two-pointers", "binary-search"],
    companies: ["Microsoft", "Amazon", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/find-the-duplicate-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "n+1 numbers in range [1, n], one duplicate",
      "Can't modify array - use as implicit linked list",
      "Or use cyclic sort if modification allowed"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Find single duplicate",
    crossReference: {
      pattern: "fast-slow-pointers",
      problemTitle: "Find the Duplicate Number",
      note: "🔗 Also in Fast & Slow Pointers - Floyd's algorithm approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems to show (not counted in 300)
const additionalProblems = [
  {
    title: "Find the Missing Number in Arithmetic Progression",
    difficulty: "Easy",
    pattern_id: "cyclic-sort",
    slug: "missing-number-in-ap",
    isAdditional: true,
    tags: ["array", "math"],
    companies: [],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-missing-number-arithmetic-progression/",
      article: ""
    },
    hints: [
      "Arithmetic progression with one missing element",
      "Find common difference first",
      "Binary search or linear scan to find missing"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    note: "⭐ Similar: Special case with AP property",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find Missing and Repeating",
    difficulty: "Medium",
    pattern_id: "cyclic-sort",
    slug: "find-missing-and-repeating",
    isAdditional: true,
    tags: ["array", "math"],
    companies: ["Amazon"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-a-repeating-and-a-missing-number/",
      article: ""
    },
    hints: [
      "Same as Set Mismatch",
      "Find both repeating and missing number",
      "Multiple approaches: cyclic sort, math, XOR"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    note: "⭐ Similar: Alternative name for Set Mismatch pattern",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find Two Missing Numbers",
    difficulty: "Medium",
    pattern_id: "cyclic-sort",
    slug: "find-two-missing-numbers",
    isAdditional: true,
    tags: ["array", "math", "bit-manipulation"],
    companies: [],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-two-missing-numbers-set-1-an-interesting-linear-time-solution/",
      article: ""
    },
    hints: [
      "Array of n-2 elements from [1, n]",
      "Two numbers missing",
      "Use XOR or math formulas"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    note: "⭐ Similar: Extension with two missing elements",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedCyclicSort() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Cyclic Sort pattern seeding...\n')

    // Check for existing questions
    const existing = await questionsCollection.countDocuments({
      pattern_id: 'cyclic-sort'
    })

    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'cyclic-sort' })
      console.log('✅ Cleaned up\n')
    }

    // Insert core questions
    console.log('📥 Inserting core questions...\n')
    const coreResult = await questionsCollection.insertMany(questionsData)
    console.log(`✅ Inserted ${coreResult.insertedCount} core questions\n`)

    // Insert additional problems
    console.log('📥 Inserting additional practice problems...\n')
    const additionalResult = await questionsCollection.insertMany(additionalProblems)
    console.log(`✅ Inserted ${additionalResult.insertedCount} additional problems\n`)

    // Display summary
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
    console.log(`   • Core Problems: 9 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length} (practice variants)`)
    console.log(`   • Cross-references: 1 (Find Duplicate → also in Fast & Slow Pointers)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedCyclicSort()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
