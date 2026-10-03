import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json(db ? db.results || [] : []);
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const itemData = await request.json();
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    if (!db.results) db.results = [];

    if (itemData.id) {
      const index = db.results.findIndex(r => r.id === itemData.id);
      if (index !== -1) {
        db.results[index] = { ...db.results[index], ...itemData };
      } else {
        db.results.push(itemData);
      }
    } else {
      const newItem = {
        ...itemData,
        id: `res-${Date.now()}`
      };
      db.results.unshift(newItem);
    }

    await saveDb(db);
    return NextResponse.json({ success: true, results: db.results });
  } catch (error) {
    console.error('Results save error:', error);
    return NextResponse.json({ error: 'Failed to save student result' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    db.results = (db.results || []).filter(r => r.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true, results: db.results });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete student result' }, { status: 500 });
  }
}
