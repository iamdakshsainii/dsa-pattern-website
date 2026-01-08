import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { connectToDatabase, getRoadmap, serializeDocs } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { userId } = params;
    const { db } = await connectToDatabase();

    const [roadmapProgress, quizAttempts] = await Promise.all([
      db.collection('roadmap_progress').find({ userId }).toArray(),
      db.collection('user_quiz_attempts').find({ userId }).toArray()
    ]);

    const enrichedRoadmaps = await Promise.all(
      roadmapProgress.map(async (progress) => {
        const roadmap = await getRoadmap(progress.roadmapId);
        const attemptInfo = quizAttempts.find(a => a.roadmapId === progress.roadmapId);

        return {
          roadmapId: progress.roadmapId,
          roadmap: roadmap || null,
          progress: progress.overallProgress || 0,
          quizAttempts: attemptInfo ? {
            used: attemptInfo.attemptsUsed || 0,
            unlocked: attemptInfo.attemptsUnlocked || 5,
            status: attemptInfo.status || 'not_started'
          } : {
            used: 0,
            unlocked: 5,
            status: 'not_started'
          }
        };
      })
    );

    return NextResponse.json({ roadmaps: enrichedRoadmaps });
  } catch (error) {
    console.error('Error fetching user roadmaps:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmaps' }, { status: 500 });
  }
}
