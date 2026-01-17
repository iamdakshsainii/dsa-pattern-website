// scripts/problems/seed-hash-maps.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 12: Hash Maps (10 core problems)
const questionsData = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    pattern_id: "hash-maps",
    slug: "two-sum",
    order: 1,
    tags: ["array", "hash-table"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/two-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Store complement in HashMap",
      "For each number, check if target - num exists",
      "Return indices when found"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Complement technique",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    pattern_id: "hash-maps",
    slug: "contains-duplicate",
    order: 2,
    tags: ["array", "hash-table", "sorting"],
    companies: ["Amazon", "Microsoft", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/contains-duplicate/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use HashSet to track seen elements",
      "If element already in set, duplicate found",
      "Otherwise add to set"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "Check existence",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    pattern_id: "hash-maps",
    slug: "valid-anagram",
    order: 3,
    tags: ["hash-table", "string", "sorting"],
    companies: ["Amazon", "Microsoft", "Facebook", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/valid-anagram/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count frequency of each character",
      "Both strings should have same character counts",
      "Can use array[26] for lowercase letters"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Character count",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Group Anagrams",
    difficulty: "Medium",
    pattern_id: "hash-maps",
    slug: "group-anagrams",
    order: 4,
    tags: ["array", "hash-table", "string", "sorting"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/group-anagrams/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use sorted string as key",
      "Or use character count array as key",
      "Group strings with same key together"
    ],
    complexity: { time: "O(n*k log k)", space: "O(n*k)" },
    keyLearning: "Grouping by key",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    pattern_id: "hash-maps",
    slug: "longest-consecutive-sequence",
    order: 5,
    tags: ["array", "hash-table", "union-find"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-consecutive-sequence/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Add all numbers to HashSet",
      "For each number, check if it's start of sequence (num-1 not in set)",
      "Count sequence length by checking num+1, num+2, ..."
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    keyLearning: "O(n) consecutive",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    pattern_id: "hash-maps",
    slug: "top-k-frequent-elements",
    order: 6,
    tags: ["array", "hash-table", "divide-and-conquer", "sorting", "heap", "bucket-sort"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/top-k-frequent-elements/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count frequency using HashMap",
      "Use min heap of size K",
      "Or use bucket sort with frequency as index"
    ],
    complexity: { time: "O(n log k)", space: "O(n)" },
    keyLearning: "Frequency + heap",
    crossReference: {
      pattern: "heaps",
      problemTitle: "Top K Frequent Elements",
      note: "🔗 Also in Heaps - heap-based approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "First Unique Character in a String",
    difficulty: "Easy",
    pattern_id: "hash-maps",
    slug: "first-unique-character",
    order: 7,
    tags: ["hash-table", "string", "queue", "counting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/first-unique-character-in-a-string/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count frequency of each character",
      "Iterate again to find first with count 1",
      "Or use LinkedHashMap to maintain order"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Frequency map",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Majority Element",
    difficulty: "Easy",
    pattern_id: "hash-maps",
    slug: "majority-element",
    order: 8,
    tags: ["array", "hash-table", "divide-and-conquer", "sorting", "counting"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/majority-element/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Element appears > n/2 times",
      "Can use HashMap to count",
      "Optimal: Boyer-Moore Voting Algorithm O(1) space"
    ],
    complexity: { time: "O(n)", space: "O(n) or O(1)" },
    keyLearning: "> n/2 frequency",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Majority Element II",
    difficulty: "Medium",
    pattern_id: "hash-maps",
    slug: "majority-element-ii",
    order: 9,
    tags: ["array", "hash-table", "sorting", "counting"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/majority-element-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Elements appear > n/3 times",
      "At most 2 such elements can exist",
      "Use modified Boyer-Moore with 2 candidates"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "> n/3 frequency",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Isomorphic Strings",
    difficulty: "Easy",
    pattern_id: "hash-maps",
    slug: "isomorphic-strings",
    order: 10,
    tags: ["hash-table", "string"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/isomorphic-strings/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Map each character of s to character in t",
      "Use two HashMaps for bidirectional mapping",
      "Ensure one-to-one mapping (no two chars map to same)"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Character mapping",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems (not counted in 300)
const additionalProblems = [
  {
    title: "Word Pattern",
    difficulty: "Easy",
    pattern_id: "hash-maps",
    slug: "word-pattern",
    isAdditional: true,
    tags: ["hash-table", "string"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "https://leetcode.com/problems/word-pattern/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Similar to Isomorphic Strings",
      "Map pattern characters to words",
      "Ensure bijective mapping"
    ],
    complexity: { time: "O(n)", space: "O(n)" },
    note: "⭐ Similar: Similar to isomorphic strings",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedHashMaps() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Hash Maps pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'hash-maps' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'hash-maps' })
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
    console.log(`   • Core Problems: 10 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
    console.log(`   • Cross-references: 1 (Top K Frequent → also in Heaps)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedHashMaps()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
