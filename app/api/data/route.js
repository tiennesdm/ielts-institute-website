import { NextResponse } from 'next/server';
import { getDbAsync, saveDb } from '@/lib/db';
import { sendLeadNotification } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Return only public data, do not expose admin credentials or leads
    const publicData = {
      settings: db.settings,
      courses: db.courses,
      results: db.results,
      gallery: db.gallery,
      testimonials: db.testimonials,
      batches: db.batches,
      faqs: db.faqs,
      universities: db.universities || {},
    };

    return NextResponse.json(publicData);
  } catch (error) {
    console.error('Error fetching public data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}

// Student Inquiry / Lead Submission
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, course, targetBand, city, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const db = await getDbAsync();
    if (!db) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const newLead = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      course: course || 'IELTS Academic Comprehensive',
      targetBand: targetBand || '7.5+ Bands',
      city: city ? city.trim() : '',
      message: message ? message.trim() : '',
      createdAt: new Date().toISOString(),
      status: 'New',
      notes: ''
    };

    if (!db.leads) {
      db.leads = [];
    }
    db.leads.unshift(newLead);

    await saveDb(db);

    // Send instant email notification to Info@firstclassglobaleducation.com
    try {
      await sendLeadNotification(newLead);
    } catch (e) {
      console.error('Email dispatch error:', e);
    }

    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully! Our expert counselor will call you shortly.' });
  } catch (error) {
    console.error('Error saving lead inquiry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
