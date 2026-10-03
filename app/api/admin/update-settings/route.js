import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    if (body.settings) {
      db.settings = { ...db.settings, ...body.settings };
    }

    if (body.adminPassword) {
      db.admin.password = body.adminPassword;
    }

    await saveDb(db);
    return NextResponse.json({ success: true, message: 'Settings saved successfully!' });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
