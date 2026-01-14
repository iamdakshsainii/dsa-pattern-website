import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority"

async function unlockYear3(userEmail) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db()

    const user = await db.collection('users').findOne({ email: userEmail })
    if (!user) {
      console.log('❌ User not found')
      return
    }

    const yearProgress = [
      {
        year: 1,
        completionPercent: 100,
        completedRoadmaps: [],
        testOut: null,
        startedAt: new Date(),
        completedAt: new Date()
      },
      {
        year: 2,
        completionPercent: 100,
        completedRoadmaps: [],
        testOut: null,
        startedAt: new Date(),
        completedAt: new Date()
      },
      {
        year: 3,
        completionPercent: 0,
        completedRoadmaps: [],
        testOut: null,
        startedAt: new Date(),
        completedAt: null
      },
      {
        year: 4,
        completionPercent: 0,
        completedRoadmaps: [],
        testOut: null,
        startedAt: null,
        completedAt: null
      }
    ]

    await db.collection('master_roadmap_progress').updateOne(
      {
        userId: user._id.toString(),
        masterId: "4-year-cs-journey"
      },
      {
        $set: {
          currentYear: 3,
          yearProgress,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    console.log('✅ Year 3 unlocked for', userEmail)
    console.log('✅ Year 1: 100% complete')
    console.log('✅ Year 2: 100% complete')
    console.log('✅ Year 3: Now accessible')

  } finally {
    await client.close()
  }
}

unlockYear3('sainidaksh70@gmail.com')
