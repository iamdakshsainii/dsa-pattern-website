import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI environment variable is not set!')
  console.error('Please set MONGODB_URI in your .env.local file')
  process.exit(1)
}

async function cleanupProgress() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db("dsa_patterns")

    console.log("🔍 Checking current progress documents...")
    const count = await db.collection("roadmap_progress").countDocuments()
    console.log(`📊 Found ${count} progress documents`)

    if (count === 0) {
      console.log("✨ No progress documents to delete!")
      return
    }

    const result = await db.collection("roadmap_progress").deleteMany({})
    console.log(`🗑️ Deleted ${result.deletedCount} progress documents`)
    console.log("✅ Cleanup complete!")

  } catch (error) {
    console.error("❌ Cleanup error:", error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

cleanupProgress()
