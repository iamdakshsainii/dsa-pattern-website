// scripts/problems/seed-recursion-subsets.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 13: Recursion - Subsets & Combinations (12 core problems)
const questionsData = [
  {
    title: "Subsets (Power Set)",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "subsets",
    order: 1,
    tags: ["array", "backtracking", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/subsets/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "For each element, make include/exclude decision",
      "Base case: when index reaches array length",
      "Can also use bit manipulation approach"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    keyLearning: "Include/exclude pattern",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Subsets II (With Duplicates)",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "subsets-ii",
    order: 2,
    tags: ["array", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/subsets-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Sort array first to handle duplicates",
      "Skip duplicates at same recursion level",
      "Use i > start && nums[i] == nums[i-1] condition"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    keyLearning: "Handle duplicates",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Combination Sum",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "combination-sum",
    order: 3,
    tags: ["array", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Airbnb"],
    links: {
      leetcode: "https://leetcode.com/problems/combination-sum/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Can use same element unlimited times",
      "Stay at same index after including element",
      "Move to next index when excluding"
    ],
    complexity: { time: "O(2^target)", space: "O(target)" },
    keyLearning: "Unlimited use",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Combination Sum II",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "combination-sum-ii",
    order: 4,
    tags: ["array", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/combination-sum-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Each element used at most once",
      "Sort to handle duplicates",
      "Skip duplicates at same level"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    keyLearning: "Each used once",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Combination Sum III",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "combination-sum-iii",
    order: 5,
    tags: ["array", "backtracking"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/combination-sum-iii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Use only numbers 1-9",
      "Exactly k numbers sum to n",
      "Prune when sum > n or count > k"
    ],
    complexity: { time: "O(2^9)", space: "O(k)" },
    keyLearning: "K numbers sum to n",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Combinations",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "combinations",
    order: 6,
    tags: ["backtracking"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/combinations/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Choose k numbers from 1 to n",
      "Start from current number to avoid duplicates",
      "Base case when k elements chosen"
    ],
    complexity: { time: "O(C(n,k))", space: "O(k)" },
    keyLearning: "Choose k from n",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Letter Combinations of Phone Number",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "letter-combinations-phone-number",
    order: 7,
    tags: ["hash-table", "string", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Uber"],
    links: {
      leetcode: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Map digits to letters using array/object",
      "For each digit, try all its letters",
      "Build combination character by character"
    ],
    complexity: { time: "O(4^n)", space: "O(n)" },
    keyLearning: "Digit to letters",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Generate Parentheses",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "generate-parentheses",
    order: 8,
    tags: ["string", "dynamic-programming", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Uber"],
    links: {
      leetcode: "https://leetcode.com/problems/generate-parentheses/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Track open and close bracket counts",
      "Add '(' if open < n",
      "Add ')' if close < open"
    ],
    complexity: { time: "O(4^n / sqrt(n))", space: "O(n)" },
    keyLearning: "Valid parentheses",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "palindrome-partitioning",
    order: 9,
    tags: ["string", "dynamic-programming", "backtracking"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/palindrome-partitioning/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Partition at each position if left part is palindrome",
      "Recursively partition right part",
      "Precompute palindrome checks for optimization"
    ],
    complexity: { time: "O(n * 2^n)", space: "O(n)" },
    keyLearning: "All palindrome partitions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Word Break",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "word-break",
    order: 10,
    tags: ["hash-table", "string", "dynamic-programming", "trie", "memoization"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/word-break/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Try all prefixes that exist in dictionary",
      "Recursively check if suffix can be segmented",
      "Use memoization to avoid recomputation"
    ],
    complexity: { time: "O(n^2)", space: "O(n)" },
    keyLearning: "Segment into words",
    crossReference: {
      pattern: "dp-1d",
      problemTitle: "Word Break",
      note: "🔗 Also in DP 1D - DP approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Partition to K Equal Sum Subsets",
    difficulty: "Hard",
    pattern_id: "recursion-subsets",
    slug: "partition-k-equal-sum-subsets",
    order: 11,
    tags: ["array", "dynamic-programming", "backtracking", "bit-manipulation"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Target sum = total / k",
      "Try to form k subsets with target sum",
      "Use backtracking with pruning"
    ],
    complexity: { time: "O(k^n)", space: "O(n)" },
    keyLearning: "Divide into K groups",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Perfect Sum Problem",
    difficulty: "Medium",
    pattern_id: "recursion-subsets",
    slug: "perfect-sum-problem",
    order: 12,
    tags: ["array", "dynamic-programming", "backtracking"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/perfect-sum-problem/1",
      article: ""
    },
    hints: [
      "Count subsets with sum equal to K",
      "Include/exclude decision for each element",
      "Can optimize with DP"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    keyLearning: "Count subsets sum K",
    crossReference: {
      pattern: "dp-subsequences",
      problemTitle: "Count Subsets with Sum K",
      note: "🔗 Also in DP Subsequences - DP approach"
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Generate Binary Strings",
    difficulty: "Easy",
    pattern_id: "recursion-subsets",
    slug: "generate-binary-strings",
    isAdditional: true,
    tags: ["string", "backtracking"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://practice.geeksforgeeks.org/problems/generate-all-binary-strings/1",
      article: ""
    },
    hints: [
      "Generate all binary strings of length n",
      "At each position, choose 0 or 1",
      "Simpler version of subsets"
    ],
    complexity: { time: "O(2^n)", space: "O(n)" },
    note: "⭐ Similar: Simpler version of subsets pattern",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedRecursionSubsets() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting Recursion - Subsets pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'recursion-subsets' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'recursion-subsets' })
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
    console.log(`   • Core Problems: 12 (counted in 300)`)
    console.log(`   • Additional Problems: ${additionalProblems.length}`)
    console.log(`   • Cross-references: 2 (Word Break → DP 1D, Perfect Sum → DP Subsequences)`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedRecursionSubsets()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
