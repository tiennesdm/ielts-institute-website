import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  const testimonials = db ? db.testimonials || [] : [];
  const config = db?.settings?.sections?.testimonials || {
    badge: "Student Experiences",
    title: "Loved By Thousands of Test Takers",
    subtitle: "Read how our structured training, daily evaluations, and master feedback helped our students achieve their immigration and admission scores.",
    show: true
  };
  return NextResponse.json({
    testimonials,
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

    if (!db.testimonials) db.testimonials = [];
    if (!db.settings) db.settings = {};
    if (!db.settings.sections) db.settings.sections = {};
    if (!db.settings.sections.testimonials) {
      db.settings.sections.testimonials = {
        badge: "Student Experiences",
        title: "Loved By Thousands of Test Takers",
        subtitle: "Read how our structured training, daily evaluations, and master feedback helped our students achieve their immigration and admission scores.",
        show: true
      };
    }

    // 1. Action: update section config
    if (itemData.action === 'update_config') {
      db.settings.sections.testimonials = {
        ...db.settings.sections.testimonials,
        ...itemData.config
      };
      await saveDb(db);
      return NextResponse.json({
        success: true,
        testimonials: db.testimonials,
        config: db.settings.sections.testimonials
      });
    }

    // 2. Action: toggle active visibility for individual testimonial
    if (itemData.action === 'toggle_active') {
      const index = db.testimonials.findIndex(t => t.id === itemData.id);
      if (index !== -1) {
        const currentActive = db.testimonials[index].isActive !== false;
        db.testimonials[index].isActive = !currentActive;
        await saveDb(db);
        return NextResponse.json({
          success: true,
          testimonials: db.testimonials,
          config: db.settings.sections.testimonials
        });
      }
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    // 3. Normal Add or Edit testimonial
    const testItem = {
      ...itemData,
      isActive: itemData.isActive !== false
    };

    if (testItem.id) {
      const index = db.testimonials.findIndex(t => t.id === testItem.id);
      if (index !== -1) {
        db.testimonials[index] = { ...db.testimonials[index], ...testItem };
      } else {
        db.testimonials.push(testItem);
      }
    } else {
      const newItem = {
        ...testItem,
        id: `test-${Date.now()}`
      };
      db.testimonials.unshift(newItem);
    }

    await saveDb(db);
    return NextResponse.json({
      success: true,
      testimonials: db.testimonials,
      config: db.settings.sections.testimonials
    });
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

    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    db.testimonials = (db.testimonials || []).filter(t => t.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true, testimonials: db.testimonials });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
