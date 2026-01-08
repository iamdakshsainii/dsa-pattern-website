import { connectToDatabase } from './db';

export async function logActivity({
  actor,
  actorType = 'admin',
  action,
  resourceType,
  resourceId,
  changes = null,
  ipAddress = null,
  userAgent = null
}) {
  try {
    const { db } = await connectToDatabase();

    const log = {
      actor,
      actorType,
      action,
      resourceType,
      resourceId,
      changes,
      ipAddress,
      userAgent,
      timestamp: new Date()
    };

    await db.collection('activity_logs').insertOne(log);
    return log;
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function getActivityLogs(filters = {}) {
  const { db } = await connectToDatabase();

  const {
    page = 1,
    limit = 50,
    action,
    resourceType,
    actor,
    startDate,
    endDate
  } = filters;

  const query = {};

  if (action) query.action = action;
  if (resourceType) query.resourceType = resourceType;
  if (actor) query.actor = { $regex: actor, $options: 'i' };
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const [logs, total] = await Promise.all([
    db.collection('activity_logs')
      .find(query)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    db.collection('activity_logs').countDocuments(query)
  ]);

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getActivityStats() {
  const { db } = await connectToDatabase();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalLogs, recentLogs, actionBreakdown] = await Promise.all([
    db.collection('activity_logs').countDocuments(),
    db.collection('activity_logs').countDocuments({
      timestamp: { $gte: thirtyDaysAgo }
    }),
    db.collection('activity_logs')
      .aggregate([
        { $match: { timestamp: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
      .toArray()
  ]);

  return {
    totalLogs,
    recentLogs,
    actionBreakdown: actionBreakdown.map(item => ({
      action: item._id,
      count: item.count
    }))
  };
}
