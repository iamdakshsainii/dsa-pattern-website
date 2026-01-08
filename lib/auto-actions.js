import { connectToDatabase } from './db';
import { createNotification } from './notifications';

export async function checkAndEscalateMentorship() {
  const { db } = await connectToDatabase();

  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

  const pendingRequests = await db.collection('mentorship_requests')
    .find({
      status: 'pending',
      createdAt: { $lte: fortyEightHoursAgo },
      escalated: { $ne: true }
    })
    .toArray();

  const escalations = [];

  for (const request of pendingRequests) {
    const escalation = {
      type: 'mentorship_escalation',
      resourceId: request._id.toString(),
      reason: 'No response for 48 hours',
      createdAt: new Date(),
      resolved: false
    };

    await db.collection('auto_actions').insertOne(escalation);
    await db.collection('mentorship_requests').updateOne(
      { _id: request._id },
      { $set: { escalated: true, escalatedAt: new Date() } }
    );

    await createNotification(
      'escalation',
      'Mentorship Request Escalated',
      `Request from ${request.userName} needs attention (48+ hours)`,
      {
        requestId: request._id.toString(),
        userEmail: request.userEmail
      }
    );

    escalations.push(escalation);
  }

  return escalations;
}

export async function autoBlockFailedLogins() {
  const { db } = await connectToDatabase();

  const fifteenMinutesAgo = new Date();
  fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

  const failedAttempts = await db.collection('login_attempts')
    .aggregate([
      {
        $match: {
          success: false,
          timestamp: { $gte: fifteenMinutesAgo }
        }
      },
      {
        $group: {
          _id: '$email',
          count: { $sum: 1 }
        }
      },
      {
        $match: { count: { $gte: 5 } }
      }
    ])
    .toArray();

  const blocks = [];

  for (const attempt of failedAttempts) {
    const user = await db.collection('users').findOne({ email: attempt._id });

    if (user && !user.blocked) {
      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { blocked: true, blockedReason: 'Auto-blocked: 5+ failed login attempts', blockedAt: new Date() } }
      );

      const block = {
        type: 'auto_block',
        resourceId: user._id.toString(),
        reason: '5+ failed login attempts in 15 minutes',
        createdAt: new Date(),
        resolved: false
      };

      await db.collection('auto_actions').insertOne(block);

      await createNotification(
        'user_blocked',
        'User Auto-Blocked',
        `${user.name} (${user.email}) blocked due to failed login attempts`,
        {
          userId: user._id.toString(),
          email: user.email,
          reason: 'failed_logins'
        }
      );

      blocks.push(block);
    }
  }

  return blocks;
}

export async function getActiveEscalations() {
  const { db } = await connectToDatabase();

  const escalations = await db.collection('auto_actions')
    .find({ resolved: false })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  return escalations;
}

export async function resolveEscalation(escalationId, adminEmail) {
  const { db } = await connectToDatabase();
  const { ObjectId } = require('mongodb');

  await db.collection('auto_actions').updateOne(
    { _id: new ObjectId(escalationId) },
    {
      $set: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy: adminEmail
      }
    }
  );

  return true;
}

export async function generateSmartInsights() {
  const { db } = await connectToDatabase();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const strugglingUsersData = await db.collection('quizzes')
    .aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: '$userId',
          avgScore: { $avg: '$score' },
          attempts: { $sum: 1 }
        }
      },
      { $match: { avgScore: { $lt: 40 } } },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      { $project: {
          email: '$userInfo.email',
          name: '$userInfo.name',
          avgScore: { $round: ['$avgScore', 0] },
          attempts: 1
        }
      },
      { $limit: 20 }
    ])
    .toArray();

  const stuckUsersData = await db.collection('users')
    .find({
      lastLogin: { $lte: sevenDaysAgo },
      createdAt: { $lte: sevenDaysAgo }
    })
    .limit(20)
    .toArray();

  const readyForQuizData = await db.collection('users')
    .aggregate([
      {
        $lookup: {
          from: 'progress',
          localField: '_id',
          foreignField: 'userId',
          as: 'progress'
        }
      },
      {
        $match: {
          'progress.lessonsCompleted': { $gte: 5 }
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'userId',
          as: 'quizzes'
        }
      },
      {
        $match: {
          'quizzes.0': { $exists: false }
        }
      },
      {
        $project: {
          email: 1,
          name: 1,
          lessonsCompleted: { $first: '$progress.lessonsCompleted' }
        }
      },
      { $limit: 20 }
    ])
    .toArray();

  const insights = [];

  if (strugglingUsersData.length > 0) {
    insights.push({
      type: 'struggling_users',
      title: `${strugglingUsersData.length} Struggling Users`,
      description: `Users scoring below 40% on quizzes (last 7 days)`,
      action: 'Send encouragement email or offer 1-on-1 help',
      priority: 'high',
      users: strugglingUsersData.map(u => ({
        email: u.email,
        name: u.name,
        avgScore: u.avgScore,
        attempts: u.attempts
      }))
    });
  }

  if (stuckUsersData.length > 0) {
    insights.push({
      type: 'stuck_users',
      title: `${stuckUsersData.length} Inactive Users`,
      description: `Users who haven't logged in for 7+ days`,
      action: 'Send re-engagement email with new content highlights',
      priority: 'medium',
      users: stuckUsersData.map(u => ({
        email: u.email,
        name: u.name,
        lastLogin: u.lastLogin
      }))
    });
  }

  if (readyForQuizData.length > 0) {
    insights.push({
      type: 'ready_for_quiz',
      title: `${readyForQuizData.length} Users Ready for Quiz`,
      description: `Completed lessons but haven't taken quiz yet`,
      action: 'Remind them to test their knowledge',
      priority: 'low',
      users: readyForQuizData.map(u => ({
        email: u.email,
        name: u.name,
        lessonsCompleted: u.lessonsCompleted
      }))
    });
  }

  return insights;
}
