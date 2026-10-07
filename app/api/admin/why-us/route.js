import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDbAsync, saveDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

const defaultWhyUs = {
  badge: "The First Class Advantage",
  title: "Why 12,000+ Students Chose Us Over Others",
  subtitle: "We don't just lecture; we train you module-by-module until you score your target band. Here is what sets our coaching methodology apart.",
  show: true,
  diagnosticTitle: "Unsure About Your Current IELTS Band Level?",
  diagnosticText: "Take our 45-minute Free Diagnostic Evaluation Test & get an accurate band score report from our Senior Head Examiner today.",
  diagnosticCta: "Take Free Diagnostic Test",
  items: [
    {
      id: "why-1",
      title: "Daily 1-on-1 Speaking Cabins",
      description: "No group speaking hesitation. Practice daily in sound-isolated acoustic cabins directly with certified examiners who record and grade your fluency, lexical score, and pronunciation.",
      isActive: true
    },
    {
      id: "why-2",
      title: "Line-by-Line Writing Evaluation",
      description: "Submit Task 1 and Task 2 essays daily. Our master mentors mark grammatical range, coherence & cohesion, and task achievement with handwritten corrections.",
      isActive: true
    },
    {
      id: "why-3",
      title: "Official CD-IELTS Computer Lab",
      description: "A 50-terminal computer lab equipped with high-fidelity headsets and official exam simulation software to build typing speed and exam stamina.",
      isActive: true
    },
    {
      id: "why-4",
      title: "Certified Master Mentors",
      description: "Learn exclusively from former British Council and IDP trained trainers with 12+ years average teaching experience.",
      isActive: true
    },
    {
      id: "why-5",
      title: "Cambridge 1 to 19 Original Kits",
      description: "Receive full physical and digital study kits with authentic Cambridge past papers, high-scoring vocabulary banks, and proven task templates.",
      isActive: true
    },
    {
      id: "why-6",
      title: "Saturday Full Hall Mock Tests",
      description: "Strict exam conditions every Saturday with identical timing, invigilators, and real question patterns. Score reports delivered in 24 hours.",
      isActive: true
    }
  ]
};

export async function GET() {
  const db = await getDbAsync();
  const whyUs = db?.settings?.whyUs || defaultWhyUs;
  return NextResponse.json({ whyUs });
}

export async function POST(request) {
  const session = verifyAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const itemData = await request.json();
    const db = await getDbAsync();
    if (!db) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    if (!db.settings) db.settings = {};
    if (!db.settings.whyUs) db.settings.whyUs = { ...defaultWhyUs };
    if (!db.settings.whyUs.items) db.settings.whyUs.items = [...defaultWhyUs.items];
    if (!db.settings.sections) db.settings.sections = {};
    if (!db.settings.sections.whyUs) db.settings.sections.whyUs = {};

    // 1. Action: update section config
    if (itemData.action === 'update_config') {
      db.settings.whyUs = {
        ...db.settings.whyUs,
        ...itemData.config
      };
      if (itemData.config.show !== undefined) {
        db.settings.sections.whyUs.show = itemData.config.show;
      }
      await saveDb(db);
      return NextResponse.json({ success: true, whyUs: db.settings.whyUs });
    }

    // 2. Action: toggle active visibility for individual feature
    if (itemData.action === 'toggle_active') {
      const index = db.settings.whyUs.items.findIndex(it => it.id === itemData.id);
      if (index !== -1) {
        const currentActive = db.settings.whyUs.items[index].isActive !== false;
        db.settings.whyUs.items[index].isActive = !currentActive;
        await saveDb(db);
        return NextResponse.json({ success: true, whyUs: db.settings.whyUs });
      }
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    // 3. Normal Add or Edit feature item
    const featureItem = {
      ...itemData,
      isActive: itemData.isActive !== false
    };

    if (featureItem.id) {
      const index = db.settings.whyUs.items.findIndex(it => it.id === featureItem.id);
      if (index !== -1) {
        db.settings.whyUs.items[index] = { ...db.settings.whyUs.items[index], ...featureItem };
      } else {
        db.settings.whyUs.items.push(featureItem);
      }
    } else {
      const newItem = {
        ...featureItem,
        id: `why-${Date.now()}`
      };
      db.settings.whyUs.items.push(newItem);
    }

    await saveDb(db);
    return NextResponse.json({ success: true, whyUs: db.settings.whyUs });
  } catch (error) {
    console.error('WhyUs save error:', error);
    return NextResponse.json({ error: 'Failed to save Why Us feature' }, { status: 500 });
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

    if (!db.settings?.whyUs?.items) {
      return NextResponse.json({ success: true, whyUs: db.settings?.whyUs });
    }

    db.settings.whyUs.items = db.settings.whyUs.items.filter(it => it.id !== id);
    await saveDb(db);

    return NextResponse.json({ success: true, whyUs: db.settings.whyUs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}
