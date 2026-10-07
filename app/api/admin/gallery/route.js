import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  const gallery = db ? db.gallery || [] : [];
  const config = db?.settings?.sections?.gallery || {
    badge: "Campus & Life At Academy",
    title: "Our Photo & Campus Gallery",
    subtitle: "Take a look inside our high-tech computer simulation labs, acoustic 1-on-1 speaking cabins, visa celebrations, and student felicitation ceremonies.",
    show: true
  };
  return NextResponse.json({
    gallery,
    config
  });
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
    if (!db.settings) db.settings = {};
    if (!db.settings.sections) db.settings.sections = {};
    if (!db.settings.sections.gallery) {
      db.settings.sections.gallery = {
        badge: "Campus & Life At Academy",
        title: "Our Photo & Campus Gallery",
        subtitle: "Take a look inside our high-tech computer simulation labs, acoustic 1-on-1 speaking cabins, visa celebrations, and student felicitation ceremonies.",
        show: true
      };
    }

    // 1. Action: update section config
    if (itemData.action === 'update_config') {
      db.settings.sections.gallery = {
        ...db.settings.sections.gallery,
        ...itemData.config
      };
      await saveDb(db);
      return NextResponse.json({
        success: true,
        gallery: db.gallery,
        config: db.settings.sections.gallery
      });
    }

    // 2. Action: toggle active visibility for individual photo
    if (itemData.action === 'toggle_active') {
      const index = db.gallery.findIndex(g => g.id === itemData.id);
      if (index !== -1) {
        const currentActive = db.gallery[index].isActive !== false;
        db.gallery[index].isActive = !currentActive;
        await saveDb(db);
        return NextResponse.json({
          success: true,
          gallery: db.gallery,
          config: db.settings.sections.gallery
        });
      }
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // 3. Normal Add or Edit photo
    const photoItem = {
      ...itemData,
      isActive: itemData.isActive !== false
    };

    if (photoItem.id) {
      const index = db.gallery.findIndex(g => g.id === photoItem.id);
      if (index !== -1) {
        db.gallery[index] = { ...db.gallery[index], ...photoItem };
      } else {
        db.gallery.push(photoItem);
      }
    } else {
      const newItem = {
        ...photoItem,
        id: `gal-${Date.now()}`
      };
      db.gallery.unshift(newItem);
    }

    await saveDb(db);
    return NextResponse.json({
      success: true,
      gallery: db.gallery,
      config: db.settings.sections.gallery
    });
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
