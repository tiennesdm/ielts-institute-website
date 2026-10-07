import { NextResponse } from 'next/server';
import { getDbAsync, saveDb } from '@/lib/db';
import { verifyAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDbAsync();
  if (!db) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  }

  const universities = db.universities || { header: {}, items: [] };
  const config = db.settings?.sections?.universities || {
    badge: "Official Global Study Abroad Network",
    title: "Direct University Tie-Ups & Global College Network",
    subtitle: "First Class Global Education directly represents 850+ world-renowned universities and colleges across 25+ countries. Fast-track offer letters, scholarship evaluations, and end-to-end visa filing.",
    stats: [
      { label: "Direct University Tie-Ups", value: "850+" },
      { label: "Top Destination Countries", value: "25+" },
      { label: "Offer Letter Turnaround", value: "48 - 72 Hrs" },
      { label: "Scholarships Facilitated", value: "₹12+ Crores" }
    ],
    marqueeTitle: "Representing 850+ Direct Global Partner Universities & Colleges",
    bannerBadge: "Fast-Track Admission & Spot Assessment",
    bannerTitle: "Confused About Which University & Country Fits Your Profile?",
    bannerDesc: "Get an unbiased profile assessment from our Senior Study Abroad Visa Advisors. We evaluate your academics, IELTS band score, and budget to provide a tailored list of top admitting universities.",
    bannerCta: "Book Free 1-on-1 Profile Assessment",
    show: true
  };

  return NextResponse.json({
    universities,
    header: universities.header || {},
    items: universities.items || [],
    config
  });
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

    if (!db.universities) {
      db.universities = { header: {}, items: [] };
    }
    if (!db.settings) db.settings = {};
    if (!db.settings.sections) db.settings.sections = {};
    if (!db.settings.sections.universities) {
      db.settings.sections.universities = {
        badge: "Official Global Study Abroad Network",
        title: "Direct University Tie-Ups & Global College Network",
        subtitle: "First Class Global Education directly represents 850+ world-renowned universities and colleges across 25+ countries. Fast-track offer letters, scholarship evaluations, and end-to-end visa filing.",
        stats: [
          { label: "Direct University Tie-Ups", value: "850+" },
          { label: "Top Destination Countries", value: "25+" },
          { label: "Offer Letter Turnaround", value: "48 - 72 Hrs" },
          { label: "Scholarships Facilitated", value: "₹12+ Crores" }
        ],
        marqueeTitle: "Representing 850+ Direct Global Partner Universities & Colleges",
        bannerBadge: "Fast-Track Admission & Spot Assessment",
        bannerTitle: "Confused About Which University & Country Fits Your Profile?",
        bannerDesc: "Get an unbiased profile assessment from our Senior Study Abroad Visa Advisors. We evaluate your academics, IELTS band score, and budget to provide a tailored list of top admitting universities.",
        bannerCta: "Book Free 1-on-1 Profile Assessment",
        show: true
      };
    }

    // Action 1: Toggle section homepage visibility
    if (body.action === 'toggle_section') {
      const currentShow = db.settings.sections.universities.show !== false;
      db.settings.sections.universities.show = !currentShow;
      await saveDb(db);
      return NextResponse.json({
        success: true,
        universities: db.universities,
        header: db.universities.header,
        items: db.universities.items,
        config: db.settings.sections.universities
      });
    }

    // Action 2: If updating section header & key stats
    if (body.updateHeader && body.header) {
      db.universities.header = {
        ...db.universities.header,
        ...body.header
      };
      // Keep settings.sections.universities in sync
      db.settings.sections.universities = {
        ...db.settings.sections.universities,
        badge: body.header.badge !== undefined ? body.header.badge : db.settings.sections.universities.badge,
        title: body.header.title !== undefined ? body.header.title : db.settings.sections.universities.title,
        subtitle: body.header.subtitle !== undefined ? body.header.subtitle : db.settings.sections.universities.subtitle,
        stats: Array.isArray(body.header.stats) ? body.header.stats : db.settings.sections.universities.stats,
      };
      await saveDb(db);
      return NextResponse.json({
        success: true,
        universities: db.universities,
        header: db.universities.header,
        items: db.universities.items,
        config: db.settings.sections.universities
      });
    }

    // Action 3: If updating config (marquee ticker, callout banner, show)
    if (body.updateConfig && body.config) {
      db.settings.sections.universities = {
        ...db.settings.sections.universities,
        ...body.config
      };
      if (body.config.badge || body.config.title || body.config.subtitle || body.config.stats) {
        db.universities.header = {
          ...db.universities.header,
          badge: body.config.badge || db.universities.header?.badge,
          title: body.config.title || db.universities.header?.title,
          subtitle: body.config.subtitle || db.universities.header?.subtitle,
          stats: body.config.stats || db.universities.header?.stats,
        };
      }
      await saveDb(db);
      return NextResponse.json({
        success: true,
        universities: db.universities,
        header: db.universities.header,
        items: db.universities.items,
        config: db.settings.sections.universities
      });
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
    await saveDb(db);

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

    const db = await getDbAsync();
    if (!db || !db.universities) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    db.universities.items = (db.universities.items || []).filter(u => u.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true, universities: db.universities });
  } catch (error) {
    console.error('Error deleting university:', error);
    return NextResponse.json({ error: 'Delete error' }, { status: 500 });
  }
}
