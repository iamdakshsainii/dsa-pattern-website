import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || "mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority"

async function markTechStacks() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('Connected to MongoDB')

    const db = client.db()

    const techStackSlugs = [
      'web-development',
      'machine-learning',
      'mobile-development',
      'devops',
      'cybersecurity'
    ]

    const result = await db.collection('roadmaps').updateMany(
      { slug: { $in: techStackSlugs } },
      {
        $set: {
          techStackCategory: true,
          yearNumber: 3
        }
      }
    )

    console.log(`✅ Marked ${result.modifiedCount} roadmaps as tech stacks`)

    const techStacks = await db.collection('roadmaps')
      .find({ techStackCategory: true })
      .toArray()

    console.log('\nTech Stack Roadmaps:')
    techStacks.forEach(stack => {
      console.log(`  - ${stack.icon} ${stack.title} (${stack.slug})`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

markTechStacks()
