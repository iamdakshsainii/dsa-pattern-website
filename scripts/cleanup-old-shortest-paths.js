// scripts/cleanup-old-shortest-paths.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI not found')

async function cleanup() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')
    const questionsCollection = db.collection('questions')

    // Delete old questions with wrong pattern_id
    const result = await questionsCollection.deleteMany({
      pattern_id: 'shortest-paths-mst'
    })

    console.log(`✅ Deleted ${result.deletedCount} questions with pattern_id: 'shortest-paths-mst'\n`)

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

cleanup()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
