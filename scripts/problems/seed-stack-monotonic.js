// scripts/problems/seed-stack-monotonic.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 10: Stack & Monotonic Stack (22 core problems)
const questionsData = [
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    pattern_id: "stack",
    slug: "valid-parentheses",
    order: 1,
    tags: ["string", "stack"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/valid-parentheses/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use stack for opening brackets",
      "Pop and match when closing bracket found",
      "Stack should be empty at end"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Stack for bracket matching",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Min Stack",
    difficulty: "Easy",
    pattern_id: "stack",
    slug: "min-stack",
    order: 2,
    tags: ["stack", "design"],
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/min-stack/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Maintain min alongside each element",
      "Two stacks: main stack and min stack",
      "Or store (value, currentMin) pairs"
    ],
    complexity: { time: "O(1)", space: "O(n)" },
    keyLearning: "Track minimum alongside",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Next Greater Element I",
    difficulty: "Easy",
    pattern_id: "stack",
    slug: "next-greater-element-i",
    order: 3,
    tags: ["array", "stack", "monotonic-stack"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/next-greater-element-i/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Monotonic decreasing stack",
      "Iterate from right to left",
      "Pop smaller elements, current is answer for popped"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Monotonic stack intro",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Next Greater Element II",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "next-greater-element-ii",
    order: 4,
    tags: ["array", "stack", "monotonic-stack"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/next-greater-element-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Circular array: traverse twice (2*n iterations)",
      "Use index % n to handle circular",
      "Same monotonic stack approach"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Circular array",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Next Smaller Element",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "next-smaller-element",
    order: 5,
    tags: ["array", "stack", "monotonic-stack"],
    companies: ["Amazon"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/next-smaller-element/",
      article: ""
    },
    hints: [
      "Monotonic increasing stack",
      "Opposite of next greater",
      "Stack maintains increasing order"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Monotonic increasing",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Previous Smaller Element",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "previous-smaller-element",
    order: 6,
    tags: ["array", "stack", "monotonic-stack"],
    companies: ["Amazon"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/find-the-nearest-smaller-numbers-on-left-side-in-an-array/",
      article: ""
    },
    hints: [
      "Iterate left to right",
      "Monotonic increasing stack",
      "Stack top is answer if smaller"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Left to right",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Daily Temperatures",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "daily-temperatures",
    order: 7,
    tags: ["array", "stack", "monotonic-stack"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/daily-temperatures/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find next greater temperature",
      "Store indices in stack",
      "Answer = current index - stack top index"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Days until warmer",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sum of Subarray Minimums",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "sum-subarray-minimums",
    order: 8,
    tags: ["array", "stack", "monotonic-stack"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/sum-of-subarray-minimums/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Contribution technique: each element contributes as min",
      "Find previous smaller and next smaller",
      "Contribution = element * left_count * right_count"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Contribution technique",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sum of Subarray Ranges",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "sum-subarray-ranges",
    order: 9,
    tags: ["array", "stack", "monotonic-stack"],
    companies: ["Google"],
    links: {
      leetcode: "https://leetcode.com/problems/sum-of-subarray-ranges/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Range = max - min in subarray",
      "Calculate sum of max - sum of min",
      "Use contribution technique for both"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Max - min contribution",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Trapping Rain Water",
    difficulty: "Hard",
    pattern_id: "stack",
    slug: "trapping-rain-water-stack",
    order: 10,
    tags: ["array", "two-pointers", "stack"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/trapping-rain-water/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Stack approach: calculate water for each bar",
      "Or two-pointer: track max left and right",
      "Water = min(maxLeft, maxRight) - height"
    ],
    complexity: { time: "O(n)", space: "O(n) or O(1)" },
    keyLearning: "Stack or two-pointer",
    crossReference: {
      pattern: "two-pointers",
      problemTitle: "Trapping Rain Water",
      note: "🔗 Also in Two Pointers - two-pointer approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    pattern_id: "stack",
    slug: "largest-rectangle-histogram",
    order: 11,
    tags: ["array", "stack", "monotonic-stack"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find previous smaller and next smaller for each bar",
      "Width = nextSmaller - prevSmaller - 1",
      "Area = height * width"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Previous/next smaller",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Remove K Digits",
    difficulty: "Hard",
    pattern_id: "stack",
    slug: "remove-k-digits",
    order: 12,
    tags: ["string", "stack", "greedy", "monotonic-stack"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-k-digits/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Monotonic increasing stack",
      "Remove digits when current < stack top",
      "Greedy: remove larger digits from left"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Monotonic greedy",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Asteroid Collision",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "asteroid-collision",
    order: 13,
    tags: ["array", "stack"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/asteroid-collision/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Positive = moving right, negative = left",
      "Collision when positive in stack meets negative",
      "Compare absolute values"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Stack simulation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Online Stock Span",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "online-stock-span",
    order: 14,
    tags: ["stack", "design", "monotonic-stack"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/online-stock-span/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Span = consecutive days with price <= today",
      "Monotonic decreasing stack with (price, span)",
      "Pop smaller prices, accumulate spans"
    ],
    complexity: { time: "O(1) amortized", space: "O(n)" },
    keyLearning: "Consecutive days <= price",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Decode String",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "decode-string",
    order: 15,
    tags: ["string", "stack", "recursion"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/decode-string/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Stack for nested brackets",
      "Push number and current string on '['",
      "Pop and repeat on ']'"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Nested brackets",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Simplify Path",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "simplify-path",
    order: 16,
    tags: ["string", "stack"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/simplify-path/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Split by '/'",
      "'..' pops directory, '.' ignored",
      "Push valid directory names to stack"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Path segments",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Remove All Adjacent Duplicates In String",
    difficulty: "Easy",
    pattern_id: "stack",
    slug: "remove-adjacent-duplicates",
    order: 17,
    tags: ["string", "stack"],
    companies: ["Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Stack for characters",
      "If top equals current, pop",
      "Otherwise push"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Simple removal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Remove All Adjacent Duplicates in String II",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "remove-adjacent-duplicates-ii",
    order: 18,
    tags: ["string", "stack"],
    companies: ["Amazon", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Stack stores (char, count)",
      "Increment count if same char",
      "Pop when count reaches k"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "K consecutive count",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "evaluate-rpn",
    order: 19,
    tags: ["array", "math", "stack"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Stack for operands",
      "On operator: pop two, compute, push result",
      "Final answer is stack top"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Postfix evaluation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Basic Calculator II",
    difficulty: "Medium",
    pattern_id: "stack",
    slug: "basic-calculator-ii",
    order: 20,
    tags: ["string", "stack", "math"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/basic-calculator-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Handle operator precedence (* / before + -)",
      "Stack for numbers",
      "Process * / immediately, push +/- to stack"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Operator precedence",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    pattern_id: "stack",
    slug: "queue-using-stacks",
    order: 21,
    tags: ["stack", "design", "queue"],
    companies: ["Amazon", "Microsoft", "Bloomberg"],
    links: {
      leetcode: "https://leetcode.com/problems/implement-queue-using-stacks/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Two stacks: input and output",
      "Push to input stack",
      "Pop from output; if empty, transfer from input"
    ],
    complexity: { time: "O(1) amortized", space: "O(n)" },
    keyLearning: "Two stack technique",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Implement Stack using Queues",
    difficulty: "Easy",
    pattern_id: "stack",
    slug: "stack-using-queues",
    order: 22,
    tags: ["stack", "design", "queue"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/implement-stack-using-queues/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "One queue: make push expensive",
      "Or two queues: transfer on pop",
      "Rotate queue on push to maintain LIFO"
    ],
    complexity: { time: "O(n) push or O(n) pop", space: "O(n)" },
    keyLearning: "Queue to stack",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedStackMonotonic() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Stack & Monotonic Stack pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'stack' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'stack' })
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
    console.log(`   • Core Problems: 22 (counted in 300)`)
    console.log(`   • Cross-references: 1 (Trapping Rain Water → also in Two Pointers)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedStackMonotonic()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
