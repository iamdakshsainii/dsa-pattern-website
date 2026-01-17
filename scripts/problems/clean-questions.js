// scripts/clean-questions.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI not found in .env.local')
}

async function cleanQuestions() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')

    console.log('🗑️  Starting questions cleanup...\n')

    // Delete all questions
    const questionsResult = await db.collection('questions').deleteMany({})
    console.log(`✅ Deleted ${questionsResult.deletedCount} questions`)

    // Delete related user progress for questions (optional - keeps user data clean)
    const progressResult = await db.collection('user_progress').deleteMany({})
    console.log(`✅ Deleted ${progressResult.deletedCount} user progress records`)

    // Delete bookmarks for questions (optional - keeps bookmarks clean)
    const bookmarksResult = await db.collection('bookmarks').deleteMany({})
    console.log(`✅ Deleted ${bookmarksResult.deletedCount} bookmarks`)

    // Delete notes for questions (optional - keeps notes clean)
    const notesResult = await db.collection('notes').deleteMany({})
    console.log(`✅ Deleted ${notesResult.deletedCount} notes`)

    console.log('\n✨ All questions and related data cleaned successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Questions deleted: ${questionsResult.deletedCount}`)
    console.log(`   - User progress cleared: ${progressResult.deletedCount}`)
    console.log(`   - Bookmarks cleared: ${bookmarksResult.deletedCount}`)
    console.log(`   - Notes cleared: ${notesResult.deletedCount}`)

    console.log('\n🔒 Kept intact:')
    console.log('   - Patterns ✅')
    console.log('   - User accounts ✅')
    console.log('   - User profiles ✅')
    console.log('   - Roadmaps ✅')

    console.log('\n💡 Next step: Run npm run seed:questions to add questions\n')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    await client.close()
    console.log('👋 Database connection closed')
  }
}

cleanQuestions()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
