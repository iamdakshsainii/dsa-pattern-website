// Alternative setup script that uses direct MongoDB connection
// Usage: node scripts/setup-profile-db-v2.js

require('dotenv').config({ path: '.env.local' })
const { MongoClient } = require('mongodb')

async function setupProfileCollections() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local')
    process.exit(1)
  }

  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db("dsa_patterns")

    // Create user_profiles collection
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)

    if (!collectionNames.includes('user_profiles')) {
      await db.createCollection('user_profiles')
      console.log('✅ Created user_profiles collection')

      // Create indexes
      await db.collection('user_profiles').createIndex({ userId: 1 }, { unique: true })
      console.log('✅ Created unique index on userId')

      await db.collection('user_profiles').createIndex({ createdAt: 1 })
      console.log('✅ Created index on createdAt')
    } else {
      console.log('ℹ️  user_profiles collection already exists')

      // Ensure indexes exist even if collection exists
      const indexes = await db.collection('user_profiles').listIndexes().toArray()
      const hasUserIdIndex = indexes.some(idx => idx.name === 'userId_1')

      if (!hasUserIdIndex) {
        await db.collection('user_profiles').createIndex({ userId: 1 }, { unique: true })
        console.log('✅ Created unique index on userId')
      }
    }

    console.log('\n🎉 Database setup complete!')
    console.log('\n📋 Next steps:')
    console.log('1. ✅ MongoDB collections ready')
    console.log('2. Install packages: npm install cloudinary next-cloudinary react-easy-crop react-dropzone zod')
    console.log('3. Setup Cloudinary and add credentials to .env.local')
    console.log('4. Add shadcn avatar: npx shadcn@latest add avatar')
    console.log('5. Copy all Phase 1 files to your project')
    console.log('6. Restart dev server: npm run dev')
    console.log('7. Test at: http://localhost:3000/profile')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.close()
    console.log('\n👋 Connection closed')
  }
}

setupProfileCollections()
