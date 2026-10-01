import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  return NextResponse.json(db.universities || { header: {}, items: [] });
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    if (!db.universities) {
      db.universities = { header: {}, items: [] };
    }

    // If updating section header
    if (body.updateHeader && body.header) {
      db.universities.header = {
        ...db.universities.header,
        ...body.header
      };
      saveDb(db);
      return NextResponse.json({ success: true, universities: db.universities });
    }

    // If adding or editing an individual university
    const itemData = body.item || body;
    if (!itemData.name || !itemData.country) {
      return NextResponse.json({ error: 'University name and country are required' }, { status: 400 });
    }

    const items = db.universities.items || [];
    const existingIndex = items.findIndex(u => u.id === itemData.id);

    if (existingIndex >= 0) {
      // Update existing
      items[existingIndex] = {
        ...items[existingIndex],
        ...itemData
      };
    } else {
      // Create new
      const newItem = {
        id: `uni-${Date.now()}`,
        name: itemData.name.trim(),
        country: itemData.country.trim(),
        flag: itemData.flag || '🏛️',
        city: itemData.city || '',
        ranking: itemData.ranking || '',
        scholarship: itemData.scholarship || '',
        popularPrograms: Array.isArray(itemData.popularPrograms) ? itemData.popularPrograms : [],
        features: Array.isArray(itemData.features) ? itemData.features : [],
        logo: itemData.logo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'
      };
      items.unshift(newItem);
    }

    db.universities.items = items;
    saveDb(db);

    return NextResponse.json({ success: true, universities: db.universities });
  } catch (error) {
    console.error('Error saving university:', error);
    return NextResponse.json({ error: error.message || 'Failed to save university' }, { status: 500 });
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
      return NextResponse.json({ error: 'University ID is required' }, { status: 400 });
    }

    const db = getDb();
    if (!db || !db.universities) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    db.universities.items = (db.universities.items || []).filter(u => u.id !== id);
    saveDb(db);

    return NextResponse.json({ success: true, universities: db.universities });
  } catch (error) {
    console.error('Error deleting university:', error);
    return NextResponse.json({ error: 'Delete error' }, { status: 500 });
  }
}
