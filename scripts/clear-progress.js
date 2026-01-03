import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in environment variables')
  console.error('Make sure .env.local file exists with MONGODB_URI')
  process.exit(1)
}

async function clearProgress() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('Connecting to MongoDB...')
    await client.connect()
    console.log('✅ Connected!')

    const db = client.db('dsa_patterns')

    // Clear progress
    console.log('Clearing progress collection...')
    const progressResult = await db.collection('progress').deleteMany({})
    console.log(`✅ Deleted ${progressResult.deletedCount} progress records`)

    // Clear visits
    console.log('Clearing visits collection...')
    const visitsResult = await db.collection('visits').deleteMany({})
    console.log(`✅ Deleted ${visitsResult.deletedCount} visit records`)

    console.log('\n🎉 All done! Database cleared successfully.')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.close()
    console.log('Connection closed.')
  }
}

clearProgress()
