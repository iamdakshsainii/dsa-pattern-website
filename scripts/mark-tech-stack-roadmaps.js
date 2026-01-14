import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

async function markTechStackRoadmaps() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('dsa_patterns');

    const techStackMapping = {
      'machine-learning': 'machine-learning',
      'data-analyst': 'machine-learning',
      'web-dev': 'web-development',
      'full-stack': 'web-development',
      'react': 'web-development',
      'node': 'web-development',
      'mobile': 'mobile-development',
      'android': 'mobile-development',
      'ios': 'mobile-development',
      'devops': 'devops',
      'docker': 'devops',
      'kubernetes': 'devops',
      'security': 'cybersecurity',
      'cyber': 'cybersecurity'
    };

    const roadmaps = await db.collection('roadmaps').find({}).toArray();

    console.log(`📋 Found ${roadmaps.length} roadmaps`);

    let updated = 0;

    for (const roadmap of roadmaps) {
      const slug = roadmap.slug.toLowerCase();
      const title = roadmap.title.toLowerCase();

      let techStack = null;

      for (const [keyword, category] of Object.entries(techStackMapping)) {
        if (slug.includes(keyword) || title.includes(keyword)) {
          techStack = category;
          break;
        }
      }

      if (techStack) {
        await db.collection('roadmaps').updateOne(
          { _id: roadmap._id },
          { $set: { techStackCategory: techStack } }
        );
        console.log(`✅ ${roadmap.title} → ${techStack}`);
        updated++;
      }
    }

    console.log(`\n🎉 Updated ${updated} roadmaps with tech stack categories`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

markTechStackRoadmaps();
