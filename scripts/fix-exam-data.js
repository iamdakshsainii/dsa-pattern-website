import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function fixExamData() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db();

    // Search for document with ObjectId
    const withObjectId = await db.collection('master_progress').findOne({
      userId: new ObjectId('694e7e801336f9894f786818'),
      masterId: '4-year-cs-journey'
    });

    if (withObjectId) {
      console.log('❌ Found document with ObjectId (wrong format)');
      console.log('Deleting it...');
      await db.collection('master_progress').deleteOne({ _id: withObjectId._id });
    }

    // Create exam date 5 days from now
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 5);

    // Create/update with correct STRING format
    const result = await db.collection('master_progress').updateOne(
      {
        userId: '694e7e801336f9894f786818',  // STRING
        masterId: '4-year-cs-journey'
      },
      {
        $set: {
          userId: '694e7e801336f9894f786818',
          masterId: '4-year-cs-journey',
          currentYear: 1,
          yearProgress: [],
          academicInfo: {
            college: null,
            currentSemester: null,
            expectedGraduation: null,
            examDates: [
              {
                name: 'Mid-Semester Exams',
                date: examDate,
                hideProjects: true
              }
            ]
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('✅ Result:', result);

    // Verify
    const check = await db.collection('master_progress').findOne({
      userId: '694e7e801336f9894f786818',
      masterId: '4-year-cs-journey'
    });

    console.log('\n✅ VERIFIED - Document now exists:');
    console.log(JSON.stringify(check, null, 2));
    console.log('\n📅 Exam Date:', examDate.toISOString());
    console.log('🎯 Days remaining: 5');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixExamData();
