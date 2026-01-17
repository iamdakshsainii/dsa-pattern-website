// scripts/problems/seed-heaps.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 17: Heaps & Priority Queue (16 core problems)
const questionsData = [
  {
    title: "Kth Largest Element in Array",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "kth-largest-element",
    order: 1,
    tags: ["array", "divide-and-conquer", "sorting", "heap", "quickselect"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use min heap of size K",
      "Maintain K largest elements in heap",
      "Root is Kth largest"
    ],
    complexity: { time: "O(n log k)", space: "O(k)" },
    keyLearning: "Min heap of size K",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kth Smallest Element in Array",
    difficulty: "Easy",
    pattern_id: "heaps",
    slug: "kth-smallest-element",
    order: 2,
    tags: ["array", "heap", "quickselect"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/kth-smallest-element/1",
      article: ""
    },
    hints: [
      "Use max heap of size K",
      "Maintain K smallest elements",
      "Root is Kth smallest"
    ],
    complexity: { time: "O(n log k)", space: "O(k)" },
    keyLearning: "Max heap of size K",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "top-k-frequent-elements-heap",
    order: 3,
    tags: ["array", "hash-table", "divide-and-conquer", "sorting", "heap", "bucket-sort"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/top-k-frequent-elements/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count frequency using HashMap",
      "Use min heap of size K based on frequency",
      "Or use bucket sort with frequency as index"
    ],
    complexity: { time: "O(n log k)", space: "O(n)" },
    keyLearning: "Frequency + heap",
    crossReference: {
      pattern: "hash-maps",
      problemTitle: "Top K Frequent Elements",
      note: "🔗 Also in Hash Maps - hash map variant"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    pattern_id: "heaps",
    slug: "find-median-data-stream",
    order: 4,
    tags: ["two-pointers", "design", "sorting", "heap"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/find-median-from-data-stream/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use two heaps: max heap for smaller half, min heap for larger half",
      "Balance heaps so sizes differ by at most 1",
      "Median is from heap tops"
    ],
    complexity: { time: "O(log n) per add", space: "O(n)" },
    keyLearning: "Two heaps technique",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sliding Window Median",
    difficulty: "Hard",
    pattern_id: "heaps",
    slug: "sliding-window-median",
    order: 5,
    tags: ["array", "hash-table", "sliding-window", "heap"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/sliding-window-median/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Two heaps technique from Find Median",
      "Add new element, remove outgoing element",
      "Rebalance heaps after each operation"
    ],
    complexity: { time: "O(n log k)", space: "O(k)" },
    keyLearning: "Two heaps + window",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    pattern_id: "heaps",
    slug: "merge-k-sorted-lists",
    order: 6,
    tags: ["linked-list", "divide-and-conquer", "heap", "merge-sort"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Min heap with one node from each list",
      "Pop minimum, add its next node to heap",
      "Continue until heap is empty"
    ],
    complexity: { time: "O(n log k)", space: "O(k)" },
    keyLearning: "Min heap k-way merge",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "k-closest-points",
    order: 7,
    tags: ["array", "math", "divide-and-conquer", "geometry", "sorting", "heap", "quickselect"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/k-closest-points-to-origin/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Calculate distance: x² + y² (no need for sqrt)",
      "Use max heap of size K",
      "Maintain K closest points"
    ],
    complexity: { time: "O(n log k)", space: "O(k)" },
    keyLearning: "Distance metric heap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sort Characters By Frequency",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "sort-characters-frequency",
    order: 8,
    tags: ["hash-table", "string", "sorting", "heap", "bucket-sort", "counting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/sort-characters-by-frequency/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count character frequencies",
      "Use max heap based on frequency",
      "Build result by popping from heap"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Frequency sorting",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Kth Largest Element in Stream",
    difficulty: "Easy",
    pattern_id: "heaps",
    slug: "kth-largest-stream",
    order: 9,
    tags: ["tree", "design", "binary-search-tree", "heap", "data-stream"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Maintain min heap of size K",
      "When adding element, if larger than root, replace root",
      "Root is always Kth largest"
    ],
    complexity: { time: "O(log k) per add", space: "O(k)" },
    keyLearning: "Maintain K largest",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Connect N Ropes with Minimum Cost",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "connect-n-ropes",
    order: 10,
    tags: ["array", "heap", "greedy"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/minimum-cost-of-ropes/1",
      article: ""
    },
    hints: [
      "Always connect two smallest ropes",
      "Use min heap to find smallest efficiently",
      "Add merged rope back to heap"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Greedy heap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Task Scheduler",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "task-scheduler",
    order: 11,
    tags: ["array", "hash-table", "greedy", "sorting", "heap", "counting"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/task-scheduler/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count task frequencies",
      "Use max heap to schedule most frequent first",
      "Handle cooling period with queue"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Cooling period",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Reorganize String",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "reorganize-string",
    order: 12,
    tags: ["hash-table", "string", "greedy", "sorting", "heap", "counting"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/reorganize-string/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use max heap by frequency",
      "Pick two most frequent, place alternately",
      "If only one left and count > 1, impossible"
    ],
    complexity: { time: "O(n log 26)", space: "O(1)" },
    keyLearning: "Avoid adjacent duplicates",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Hand of Straights",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "hand-of-straights",
    order: 13,
    tags: ["array", "hash-table", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/hand-of-straights/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort cards or use min heap",
      "Form groups starting from smallest",
      "Check if W consecutive cards available"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Greedy with heap",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Ugly Number II",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "ugly-number-ii",
    order: 14,
    tags: ["hash-table", "math", "dynamic-programming", "heap"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/ugly-number-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Ugly numbers: only factors 2, 3, 5",
      "Use three pointers for *2, *3, *5",
      "Or use min heap with set to avoid duplicates"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Three pointers",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Furthest Building You Can Reach",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "furthest-building",
    order: 15,
    tags: ["array", "greedy", "heap"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/furthest-building-you-can-reach/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use bricks for small climbs, ladders for large",
      "Min heap to track brick usage",
      "Replace largest brick usage with ladder"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Brick optimization",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sort K Sorted Array (Nearly Sorted)",
    difficulty: "Easy",
    pattern_id: "heaps",
    slug: "sort-k-sorted-array",
    order: 16,
    tags: ["array", "heap", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/nearly-sorted/1",
      article: ""
    },
    hints: [
      "Element can be at most K positions away",
      "Use min heap of size K+1",
      "Extract min and add next element"
    ],
    complexity: { time: "O(n log k)", space: "O(k)" },
    keyLearning: "Nearly sorted",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Kth Smallest in M Sorted Arrays",
    difficulty: "Medium",
    pattern_id: "heaps",
    slug: "kth-smallest-m-sorted",
    isAdditional: true,
    tags: ["array", "heap"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Similar to merge K sorted lists",
      "Use min heap with indices",
      "Extract K elements"
    ],
    complexity: { time: "O(k log m)", space: "O(m)" },
    note: "❌ Removed: Covered by k-way merge pattern",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedHeaps() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Heaps & Priority Queue pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'heaps' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'heaps' })
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
    console.log(`   • Cross-references: 1 (Top K Frequent → Hash Maps)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedHeaps()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
