import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedExamDate() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb+srv://dakshsaini:%40Daksh2003@cluster0.rcxv8zy.mongodb.net/dsa_patterns?retryWrites=true&w=majority');

  try {
    await client.connect();
    const db = client.db();

    const userId = '694e7e801336f9894f786818'; // Your user ID
    const masterId = '4-year-cs-journey';

    // Create exam date 5 days from now
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 5);

    const result = await db.collection('master_progress').updateOne(
      {
        userId: new ObjectId(userId),
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

    console.log('✅ Exam date added:', result);
    console.log('📅 Exam Date:', examDate.toISOString());
    console.log('🎯 Days remaining:', 5);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

seedExamDate();
