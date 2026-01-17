// scripts/problems/seed-bit-manipulation.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 16: Bit Manipulation (15 core problems)
const questionsData = [
  {
    title: "Count Set Bits (Hamming Weight)",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "count-set-bits",
    order: 1,
    tags: ["bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-1-bits/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Brian Kernighan's algorithm: n & (n-1) removes rightmost set bit",
      "Count iterations until n becomes 0",
      "Or use loop with n & 1 and right shift"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Brian Kernighan's algorithm",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Check if Power of Two",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "power-of-two",
    order: 2,
    tags: ["math", "bit-manipulation", "recursion"],
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/power-of-two/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Power of 2 has exactly one set bit",
      "Use n & (n-1) == 0 and n > 0",
      "Or count set bits == 1"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    keyLearning: "Single bit check",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Check if Power of Four",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "power-of-four",
    order: 3,
    tags: ["math", "bit-manipulation", "recursion"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/power-of-four/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Must be power of 2 first",
      "Set bit must be at even position (0, 2, 4...)",
      "Use n & 0xAAAAAAAA == 0 to check odd positions"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    keyLearning: "Even position bit",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Single Number",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "single-number",
    order: 4,
    tags: ["array", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/single-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "XOR of two same numbers is 0",
      "XOR all numbers - duplicates cancel out",
      "Result is the single number"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "XOR cancels pairs",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Single Number II",
    difficulty: "Medium",
    pattern_id: "bit-manipulation",
    slug: "single-number-ii",
    order: 5,
    tags: ["array", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/single-number-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count bits at each position",
      "Take modulo 3 - remainder is from single number",
      "Or use two variables (ones, twos) to track states"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Appear 3 times",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Single Number III",
    difficulty: "Medium",
    pattern_id: "bit-manipulation",
    slug: "single-number-iii",
    order: 6,
    tags: ["array", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/single-number-iii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "XOR all numbers gives xor of two single numbers",
      "Find any set bit in xor result",
      "Partition array based on this bit, XOR each partition"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Two appear once",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Number of 1 Bits",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "number-of-1-bits",
    order: 7,
    tags: ["bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/number-of-1-bits/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Same as Count Set Bits (#1)",
      "Use n & (n-1) repeatedly",
      "Or check each bit with n & 1"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "Count set bits",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Reverse Bits",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "reverse-bits",
    order: 8,
    tags: ["divide-and-conquer", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/reverse-bits/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Extract bits from right, add to result from left",
      "Use (n & 1) to get rightmost bit",
      "Shift result left, shift n right"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    keyLearning: "32-bit reversal",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Divide Two Integers",
    difficulty: "Medium",
    pattern_id: "bit-manipulation",
    slug: "divide-two-integers",
    order: 9,
    tags: ["math", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/divide-two-integers/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Cannot use *, /, % operators",
      "Use bit shifts to multiply/divide by 2",
      "Repeatedly subtract divisor * 2^k from dividend"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "No / operator",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sum of Two Integers",
    difficulty: "Medium",
    pattern_id: "bit-manipulation",
    slug: "sum-of-two-integers",
    order: 10,
    tags: ["math", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/sum-of-two-integers/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Cannot use + or - operators",
      "XOR gives sum without carry",
      "AND and left shift gives carry, repeat until no carry"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    keyLearning: "No +/- operators",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Complement of Base 10 Integer",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "complement-base-10",
    order: 11,
    tags: ["bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/complement-of-base-10-integer/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Flip all bits up to most significant bit",
      "Find mask with all 1s up to MSB",
      "XOR with mask to flip bits"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    keyLearning: "Flip bits to MSB",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Flipping an Image",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "flip-invert-image",
    order: 12,
    tags: ["array", "two-pointers", "matrix", "simulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/flipping-an-image/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Reverse each row (two pointers)",
      "Flip bits (0 to 1, 1 to 0) using XOR with 1",
      "Can combine both operations"
    ],
    complexity: { time: "O(m*n)", space: "O(1)" },
    keyLearning: "Matrix bit operations",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Bit Flips to Convert Number",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "minimum-bit-flips",
    order: 13,
    tags: ["bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-bit-flips-to-convert-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "XOR start and goal to find different bits",
      "Count set bits in XOR result",
      "That's the number of flips needed"
    ],
    complexity: { time: "O(log n)", space: "O(1)" },
    keyLearning: "XOR + count",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Find XOR from L to R",
    difficulty: "Medium",
    pattern_id: "bit-manipulation",
    slug: "find-xor-l-to-r",
    order: 14,
    tags: ["math", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/find-xor-from-l-to-r/1",
      article: ""
    },
    hints: [
      "XOR from 1 to n follows pattern based on n % 4",
      "XOR(L to R) = XOR(1 to R) ^ XOR(1 to L-1)",
      "Pattern: n, 1, n+1, 0 for n%4 = 1,2,3,0"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    keyLearning: "Pattern-based XOR",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Maximum XOR of Two Numbers in Array",
    difficulty: "Medium",
    pattern_id: "bit-manipulation",
    slug: "maximum-xor-two-numbers",
    order: 15,
    tags: ["array", "hash-table", "bit-manipulation", "trie"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Build Trie of binary representations",
      "For each number, try to find complement in Trie",
      "Choose opposite bit at each level to maximize XOR"
    ],
    complexity: { time: "O(n*32)", space: "O(n*32)" },
    keyLearning: "Trie approach",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Set ith Bit",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "set-ith-bit",
    isAdditional: true,
    tags: ["bit-manipulation"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/set-the-rightmost-unset-bit/1",
      article: ""
    },
    hints: [
      "Use OR with (1 << i)",
      "Creates mask with only ith bit set",
      "n | (1 << i)"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    note: "⭐ Similar: Basic bit operation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Clear ith Bit",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "clear-ith-bit",
    isAdditional: true,
    tags: ["bit-manipulation"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use AND with ~(1 << i)",
      "Creates mask with all bits set except ith",
      "n & ~(1 << i)"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    note: "⭐ Similar: Basic bit operation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Toggle ith Bit",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "toggle-ith-bit",
    isAdditional: true,
    tags: ["bit-manipulation"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use XOR with (1 << i)",
      "Flips ith bit",
      "n ^ (1 << i)"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    note: "⭐ Similar: Basic bit operation",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Remove Last Set Bit",
    difficulty: "Easy",
    pattern_id: "bit-manipulation",
    slug: "remove-last-set-bit",
    isAdditional: true,
    tags: ["bit-manipulation"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use n & (n-1)",
      "Classic Brian Kernighan technique",
      "Removes rightmost set bit"
    ],
    complexity: { time: "O(1)", space: "O(1)" },
    note: "⭐ Similar: n & (n-1) pattern",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedBitManipulation() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Bit Manipulation pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'bit-manipulation' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'bit-manipulation' })
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
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
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

seedBitManipulation()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
