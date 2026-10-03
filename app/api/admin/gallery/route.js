import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json(db ? db.gallery || [] : []);
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

    if (!db.gallery) db.gallery = [];

    if (itemData.id) {
      const index = db.gallery.findIndex(g => g.id === itemData.id);
      if (index !== -1) {
        db.gallery[index] = { ...db.gallery[index], ...itemData };
      } else {
        db.gallery.push(itemData);
      }
    } else {
      const newItem = {
        ...itemData,
        id: `gal-${Date.now()}`
      };
      db.gallery.unshift(newItem);
    }

    await saveDb(db);
    return NextResponse.json({ success: true, gallery: db.gallery });
  } catch (error) {
    console.error('Gallery save error:', error);
    return NextResponse.json({ error: 'Failed to save gallery item' }, { status: 500 });
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

    db.gallery = (db.gallery || []).filter(g => g.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true, gallery: db.gallery });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
