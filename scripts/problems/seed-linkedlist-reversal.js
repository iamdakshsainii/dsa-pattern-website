// scripts/problems/seed-linkedlist-reversal.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 6: In-place LinkedList Reversal (9 core problems)
const questionsData = [
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    pattern_id: "linkedlist-reversal",
    slug: "reverse-linked-list",
    order: 1,
    tags: ["linked-list"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/reverse-linked-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Three pointers: prev, current, next",
      "Iterate and reverse direction of each pointer",
      "prev starts as null, current as head"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Three-pointer reversal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Reverse Linked List II",
    difficulty: "Medium",
    pattern_id: "linkedlist-reversal",
    slug: "reverse-linked-list-ii",
    order: 2,
    tags: ["linked-list"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/reverse-linked-list-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Reverse only between positions m and n",
      "Keep track of node before m and node at m",
      "Reverse the portion, then reconnect"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Reverse between positions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Reverse Nodes in K-Group",
    difficulty: "Hard",
    pattern_id: "linkedlist-reversal",
    slug: "reverse-nodes-k-group",
    order: 3,
    tags: ["linked-list", "recursion"],
    companies: ["Amazon", "Microsoft", "Facebook"],
    links: {
      leetcode: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Check if k nodes exist before reversing",
      "Reverse k nodes, recursively handle rest",
      "Connect reversed group to rest of list"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Reverse groups of K",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Swap Nodes in Pairs",
    difficulty: "Medium",
    pattern_id: "linkedlist-reversal",
    slug: "swap-nodes-pairs",
    order: 4,
    tags: ["linked-list", "recursion"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/swap-nodes-in-pairs/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "K=2 special case of reverse k-group",
      "Swap every two adjacent nodes",
      "Use dummy node to handle head change"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "K=2 special case",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Rotate List",
    difficulty: "Medium",
    pattern_id: "linkedlist-reversal",
    slug: "rotate-list",
    order: 5,
    tags: ["linked-list", "two-pointers"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/rotate-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find length and make circular",
      "k = k % length to handle k > length",
      "Break circle at new tail position"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Rotation using reversal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Reverse Alternating K Elements",
    difficulty: "Medium",
    pattern_id: "linkedlist-reversal",
    slug: "reverse-alternating-k-elements",
    order: 6,
    tags: ["linked-list"],
    companies: [],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/reverse-alternate-k-nodes-in-a-singly-linked-list/",
      article: ""
    },
    hints: [
      "Reverse k nodes, skip k nodes alternately",
      "Use two loops: one for reverse, one for skip",
      "Recursively process remaining list"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Skip K then reverse K",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Reverse Nodes in Even Length Groups",
    difficulty: "Medium",
    pattern_id: "linkedlist-reversal",
    slug: "reverse-even-length-groups",
    order: 7,
    tags: ["linked-list"],
    companies: ["Amazon"],
    links: {
      leetcode: "https://leetcode.com/problems/reverse-nodes-in-even-length-groups/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Groups are size 1, 2, 3, 4, ...",
      "Reverse only if group length is even",
      "Handle last group which may be incomplete"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Conditional reversal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Flatten a Multilevel Doubly Linked List",
    difficulty: "Medium",
    pattern_id: "linkedlist-reversal",
    slug: "flatten-multilevel-dll",
    order: 8,
    tags: ["linked-list", "depth-first-search", "doubly-linked-list"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "DFS approach: process child before next",
      "Keep track of tail when flattening",
      "Reconnect all pointers properly"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Recursive flattening",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Add Two Numbers",
    difficulty: "Medium",
    pattern_id: "linkedlist-reversal",
    slug: "add-two-numbers",
    order: 9,
    tags: ["linked-list", "math", "recursion"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/add-two-numbers/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Numbers stored in reverse (342 = 2→4→3)",
      "Add digit by digit with carry",
      "Handle different lengths and final carry"
    ],
    complexity: { time: "O(max(m,n))", space: "O(max(m,n))" },
    keyLearning: "Reverse logic application",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedLinkedListReversal() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting LinkedList Reversal pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'linkedlist-reversal' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'linkedlist-reversal' })
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
    console.log(`   • Core Problems: 9 (counted in 300)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedLinkedListReversal()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
