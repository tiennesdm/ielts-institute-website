import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  const results = db ? db.results || [] : [];
  const config = db?.settings?.sections?.results || {
    badge: "Hall of Fame & High Achievers",
    title: "Real Students, Real 8+ Band Results",
    subtitle: "Hundreds of our students clear their target band scores on their first attempt every month and secure admissions in top Ivy League & Global Universities.",
    show: true
  };
  return NextResponse.json({
    results,
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

    if (!db.results) db.results = [];
    if (!db.settings) db.settings = {};
    if (!db.settings.sections) db.settings.sections = {};
    if (!db.settings.sections.results) {
      db.settings.sections.results = {
        badge: "Hall of Fame & High Achievers",
        title: "Real Students, Real 8+ Band Results",
        subtitle: "Hundreds of our students clear their target band scores on their first attempt every month and secure admissions in top Ivy League & Global Universities.",
        show: true
      };
    }

    // 1. Action: update section config (badge, title, subtitle, show)
    if (itemData.action === 'update_config') {
      db.settings.sections.results = {
        ...db.settings.sections.results,
        ...itemData.config
      };
      await saveDb(db);
      return NextResponse.json({
        success: true,
        results: db.results,
        config: db.settings.sections.results
      });
    }

    // 2. Action: toggle active visibility for individual student card
    if (itemData.action === 'toggle_active') {
      const index = db.results.findIndex(r => r.id === itemData.id);
      if (index !== -1) {
        const currentActive = db.results[index].isActive !== false;
        db.results[index].isActive = !currentActive;
        await saveDb(db);
        return NextResponse.json({
          success: true,
          results: db.results,
          config: db.settings.sections.results
        });
      }
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // 3. Normal Add or Edit result item
    const studentItem = {
      ...itemData,
      isActive: itemData.isActive !== false
    };

    if (studentItem.id) {
      const index = db.results.findIndex(r => r.id === studentItem.id);
      if (index !== -1) {
        db.results[index] = { ...db.results[index], ...studentItem };
      } else {
        db.results.push(studentItem);
      }
    } else {
      const newItem = {
        ...studentItem,
        id: `res-${Date.now()}`
      };
      db.results.unshift(newItem);
    }

    await saveDb(db);
    return NextResponse.json({
      success: true,
      results: db.results,
      config: db.settings.sections.results
    });
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
