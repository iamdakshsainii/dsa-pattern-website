import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found')
  process.exit(1)
}

async function cleanupDSANodes() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db('dsa_patterns')

    // Delete all DSA Fundamentals nodes
    const result = await db.collection('roadmap_nodes').deleteMany({
      roadmapId: 'dsa-fundamentals-y1'
    })

    console.log(`🗑️  Deleted ${result.deletedCount} DSA Fundamentals nodes`)
    console.log('✅ Cleanup complete! Now you can run the seed script.')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

cleanupDSANodes()
