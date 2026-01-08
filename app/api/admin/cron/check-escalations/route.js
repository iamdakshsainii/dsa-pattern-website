import { NextResponse } from 'next/server';
import { checkAndEscalateMentorship, autoBlockFailedLogins } from '@/lib/auto-actions';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [mentorshipEscalations, loginBlocks] = await Promise.all([
      checkAndEscalateMentorship(),
      autoBlockFailedLogins()
    ]);

    return NextResponse.json({
      success: true,
      mentorshipEscalations: mentorshipEscalations.length,
      loginBlocks: loginBlocks.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
