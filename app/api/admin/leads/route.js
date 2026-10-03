import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await getDbAsync();
  return NextResponse.json(db ? db.leads || [] : []);
}

export async function PATCH(request) {
  const session = verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status, notes } = await request.json();
    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const lead = (db.leads || []).find(l => l.id === id);
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    if (status !== undefined) lead.status = status;
    if (notes !== undefined) lead.notes = notes;

    await saveDb(db);
    return NextResponse.json({ success: true, leads: db.leads });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
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

    db.leads = (db.leads || []).filter(l => l.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true, leads: db.leads });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
