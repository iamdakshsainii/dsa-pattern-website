// scripts/problems/seed-dp-strings.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 25: Dynamic Programming - Strings (12 core problems)
const questionsData = [
  {
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    pattern_id: "dp-strings",
    slug: "longest-common-subsequence",
    order: 1,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-common-subsequence/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Classic 2-string DP",
      "If s1[i] == s2[j]: dp[i][j] = 1 + dp[i-1][j-1]",
      "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Classic 2-string DP",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Common Substring",
    difficulty: "Medium",
    pattern_id: "dp-strings",
    slug: "longest-common-substring",
    order: 2,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/longest-common-substring-dp-29/",
      article: ""
    },
    hints: [
      "Continuous variant of LCS",
      "If s1[i] == s2[j]: dp[i][j] = 1 + dp[i-1][j-1]",
      "Else: dp[i][j] = 0 (reset)"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Continuous variant",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Palindromic Subsequence",
    difficulty: "Medium",
    pattern_id: "dp-strings",
    slug: "longest-palindromic-subsequence",
    order: 3,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-palindromic-subsequence/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "LCS of s and reverse(s)",
      "Or use range DP: dp[i][j] for substring [i,j]",
      "If s[i] == s[j]: dp[i][j] = 2 + dp[i+1][j-1]"
    ],
    complexity: { time: "O(n²)", space: "O(n²)" },
    keyLearning: "LCS of s and reverse(s)",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    pattern_id: "dp-strings",
    slug: "longest-palindromic-substring",
    order: 4,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/longest-palindromic-substring/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Expand around center approach",
      "Or DP: dp[i][j] = true if s[i:j+1] is palindrome",
      "Check both odd and even length centers"
    ],
    complexity: { time: "O(n²)", space: "O(1)" },
    keyLearning: "Expand around center",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Minimum Insertion Steps to Make String Palindrome",
    difficulty: "Medium",
    pattern_id: "dp-strings",
    slug: "min-insertions-palindrome",
    order: 5,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Find LPS (Longest Palindromic Subsequence)",
      "Answer = n - LPS length",
      "Insert characters that are missing from palindrome"
    ],
    complexity: { time: "O(n²)", space: "O(n²)" },
    keyLearning: "n - LPS length",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Shortest Common Supersequence",
    difficulty: "Hard",
    pattern_id: "dp-strings",
    slug: "shortest-common-supersequence",
    order: 6,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/shortest-common-supersequence/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Merge two strings with LCS",
      "Length = m + n - LCS",
      "Backtrack to construct actual string"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: "Merge two strings",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Edit Distance",
    difficulty: "Hard",
    pattern_id: "dp-strings",
    slug: "edit-distance",
    order: 7,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/edit-distance/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Min operations: insert, delete, replace",
      "If s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1]",
      "Else: 1 + min(insert, delete, replace)"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Min edit operations",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Wildcard Pattern Matching",
    difficulty: "Hard",
    pattern_id: "dp-strings",
    slug: "wildcard-matching",
    order: 8,
    tags: ["string", "dynamic-programming", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/wildcard-matching/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "* matches any sequence (including empty)",
      "? matches single character",
      "dp[i][j] = match s[0:i] with p[0:j]"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "* and ? wildcards",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Regular Expression Matching",
    difficulty: "Hard",
    pattern_id: "dp-strings",
    slug: "regex-matching",
    order: 9,
    tags: ["string", "dynamic-programming", "recursion"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/regular-expression-matching/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      ". matches any single character",
      "* matches zero or more of preceding element",
      "Handle . and * separately in DP"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: ". and * operators",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Distinct Subsequences",
    difficulty: "Hard",
    pattern_id: "dp-strings",
    slug: "distinct-subsequences",
    order: 10,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/distinct-subsequences/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Count occurrences of t in s",
      "If s[i] == t[j]: dp[i][j] = dp[i-1][j-1] + dp[i-1][j]",
      "Else: dp[i][j] = dp[i-1][j]"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Count t in s",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Interleaving String",
    difficulty: "Medium",
    pattern_id: "dp-strings",
    slug: "interleaving-string",
    order: 11,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/interleaving-string/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Check if s3 is interleaving of s1 and s2",
      "dp[i][j] = can form s3[0:i+j] from s1[0:i] and s2[0:j]",
      "Match with either s1[i-1] or s2[j-1]"
    ],
    complexity: { time: "O(m*n)", space: "O(n)" },
    keyLearning: "Check if s3 interleaves",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Print Longest Common Subsequence",
    difficulty: "Medium",
    pattern_id: "dp-strings",
    slug: "print-lcs",
    order: 12,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "https://www.geeksforgeeks.org/printing-longest-common-subsequence/",
      article: ""
    },
    hints: [
      "First compute LCS DP table",
      "Backtrack from dp[m][n]",
      "If s1[i] == s2[j], include in result"
    ],
    complexity: { time: "O(m*n)", space: "O(m*n)" },
    keyLearning: "Backtrack to print",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Additional problems
const additionalProblems = [
  {
    title: "Minimum Deletions to Make Palindrome",
    difficulty: "Medium",
    pattern_id: "dp-strings",
    slug: "min-deletions-palindrome",
    isAdditional: true,
    tags: ["string", "dynamic-programming"],
    companies: ["Amazon", "Microsoft"],
    links: {
      leetcode: "",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Same as minimum insertions",
      "n - LPS length",
      "Delete characters not in longest palindromic subsequence"
    ],
    complexity: { time: "O(n²)", space: "O(n²)" },
    note: "⭐ Similar to Minimum Insertions",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedDPStrings() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting DP - Strings pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'dp-strings' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'dp-strings' })
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
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedDPStrings()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
