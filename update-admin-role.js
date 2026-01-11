import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('❌ MONGODB_URI not found in .env.local')
  process.exit(1)
}

async function updateAdminRole() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db()

    const result = await db.collection('users').updateOne(
      { email: 'sainidaksh70@gmail.com' },
      { $set: { role: 'admin' } }
    )

    console.log('✅ Updated:', result.modifiedCount, 'user(s)')

    const user = await db.collection('users').findOne({ email: 'sainidaksh70@gmail.com' })
    console.log('✅ User role now:', user.role)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
    process.exit(0)
  }
}

updateAdminRole()
