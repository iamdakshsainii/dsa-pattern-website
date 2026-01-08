import { connectToDatabase } from './db';
import { ObjectId } from 'mongodb';

export async function createNotification(type, title, message, metadata = {}) {
  try {
    const { db } = await connectToDatabase();

    const notification = {
      type,
      title,
      message,
      metadata,
      read: false,
      createdAt: new Date()
    };

    const result = await db.collection('notifications').insertOne(notification);
    return { ...notification, _id: result.insertedId };
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

export async function getAdminNotifications(limit = 20, unreadOnly = false) {
  try {
    const { db } = await connectToDatabase();

    const query = unreadOnly ? { read: false } : {};

    const notifications = await db.collection('notifications')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return notifications;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    const { db } = await connectToDatabase();

    await db.collection('notifications').updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { read: true, readAt: new Date() } }
    );

    return true;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
}

export async function markAllAsRead() {
  try {
    const { db } = await connectToDatabase();

    await db.collection('notifications').updateMany(
      { read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    return true;
  } catch (error) {
    console.error('Failed to mark all as read:', error);
    return false;
  }
}

export async function getUnreadCount() {
  try {
    const { db } = await connectToDatabase();
    const count = await db.collection('notifications').countDocuments({ read: false });
    return count;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }
}
