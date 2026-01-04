import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoClient } from 'mongodb'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'dsa_patterns'

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not defined in .env.local')
  process.exit(1)
}

async function seedDatabase() {
  console.log('🌱 Starting database seed...')
  console.log(`📍 Database: ${DB_NAME}`)

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db(DB_NAME)

    // 1. Create user_achievements collection
    console.log('\n📦 Creating user_achievements collection...')
    try {
      await db.createCollection('user_achievements')
      console.log('✅ user_achievements collection created')
    } catch (err) {
      if (err.codeName === 'NamespaceExists') {
        console.log('ℹ️  user_achievements collection already exists')
      } else {
        throw err
      }
    }

    // Create index for user_achievements
    await db.collection('user_achievements').createIndex(
      { userId: 1, badgeId: 1 },
      { unique: true }
    )
    console.log('✅ Created unique index on userId + badgeId')

    // 2. Create user_resumes collection
    console.log('\n📦 Creating user_resumes collection...')
    try {
      await db.createCollection('user_resumes')
      console.log('✅ user_resumes collection created')
    } catch (err) {
      if (err.codeName === 'NamespaceExists') {
        console.log('ℹ️  user_resumes collection already exists')
      } else {
        throw err
      }
    }

    // Create index for user_resumes
    await db.collection('user_resumes').createIndex({ userId: 1 })
    console.log('✅ Created index on userId')

    // 3. Create interview_prep collection
    console.log('\n📦 Creating interview_prep collection...')
    try {
      await db.createCollection('interview_prep')
      console.log('✅ interview_prep collection created')
    } catch (err) {
      if (err.codeName === 'NamespaceExists') {
        console.log('ℹ️  interview_prep collection already exists')
      } else {
        throw err
      }
    }

    // Create index for interview_prep
    await db.collection('interview_prep').createIndex({ userId: 1 })
    console.log('✅ Created index on userId')

    // 4. Create company_progress collection (optional)
    console.log('\n📦 Creating company_progress collection...')
    try {
      await db.createCollection('company_progress')
      console.log('✅ company_progress collection created')
    } catch (err) {
      if (err.codeName === 'NamespaceExists') {
        console.log('ℹ️  company_progress collection already exists')
      } else {
        throw err
      }
    }

    // Create index for company_progress
    await db.collection('company_progress').createIndex(
      { userId: 1, companyName: 1 },
      { unique: true }
    )
    console.log('✅ Created unique index on userId + companyName')

    // 5. Verify existing collections (should already exist from Phase 1)
    console.log('\n🔍 Verifying existing collections...')

    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)

    const requiredCollections = [
      'users',
      'user_profiles',
      'user_progress',
      'bookmarks',
      'user_notes',
      'user_achievements',
      'user_resumes',
      'interview_prep',
      'company_progress'
    ]

    console.log('\n📊 Collection Status:')
    requiredCollections.forEach(name => {
      const exists = collectionNames.includes(name)
      console.log(`  ${exists ? '✅' : '❌'} ${name}`)
    })

    // 6. Display all indexes
    console.log('\n📇 Indexes created:')

    try {
      const achievementsIndexes = await db.collection('user_achievements').indexes()
      console.log('\n  user_achievements indexes:')
      achievementsIndexes.forEach(idx => {
        console.log(`    - ${idx.name}`)
      })
    } catch (err) {
      console.log('  ⚠️  Could not fetch user_achievements indexes')
    }

    try {
      const resumesIndexes = await db.collection('user_resumes').indexes()
      console.log('\n  user_resumes indexes:')
      resumesIndexes.forEach(idx => {
        console.log(`    - ${idx.name}`)
      })
    } catch (err) {
      console.log('  ⚠️  Could not fetch user_resumes indexes')
    }

    try {
      const interviewIndexes = await db.collection('interview_prep').indexes()
      console.log('\n  interview_prep indexes:')
      interviewIndexes.forEach(idx => {
        console.log(`    - ${idx.name}`)
      })
    } catch (err) {
      console.log('  ⚠️  Could not fetch interview_prep indexes')
    }

    try {
      const companyIndexes = await db.collection('company_progress').indexes()
      console.log('\n  company_progress indexes:')
      companyIndexes.forEach(idx => {
        console.log(`    - ${idx.name}`)
      })
    } catch (err) {
      console.log('  ⚠️  Could not fetch company_progress indexes')
    }

    console.log('\n✅ Database seed completed successfully!')
    console.log('\n🎉 Your database is ready for Phase 2, 3 & 4 features!')
    console.log('\n📝 Next steps:')
    console.log('  1. Run: npm run dev')
    console.log('  2. Visit: http://localhost:3000/dashboard')
    console.log('  3. Test new features: Resume, Interview Prep, Community')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    console.error('\n💡 Troubleshooting:')
    console.error('  1. Check your MONGODB_URI in .env.local')
    console.error('  2. Ensure MongoDB is running')
    console.error('  3. Check network connection')
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n👋 Disconnected from MongoDB')
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('\n🚀 Seed script completed')
    process.exit(0)
  })
  .catch(err => {
    console.error('💥 Fatal error:', err)
    process.exit(1)
  })
