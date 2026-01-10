import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const { ObjectId } = await import('mongodb');

    await db.collection('users').updateOne(
      { _id: new ObjectId(user.id) },
      {
        $set: { showWelcomeBack: false },
        $unset: { unblockedAt: "" }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing welcome flag:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
