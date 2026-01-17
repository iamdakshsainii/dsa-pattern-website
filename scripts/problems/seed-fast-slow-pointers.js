// scripts/seed-fast-slow-pointers.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI not found in .env.local')
}

// Pattern 3: Fast & Slow Pointers (10 core problems)
const questionsData = [
  {
    title: "Linked List Cycle",
    difficulty: "Easy",
    pattern_id: "fast-slow-pointers",
    slug: "linked-list-cycle",
    order: 1,
    tags: ["linked-list", "two-pointers"],
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/linked-list-cycle/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use two pointers - fast moves 2 steps, slow moves 1 step",
      "If there's a cycle, fast will eventually meet slow",
      "If fast reaches null, there's no cycle"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Floyd's cycle detection",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Linked List Cycle II",
    difficulty: "Medium",
    pattern_id: "fast-slow-pointers",
    slug: "linked-list-cycle-ii",
    order: 2,
    tags: ["linked-list", "two-pointers"],
    companies: ["Amazon", "Microsoft", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/linked-list-cycle-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "First detect cycle using fast-slow",
      "Reset one pointer to head after meeting",
      "Move both one step at a time - they meet at cycle start"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Find cycle start point",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Middle of the Linked List",
    difficulty: "Easy",
    pattern_id: "fast-slow-pointers",
    slug: "middle-of-linked-list",
    order: 3,
    tags: ["linked-list", "two-pointers"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/middle-of-the-linked-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Fast pointer moves 2x speed of slow",
      "When fast reaches end, slow is at middle",
      "For even length, returns second middle"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Fast 2x, Slow 1x",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Happy Number",
    difficulty: "Easy",
    pattern_id: "fast-slow-pointers",
    slug: "happy-number",
    order: 4,
    tags: ["hash-table", "math", "two-pointers"],
    companies: ["Google", "Airbnb"],
    links: {
      leetcode: "https://leetcode.com/problems/happy-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Treat as cycle detection in sequence",
      "Fast computes sum twice, slow once",
      "If they meet at 1, it's happy; otherwise cycle detected"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Cycle in number sequence",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find the Duplicate Number",
    difficulty: "Medium",
    pattern_id: "fast-slow-pointers",
    slug: "find-duplicate-number",
    order: 5,
    tags: ["array", "two-pointers", "binary-search"],
    companies: ["Microsoft", "Amazon", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/find-the-duplicate-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Treat array as implicit linked list where nums[i] points to nums[nums[i]]",
      "Duplicate creates a cycle",
      "Use Floyd's algorithm to find cycle start"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Array as implicit linked list",
    crossReference: {
      pattern: "cyclic-sort",
      problemTitle: "Find the Duplicate Number",
      note: "Also solvable using cyclic sort approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Palindrome Linked List",
    difficulty: "Easy",
    pattern_id: "fast-slow-pointers",
    slug: "palindrome-linked-list",
    order: 6,
    tags: ["linked-list", "two-pointers", "stack"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/palindrome-linked-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find middle using fast-slow",
      "Reverse second half",
      "Compare first half with reversed second half"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Middle + reverse + compare",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Reorder List",
    difficulty: "Medium",
    pattern_id: "fast-slow-pointers",
    slug: "reorder-list",
    order: 7,
    tags: ["linked-list", "two-pointers"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/reorder-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find middle using fast-slow",
      "Reverse second half",
      "Merge two halves alternately (L0→Ln→L1→Ln-1→...)"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Middle + reverse + merge",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    pattern_id: "fast-slow-pointers",
    slug: "remove-nth-node-from-end",
    order: 8,
    tags: ["linked-list", "two-pointers"],
    companies: ["Amazon", "Facebook", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use two pointers with N+1 gap",
      "Move fast N steps ahead first",
      "Then move both until fast reaches end"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Fixed gap between pointers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Circular Array Loop",
    difficulty: "Hard",
    pattern_id: "fast-slow-pointers",
    slug: "circular-array-loop",
    order: 9,
    tags: ["array", "two-pointers"],
    companies: ["Google", "Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/circular-array-loop/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Check for cycle with consistent direction (all forward or all backward)",
      "Use fast-slow with direction validation",
      "Mark visited elements to avoid rechecking"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Cycle with consistent direction",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Intersection of Two Linked Lists",
    difficulty: "Easy",
    pattern_id: "fast-slow-pointers",
    slug: "intersection-of-two-linked-lists",
    order: 10,
    tags: ["linked-list", "two-pointers", "hash-table"],
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Handle different list lengths",
      "When pointer reaches end, redirect to other list's head",
      "They'll meet at intersection or both reach null"
    ],
    complexity: { time: "O(m+n)", space: "O(1)" },
    keyLearning: "Handle length difference",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems to show (not counted in 300)
const additionalProblems = [
  {
    title: "Delete Middle Node of Linked List",
    difficulty: "Medium",
    pattern_id: "fast-slow-pointers",
    slug: "delete-middle-node-linked-list",
    isAdditional: true,
    tags: ["linked-list", "two-pointers"],
    companies: ["Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find middle using fast-slow",
      "Keep track of node before middle",
      "Skip the middle node"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    note: "⭐ Similar: Practice variant of finding middle",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sort List",
    difficulty: "Medium",
    pattern_id: "fast-slow-pointers",
    slug: "sort-list",
    isAdditional: true,
    tags: ["linked-list", "sorting", "merge-sort"],
    companies: ["Amazon", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/sort-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use merge sort approach",
      "Find middle using fast-slow to split",
      "Recursively sort both halves"
    ],
    complexity: { time: "O(n log n)", space: "O(log n)" },
    note: "⭐ Similar: Combines fast-slow with merge sort",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedFastSlowPointers() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Fast & Slow Pointers pattern seeding...\n')

    // Check for existing questions
    const existing = await questionsCollection.countDocuments({
      pattern_id: 'fast-slow-pointers'
    })

    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'fast-slow-pointers' })
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
    console.log(`   • Core Problems: 10 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length} (practice variants)`)
    console.log(`   • Cross-references: 1 (Find Duplicate → also in Cyclic Sort)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedFastSlowPointers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
