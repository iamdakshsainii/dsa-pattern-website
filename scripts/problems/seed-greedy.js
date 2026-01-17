// scripts/problems/seed-greedy.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 18: Greedy Algorithms (15 core problems)
const questionsData = [
  {
    title: "Assign Cookies",
    difficulty: "Easy",
    pattern_id: "greedy",
    slug: "assign-cookies",
    order: 1,
    tags: ["array", "two-pointers", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/assign-cookies/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort both greed factors and cookie sizes",
      "Use two pointers to match smallest greed with smallest valid cookie",
      "Move to next child only when satisfied"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Sort and match",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Lemonade Change",
    difficulty: "Easy",
    pattern_id: "greedy",
    slug: "lemonade-change",
    order: 2,
    tags: ["array", "greedy"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/lemonade-change/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track count of $5 and $10 bills",
      "For $20, prefer giving $10+$5 over three $5s",
      "Greedy: save $5 bills for later"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Bill change strategy",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Jump Game",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "jump-game",
    order: 3,
    tags: ["array", "dynamic-programming", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/jump-game/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track furthest position reachable",
      "At each index, update furthest = max(furthest, i + nums[i])",
      "Check if furthest >= last index"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Furthest reach",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Jump Game II",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "jump-game-ii",
    order: 4,
    tags: ["array", "dynamic-programming", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/jump-game-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track current jump's end and furthest reachable",
      "When reaching current end, increment jumps",
      "Update current end to furthest"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Minimize jumps",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Gas Station",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "gas-station",
    order: 5,
    tags: ["array", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/gas-station/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "If total gas >= total cost, solution exists",
      "Track running tank balance",
      "When tank goes negative, start from next station"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Find valid start",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Candy",
    difficulty: "Hard",
    pattern_id: "greedy",
    slug: "candy",
    order: 6,
    tags: ["array", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/candy/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Two-pass approach: left-to-right, then right-to-left",
      "Left pass: if rating[i] > rating[i-1], candy[i] = candy[i-1] + 1",
      "Right pass: if rating[i] > rating[i+1], candy[i] = max(candy[i], candy[i+1] + 1)"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Two-pass greedy",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "N Meetings in One Room",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "n-meetings-one-room",
    order: 7,
    tags: ["array", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room/1",
      article: ""
    },
    hints: [
      "Sort meetings by end time",
      "Greedily pick earliest ending meeting",
      "Skip meetings that overlap with last picked"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Activity selection",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Job Sequencing Problem",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "job-sequencing",
    order: 8,
    tags: ["array", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/job-sequencing-problem/1",
      article: ""
    },
    hints: [
      "Sort jobs by profit (descending)",
      "For each job, schedule at latest possible slot before deadline",
      "Use boolean array to track filled slots"
    ],
    complexity: { time: "O(n log n)", space: "O(n)" },
    keyLearning: "Sort by profit",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Number of Platforms Required",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "minimum-platforms",
    order: 9,
    tags: ["array", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/minimum-platforms/1",
      article: ""
    },
    hints: [
      "Sort arrivals and departures separately",
      "Use two pointers to track overlapping trains",
      "Increment platforms when train arrives, decrement when departs"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Arrival/departure sort",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Remove K Digits",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "remove-k-digits-greedy",
    order: 10,
    tags: ["string", "stack", "greedy", "monotonic-stack"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/remove-k-digits/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use monotonic increasing stack",
      "Remove digits when current < stack top",
      "Handle remaining k and leading zeros"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Monotonic stack greedy",
    crossReference: {
      pattern: "stack",
      problemTitle: "Remove K Digits",
      note: "🔗 Also in Stack - monotonic stack approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Valid Parenthesis String",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "valid-parenthesis-string",
    order: 11,
    tags: ["string", "dynamic-programming", "stack", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/valid-parenthesis-string/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track range of possible open brackets [low, high]",
      "'(' increases both, ')' decreases both",
      "'*' can be (, ), or empty - adjust range accordingly"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Balance range tracking",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximum Length of Pair Chain",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "max-length-pair-chain",
    order: 12,
    tags: ["array", "dynamic-programming", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-length-of-pair-chain/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort pairs by end value",
      "Greedy: pick pair with earliest end",
      "Similar to activity selection"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Activity on pairs",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Partition Labels",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "partition-labels-greedy",
    order: 13,
    tags: ["hash-table", "two-pointers", "string", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/partition-labels/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find last occurrence of each character",
      "Expand partition end to include last occurrence",
      "Create partition when reaching current end"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Last occurrence",
    crossReference: {
      pattern: "two-pointers",
      problemTitle: "Partition Labels",
      note: "🔗 Also in Two Pointers - two pointer variant"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Boats to Save People",
    difficulty: "Medium",
    pattern_id: "greedy",
    slug: "boats-to-save-people-greedy",
    order: 14,
    tags: ["array", "two-pointers", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/boats-to-save-people/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort people by weight",
      "Two pointers: pair heaviest with lightest if possible",
      "Otherwise, heaviest goes alone"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Two pointer greedy",
    crossReference: {
      pattern: "two-pointers",
      problemTitle: "Boats to Save People",
      note: "🔗 Also in Two Pointers - greedy pairing"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Fractional Knapsack",
    difficulty: "Easy",
    pattern_id: "greedy",
    slug: "fractional-knapsack",
    order: 15,
    tags: ["array", "greedy", "sorting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/fractional-knapsack/1",
      article: ""
    },
    hints: [
      "Sort items by value/weight ratio (descending)",
      "Take items greedily until capacity full",
      "Can take fraction of last item"
    ],
    complexity: { time: "O(n log n)", space: "O(1)" },
    keyLearning: "Value/weight ratio",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedGreedy() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Greedy Algorithms pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'greedy' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'greedy' })
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
    console.log(`   • Core Problems: 15 (counted in 300)`)
    console.log(`   • Additional Problems: 0`)
    console.log(`   • Cross-references: 3 (Remove K Digits → Stack, Partition Labels → Two Pointers, Boats → Two Pointers)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedGreedy()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
