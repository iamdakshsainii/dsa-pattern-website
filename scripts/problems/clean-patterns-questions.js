// scripts/clean-patterns-questions.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

// Load environment variables
config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI not found in .env.local')
}

async function cleanDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')

    console.log('🚀 Starting database cleanup...\n')

    // 1. Delete all patterns
    const patternsResult = await db.collection('patterns').deleteMany({})
    console.log(`✅ Deleted ${patternsResult.deletedCount} patterns`)

    // 2. Delete all questions
    const questionsResult = await db.collection('questions').deleteMany({})
    console.log(`✅ Deleted ${questionsResult.deletedCount} questions`)

    // 3. Delete user progress (orphaned question references)
    const progressResult = await db.collection('user_progress').deleteMany({})
    console.log(`✅ Deleted ${progressResult.deletedCount} user progress records`)

    // 4. Delete notes (orphaned question references)
    const notesResult = await db.collection('notes').deleteMany({})
    console.log(`✅ Deleted ${notesResult.deletedCount} notes`)

    // 5. Delete bookmarks (orphaned question references)
    const bookmarksResult = await db.collection('bookmarks').deleteMany({})
    console.log(`✅ Deleted ${bookmarksResult.deletedCount} bookmarks`)

    console.log('\n✨ Database cleanup completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Patterns deleted: ${patternsResult.deletedCount}`)
    console.log(`   - Questions deleted: ${questionsResult.deletedCount}`)
    console.log(`   - User progress cleared: ${progressResult.deletedCount}`)
    console.log(`   - Notes cleared: ${notesResult.deletedCount}`)
    console.log(`   - Bookmarks cleared: ${bookmarksResult.deletedCount}`)
    console.log('\n🔒 Kept intact:')
    console.log('   - User accounts ✅')
    console.log('   - User profiles ✅')
    console.log('   - Roadmaps ✅')
    console.log('   - Quiz system ✅')
    console.log('   - Streaks & visits ✅')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    await client.close()
    console.log('\n👋 Database connection closed')
  }
}

cleanDatabase()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
