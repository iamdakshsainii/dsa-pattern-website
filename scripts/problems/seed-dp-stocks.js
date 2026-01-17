// scripts/problems/seed-dp-stocks.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

// Pattern 26: Dynamic Programming - Stocks (6 core problems)
const questionsData = [
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    pattern_id: "dp-stocks",
    slug: "best-time-buy-sell-stock",
    order: 1,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Single transaction allowed",
      "Track minimum price seen so far",
      "maxProfit = max(maxProfit, price - minPrice)"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Single transaction",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "Medium",
    pattern_id: "dp-stocks",
    slug: "best-time-buy-sell-stock-ii",
    order: 2,
    tags: ["array", "dynamic-programming", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    links: {
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Unlimited transactions",
      "Greedy: add all positive differences",
      "Or DP with buy/sell states"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Unlimited transactions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Best Time to Buy and Sell Stock III",
    difficulty: "Hard",
    pattern_id: "dp-stocks",
    slug: "best-time-buy-sell-stock-iii",
    order: 3,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "At most 2 transactions",
      "Track: buy1, sell1, buy2, sell2",
      "State machine DP"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "At most 2 transactions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Best Time to Buy and Sell Stock IV",
    difficulty: "Hard",
    pattern_id: "dp-stocks",
    slug: "best-time-buy-sell-stock-iv",
    order: 4,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "At most K transactions",
      "If K >= n/2, use unlimited approach",
      "dp[i][k][0/1] = max profit at day i with k transactions"
    ],
    complexity: { time: "O(n*k)", space: "O(k)" },
    keyLearning: "At most K transactions",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Best Time to Buy and Sell Stock with Cooldown",
    difficulty: "Medium",
    pattern_id: "dp-stocks",
    slug: "best-time-cooldown",
    order: 5,
    tags: ["array", "dynamic-programming"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Cooldown 1 day after selling",
      "Three states: hold, sold, rest",
      "sold[i] = hold[i-1] + price"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Cooldown after selling",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Best Time to Buy and Sell Stock with Transaction Fee",
    difficulty: "Medium",
    pattern_id: "dp-stocks",
    slug: "best-time-transaction-fee",
    order: 6,
    tags: ["array", "dynamic-programming", "greedy"],
    companies: ["Amazon", "Microsoft", "Facebook", "Google"],
    links: {
      leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
      youtube: "",
      gfg: "",
      article: ""
    },
    hints: [
      "Fee per transaction",
      "Two states: hold, sold",
      "sold[i] = hold[i-1] + price - fee"
    ],
    complexity: { time: "O(n)", space: "O(1)" },
    keyLearning: "Fee per transaction",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedDPStocks() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    console.log('🌱 Starting DP - Stocks pattern seeding...\n')

    const existing = await questionsCollection.countDocuments({ pattern_id: 'dp-stocks' })
    console.log(`📊 Current state: ${existing} questions\n`)

    if (existing > 0) {
      console.log('⚠️  Found existing questions')
      console.log('🗑️  Cleaning up...\n')
      await questionsCollection.deleteMany({ pattern_id: 'dp-stocks' })
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
    console.log(`   • All stock trading variations covered`)
    console.log('\n🔄 Refresh your browser to see the questions!\n')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

seedDPStocks()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
