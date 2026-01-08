import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import { getPlatformSettings, updatePlatformSetting, getDefaultSettings, initializeSettings } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await initializeSettings();
    const settings = await getPlatformSettings();
    const defaults = await getDefaultSettings();
    const merged = { ...defaults, ...settings };
    return NextResponse.json({ success: true, data: merged });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { key, value } = body;
    if (!key) {
      return NextResponse.json({ error: 'Key required' }, { status: 400 });
    }
    await updatePlatformSetting(key, value, user.email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

