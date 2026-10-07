import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  const batches = db ? db.batches || [] : [];
  const config = db?.settings?.sections?.batches || {
    badge: "Admissions Open",
    title: "Upcoming IELTS & PTE Batches",
    subtitle: "Small batch size (max 15 students per batch) to ensure individualized attention. Secure your preferred timing before seats fill out.",
    ctaText: "Reserve Seat Now",
    show: true
  };
  return NextResponse.json({
    batches,
    config
  });
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const itemData = await request.json();
    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    if (!db.batches) db.batches = [];
    if (!db.settings) db.settings = {};
    if (!db.settings.sections) db.settings.sections = {};
    if (!db.settings.sections.batches) {
      db.settings.sections.batches = {
        badge: "Admissions Open",
        title: "Upcoming IELTS & PTE Batches",
        subtitle: "Small batch size (max 15 students per batch) to ensure individualized attention. Secure your preferred timing before seats fill out.",
        ctaText: "Reserve Seat Now",
        show: true
      };
    }

    // 1. Action: update section config
    if (itemData.action === 'update_config') {
      db.settings.sections.batches = {
        ...db.settings.sections.batches,
        ...itemData.config
      };
      await saveDb(db);
      return NextResponse.json({
        success: true,
        batches: db.batches,
        config: db.settings.sections.batches
      });
    }

    // 2. Action: toggle active visibility for individual batch
    if (itemData.action === 'toggle_active') {
      const index = db.batches.findIndex(b => b.id === itemData.id);
      if (index !== -1) {
        const currentActive = db.batches[index].isActive !== false;
        db.batches[index].isActive = !currentActive;
        await saveDb(db);
        return NextResponse.json({
          success: true,
          batches: db.batches,
          config: db.settings.sections.batches
        });
      }
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    // 3. Normal Add or Edit batch
    const batchItem = {
      ...itemData,
      isActive: itemData.isActive !== false
    };

    if (batchItem.id) {
      const index = db.batches.findIndex(b => b.id === batchItem.id);
      if (index !== -1) {
        db.batches[index] = { ...db.batches[index], ...batchItem };
      } else {
        db.batches.push(batchItem);
      }
    } else {
      const newItem = {
        ...batchItem,
        id: `batch-${Date.now()}`
      };
      db.batches.push(newItem);
    }

    await saveDb(db);
    return NextResponse.json({
      success: true,
      batches: db.batches,
      config: db.settings.sections.batches
    });
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
