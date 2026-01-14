import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedExamDate() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    const userId = '694e7e801336f9894f786818'; // STRING, not ObjectId
    const masterId = '4-year-cs-journey';

    // Check if document exists
    const existing = await db.collection('master_progress').findOne({
      userId: userId,  // Query as STRING
      masterId: masterId
    });

    console.log('Existing document:', JSON.stringify(existing, null, 2));

    // Create exam date 5 days from now
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 5);

    const result = await db.collection('master_progress').updateOne(
      {
        userId: userId,  // Update as STRING
        masterId: masterId
      },
      {
        $set: {
          'academicInfo.examDates': [
            {
              name: 'Mid-Semester Exams',
              date: examDate,
              hideProjects: true
            }
          ]
        }
      },
      { upsert: true }
    );

    console.log('✅ Update result:', result);
    console.log('📅 Exam Date:', examDate.toISOString());
    console.log('🎯 Days remaining: 5');

    // Verify the update
    const updated = await db.collection('master_progress').findOne({
      userId: userId,
      masterId: masterId
    });
    console.log('✅ Updated document:', JSON.stringify(updated, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

seedExamDate();
