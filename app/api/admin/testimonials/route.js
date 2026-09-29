import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDb, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db ? db.testimonials || [] : []);
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const itemData = await request.json();
    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    if (!db.testimonials) db.testimonials = [];

    if (itemData.id) {
      const index = db.testimonials.findIndex(t => t.id === itemData.id);
      if (index !== -1) {
        db.testimonials[index] = { ...db.testimonials[index], ...itemData };
      } else {
        db.testimonials.push(itemData);
      }
    } else {
      const newItem = {
        ...itemData,
        id: `test-${Date.now()}`
      };
      db.testimonials.unshift(newItem);
    }

    saveDb(db);
    return NextResponse.json({ success: true, testimonials: db.testimonials });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const db = getDb();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    db.testimonials = (db.testimonials || []).filter(t => t.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, testimonials: db.testimonials });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
