import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  const faqs = (db?.faqs || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  const config = db?.settings?.sections?.faqs || {};
  return NextResponse.json({ faqs, config });
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    if (!db.faqs) db.faqs = [];
    if (!db.settings) db.settings = {};
    if (!db.settings.sections) db.settings.sections = {};
    if (!db.settings.sections.faqs) db.settings.sections.faqs = {};

    // Action A: Update Section Headings & Helpdesk Support Card Configuration
    if (body.action === 'update_config') {
      db.settings.sections.faqs = {
        ...db.settings.sections.faqs,
        ...body.config
      };
      await saveDb(db);
      return NextResponse.json({
        success: true,
        config: db.settings.sections.faqs,
        faqs: db.faqs
      });
    }

    // Action B: Reorder all FAQs
    if (body.action === 'reorder') {
      if (Array.isArray(body.faqs)) {
        db.faqs = body.faqs.map((f, idx) => ({
          ...f,
          order: idx + 1
        }));
        await saveDb(db);
        return NextResponse.json({ success: true, faqs: db.faqs });
      }
      return NextResponse.json({ error: 'Invalid FAQs array for reorder' }, { status: 400 });
    }

    // Action C: Quick Toggle Active Status
    if (body.action === 'toggle_status') {
      const idx = db.faqs.findIndex(f => f.id === body.id);
      if (idx !== -1) {
        db.faqs[idx].isActive = body.isActive;
        await saveDb(db);
        return NextResponse.json({ success: true, faqs: db.faqs });
      }
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    // Action D: Add or Edit individual FAQ item
    const faqData = body;
    if (!faqData.question?.trim() || !faqData.answer?.trim()) {
      return NextResponse.json({ error: 'Question and Answer are required' }, { status: 400 });
    }

    if (faqData.id) {
      const index = db.faqs.findIndex(f => f.id === faqData.id);
      if (index !== -1) {
        db.faqs[index] = {
          ...db.faqs[index],
          question: faqData.question.trim(),
          answer: faqData.answer.trim(),
          category: faqData.category?.trim() || 'General',
          isActive: faqData.isActive !== false,
          order: typeof faqData.order === 'number' ? faqData.order : db.faqs[index].order || (index + 1)
        };
      } else {
        db.faqs.push({
          id: faqData.id,
          question: faqData.question.trim(),
          answer: faqData.answer.trim(),
          category: faqData.category?.trim() || 'General',
          isActive: faqData.isActive !== false,
          order: typeof faqData.order === 'number' ? faqData.order : db.faqs.length + 1
        });
      }
    } else {
      const newFaq = {
        id: `faq-${Date.now()}`,
        question: faqData.question.trim(),
        answer: faqData.answer.trim(),
        category: faqData.category?.trim() || 'General',
        isActive: faqData.isActive !== false,
        order: db.faqs.length + 1
      };
      db.faqs.push(newFaq);
    }

    // Keep sorted by order
    db.faqs.sort((a, b) => (a.order || 0) - (b.order || 0));

    await saveDb(db);
    return NextResponse.json({
      success: true,
      faqs: db.faqs,
      config: db.settings.sections.faqs
    });
  } catch (error) {
    console.error('FAQ save error:', error);
    return NextResponse.json({ error: 'Failed to save FAQ' }, { status: 500 });
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
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }

    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    db.faqs = (db.faqs || []).filter(f => f.id !== id);
    // Re-index orders cleanly
    db.faqs.forEach((f, idx) => {
      f.order = idx + 1;
    });

    await saveDb(db);
    return NextResponse.json({ success: true, faqs: db.faqs });
  } catch (error) {
    console.error('FAQ delete error:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
