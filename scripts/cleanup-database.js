import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const ADMIN_EMAIL = 'sainidaksh70@gmail.com'
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI not found in .env.local')
  process.exit(1)
}

async function cleanupDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('🚀 Starting database cleanup...\n')

    await client.connect()
    console.log('✅ Connected to MongoDB\n')

    const db = client.db()

    console.log('👤 Cleaning up users...')
    const usersResult = await db.collection('users').deleteMany({
      email: { $ne: ADMIN_EMAIL }
    })
    console.log(`   ✅ Deleted ${usersResult.deletedCount} non-admin users\n`)

    console.log('📊 Cleaning up user progress...')
    const adminUser = await db.collection('users').findOne({ email: ADMIN_EMAIL })
    if (adminUser) {
      const progressResult = await db.collection('user_progress').deleteMany({
        user_id: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${progressResult.deletedCount} progress records\n`)
    }

    console.log('🔥 Cleaning up user streaks...')
    if (adminUser) {
      const streaksResult = await db.collection('visits').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${streaksResult.deletedCount} visit/streak records\n`)
    }

    console.log('📝 Cleaning up submissions...')
    if (adminUser) {
      const submissionsResult = await db.collection('submissions').deleteMany({
        user_id: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${submissionsResult.deletedCount} submission records\n`)
    }

    console.log('🐛 Cleaning up bug reports...')
    if (adminUser) {
      const bugsResult = await db.collection('bug_reports').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${bugsResult.deletedCount} bug reports\n`)
    }

    console.log('🎯 Cleaning up bookmarks...')
    if (adminUser) {
      const bookmarksResult = await db.collection('bookmarks').deleteMany({
        user_id: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${bookmarksResult.deletedCount} bookmarks\n`)
    }

    console.log('📚 Cleaning up notes...')
    if (adminUser) {
      const notesResult = await db.collection('notes').deleteMany({
        user_id: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${notesResult.deletedCount} notes\n`)
    }

    console.log('🎓 Cleaning up quiz attempts...')
    if (adminUser) {
      const quizResult = await db.collection('quiz_results').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      const quizAttemptsResult = await db.collection('user_quiz_attempts').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${quizResult.deletedCount} quiz results\n`)
      console.log(`   ✅ Deleted ${quizAttemptsResult.deletedCount} quiz attempt records\n`)
    }

    console.log('🗺️ Cleaning up roadmap progress...')
    if (adminUser) {
      const roadmapResult = await db.collection('roadmap_progress').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${roadmapResult.deletedCount} roadmap progress records\n`)
    }

    console.log('🏆 Cleaning up achievements...')
    if (adminUser) {
      const achievementsResult = await db.collection('user_achievements').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${achievementsResult.deletedCount} achievements\n`)
    }

    console.log('👤 Cleaning up user profiles...')
    if (adminUser) {
      const profilesResult = await db.collection('user_profiles').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${profilesResult.deletedCount} user profiles\n`)
    }

    console.log('📜 Cleaning up certificates...')
    if (adminUser) {
      const certsResult = await db.collection('certificates').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${certsResult.deletedCount} certificates\n`)
    }

    console.log('🎫 Cleaning up mentorship requests...')
    if (adminUser) {
      const mentorshipResult = await db.collection('mentorship_requests').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${mentorshipResult.deletedCount} mentorship requests\n`)
    }

    console.log('📋 Cleaning up appeals...')
    if (adminUser) {
      const appealsResult = await db.collection('user_appeals').deleteMany({
        userId: { $ne: adminUser._id.toString() }
      })
      console.log(`   ✅ Deleted ${appealsResult.deletedCount} appeals\n`)
    }

    console.log('=' .repeat(50))
    console.log('✨ DATABASE CLEANUP COMPLETED SUCCESSFULLY!')
    console.log('=' .repeat(50))
    console.log('\n📋 Summary:')
    console.log(`   ✅ Admin user preserved: ${ADMIN_EMAIL}`)
    console.log(`   ✅ All other users and their data removed`)
    console.log('\n🔒 PRESERVED DATA:')
    console.log('   ✅ Patterns')
    console.log('   ✅ Questions')
    console.log('   ✅ Solutions')
    console.log('   ✅ Quizzes')
    console.log('   ✅ Quiz Bank')
    console.log('   ✅ Roadmaps')
    console.log('   ✅ Roadmap Nodes')
    console.log('   ✅ Resources')
    console.log('   ✅ Admin data')
    console.log('\n🚀 Platform is now fresh and ready!')

    await client.close()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ ERROR during cleanup:', error)
    await client.close()
    process.exit(1)
  }
}

cleanupDatabase()
