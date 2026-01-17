// scripts/fix-progress-duplicates.js
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

async function fixDuplicates() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('🔌 Connected to MongoDB\n')

    const db = client.db('dsa_patterns')

    // Delete all records with null userId or questionId
    const result = await db.collection('user_progress').deleteMany({
      $or: [
        { user_id: null },
        { question_id: null },
        { userId: null },
        { questionId: null }
      ]
    })

    console.log(`✅ Deleted ${result.deletedCount} invalid progress records\n`)

    // Drop the old index
    try {
      await db.collection('user_progress').dropIndex('userId_1_questionId_1')
      console.log('✅ Dropped old index: userId_1_questionId_1')
    } catch (e) {
      console.log('ℹ️  Index userId_1_questionId_1 did not exist')
    }

    // Create the correct index
    await db.collection('user_progress').createIndex(
      { user_id: 1, question_id: 1 },
      { unique: true }
    )
    console.log('✅ Created new index: user_id_1_question_id_1\n')

    console.log('✨ Database fixed! Try clicking checkboxes again.\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

fixDuplicates()
