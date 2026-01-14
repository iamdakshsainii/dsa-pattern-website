import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found');
  process.exit(1);
}

async function createMasterCollections() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('dsa_patterns');

    console.log('📦 Creating master_roadmaps collection...');
    const masterExists = await db.listCollections({ name: 'master_roadmaps' }).hasNext();

    if (!masterExists) {
      await db.createCollection('master_roadmaps');
      await db.collection('master_roadmaps').createIndex({ masterId: 1 }, { unique: true });
      await db.collection('master_roadmaps').createIndex({ published: 1, order: 1 });
      console.log('✅ master_roadmaps collection created');
    } else {
      console.log('⚠️  master_roadmaps already exists');
    }

    console.log('📦 Creating master_roadmap_progress collection...');
    const progressExists = await db.listCollections({ name: 'master_roadmap_progress' }).hasNext();

    if (!progressExists) {
      await db.createCollection('master_roadmap_progress');
      await db.collection('master_roadmap_progress').createIndex({ userId: 1, masterId: 1 }, { unique: true });
      await db.collection('master_roadmap_progress').createIndex({ userId: 1 });
      console.log('✅ master_roadmap_progress collection created');
    } else {
      console.log('⚠️  master_roadmap_progress already exists');
    }

    console.log('📦 Adding indexes to roadmaps collection...');
    await db.collection('roadmaps').createIndex({ isMasterRoadmap: 1 });
    await db.collection('roadmaps').createIndex({ parentMasterId: 1, yearNumber: 1 });
    await db.collection('roadmaps').createIndex({ techStackCategory: 1 });
    console.log('✅ Roadmaps indexes added');

    console.log('🎉 All collections and indexes created successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createMasterCollections();
