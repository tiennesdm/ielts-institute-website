import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json(db ? db.batches || [] : []);
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const itemData = await request.json();
    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    if (!db.batches) db.batches = [];

    if (itemData.id) {
      const index = db.batches.findIndex(b => b.id === itemData.id);
      if (index !== -1) {
        db.batches[index] = { ...db.batches[index], ...itemData };
      } else {
        db.batches.push(itemData);
      }
    } else {
      const newItem = {
        ...itemData,
        id: `batch-${Date.now()}`
      };
      db.batches.push(newItem);
    }

    await saveDb(db);
    return NextResponse.json({ success: true, batches: db.batches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save batch' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    db.batches = (db.batches || []).filter(b => b.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true, batches: db.batches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
