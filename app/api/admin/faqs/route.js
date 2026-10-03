import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await getDbAsync();
  return NextResponse.json(db ? db.faqs || [] : []);
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const faqData = await request.json();
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    if (!db.faqs) db.faqs = [];

    if (faqData.id) {
      const index = db.faqs.findIndex(f => f.id === faqData.id);
      if (index !== -1) {
        db.faqs[index] = { ...db.faqs[index], ...faqData };
      } else {
        db.faqs.push(faqData);
      }
    } else {
      const newFaq = {
        ...faqData,
        id: `faq-${Date.now()}`
      };
      db.faqs.push(newFaq);
    }

    await saveDb(db);
    return NextResponse.json({ success: true, faqs: db.faqs });
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
    await saveDb(db);

    return NextResponse.json({ success: true, faqs: db.faqs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}
