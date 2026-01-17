// scripts/problems/seed-recursion-permutations.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 14: Recursion - Permutations (6 core problems)
const questionsData = [
  {
    title: "Permutations",
    difficulty: "Medium",
    pattern_id: "recursion-permutations",
    slug: "permutations",
    order: 1,
    tags: ["array", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/permutations/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Swap elements to generate permutations",
      "Backtrack after exploring each swap",
      "When index reaches end, add to result"
    ],
    complexity: { time: "O(n!)", space: "O(n)" },
    keyLearning: "Swap-based backtracking",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Permutations II (With Duplicates)",
    difficulty: "Medium",
    pattern_id: "recursion-permutations",
    slug: "permutations-ii",
    order: 2,
    tags: ["array", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/permutations-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use frequency map to handle duplicates",
      "Skip if element already used at this level",
      "Or use set to track used elements at each level"
    ],
    complexity: { time: "O(n!)", space: "O(n)" },
    keyLearning: "Handle duplicates",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Next Permutation",
    difficulty: "Medium",
    pattern_id: "recursion-permutations",
    slug: "next-permutation",
    order: 3,
    tags: ["array", "two-pointers"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/next-permutation/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find first decreasing element from right",
      "Find smallest element greater than it on right",
      "Swap and reverse the suffix"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "In-place next order",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Permutation Sequence",
    difficulty: "Hard",
    pattern_id: "recursion-permutations",
    slug: "permutation-sequence",
    order: 4,
    tags: ["math", "backtracking"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/permutation-sequence/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use factorial to find position in each block",
      "Calculate which number should be at each position",
      "Remove used numbers from available list"
    ],
    complexity: { time: "O(n^2)", space: "O(n)" },
    keyLearning: "Kth permutation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Letter Case Permutation",
    difficulty: "Medium",
    pattern_id: "recursion-permutations",
    slug: "letter-case-permutation",
    order: 5,
    tags: ["string", "backtracking", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/letter-case-permutation/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "For each letter, branch into lowercase and uppercase",
      "Skip digits (no transformation needed)",
      "Build string character by character"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    keyLearning: "Toggle case",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "String Permutations Changing Case",
    difficulty: "Medium",
    pattern_id: "recursion-permutations",
    slug: "string-permutations-changing-case",
    order: 6,
    tags: ["string", "backtracking"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/permutations-of-a-given-string/1",
      article: ""
    },
    hints: [
      "Generate all case variations",
      "For each character, try original and toggled case",
      "Similar to letter case permutation"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    keyLearning: "Case variations",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedRecursionPermutations() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Recursion - Permutations pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'recursion-permutations' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'recursion-permutations' })
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
    console.log(`   • Core Problems: 6 (counted in 300)`)
    console.log(`   • Additional Problems: 0`)
    console.log(`   • Cross-references: 0`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedRecursionPermutations()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
